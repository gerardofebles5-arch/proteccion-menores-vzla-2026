-- Schema SQL para Supabase - Sistema Completo de Protección de Menores
-- Todas las tablas necesarias para funcionalidades reales

-- Tablas existentes (mantener)
-- solicitudes_acceso
-- reportes_urgentes
-- menores_registrados
-- matches
-- refugios
-- tokens
-- audit_log
-- security_alerts
-- denuncias_internas

-- Nuevas tablas para sistemas completos

-- Chat interno para coordinación
CREATE TABLE IF NOT EXISTS chat_canales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('general', 'emergencia', 'coordinacion', 'regional')),
  descripcion TEXT,
  participantes TEXT[],
  creado_por VARCHAR(255),
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS chat_mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  remitente VARCHAR(255) NOT NULL,
  remitente_id VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('texto', 'alerta', 'coordenada', 'archivo')),
  canal_id UUID REFERENCES chat_canales(id) ON DELETE CASCADE,
  prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('baja', 'normal', 'alta', 'critica')) DEFAULT 'normal',
  leido_por TEXT[],
  mensaje_padre_id UUID REFERENCES chat_mensajes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gestión de recursos
CREATE TABLE IF NOT EXISTS recursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('medico', 'alimentacion', 'agua', 'refugio', 'transporte', 'comunicacion', 'equipo', 'personal')),
  nombre VARCHAR(255) NOT NULL,
  cantidad INTEGER NOT NULL,
  unidad VARCHAR(50),
  ubicacion TEXT NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('disponible', 'en_uso', 'mantenimiento', 'agotado')) DEFAULT 'disponible',
  prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')) DEFAULT 'media',
  asignado_a TEXT,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voluntarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  cedula VARCHAR(50) UNIQUE NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  habilidades TEXT[],
  disponibilidad VARCHAR(20) NOT NULL CHECK (disponibilidad IN ('completa', 'parcial', 'limitada')),
  ubicacion TEXT NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('activo', 'inactivo', 'en_mision')) DEFAULT 'activo',
  certificaciones TEXT[],
  experiencia_previa TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultima_mision TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS misiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('busqueda', 'rescate', 'evacuacion', 'asistencia', 'coordinacion')),
  ubicacion TEXT NOT NULL,
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_fin TIMESTAMP WITH TIME ZONE,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('planificada', 'en_progreso', 'completada', 'suspendida')) DEFAULT 'planificada',
  personal_asignado UUID[],
  recursos_asignados UUID[],
  prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')) DEFAULT 'media',
  descripcion TEXT
);

-- Protocolos de evacuación
CREATE TABLE IF NOT EXISTS puntos_evacuacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  direccion TEXT NOT NULL,
  capacidad INTEGER NOT NULL,
  capacidad_actual INTEGER DEFAULT 0,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('temporal', 'permanente', 'emergencia')),
  servicios TEXT[],
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('activo', 'lleno', 'inactivo', 'mantenimiento')) DEFAULT 'activo',
  contacto_telefono VARCHAR(50),
  contacto_responsable VARCHAR(255),
  accesibilidad BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS rutas_evacuacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  origen TEXT NOT NULL,
  destino TEXT NOT NULL,
  puntos_intermedios TEXT[],
  distancia_km DECIMAL(10, 2),
  tiempo_estimado_minutos INTEGER,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('segura', 'riesgosa', 'bloqueada')) DEFAULT 'segura',
  tipo_transporte VARCHAR(20) NOT NULL CHECK (tipo_transporte IN ('pie', 'vehiculo', 'ambulancia', 'helicoptero')),
  condiciones TEXT[]
);

CREATE TABLE IF NOT EXISTS planes_evacuacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  tipo_emergencia VARCHAR(50) NOT NULL CHECK (tipo_emergencia IN ('sismo', 'inundacion', 'deslizamiento', 'incendio', 'trata')),
  zona_afectada TEXT NOT NULL,
  nivel_riesgo VARCHAR(20) NOT NULL CHECK (nivel_riesgo IN ('bajo', 'medio', 'alto', 'critico')),
  puntos_evacuacion UUID[],
  rutas UUID[],
  prioridades JSONB,
  procedimientos JSONB,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('activo', 'inactivo', 'ejecucion')) DEFAULT 'activo'
);

