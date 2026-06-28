import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Organizaciones en lista blanca para aprobación automática
const ORGANIZACIONES_AUTORIZADAS = [
  'FUNDANA',
  'CECODAP',
  'UNICEF',
  'Cruz Roja',
  'Protección Civil',
  'CPNNA',
  'Gobierno'
]

// Dominios oficiales conocidos
const DOMINIOS_OFICIALES = {
  'FUNDANA': ['fundana.org'],
  'CECODAP': ['cecodap.org.ve', 'cecodap.org'],
  'UNICEF': ['unicef.org'],
  'Cruz Roja': ['cruzroja.ve'],
  'Protección Civil': ['gob.ve'],
  'CPNNA': ['gob.ve'],
  'Gobierno': ['gob.ve']
}

// Algoritmo de validación automática
async function validarSolicitudAutomatica(body: any, supabase: any) {
  let puntaje = 0
  const razones = []

  // 1. Verificar organización autorizada
  if (ORGANIZACIONES_AUTORIZADAS.includes(body.organizacion)) {
    puntaje += 30
    razones.push('Organización autorizada')
  }

  // 2. Verificar dominio oficial del email
  const emailDomain = body.email.split('@')[1]?.toLowerCase()
  const dominiosOrg = (DOMINIOS_OFICIALES as any)[body.organizacion] || []
  if (dominiosOrg.some((d: string) => emailDomain?.includes(d))) {
    puntaje += 25
    razones.push('Email corporativo oficial')
  }

  // 3. Validar formato de cédula venezolana
  const cedulaValida = /^V-\d{7,9}-?\d?$/.test(body.cedula)
  if (cedulaValida) {
    puntaje += 15
    razones.push('Cédula válida')
  }

  // 4. Verificar referido por usuario verificado
  if (body.referido_por) {
    const { data: referido } = await supabase
      .from('solicitudes_acceso')
      .select('*')
      .eq('nombre', body.referido_por)
      .eq('estado', 'aprobado')
      .single()

    if (referido) {
      puntaje += 20
      razones.push('Referido por usuario verificado')
    }
  }

  // 5. Verificar que no haya solicitudes previas rechazadas con misma cédula
  const { data: solicitudesPrevias } = await supabase
    .from('solicitudes_acceso')
    .select('*')
    .eq('cedula', body.cedula)
    .eq('estado', 'rechazado')

  if (!solicitudesPrevias || solicitudesPrevias.length === 0) {
    puntaje += 10
    razones.push('Sin historial de rechazos')
  }

  // Umbral de aprobación automática: 70 puntos
  const APROBADO_AUTOMATICAMENTE = puntaje >= 70

  return {
    aprobado: APROBADO_AUTOMATICAMENTE,
    puntaje,
    razones,
    umbral: 70
  }
}

// Detección de fraude básica
async function detectarFraude(body: any, supabase: any, ip: string) {
  const alertas = []

  // Verificar múltiples solicitudes desde misma IP en última hora
  const { data: solicitudesIP } = await supabase
    .from('solicitudes_acceso')
    .select('*')
    .eq('ip_address', ip)
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())

  if (solicitudesIP && solicitudesIP.length > 3) {
    alertas.push('Múltiples solicitudes desde misma IP')
  }

  // Verificar múltiples solicitudes con misma cédula
  const { data: solicitudesCedula } = await supabase
    .from('solicitudes_acceso')
    .select('*')
    .eq('cedula', body.cedula)

  if (solicitudesCedula && solicitudesCedula.length > 2) {
    alertas.push('Múltiples solicitudes con misma cédula')
  }

  // Verificar email temporal
  const dominiosTemporales = ['tempmail.com', 'guerrillamail.com', '10minutemail.com']
  const emailDomain = body.email.split('@')[1]?.toLowerCase()
  if (dominiosTemporales.some(d => emailDomain?.includes(d))) {
    alertas.push('Email temporal detectado')
  }

  return {
    fraudeDetectado: alertas.length > 0,
    alertas
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'

    // Detección de fraude
    const fraudeCheck = await detectarFraude(body, supabaseAdmin, ip)

    if (fraudeCheck.fraudeDetectado) {
      // Rechazar automáticamente si hay fraude
      await supabaseAdmin
        .from('solicitudes_acceso')
        .insert({
          ...body,
          ip_address: ip,
          estado: 'rechazado',
          razon_rechazo: fraudeCheck.alertas.join(', ')
        })

      return NextResponse.json({ 
        success: false, 
        error: 'Solicitud rechazada por seguridad',
        alertas: fraudeCheck.alertas
      }, { status: 403 })
    }

    // Validación automática
    const validacion = await validarSolicitudAutomatica(body, supabaseAdmin)

    // Insertar solicitud
    const { data, error } = await supabaseAdmin
      .from('solicitudes_acceso')
      .insert({
        nombre: body.nombre,
        organizacion: body.organizacion,
        cargo: body.cargo,
        cedula: body.cedula,
        telefono: body.telefono,
        email: body.email,
        credencial_url: body.credencial_url,
        referido_por: body.referido_por,
        ip_address: ip,
        estado: validacion.aprobado ? 'aprobado' : 'pendiente',
        validacion_auto: validacion,
        metodo_aprobacion: validacion.aprobado ? 'automatica' : 'manual'
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
