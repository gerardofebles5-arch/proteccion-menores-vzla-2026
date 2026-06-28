import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado')

    let query = supabaseAdmin.from('alertas_masivas').select('*')

    if (estado) query = query.eq('estado', estado)

    const { data, error } = await query.order('fecha_creacion', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al obtener alertas:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener alertas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tipo, prioridad, titulo, mensaje, destinatarios } = body

    const { data, error } = await supabaseAdmin
      .from('alertas_masivas')
      .insert({
        tipo,
        prioridad,
        titulo,
        mensaje,
        destinatarios: destinatarios || [],
        estado: 'pendiente',
        estadisticas: {
          total_destinatarios: (destinatarios || []).length,
          enviados: 0,
          fallidos: 0,
          leidos: 0
        }
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al crear alerta:', error)
    return NextResponse.json({ success: false, error: 'Error al crear alerta' }, { status: 500 })
  }
}