-- Alertas masivas
CREATE TABLE IF NOT EXISTS alertas_masivas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('sms', 'email', 'push', 'todas')),
  prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
  titulo VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  destinatarios TEXT[],
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'enviando', 'enviado', 'fallido', 'cancelado')) DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_envio TIMESTAMP WITH TIME ZONE,
  estadisticas JSONB DEFAULT '{"total_destinatarios": 0, "enviados": 0, "fallidos": 0, "leidos": 0}'::jsonb
);

CREATE TABLE IF NOT EXISTS plantillas_alerta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('emergencia', 'busqueda', 'evacuacion', 'informacion')),
  asunto VARCHAR(255) NOT NULL,
  cuerpo TEXT NOT NULL,
  variables TEXT[]
);

-- Métricas y KPIs
CREATE TABLE IF NOT EXISTS metricas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  valor DECIMAL(15, 2) NOT NULL,
  unidad VARCHAR(50),
  tendencia VARCHAR(20) CHECK (tendencia IN ('ascendente', 'descendente', 'estable')),
  cambio_porcentaje DECIMAL(10, 2),
  periodo VARCHAR(20) CHECK (periodo IN ('hoy', 'semana', 'mes', 'anio')),
  categoria VARCHAR(50) CHECK (categoria IN ('operacional', 'seguridad', 'impacto', 'eficiencia')),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  objetivo DECIMAL(15, 2) NOT NULL,
  valor_actual DECIMAL(15, 2) NOT NULL,
  estado VARCHAR(20) CHECK (estado IN ('excelente', 'bueno', 'aceptable', 'critico')),
  historial JSONB DEFAULT '[]'::jsonb,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gestión de evidencia
CREATE TABLE IF NOT EXISTS evidencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caso_id VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('foto', 'video', 'audio', 'documento', 'testimonio', 'fisica')),
  descripcion TEXT NOT NULL,
  archivo_url TEXT,
  ubicacion_fisica TEXT,
  fecha_recoleccion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recolectado_por VARCHAR(255) NOT NULL,
  cadena_custodia JSONB DEFAULT '[]'::jsonb,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('activa', 'analisis', 'procesada', 'archivada')) DEFAULT 'activa',
  prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')) DEFAULT 'media',
  clasificacion VARCHAR(20) NOT NULL CHECK (clasificacion IN ('publica', 'restringida', 'confidencial', 'secreta')) DEFAULT 'restringida',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Integración redes sociales
CREATE TABLE IF NOT EXISTS publicaciones_sociales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plataforma VARCHAR(20) NOT NULL CHECK (plataforma IN ('twitter', 'facebook', 'instagram', 'todas')),
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('alerta_menor', 'informacion', 'emergencia', 'actualizacion')),
  contenido JSONB NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('borrador', 'programado', 'publicado', 'eliminado')) DEFAULT 'borrador',
  fecha_programada TIMESTAMP WITH TIME ZONE,
  fecha_publicacion TIMESTAMP WITH TIME ZONE,
  estadisticas JSONB DEFAULT '{"alcance": 0, "likes": 0, "compartidos": 0, "comentarios": 0}'::jsonb,
  caso_relacionado VARCHAR(255)
);

-- Documentos legales
CREATE TABLE IF NOT EXISTS documentos_legales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('reporte_urgente', 'denuncia_trata', 'menor_desaparecido', 'reunion_familiar')),
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('borrador', 'en_revision', 'aprobado', 'archivado')) DEFAULT 'borrador',
  contenido JSONB NOT NULL,
  referencias_legales TEXT[],
  firmas JSONB DEFAULT '[]'::jsonb,
  creador VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_chat_mensajes_canal ON chat_mensajes(canal_id);
CREATE INDEX IF NOT EXISTS idx_chat_mensajes_fecha ON chat_mensajes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recursos_estado ON recursos(estado);
CREATE INDEX IF NOT EXISTS idx_voluntarios_estado ON voluntarios(estado);
CREATE INDEX IF NOT EXISTS idx_misiones_estado ON misiones(estado);
CREATE INDEX IF NOT EXISTS idx_evidencias_caso ON evidencias(caso_id);
CREATE INDEX IF NOT EXISTS idx_alertas_estado ON alertas_masivas(estado);
CREATE INDEX IF NOT EXISTS idx_publicaciones_estado ON publicaciones_sociales(estado);

