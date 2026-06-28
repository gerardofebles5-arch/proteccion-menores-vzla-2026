import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado')
    const habilidad = searchParams.get('habilidad')

    let query = supabaseAdmin.from('voluntarios').select('*')

    if (estado) query = query.eq('estado', estado)
    if (habilidad) query = query.contains('habilidades', [habilidad])

    const { data, error } = await query.order('fecha_registro', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al obtener voluntarios:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener voluntarios' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, cedula, telefono, email, habilidades, disponibilidad, ubicacion, certificaciones, experiencia_previa } = body

    const { data, error } = await supabaseAdmin
      .from('voluntarios')
      .insert({
        nombre,
        cedula,
        telefono,
        email,
        habilidades: habilidades || [],
        disponibilidad: disponibilidad || 'completa',
        ubicacion,
        certificaciones: certificaciones || [],
        experiencia_previa,
        estado: 'activo'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al registrar voluntario:', error)
    return NextResponse.json({ success: false, error: 'Error al registrar voluntario' }, { status: 500 })
  }
}
