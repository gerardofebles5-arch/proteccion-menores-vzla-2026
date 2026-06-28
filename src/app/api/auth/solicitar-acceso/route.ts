import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { 
  isIPBlacklisted, 
  detectVPN, 
  reputationSystem, 
  earlyWarningSystem,
  encryptData,
  hashSensitiveData
} from '@/lib/security'

// Organizaciones en lista blanca para aprobación automática (expandido al máximo)
const ORGANIZACIONES_AUTORIZADAS = [
  'FUNDANA',
  'CECODAP',
  'UNICEF',
  'Cruz Roja',
  'Protección Civil',
  'CPNNA',
  'Gobierno',
  'Defensoría del Pueblo',
  'CICPC',
  'Fiscalía',
  'Ministerio Público',
  'Ministerio de Educación',
  'Ministerio de Salud',
  'Ministerio de la Familia',
  'INN',
  'IVSS',
  'Policía Nacional',
  'Guardia Nacional',
  'Bomberos',
  'Fundación del Niño',
  'Aldeas SOS',
  'Save the Children',
  'World Vision',
  'Plan International',
  'Caritas',
  'Fundación Ayuda en Acción',
  'Fundación La Salle',
  'UCAB',
  'USB',
  'UCV',
  'UNESR',
  'ULA',
  'UDO',
  'UNELLEZ',
  'Misión Alimentación',
  'Pdvsa',
  'Cantv',
  'Corpoelec',
  'Hidroven',
  'Ministerio del Poder Popular para la Educación',
  'Ministerio del Poder Popular para la Salud',
  'Ministerio del Poder Popular para las Relaciones Interiores',
  'Ministerio del Poder Popular para la Defensa',
  'Consejo Nacional Electoral',
  'Tribunal Supremo de Justicia',
  'Asamblea Nacional',
  'Gobernaciones',
  'Alcaldías',
  'Consejos Municipales',
  'Consejos Comunales',
  'Comités de Salud',
  'Comités de Educación',
  'Mesas Técnicas de Agua',
  'Mesas Técnicas de Electricidad',
  'Fundacite',
  'Conicit',
  'Fundayacucho',
  'Fundacite Mérida',
  'Fundacite Aragua',
  'Fundacite Zulia',
  'Fundacite Carabobo',
  'Fundacite Anzoátegui',
  'Fundacite Bolívar',
  'Fundacite Falcón',
  'Fundacite Lara',
  'Fundacite Miranda',
  'Fundacite Nueva Esparta',
  'Fundacite Sucre',
  'Fundacite Táchira',
  'Fundacite Trujillo',
  'Fundacite Yaracuy',
  'Fundacite Portuguesa',
  'Fundacite Cojedes',
  'Fundacite Delta Amacuro',
  'Fundacite Amazonas',
  'Fundacite Vargas'
]

