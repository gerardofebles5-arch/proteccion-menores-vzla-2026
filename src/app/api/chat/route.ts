import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const canalId = searchParams.get('canal_id')

    let query = supabaseAdmin
      .from('chat_mensajes')
      .select('*')
      .order('created_at', { ascending: false })

    if (canalId) {
      query = query.eq('canal_id', canalId)
    }

    const { data, error } = await query.limit(100)

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al obtener mensajes:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener mensajes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { remitente, remitente_id, contenido, tipo, canal_id, prioridad } = body

    const { data, error } = await supabaseAdmin
      .from('chat_mensajes')
      .insert({
        remitente,
        remitente_id,
        contenido,
        tipo: tipo || 'texto',
        canal_id,
        prioridad: prioridad || 'normal',
        leido_por: []
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error al enviar mensaje:', error)
    return NextResponse.json({ success: false, error: 'Error al enviar mensaje' }, { status: 500 })
  }
}
