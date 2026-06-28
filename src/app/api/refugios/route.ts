import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, error } = await supabaseAdmin
      .from('refugios')
      .insert({
        nombre: body.nombre,
        direccion: body.direccion,
        capacidad: parseInt(body.capacidad),
        ocupacion_actual: parseInt(body.ocupacion_actual),
        tipo: body.tipo,
        contacto: body.contacto,
        telefono: body.telefono,
        activo: true
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('refugios')
      .select('*')
      .eq('activo', true)

    if (error) throw error

    return NextResponse.json({ refugios: data || [] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ refugios: [] })
  }
}
