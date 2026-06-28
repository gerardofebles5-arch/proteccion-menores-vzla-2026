import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.nombre || !body.edad || !body.refugio_id) {
      return NextResponse.json({ error: 'Campos requeridos: nombre, edad, refugio_id' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const codigo = `MEN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const { data, error } = await supabaseAdmin
      .from('menores_hallados')
      .insert({
        codigo,
        nombre: body.nombre,
        edad: body.edad,
        altura: body.altura,
        peso: body.peso,
        color_cabello: body.color_cabello,
        color_ojos: body.color_ojos,
        marcas_nacimiento: body.marcas_nacimiento,
        ropa_ultima_vez: body.ropa_ultima_vez,
        lugar_hallado: body.lugar_hallado,
        fecha_hallado: body.fecha_hallado,
        foto_url: body.foto_url,
        refugio_id: body.refugio_id,
        registrado_por: body.registrado_por,
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
