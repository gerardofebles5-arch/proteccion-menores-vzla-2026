import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado')
    const plataforma = searchParams.get('plataforma')

    let query = supabaseAdmin.from('publicaciones_sociales').select('*')

    if (estado) query = query.eq('estado', estado)
    if (plataforma) query = query.eq('plataforma', plataforma)

    const { data, error } = await query.order('fecha_creacion', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al obtener publicaciones:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener publicaciones' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plataforma, tipo, contenido, caso_relacionado } = body

    const { data, error } = await supabaseAdmin
      .from('publicaciones_sociales')
      .insert({
        plataforma,
        tipo,
        contenido,
        caso_relacionado,
        estado: 'borrador',
        estadisticas: {
          alcance: 0,
          likes: 0,
          compartidos: 0,
          comentarios: 0
        }
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al crear publicación:', error)
    return NextResponse.json({ success: false, error: 'Error al crear publicación' }, { status: 500 })
  }
}