-- Row Level Security (RLS)
ALTER TABLE chat_canales ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE voluntarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE misiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE puntos_evacuacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE rutas_evacuacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE planes_evacuacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_masivas ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantillas_alerta ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicaciones_sociales ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_legales ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (ajustar según necesidades de seguridad)
CREATE OR REPLACE POLICY "Lectura pública para chat_canales" ON chat_canales FOR SELECT USING (true);
CREATE OR REPLACE POLICY "Lectura pública para chat_mensajes" ON chat_mensajes FOR SELECT USING (true);
CREATE OR REPLACE POLICY "Lectura pública para recursos" ON recursos FOR SELECT USING (true);
CREATE OR REPLACE POLICY "Lectura pública para voluntarios" ON voluntarios FOR SELECT USING (true);
CREATE OR REPLACE POLICY "Lectura pública para misiones" ON misiones FOR SELECT USING (true);
CREATE OR REPLACE POLICY "Lectura pública para puntos_evacuacion" ON puntos_evacuacion FOR SELECT USING (true);
CREATE OR REPLACE POLICY "Lectura pública para alertas_masivas" ON alertas_masivas FOR SELECT USING (true);
CREATE OR REPLACE POLICY "Lectura pública para metricas" ON metricas FOR SELECT USING (true);
CREATE OR REPLACE POLICY "Lectura pública para kpis" ON kpis FOR SELECT USING (true);
CREATE OR REPLACE POLICY "Lectura pública para evidencias" ON evidencias FOR SELECT USING (true);
CREATE OR REPLACE POLICY "Lectura pública para publicaciones_sociales" ON publicaciones_sociales FOR SELECT USING (true);

-- Políticas de inserción (requieren autenticación en producción)
CREATE OR REPLACE POLICY "Inserción autenticada" ON chat_mensajes FOR INSERT WITH CHECK (true);
CREATE OR REPLACE POLICY "Inserción autenticada" ON recursos FOR INSERT WITH CHECK (true);
CREATE OR REPLACE POLICY "Inserción autenticada" ON voluntarios FOR INSERT WITH CHECK (true);
CREATE OR REPLACE POLICY "Inserción autenticada" ON misiones FOR INSERT WITH CHECK (true);
CREATE OR REPLACE POLICY "Inserción autenticada" ON alertas_masivas FOR INSERT WITH CHECK (true);
CREATE OR REPLACE POLICY "Inserción autenticada" ON metricas FOR INSERT WITH CHECK (true);
CREATE OR REPLACE POLICY "Inserción autenticada" ON kpis FOR INSERT WITH CHECK (true);
CREATE OR REPLACE POLICY "Inserción autenticada" ON evidencias FOR INSERT WITH CHECK (true);
CREATE OR REPLACE POLICY "Inserción autenticada" ON publicaciones_sociales FOR INSERT WITH CHECK (true);
CREATE OR REPLACE POLICY "Inserción autenticada" ON documentos_legales FOR INSERT WITH CHECK (true);

-- Políticas de actualización
CREATE OR REPLACE POLICY "Actualización autenticada" ON chat_mensajes FOR UPDATE USING (true);
CREATE OR REPLACE POLICY "Actualización autenticada" ON recursos FOR UPDATE USING (true);
CREATE OR REPLACE POLICY "Actualización autenticada" ON voluntarios FOR UPDATE USING (true);
CREATE OR REPLACE POLICY "Actualización autenticada" ON misiones FOR UPDATE USING (true);
CREATE OR REPLACE POLICY "Actualización autenticada" ON alertas_masivas FOR UPDATE USING (true);
CREATE OR REPLACE POLICY "Actualización autenticada" ON metricas FOR UPDATE USING (true);
CREATE OR REPLACE POLICY "Actualización autenticada" ON kpis FOR UPDATE USING (true);
CREATE OR REPLACE POLICY "Actualización autenticada" ON evidencias FOR UPDATE USING (true);
CREATE OR REPLACE POLICY "Actualización autenticada" ON publicaciones_sociales FOR UPDATE USING (true);
CREATE OR REPLACE POLICY "Actualización autenticada" ON documentos_legales FOR UPDATE USING (true);
