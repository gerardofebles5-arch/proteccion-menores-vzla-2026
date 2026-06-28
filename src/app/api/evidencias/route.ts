import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const casoId = searchParams.get('caso_id')
    const tipo = searchParams.get('tipo')

    let query = supabaseAdmin.from('evidencias').select('*')

    if (casoId) query = query.eq('caso_id', casoId)
    if (tipo) query = query.eq('tipo', tipo)

    const { data, error } = await query.order('fecha_recoleccion', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al obtener evidencias:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener evidencias' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { caso_id, tipo, descripcion, archivo_url, ubicacion_fisica, recolectado_por, prioridad, clasificacion } = body

    const { data, error } = await supabaseAdmin
      .from('evidencias')
      .insert({
        caso_id,
        tipo,
        descripcion,
        archivo_url,
        ubicacion_fisica,
        recolectado_por,
        prioridad: prioridad || 'media',
        clasificacion: clasificacion || 'restringida',
        estado: 'activa',
        cadena_custodia: [
          {
            fecha: new Date().toISOString(),
            responsable: recolectado_por,
            accion: 'Recolección inicial',
            observaciones: 'Evidencia registrada en sistema'
          }
        ],
        metadata: {}
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al registrar evidencia:', error)
    return NextResponse.json({ success: false, error: 'Error al registrar evidencia' }, { status: 500 })
  }
}
