import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.tipo || !body.ubicacion || !body.descripcion) {
      return NextResponse.json({ error: 'Campos requeridos: tipo, ubicacion, descripcion' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const codigo = `REP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const { data, error } = await supabaseAdmin
      .from('reportes_urgentes')
      .insert({
        codigo,
        tipo: body.tipo,
        ubicacion: body.ubicacion,
        descripcion: body.descripcion,
        descripcion_sospechoso: body.descripcion_sospechoso,
        nombre_reportante: body.nombre_reportante,
        telefono_reportante: body.telefono_reportante,
        archivos_url: body.archivos_url || [],
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
