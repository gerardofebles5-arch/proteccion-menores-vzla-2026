import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, error } = await supabaseAdmin
      .from('solicitudes_organismos')
      .insert({
        organizacion: body.organizacion,
        nombre_contacto: body.nombre_contacto,
        email: body.email,
        telefono: body.telefono,
        tipo_integracion: body.tipo_integracion,
        mensaje: body.mensaje,
        estado: 'pendiente'
      })
      .select('id')
      .single()

    if (error) throw error

    // Enviar notificación al admin
    console.log('📧 Nueva solicitud de organismo:', body.organizacion)

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
