-- ============================================================
-- PROTECCIÓN MENORES VENEZUELA - RLS + TRIGGERS + MATCHING
-- Ejecutar DESPUÉS de 01_schema.sql
-- ============================================================

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE menores_hallados ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes_desaparecidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE denuncias_trata ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes_urgentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens_invitacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper: obtener rol del usuario autenticado
CREATE OR REPLACE FUNCTION get_user_rol()
RETURNS rol_usuario AS $$
  SELECT rol FROM usuarios WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: verificar si usuario está bloqueado
CREATE OR REPLACE FUNCTION usuario_bloqueado()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(bloqueado, false) FROM usuarios WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- MENORES HALLADOS ----
-- Solo admin_ong y rescatista_campo pueden VER menores (nunca ciudadano)
CREATE POLICY "menores_select_staff" ON menores_hallados
  FOR SELECT USING (
    get_user_rol() IN ('admin_ong', 'rescatista_campo')
    AND NOT usuario_bloqueado()
  );

-- Solo rescatistas y admins pueden INSERTAR
CREATE POLICY "menores_insert_staff" ON menores_hallados
  FOR INSERT WITH CHECK (
    get_user_rol() IN ('admin_ong', 'rescatista_campo')
    AND NOT usuario_bloqueado()
  );

-- Solo admins pueden ACTUALIZAR
CREATE POLICY "menores_update_admin" ON menores_hallados
  FOR UPDATE USING (get_user_rol() = 'admin_ong');

-- Nadie puede BORRAR menores del sistema
-- (no se crea política DELETE → bloqueado por defecto)

-- ---- MATCHES ----
-- Solo admins ven todos los matches; rescatistas solo los de su refugio
CREATE POLICY "matches_select_admin" ON matches
  FOR SELECT USING (get_user_rol() = 'admin_ong' AND NOT usuario_bloqueado());

CREATE POLICY "matches_select_rescatista" ON matches
  FOR SELECT USING (
    get_user_rol() = 'rescatista_campo'
    AND NOT usuario_bloqueado()
    AND menor_id IN (
      SELECT id FROM menores_hallados WHERE registrado_por = auth.uid()
    )
  );

-- Solo sistema (service_role) puede insertar matches
-- Los rescatistas no pueden manipular matches directamente

-- ---- REPORTES DESAPARECIDOS ----
-- Ciudadanos pueden insertar sus propios reportes
CREATE POLICY "reportes_insert_ciudadano" ON reportes_desaparecidos
  FOR INSERT WITH CHECK (true); -- abierto para ciudadanos

-- Solo staff puede leer todos los reportes
CREATE POLICY "reportes_select_staff" ON reportes_desaparecidos
  FOR SELECT USING (get_user_rol() IN ('admin_ong', 'rescatista_campo'));

-- ---- DENUNCIAS TRATA ----
-- Cualquiera puede denunciar
CREATE POLICY "trata_insert_all" ON denuncias_trata
  FOR INSERT WITH CHECK (true);

-- Solo admins pueden leer denuncias (datos sensibles)
CREATE POLICY "trata_select_admin" ON denuncias_trata
  FOR SELECT USING (get_user_rol() = 'admin_ong');

-- ---- REPORTES URGENTES ----
CREATE POLICY "urgentes_insert_all" ON reportes_urgentes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "urgentes_select_staff" ON reportes_urgentes
  FOR SELECT USING (get_user_rol() IN ('admin_ong', 'rescatista_campo'));

-- ---- TOKENS INVITACIÓN ----
-- Solo admin_ong puede generar tokens
CREATE POLICY "tokens_insert_admin" ON tokens_invitacion
  FOR INSERT WITH CHECK (get_user_rol() = 'admin_ong');

CREATE POLICY "tokens_select_admin" ON tokens_invitacion
  FOR SELECT USING (get_user_rol() = 'admin_ong' AND generado_por = auth.uid());

-- ---- AUDIT LOG ----
-- Solo admins pueden leer el log; nadie puede borrar ni modificar
CREATE POLICY "audit_select_admin" ON audit_log
  FOR SELECT USING (get_user_rol() = 'admin_ong');
-- Sin política INSERT desde cliente → solo se inserta desde triggers (SECURITY DEFINER)

