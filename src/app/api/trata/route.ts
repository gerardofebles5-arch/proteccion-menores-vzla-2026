import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.plataforma || !body.descripcion) {
      return NextResponse.json({ error: 'Campos requeridos: plataforma, descripcion' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const codigo = `TRT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const { data, error } = await supabaseAdmin
      .from('denuncias_trata')
      .insert({
        codigo,
        plataforma: body.plataforma,
        url_anuncio: body.url_anuncio,
        descripcion: body.descripcion,
        captura_url: body.captura_url,
        precio_irregular: body.precio_irregular,
        descripcion_nino: body.descripcion_nino,
        anonimo: body.anonimo !== false,
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
