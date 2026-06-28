import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const estado = searchParams.get('estado')

    let query = supabaseAdmin.from('recursos').select('*')

    if (tipo) query = query.eq('tipo', tipo)
    if (estado) query = query.eq('estado', estado)

    const { data, error } = await query.order('fecha_actualizacion', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al obtener recursos:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener recursos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tipo, nombre, cantidad, unidad, ubicacion, estado, prioridad } = body

    const { data, error } = await supabaseAdmin
      .from('recursos')
      .insert({
        tipo,
        nombre,
        cantidad,
        unidad,
        ubicacion,
        estado: estado || 'disponible',
        prioridad: prioridad || 'media'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al crear recurso:', error)
    return NextResponse.json({ success: false, error: 'Error al crear recurso' }, { status: 500 })
  }
}