// Dominios oficiales conocidos (expandido)
const DOMINIOS_OFICIALES = {
  'FUNDANA': ['fundana.org'],
  'CECODAP': ['cecodap.org.ve', 'cecodap.org'],
  'UNICEF': ['unicef.org'],
  'Cruz Roja': ['cruzroja.ve', 'ifrc.org'],
  'Protección Civil': ['proteccioncivil.gob.ve', 'gob.ve'],
  'CPNNA': ['cpnna.gob.ve', 'gob.ve'],
  'Gobierno': ['gob.ve', 'venezuela.gob.ve', 'mppri.gob.ve', 'mppsalud.gob.ve', 'mpppe.gob.ve'],
  'Defensoría del Pueblo': ['defensoria.gob.ve', 'gob.ve'],
  'CICPC': ['cicpc.gob.ve', 'gob.ve'],
  'Fiscalía': ['fiscalia.gob.ve', 'mp.gob.ve', 'gob.ve'],
  'Ministerio Público': ['mp.gob.ve', 'gob.ve'],
  'Ministerio de Educación': ['mpppe.gob.ve', 'gob.ve'],
  'Ministerio de Salud': ['mppsalud.gob.ve', 'gob.ve'],
  'Ministerio de la Familia': ['minfamilia.gob.ve', 'gob.ve'],
  'INN': ['inn.gob.ve', 'gob.ve'],
  'IVSS': ['ivss.gob.ve', 'gob.ve'],
  'Policía Nacional': ['policia.gob.ve', 'gob.ve'],
  'Guardia Nacional': ['fanb.gob.ve', 'gob.ve'],
  'Bomberos': ['bomberos.gob.ve', 'gob.ve'],
  'Fundación del Niño': ['fundacionnino.gob.ve', 'gob.ve'],
  'Aldeas SOS': ['aldeasos.org', 'sos-childrensvillages.org'],
  'Save the Children': ['savethechildren.org', 'savethechildren.net'],
  'World Vision': ['worldvision.org'],
  'Plan International': ['plan-international.org'],
  'Caritas': ['caritas.org.ve', 'caritas.org'],
  'Fundación Ayuda en Acción': ['ayudaenaccion.org'],
  'Fundación La Salle': ['fundacionlasalle.org.ve'],
  'UCAB': ['ucab.edu.ve'],
  'USB': ['usb.ve'],
  'UCV': ['ucv.ve'],
  'UNESR': ['unesr.edu.ve'],
  'ULA': ['ula.ve'],
  'UDO': ['udo.edu.ve'],
  'UNELLEZ': ['unellez.edu.ve'],
  'Misión Alimentación': ['misionalimentacion.gob.ve', 'gob.ve'],
  'Pdvsa': ['pdvsa.com'],
  'Cantv': ['cantv.com.ve'],
  'Corpoelec': ['corpoelec.gob.ve', 'gob.ve'],
  'Hidroven': ['hidroven.gob.ve', 'gob.ve'],
  'Consejo Nacional Electoral': ['cne.gob.ve', 'gob.ve'],
  'Tribunal Supremo de Justicia': ['tsj.gob.ve', 'gob.ve'],
  'Asamblea Nacional': ['asambleanacional.gob.ve', 'gob.ve']
}

// Cargos autorizados por organización
const CARGOS_AUTORIZADOS = {
  'FUNDANA': ['trabajador social', 'psicólogo', 'coordinador', 'director', 'voluntario', 'educador', 'nutricionista', 'médico'],
  'CECODAP': ['trabajador social', 'psicólogo', 'abogado', 'coordinador', 'director', 'voluntario', 'educador'],
  'UNICEF': ['oficial de programa', 'coordinador', 'director', 'especialista', 'consultor', 'voluntario'],
  'Cruz Roja': ['voluntario', 'enfermero', 'médico', 'coordinador', 'director', 'socorrista', 'logístico'],
  'Protección Civil': ['oficial', 'coordinador', 'director', 'técnico', 'voluntario', 'rescatista'],
  'CPNNA': ['consejero', 'director', 'trabajador social', 'psicólogo', 'abogado'],
  'Gobierno': ['funcionario', 'director', 'coordinador', 'técnico', 'analista', 'asesor'],
  'Defensoría del Pueblo': ['defensor', 'abogado', 'trabajador social', 'coordinador'],
  'CICPC': ['investigador', 'comisario', 'director', 'técnico'],
  'Fiscalía': ['fiscal', 'abogado', 'secretario', 'técnico'],
  'default': ['director', 'coordinador', 'técnico', 'analista', 'funcionario', 'voluntario', 'trabajador social', 'psicólogo', 'abogado', 'médico', 'enfermero']
}

