import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('solicitudes_acceso')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ count: data?.length || 0, data: data || [] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ count: 0, data: [] })
  }
}

export async function POST(req: Request) {
  try {
    const { id, accion } = await req.json()

    if (accion === 'aprobar') {
      // Generar token para el usuario aprobado
      const token = `STAFF-${Date.now()}-${Math.random().toString(36).substring(2).toUpperCase()}`
      
      // Actualizar solicitud
      const { data: solicitud, error: errorUpdate } = await supabaseAdmin
        .from('solicitudes_acceso')
        .update({ estado: 'aprobado', codigo_acceso: token })
        .eq('id', id)
        .select()
        .single()

      if (errorUpdate) throw errorUpdate

      // Crear registro en tokens
      await supabaseAdmin.from('tokens').insert({
        codigo: token,
        organizacion_id: solicitud.organizacion,
        tipo: 'staff',
        activo: true,
        expira_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
      })

      return NextResponse.json({ success: true, token })
    } else if (accion === 'rechazar') {
      await supabaseAdmin
        .from('solicitudes_acceso')
        .update({ estado: 'rechazado' })
        .eq('id', id)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
