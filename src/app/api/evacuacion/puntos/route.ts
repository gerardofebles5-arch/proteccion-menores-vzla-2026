import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado')

    let query = supabaseAdmin.from('puntos_evacuacion').select('*')

    if (estado) query = query.eq('estado', estado)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al obtener puntos de evacuación:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener puntos de evacuación' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, latitud, longitud, direccion, capacidad, tipo, servicios, contacto_telefono, contacto_responsable } = body

    const { data, error } = await supabaseAdmin
      .from('puntos_evacuacion')
      .insert({
        nombre,
        latitud,
        longitud,
        direccion,
        capacidad,
        capacidad_actual: 0,
        tipo,
        servicios: servicios || [],
        contacto_telefono,
        contacto_responsable,
        estado: 'activo',
        accesibilidad: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al crear punto de evacuación:', error)
    return NextResponse.json({ success: false, error: 'Error al crear punto de evacuación' }, { status: 500 })
  }
}