// Algoritmo de validación automática (mejorado al máximo)
async function validarSolicitudAutomatica(body: any, supabase: any) {
  let puntaje = 0
  const razones = []

  // 1. Verificar organización autorizada
  if (ORGANIZACIONES_AUTORIZADAS.includes(body.organizacion)) {
    puntaje += 25
    razones.push('Organización autorizada')
  }

  // 2. Verificar dominio oficial del email
  const emailDomain = body.email.split('@')[1]?.toLowerCase()
  const dominiosOrg = (DOMINIOS_OFICIALES as any)[body.organizacion] || []
  if (dominiosOrg.some((d: string) => emailDomain?.includes(d))) {
    puntaje += 20
    razones.push('Email corporativo oficial')
  } else if (emailDomain?.includes('.gob.ve') || emailDomain?.includes('.edu.ve') || emailDomain?.includes('.org')) {
    puntaje += 10
    razones.push('Dominio institucional')
  }

  // 3. Validar formato de cédula venezolana
  const cedulaValida = /^V-\d{7,9}-?\d?$/.test(body.cedula) || /^E-\d{7,9}-?\d?$/.test(body.cedula)
  if (cedulaValida) {
    puntaje += 15
    razones.push('Cédula válida')
  }

  // 4. Validar cargo autorizado para la organización
  const cargosOrg = (CARGOS_AUTORIZADOS as any)[body.organizacion] || CARGOS_AUTORIZADOS.default
  const cargoNormalizado = body.cargo.toLowerCase().trim()
  if (cargosOrg.some((c: string) => cargoNormalizado.includes(c))) {
    puntaje += 10
    razones.push('Cargo autorizado')
  }

  // 5. Validar formato de teléfono venezolano
  const telefonoValido = /^04(12|14|16|24|26)\d{7}$/.test(body.telefono.replace(/[-\s]/g, ''))
  if (telefonoValido) {
    puntaje += 5
    razones.push('Teléfono válido')
  }

  // 6. Verificar referido por usuario verificado (bonus alto)
  if (body.referido_por) {
    const { data: referido } = await supabase
      .from('solicitudes_acceso')
      .select('*')
      .eq('nombre', body.referido_por)
      .eq('estado', 'aprobado')
      .single()

    if (referido) {
      puntaje += 15
      razones.push('Referido por usuario verificado')
    }
  }

  // 7. Verificar que no haya solicitudes previas rechazadas con misma cédula
  const { data: solicitudesPrevias } = await supabase
    .from('solicitudes_acceso')
    .select('*')
    .eq('cedula', body.cedula)
    .eq('estado', 'rechazado')

  if (!solicitudesPrevias || solicitudesPrevias.length === 0) {
    puntaje += 5
    razones.push('Sin historial de rechazos')
  }

  // 8. Verificar credencial subida
  if (body.credencial_url) {
    puntaje += 5
    razones.push('Credencial oficial subida')
  }

  // 9. Sistema de confianza progresiva (si hay usuarios verificados de misma org)
  const { data: usuariosMismaOrg } = await supabase
    .from('solicitudes_acceso')
    .select('*')
    .eq('organizacion', body.organizacion)
    .eq('estado', 'aprobado')

  if (usuariosMismaOrg && usuariosMismaOrg.length >= 5) {
    puntaje += 5
    razones.push('Organización con historial positivo')
  }

  // Umbral de aprobación automática reducido: 60 puntos (más permisivo)
  const APROBADO_AUTOMATICAMENTE = puntaje >= 60

  return {
    aprobado: APROBADO_AUTOMATICAMENTE,
    puntaje,
    razones,
    umbral: 60
  }
}