-- ============================================================
-- TRIGGER: Auditoría automática en accesos a menores
-- ============================================================
CREATE OR REPLACE FUNCTION fn_audit_acceso_menor()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (usuario_id, accion, tabla_afectada, registro_id, metadata)
  VALUES (
    auth.uid(),
    TG_OP,
    'menores_hallados',
    NEW.id,
    jsonb_build_object('codigo', NEW.codigo, 'estado', NEW.estado)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_audit_menor
  AFTER INSERT OR UPDATE ON menores_hallados
  FOR EACH ROW EXECUTE FUNCTION fn_audit_acceso_menor();

-- ============================================================
-- TRIGGER: Bloqueo automático si rescatista consulta >5 perfiles en 10 min
-- ============================================================
CREATE OR REPLACE FUNCTION fn_detectar_consulta_masiva()
RETURNS TRIGGER AS $$
DECLARE
  consultas_recientes INTEGER;
BEGIN
  SELECT COUNT(*) INTO consultas_recientes
  FROM audit_log
  WHERE usuario_id = auth.uid()
    AND accion = 'SELECT'
    AND tabla_afectada = 'menores_hallados'
    AND created_at > NOW() - INTERVAL '10 minutes';

  IF consultas_recientes >= 5 THEN
    -- Bloquear la cuenta automáticamente
    UPDATE usuarios
    SET bloqueado = true,
        razon_bloqueo = 'Auto-bloqueo: ' || consultas_recientes || ' consultas en 10 minutos. Revisión manual requerida.'
    WHERE id = auth.uid()
      AND rol = 'rescatista_campo'; -- nunca bloquear admins automáticamente

    -- Registrar en audit
    INSERT INTO audit_log (usuario_id, accion, tabla_afectada, metadata)
    VALUES (
      auth.uid(),
      'AUTO_BLOQUEO',
      'usuarios',
      jsonb_build_object('razon', 'consulta_masiva', 'count', consultas_recientes)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_detectar_scraping
  AFTER INSERT ON audit_log
  FOR EACH ROW
  WHEN (NEW.tabla_afectada = 'menores_hallados')
  EXECUTE FUNCTION fn_detectar_consulta_masiva();

-- ============================================================
-- TRIGGER: Detectar denuncias duplicadas de trata (anti-ruido)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_detectar_duplicado_trata()
RETURNS TRIGGER AS $$
DECLARE
  hash_nuevo TEXT;
  duplicado_count INTEGER;
BEGIN
  -- Crear hash del contenido para detectar duplicados
  hash_nuevo := md5(COALESCE(NEW.url_denunciada,'') || COALESCE(NEW.descripcion,''));
  NEW.hash_contenido := hash_nuevo;

  SELECT COUNT(*) INTO duplicado_count
  FROM denuncias_trata
  WHERE hash_contenido = hash_nuevo
    AND created_at > NOW() - INTERVAL '1 hour';

  IF duplicado_count >= 3 THEN
    NEW.es_duplicado := true;
    -- Reducir score del reportante
    UPDATE usuarios
    SET score_confianza = GREATEST(0, score_confianza - 10)
    WHERE id = auth.uid();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_anti_duplicado_trata
  BEFORE INSERT ON denuncias_trata
  FOR EACH ROW EXECUTE FUNCTION fn_detectar_duplicado_trata();

-- ============================================================
-- FUNCIÓN: Motor de matching entre menores y reportes
-- Se ejecuta cada vez que se registra un nuevo menor
-- ============================================================
CREATE OR REPLACE FUNCTION fn_calcular_matches(p_menor_id UUID)
RETURNS VOID AS $$
DECLARE
  menor menores_hallados%ROWTYPE;
  reporte reportes_desaparecidos%ROWTYPE;
  score NUMERIC := 0;
  campos TEXT[] := ARRAY[]::TEXT[];
BEGIN
  SELECT * INTO menor FROM menores_hallados WHERE id = p_menor_id;

  FOR reporte IN SELECT * FROM reportes_desaparecidos WHERE validado_cpnna = true OR score_reportante > 40
  LOOP
    score := 0;
    campos := ARRAY[]::TEXT[];

    -- 1. Género (20 puntos)
    IF menor.genero = reporte.genero THEN
      score := score + 20;
      campos := array_append(campos, 'genero');
    END IF;

    -- 2. Edad en rango (20 puntos)
    IF reporte.edad BETWEEN menor.edad_min AND menor.edad_max THEN
      score := score + 20;
      campos := array_append(campos, 'edad');
    END IF;

    -- 3. Similitud textual en descripción física (35 puntos - más importante)
    IF similarity(
      menor.descripcion_fisica,
      reporte.descripcion_fisica || ' ' || COALESCE(reporte.senas_particulares, '')
    ) > 0.3 THEN
      score := score + (similarity(
        menor.descripcion_fisica,
        reporte.descripcion_fisica || ' ' || COALESCE(reporte.senas_particulares, '')
      ) * 35);
      campos := array_append(campos, 'descripcion_fisica');
    END IF;

    -- 4. Similitud en ropa (15 puntos)
    IF menor.ropa_descripcion IS NOT NULL AND reporte.ropa_descripcion IS NOT NULL THEN
      IF similarity(menor.ropa_descripcion, reporte.ropa_descripcion) > 0.3 THEN
        score := score + (similarity(menor.ropa_descripcion, reporte.ropa_descripcion) * 15);
        campos := array_append(campos, 'ropa');
      END IF;
    END IF;

    -- 5. Palabras clave del menor (10 puntos)
    IF menor.palabras_clave IS NOT NULL AND reporte.nombre_menor IS NOT NULL THEN
      IF menor.palabras_clave ILIKE '%' || reporte.nombre_menor || '%' THEN
        score := score + 10;
        campos := array_append(campos, 'nombre_clave');
      END IF;
    END IF;

    -- Solo guardar si score > 50%
    IF score >= 50 THEN
      INSERT INTO matches (menor_id, reporte_id, porcentaje_coincidencia, campos_coincidentes)
      VALUES (p_menor_id, reporte.id, LEAST(score, 99), campos)
      ON CONFLICT (menor_id, reporte_id) DO UPDATE
        SET porcentaje_coincidencia = LEAST(score, 99),
            campos_coincidentes = campos,
            updated_at = NOW();

      -- Log del match detectado
      INSERT INTO audit_log (accion, tabla_afectada, metadata)
      VALUES (
        'MATCH_DETECTADO',
        'matches',
        jsonb_build_object(
          'menor_codigo', menor.codigo,
          'reporte_codigo', reporte.codigo,
          'score', score,
          'campos', campos
        )
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar matching automático al registrar un menor
CREATE OR REPLACE FUNCTION fn_trigger_matching()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM fn_calcular_matches(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_auto_matching
  AFTER INSERT ON menores_hallados
  FOR EACH ROW EXECUTE FUNCTION fn_trigger_matching();

-- También re-calcular cuando llega un nuevo reporte de padre
CREATE OR REPLACE FUNCTION fn_matching_desde_reporte()
RETURNS TRIGGER AS $$
DECLARE
  m menores_hallados%ROWTYPE;
BEGIN
  FOR m IN SELECT * FROM menores_hallados WHERE estado != 'reunificado'
  LOOP
    PERFORM fn_calcular_matches(m.id);
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_matching_reporte
  AFTER INSERT ON reportes_desaparecidos
  FOR EACH ROW EXECUTE FUNCTION fn_matching_desde_reporte();

-- ============================================================
-- FUNCIÓN: Generar token de invitación (solo admins)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_generar_token(
  p_para_nombre TEXT,
  p_refugio TEXT
)
RETURNS TEXT AS $$
DECLARE
  nuevo_token TEXT;
  user_rol rol_usuario;
BEGIN
  SELECT rol INTO user_rol FROM usuarios WHERE id = auth.uid();

  IF user_rol != 'admin_ong' THEN
    RAISE EXCEPTION 'Solo Admin_ONG puede generar tokens de invitación';
  END IF;

  INSERT INTO tokens_invitacion (generado_por, para_nombre, refugio_asignado)
  VALUES (auth.uid(), p_para_nombre, p_refugio)
  RETURNING token INTO nuevo_token;

  INSERT INTO audit_log (usuario_id, accion, tabla_afectada, metadata)
  VALUES (auth.uid(), 'TOKEN_GENERADO', 'tokens_invitacion',
    jsonb_build_object('para', p_para_nombre, 'refugio', p_refugio));

  RETURN nuevo_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCIÓN: Revocar token / bloquear rescatista (solo admins)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_revocar_acceso(p_usuario_id UUID, p_razon TEXT)
RETURNS VOID AS $$
BEGIN
  IF get_user_rol() != 'admin_ong' THEN
    RAISE EXCEPTION 'Solo Admin_ONG puede revocar accesos';
  END IF;

  UPDATE usuarios
  SET bloqueado = true, razon_bloqueo = p_razon
  WHERE id = p_usuario_id AND rol = 'rescatista_campo';

  -- Invalidar todos sus tokens
  UPDATE tokens_invitacion SET usado = true WHERE usado_por = p_usuario_id;

  INSERT INTO audit_log (usuario_id, accion, tabla_afectada, registro_id, metadata)
  VALUES (auth.uid(), 'ACCESO_REVOCADO', 'usuarios', p_usuario_id,
    jsonb_build_object('razon', p_razon));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCIÓN: Aprobar reunificación (HITL - solo admins)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_aprobar_reunificacion(
  p_match_id UUID,
  p_notas TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_match matches%ROWTYPE;
BEGIN
  IF get_user_rol() != 'admin_ong' THEN
    RAISE EXCEPTION 'Solo Admin_ONG puede aprobar reunificaciones';
  END IF;

  SELECT * INTO v_match FROM matches WHERE id = p_match_id;

  UPDATE matches
  SET estado = 'aprobado', revisado_por = auth.uid(), notas_revisor = p_notas, updated_at = NOW()
  WHERE id = p_match_id;

  UPDATE menores_hallados SET estado = 'reunificado', updated_at = NOW()
  WHERE id = v_match.menor_id;

  INSERT INTO audit_log (usuario_id, accion, tabla_afectada, registro_id, metadata)
  VALUES (auth.uid(), 'REUNIFICACION_APROBADA', 'matches', p_match_id,
    jsonb_build_object('menor_id', v_match.menor_id, 'reporte_id', v_match.reporte_id, 'notas', p_notas));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
