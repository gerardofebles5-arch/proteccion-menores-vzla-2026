import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado')

    let query = supabaseAdmin.from('misiones').select('*')

    if (estado) query = query.eq('estado', estado)

    const { data, error } = await query.order('fecha_inicio', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al obtener misiones:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener misiones' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, tipo, ubicacion, prioridad, descripcion } = body

    const { data, error } = await supabaseAdmin
      .from('misiones')
      .insert({
        nombre,
        tipo,
        ubicacion,
        prioridad: prioridad || 'media',
        descripcion,
        estado: 'planificada',
        personal_asignado: [],
        recursos_asignados: []
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al crear misión:', error)
    return NextResponse.json({ success: false, error: 'Error al crear misión' }, { status: 500 })
  }
}