// Detección de fraude avanzada con análisis de patrones
async function detectarFraude(body: any, supabase: any, ip: string) {
  const alertas = []
  let puntajeFraude = 0

  // 1. Verificar múltiples solicitudes desde misma IP en última hora
  const { data: solicitudesIP } = await supabase
    .from('solicitudes_acceso')
    .select('*')
    .eq('ip_address', ip)
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())

  if (solicitudesIP && solicitudesIP.length > 3) {
    alertas.push('Múltiples solicitudes desde misma IP')
    puntajeFraude += 30
  }

  // 2. Verificar múltiples solicitudes con misma cédula
  const { data: solicitudesCedula } = await supabase
    .from('solicitudes_acceso')
    .select('*')
    .eq('cedula', body.cedula)

  if (solicitudesCedula && solicitudesCedula.length > 2) {
    alertas.push('Múltiples solicitudes con misma cédula')
    puntajeFraude += 40
  }

  // 3. Verificar email temporal (lista expandida)
  const dominiosTemporales = [
    'tempmail.com', 'guerrillamail.com', '10minutemail.com',
    'mailinator.com', 'throwaway.email', 'temp-mail.org',
    'sharklasers.com', 'getairmail.com', 'yopmail.com',
    'maildrop.cc', 'tempmail.de', 'tempmail.net',
    'fake-mail.com', 'trash-mail.com', 'spam4.me'
  ]
  const emailDomain = body.email.split('@')[1]?.toLowerCase()
  if (dominiosTemporales.some(d => emailDomain?.includes(d))) {
    alertas.push('Email temporal detectado')
    puntajeFraude += 50
  }

  // 4. Verificar email personal (gmail, yahoo, hotmail) sin organización oficial
  const dominiosPersonales = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com']
  if (dominiosPersonales.some(d => emailDomain?.includes(d))) {
    // Solo alerta si no es organización autorizada
    if (!ORGANIZACIONES_AUTORIZADAS.includes(body.organizacion)) {
      alertas.push('Email personal sin organización oficial')
      puntajeFraude += 20
    }
  }

  // 5. Verificar patrones sospechosos en nombre
  const patronesSospechosos = ['test', 'demo', 'fake', 'admin', 'root', 'user', 'temp']
  const nombreNormalizado = body.nombre.toLowerCase()
  if (patronesSospechosos.some(p => nombreNormalizado.includes(p))) {
    alertas.push('Nombre con patrón sospechoso')
    puntajeFraude += 25
  }

  // 6. Verificar teléfono inválido o repetido
  const { data: solicitudesTelefono } = await supabase
    .from('solicitudes_acceso')
    .select('*')
    .eq('telefono', body.telefono)

  if (solicitudesTelefono && solicitudesTelefono.length > 2) {
    alertas.push('Teléfono usado en múltiples solicitudes')
    puntajeFraude += 30
  }

  // 7. Verificar velocidad de solicitud (muy rápido = bot)
  const { data: solicitudesRapidas } = await supabase
    .from('solicitudes_acceso')
    .select('*')
    .eq('ip_address', ip)
    .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())

  if (solicitudesRapidas && solicitudesRapidas.length > 1) {
    alertas.push('Solicitudes demasiado rápidas (posible bot)')
    puntajeFraude += 35
  }

  // 8. Verificar inconsistencia entre organización y email
  const dominiosOrg = (DOMINIOS_OFICIALES as any)[body.organizacion] || []
  if (dominiosOrg.length > 0 && !dominiosOrg.some((d: string) => emailDomain?.includes(d))) {
    if (!emailDomain?.includes('.gob.ve') && !emailDomain?.includes('.edu.ve')) {
      alertas.push('Email no coincide con organización')
      puntajeFraude += 15
    }
  }

  // Umbral de fraude: 50 puntos
  const FRAUDE_DETECTADO = puntajeFraude >= 50

  return {
    fraudeDetectado: FRAUDE_DETECTADO,
    puntajeFraude,
    alertas
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'

    // NIVEL 1: Verificación de IP en lista negra (tratantes conocidos)
    if (isIPBlacklisted(ip)) {
      console.log('🚨 IP en lista negra detectada:', ip)
      await supabaseAdmin.from('security_alerts').insert({
        tipo: 'BLACKLISTED_IP',
        ip,
        datos: body,
        severidad: 'CRITICAL'
      })
      return NextResponse.json({ 
        success: false, 
        error: 'Acceso denegado por seguridad' 
      }, { status: 403 })
    }

    // NIVEL 2: Detección de VPN/Proxy (tratantes ocultando ubicación)
    if (detectVPN(ip)) {
      console.log('⚠️ VPN/Proxy detectado:', ip)
      await supabaseAdmin.from('security_alerts').insert({
        tipo: 'VPN_DETECTED',
        ip,
        datos: body,
        severidad: 'HIGH'
      })
      return NextResponse.json({ 
        success: false, 
        error: 'No se permite acceso desde VPN/Proxy por seguridad' 
      }, { status: 403 })
    }

    // NIVEL 3: Detección de fraude avanzada
    const fraudeCheck = await detectarFraude(body, supabaseAdmin, ip)

    if (fraudeCheck.fraudeDetectado) {
      console.log('🚨 Fraude detectado:', fraudeCheck.alertas)
      await supabaseAdmin
        .from('solicitudes_acceso')
        .insert({
          ...body,
          ip_address: ip,
          estado: 'rechazado',
          razon_rechazo: fraudeCheck.alertas.join(', ')
        })

      await supabaseAdmin.from('security_alerts').insert({
        tipo: 'FRAUD_DETECTED',
        ip,
        alertas: fraudeCheck.alertas,
        datos: body,
        severidad: 'HIGH'
      })

      return NextResponse.json({ 
        success: false, 
        error: 'Solicitud rechazada por seguridad',
        alertas: fraudeCheck.alertas
      }, { status: 403 })
    }

    // NIVEL 4: Sistema de alertas tempranas
    const hasAnomaly = earlyWarningSystem.checkForAnomalies(
      ip, 
      'ACCESS_REQUEST', 
      { body, ip }
    )

    if (hasAnomaly) {
      console.log('⚠️ Comportamiento anómalo detectado')
      return NextResponse.json({ 
        success: false, 
        error: 'Solicitud bajo revisión de seguridad' 
      }, { status: 403 })
    }

    // Validación automática
    const validacion = await validarSolicitudAutomatica(body, supabaseAdmin)

    // Insertar solicitud con datos sensibles cifrados
    const cedulaCifrada = hashSensitiveData(body.cedula)
    const telefonoCifrado = encryptData(body.telefono)
    const emailCifrado = encryptData(body.email)

    const { data, error } = await supabaseAdmin
      .from('solicitudes_acceso')
      .insert({
        nombre: body.nombre,
        organizacion: body.organizacion,
        cargo: body.cargo,
        cedula: cedulaCifrada, // Hash irreversible
        telefono: telefonoCifrado, // Cifrado reversible
        email: emailCifrado, // Cifrado reversible
        credencial_url: body.credencial_url,
        referido_por: body.referido_por,
        ip_address: ip,
        estado: validacion.aprobado ? 'aprobado' : 'pendiente',
        validacion_auto: validacion,
        metodo_aprobacion: validacion.aprobado ? 'automatica' : 'manual',
        nivel_seguridad: 'EXTREME'
      })
      .select('id')
      .single()

    if (error) throw error

    // Si fue aprobado automáticamente, generar token
    let token = null
    if (validacion.aprobado) {
      token = `STAFF-${Date.now()}-${Math.random().toString(36).substring(2).toUpperCase()}`
      
      await supabaseAdmin.from('tokens').insert({
        codigo: token,
        organizacion_id: body.organizacion,
        tipo: 'staff',
        activo: true,
        expira_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })

      await supabaseAdmin
        .from('solicitudes_acceso')
        .update({ codigo_acceso: token })
        .eq('id', data.id)
    }

    console.log('📧 Nueva solicitud de acceso staff:', body.nombre, body.organizacion, validacion.aprobado ? '✅ APROBADO AUTO' : '⏳ PENDIENTE')

    return NextResponse.json({ 
      success: true, 
      id: data.id,
      aprobadoAutomaticamente: validacion.aprobado,
      token: validacion.aprobado ? token : null,
      validacion
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
