import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { 
  isIPBlacklisted, 
  detectVPN, 
  encryptData, 
  hashSensitiveData,
  earlyWarningSystem
} from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    // NIVEL 1: Verificación de IP en lista negra
    if (isIPBlacklisted(ip)) {
      console.log('🚨 IP en lista negra intentando reporte:', ip)
      await supabaseAdmin.from('security_alerts').insert({
        tipo: 'BLACKLISTED_IP_REPORT',
        ip,
        datos: { tipo: body.tipo, ubicacion: body.ubicacion },
        severidad: 'CRITICAL'
      })
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // NIVEL 2: Detección de VPN/Proxy
    if (detectVPN(ip)) {
      console.log('⚠️ VPN/Proxy detectado en reporte:', ip)
      await supabaseAdmin.from('security_alerts').insert({
        tipo: 'VPN_REPORT',
        ip,
        datos: { tipo: body.tipo },
        severidad: 'HIGH'
      })
      return NextResponse.json({ error: 'No se permite acceso desde VPN/Proxy' }, { status: 403 })
    }

    // NIVEL 3: Sistema de alertas tempranas
    const hasAnomaly = earlyWarningSystem.checkForAnomalies(
      ip, 
      'URGENT_REPORT', 
      { tipo: body.tipo, ubicacion: body.ubicacion }
    )

    if (hasAnomaly) {
      return NextResponse.json({ error: 'Solicitud bajo revisión' }, { status: 403 })
    }

    if (!body.tipo || !body.ubicacion || !body.descripcion) {
      return NextResponse.json({ error: 'Campos requeridos: tipo, ubicacion, descripcion' }, { status: 400 })
    }

    const codigo = `REP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Cifrar datos sensibles
    const descripcionCifrada = encryptData(body.descripcion)
    const nombreCifrado = body.nombre_reportante ? encryptData(body.nombre_reportante) : null
    const telefonoCifrado = body.telefono_reportante ? hashSensitiveData(body.telefono_reportante) : null

    const { data, error } = await supabaseAdmin
      .from('reportes_urgentes')
      .insert({
        codigo,
        tipo: body.tipo,
        ubicacion: body.ubicacion,
        descripcion: descripcionCifrada,
        descripcion_sospechoso: body.descripcion_sospechoso,
        nombre_reportante: nombreCifrado,
        telefono_reportante: telefonoCifrado,
        archivos_url: body.archivos_url || [],
        ip_origen: hashSensitiveData(ip),
        nivel_confidencialidad: 'ALTO'
      })
      .select('codigo')
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, codigo: data.codigo })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
