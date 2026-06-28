-- ============================================================
-- PROTECCIÓN MENORES VENEZUELA - EMERGENCIA 2026
-- Schema Supabase/PostgreSQL
-- Ejecutar en orden en el SQL Editor de Supabase
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- para búsqueda fuzzy de texto

-- ============================================================
-- ENUM TIPOS
-- ============================================================
CREATE TYPE rol_usuario AS ENUM ('admin_ong', 'rescatista_campo', 'ciudadano');
CREATE TYPE estado_menor AS ENUM ('hallado', 'en_proceso', 'reunificado', 'alta_alerta');
CREATE TYPE nivel_match AS ENUM ('pendiente', 'aprobado', 'rechazado', 'escalado_cicpc');
CREATE TYPE tipo_reporte AS ENUM ('intento_rapto', 'menor_solo', 'menor_desaparecido', 'falso_funcionario', 'movimiento_sospechoso', 'otro');
CREATE TYPE plataforma_trata AS ENUM ('vinted', 'instagram', 'facebook', 'telegram', 'whatsapp', 'olx', 'mercadolibre', 'tiktok', 'otro');
CREATE TYPE nivel_urgencia AS ENUM ('critico', 'urgente', 'moderado');

-- ============================================================
-- TABLA: organizaciones
-- ============================================================
CREATE TABLE organizaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL, -- 'estatal', 'ong_nacional', 'ong_internacional'
  contacto TEXT,
  telefono TEXT,
  email_oficial TEXT,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO organizaciones (nombre, tipo, telefono, email_oficial) VALUES
  ('IDENNA', 'estatal', NULL, 'contacto@idenna.gob.ve'),
  ('CPNNA', 'estatal', NULL, NULL),
  ('Defensoría del Pueblo', 'estatal', '0800-DEFENSOR', NULL),
  ('Ministerio Público', 'estatal', NULL, NULL),
  ('CICPC', 'estatal', '0212-483-0411', NULL),
  ('FUNDANA', 'ong_nacional', NULL, NULL),
  ('CECODAP', 'ong_nacional', NULL, NULL),
  ('UNICEF Venezuela', 'ong_internacional', '0212-206-0200', NULL),
  ('HIAS Venezuela', 'ong_internacional', NULL, NULL),
  ('World Vision Venezuela', 'ong_internacional', NULL, NULL),
  ('Cruz Roja Venezuela', 'ong_internacional', '0800-CRUZROJA', NULL),
  ('INTERPOL Venezuela', 'estatal', NULL, NULL);

-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  rol rol_usuario NOT NULL DEFAULT 'ciudadano',
  organizacion_id UUID REFERENCES organizaciones(id),
  admin_padre_id UUID REFERENCES usuarios(id), -- quién generó su token
  score_confianza INTEGER DEFAULT 100 CHECK (score_confianza BETWEEN 0 AND 100),
  bloqueado BOOLEAN DEFAULT false,
  razon_bloqueo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ultimo_acceso TIMESTAMPTZ
);

-- ============================================================
-- TABLA: tokens_invitacion
-- ============================================================
CREATE TABLE tokens_invitacion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL DEFAULT 'TKN-' || upper(substr(md5(random()::text), 1, 8)) || '-' || upper(substr(md5(random()::text), 1, 4)),
  generado_por UUID NOT NULL REFERENCES usuarios(id),
  para_nombre TEXT NOT NULL,
  refugio_asignado TEXT,
  usado BOOLEAN DEFAULT false,
  usado_por UUID REFERENCES usuarios(id),
  expira_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '48 hours',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: refugios
-- ============================================================
CREATE TABLE refugios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo TEXT UNIQUE NOT NULL, -- REF-####
  nombre TEXT,
  estado TEXT NOT NULL,
  municipio TEXT NOT NULL,
  direccion_encriptada TEXT, -- AES-256 aplicado en aplicación
  organizacion_id UUID REFERENCES organizaciones(id),
  capacidad INTEGER,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: menores_hallados
