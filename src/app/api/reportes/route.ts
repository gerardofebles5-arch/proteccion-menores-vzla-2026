import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validación básica
    if (!body.tipo || !body.ubicacion || !body.descripcion) {
      return NextResponse.json({ error: 'Campos requeridos: tipo, ubicacion, descripcion' }, { status: 400 })
    }

    // Registrar IP para trazabilidad
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    const { data, error } = await supabaseAdmin
      .from('reportes_urgentes')
      .insert({
        tipo: body.tipo,
        ubicacion: body.ubicacion,
        descripcion: body.descripcion,
        descripcion_sospechoso: body.descripcion_sospechoso,
        nombre_reportante: body.nombre_reportante,
        telefono_reportante: body.telefono_reportante,
        archivos_url: body.archivos_url || [],
      })
      .select('codigo')
      .single()

    if (error) throw error

    // Registrar en auditoría
    await supabaseAdmin.from('audit_log').insert({
      accion: 'REPORTE_URGENTE_CREADO',
      tabla_afectada: 'reportes_urgentes',
      ip_address: ip,
      metadata: { tipo: body.tipo, codigo: data.codigo }
    })

    return NextResponse.json({ success: true, codigo: data.codigo })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}