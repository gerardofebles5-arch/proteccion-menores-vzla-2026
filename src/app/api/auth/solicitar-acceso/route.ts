import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

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
        estado: 'pendiente'
      })
      .select('id')
      .single()

    if (error) throw error

    // Notificar al superadmin
    console.log('📧 Nueva solicitud de acceso staff:', body.nombre, body.organizacion)

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