-- ============================================================
CREATE TABLE menores_hallados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo TEXT UNIQUE NOT NULL DEFAULT 'MEN-2026-' || lpad(floor(random()*9000+1000)::text, 4, '0'),
  refugio_id UUID REFERENCES refugios(id),
  registrado_por UUID NOT NULL REFERENCES usuarios(id),

  -- Datos de matching (nunca expuestos públicamente)
  nombre_posible TEXT, -- cifrado en app
  edad_min INTEGER,
  edad_max INTEGER,
  genero TEXT,
  descripcion_fisica TEXT NOT NULL, -- señas particulares
  ropa_descripcion TEXT,
  palabras_clave TEXT, -- lo que dijo el menor
  foto_url TEXT, -- Supabase Storage, acceso privado
  audio_url TEXT,

  -- Estado
  estado estado_menor DEFAULT 'hallado',
  salud TEXT,
  idioma TEXT DEFAULT 'español',

  -- Custodia
  condicion_entrega TEXT DEFAULT 'requiere_verificacion_completa',
  intento_retiro_no_autorizado BOOLEAN DEFAULT false,
  detalle_intento TEXT,

  -- Control
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: reportes_desaparecidos (padres buscando hijos)
-- ============================================================
CREATE TABLE reportes_desaparecidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo TEXT UNIQUE NOT NULL DEFAULT 'REP-2026-' || lpad(floor(random()*9000+1000)::text, 4, '0'),
  reportado_por UUID REFERENCES usuarios(id), -- puede ser anónimo
  nombre_reportante TEXT,
  telefono_reportante TEXT, -- cifrado en app

  -- Datos del menor buscado
  nombre_menor TEXT,
  edad INTEGER,
  genero TEXT,
  descripcion_fisica TEXT NOT NULL,
  ropa_descripcion TEXT,
  senas_particulares TEXT,
  foto_previa_url TEXT, -- foto antes del sismo
  fecha_desaparicion DATE,
  lugar_desaparicion TEXT,

  -- Verificación anti-falsos reportes
  validado_cpnna BOOLEAN DEFAULT false,
  score_reportante INTEGER DEFAULT 50,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: matches (ciego - nunca expone datos directamente)
-- ============================================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menor_id UUID NOT NULL REFERENCES menores_hallados(id),
  reporte_id UUID NOT NULL REFERENCES reportes_desaparecidos(id),
  porcentaje_coincidencia NUMERIC(5,2) NOT NULL,
  campos_coincidentes TEXT[], -- ['genero','descripcion_fisica','ropa']
  estado nivel_match DEFAULT 'pendiente',
  revisado_por UUID REFERENCES usuarios(id),
  notas_revisor TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(menor_id, reporte_id)
);

-- ============================================================
-- TABLA: reportes_urgentes (ciudadanos reportan incidentes)
-- ============================================================
CREATE TABLE reportes_urgentes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo TEXT UNIQUE NOT NULL DEFAULT 'VE-2026-' || lpad(floor(random()*9000+1000)::text, 4, '0'),
  tipo tipo_reporte NOT NULL,
  ubicacion TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  descripcion_sospechoso TEXT,
  nombre_reportante TEXT,
  telefono_reportante TEXT,
  archivos_url TEXT[], -- fotos, videos, audios de evidencia
  score_reportante INTEGER DEFAULT 50,
  procesado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: denuncias_trata
-- ============================================================
CREATE TABLE denuncias_trata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo TEXT UNIQUE NOT NULL DEFAULT 'TRA-2026-' || lpad(floor(random()*9000+1000)::text, 4, '0'),
  plataforma plataforma_trata NOT NULL,
  url_denunciada TEXT,
  descripcion TEXT NOT NULL,
  capturas_url TEXT[],
  posible_menor_id UUID REFERENCES menores_hallados(id),
  nombre_denunciante TEXT,
  contacto_denunciante TEXT,
  score_denunciante INTEGER DEFAULT 50,
  -- Anti-ruido: detectar duplicados
  hash_contenido TEXT, -- hash de URL+descripción para detectar spam
  es_duplicado BOOLEAN DEFAULT false,
  procesado BOOLEAN DEFAULT false,
  enviado_fiscalia BOOLEAN DEFAULT false,
  enviado_cicpc BOOLEAN DEFAULT false,
  enviado_interpol BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: necesidades_refugio (geolocalización de insumos)
-- ============================================================
CREATE TABLE necesidades_refugio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  refugio_id UUID NOT NULL REFERENCES refugios(id),
  tipo_necesidad TEXT NOT NULL,
  nivel_urgencia nivel_urgencia NOT NULL,
  cantidad TEXT,
  cubierta BOOLEAN DEFAULT false,
  reportado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: rumores_verificacion
-- ============================================================
CREATE TABLE rumores_verificacion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('falso','verdadero','verificando')),
  verificado_por UUID REFERENCES organizaciones(id),
  fuente_rumor TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: audit_log (inmutable)
-- ============================================================
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  accion TEXT NOT NULL,
  tabla_afectada TEXT,
  registro_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- audit_log NO tiene DELETE ni UPDATE permitido (política)

-- ============================================================
-- ÍNDICES para búsqueda rápida
-- ============================================================
CREATE INDEX idx_menores_estado ON menores_hallados(estado);
CREATE INDEX idx_menores_refugio ON menores_hallados(refugio_id);
CREATE INDEX idx_menores_descripcion ON menores_hallados USING gin(to_tsvector('spanish', descripcion_fisica));
CREATE INDEX idx_reportes_descripcion ON reportes_desaparecidos USING gin(to_tsvector('spanish', descripcion_fisica || ' ' || COALESCE(senas_particulares,'')));
CREATE INDEX idx_matches_estado ON matches(estado);
CREATE INDEX idx_denuncias_plataforma ON denuncias_trata(plataforma);
CREATE INDEX idx_denuncias_hash ON denuncias_trata(hash_contenido);
CREATE INDEX idx_audit_usuario ON audit_log(usuario_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);
