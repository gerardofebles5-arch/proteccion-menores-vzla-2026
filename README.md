# 🚨 PROTECCIÓN MENORES VENEZUELA 2026 - EMERGENCIA SISMOS

Sistema seguro de **reunificación familiar y protección contra trata** para menores afectados por los sismos del 24 de junio de 2026 en Venezuela.

## 🎯 OBJETIVO CRÍTICO
Prevenir raptos, tráfico humano y proteger a niños separados de sus familias durante el caos post-sísmico.

## 🔒 ARQUITECTURA DE SEGURIDAD
- **Doble Ciego**: Datos de menores cifrados, nunca expuestos públicamente
- **RBAC Estricto**: Solo ONGs verificadas (FUNDANA, CECODAP, UNICEF) acceden a datos sensibles
- **Auditoría Total**: Cada acceso es registrado y bloqueado ante comportamiento sospechoso
- **Anti-Scraping**: Defensas contra extracción masiva de datos
- **PWA Offline**: Funciona sin conexión en zonas de desastre

## 🏗️ STACK TECNOLÓGICO
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL con RLS, Storage, Auth)
- **PWA**: next-pwa + Service Workers + IndexedDB
- **Despliegue**: Vercel + Supabase Cloud

## 🚀 DESPLIEGUE URGENTE (15 minutos)

### 1. CONFIGURAR SUPABASE
1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Ir a **SQL Editor** y ejecutar:
   - Primero `01_schema.sql`
   - Luego `02_rls_triggers.sql`
4. Crear buckets de Storage:
   - `evidencias-reportes`
   - `fotos-menores` (con RLS activado)
   - `capturas-trata`

### 2. CONFIGURAR VARIABLES DE ENTORNO
Crear archivo `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 3. INSTALAR DEPENDENCIAS
```bash
npm install
```

### 4. DESPLEGAR EN VERCEL
1. Conectar repositorio GitHub a Vercel
2. Agregar variables de entorno
3. Deploy automático

### 5. CONFIGURAR ONGs (ADMIN ROOT)
1. Crear cuenta admin inicial
2. Generar tokens para coordinadores de FUNDANA/CECODAP/UNICEF
3. Ellos generan sub-tokens para sus rescatistas

## 📱 MÓDULOS PRINCIPALES

### 🚨 Reporte Urgente (Ciudadanos)
- Intentos de rapto en progreso
- Menores solos en zona de riesgo
- Falsos funcionarios/autodeclarados
- Evidencia multimedia (foto, audio, video)

### 👶 Buscar Hijo/a (Padres)
- Reporte de menor desaparecido
- Fotos previas, descripción física
- Sistema de matching ciego

### ⚠️ Denuncia de Trata
- Anuncios sospechosos en Vinted, OLX, etc.
- Señales: precios irregulares, descripciones físicas
- Envío automático a Fiscalía + CICPC + INTERPOL

### 🔍 Panel Staff (ONGs verificadas)
- Ver coincidencias detectadas (matches)
- Aprobar/rechazar reunificaciones (HITL)
- Auditar todos los accesos
- Revocar accesos sospechosos

## 🛡️ MECANISMOS DE DEFENSA

### Contra Exfiltración de Datos
- Trigger bloquea consultas masivas (>5 perfiles en 10 min)
- Logs inmutables de todos los accesos
- Score de confianza de usuarios

### Contra Falsos Reportes
- Validación con CPNNA para reportes de padres
- Detección de duplicados/spam
- Score de reputación de reportantes

### Contra Suplantación
- Tokens jerárquicos (solo admin → rescatista)
- 2FA recomendado para staff
- Auditoría de cada acción

## 📞 CONTACTOS DE EMERGENCIA INTEGRADOS
- **911**: Emergencias generales
- **0800-SECUESTRO**: CICPC antirapto
- **0800-FISCA-00**: Fiscalía de protección
- **0800-DEFENSOR**: Defensoría del Pueblo

## 📊 ENTES COLABORADORES
- IDENNA (órgano rector)
- FUNDANA (refugio temporal 0-7 años)
- CECODAP (asesoría legal y psicológica)
- UNICEF (protección en emergencia)
- Cruz Roja Venezolana

## 🚨 PROTOCOLO DE USO EN REFUGIOS
1. **No mostrar listados públicos** de niños
2. **Solo staff con token** registra menores hallados
3. **Verificación de reclamantes** requiere doble validación
4. **Auditar cada entrega** con logs inmutables

## 🔧 MANTENIMIENTO
- Revisar logs de auditoría diariamente
- Revocar tokens de rescatistas que dejaron de operar
- Actualizar contactos de ONGs según disponibilidad
- Monitorizar intentos de scraping/bloqueo automático

## 📄 LICENCIA
Sistema de emergencia - Uso libre para fines humanitarios en Venezuela 2026.

## 🤝 COLABORACIÓN CON ONGs
Para integrarse como organización verificada:
1. Contactar vía correo oficial
2. Validar documentación de la organización
3. Recibir tokens root para administrar su personal
4. Capacitar rescatistas en uso seguro del sistema

---
**⚠️ Este sistema salva vidas. Úselo con responsabilidad extrema.**