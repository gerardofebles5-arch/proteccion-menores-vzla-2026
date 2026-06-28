import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')

    let query = supabaseAdmin.from('metricas').select('*')

    if (categoria) query = query.eq('categoria', categoria)

    const { data, error } = await query.order('fecha_registro', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al obtener métricas:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener métricas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, valor, unidad, tendencia, cambio_porcentaje, periodo, categoria } = body

    const { data, error } = await supabaseAdmin
      .from('metricas')
      .insert({
        nombre,
        valor,
        unidad,
        tendencia,
        cambio_porcentaje,
        periodo,
        categoria
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al crear métrica:', error)
    return NextResponse.json({ success: false, error: 'Error al crear métrica' }, { status: 500 })
  }
}
