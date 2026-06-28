import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { encryptData, hashSensitiveData } from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'

    // Verificar seguridad básica
    if (!body.tipo_denuncia || !body.descripcion) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Cifrar datos sensibles de la denuncia
    const descripcionCifrada = encryptData(body.descripcion)
    const ubicacionCifrada = body.ubicacion ? encryptData(body.ubicacion) : null

    // Insertar denuncia con máxima seguridad
    const { data, error } = await supabaseAdmin
      .from('denuncias_internas')
      .insert({
        tipo_denuncia: body.tipo_denuncia,
        descripcion: descripcionCifrada,
        ubicacion: ubicacionCifrada,
        fecha_incidente: body.fecha_incidente,
        ip_origen: hashSensitiveData(ip), // Hash irreversible para anonimato
        estado: 'pendiente',
        prioridad: 'ALTA',
        nivel_confidencialidad: 'MAXIMO',
        created_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (error) throw error

    // Alerta inmediata al superadmin
    await supabaseAdmin.from('security_alerts').insert({
      tipo: 'INTERNAL_REPORT',
      denuncia_id: data.id,
      severidad: 'HIGH',
      mensaje: 'Nueva denuncia interna recibida',
      created_at: new Date().toISOString()
    })

    console.log('🚨 Nueva denuncia interna recibida:', data.id)

    return NextResponse.json({ 
      success: true, 
      id: data.id,
      mensaje: 'Denuncia recibida de forma anónima y segura'
    })
  } catch (err) {
    console.error('Error en denuncia interna:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
