import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { codigo } = await req.json()

    // Verificar código en tabla de tokens
    const { data, error } = await supabaseAdmin
      .from('tokens')
      .select('*')
      .eq('codigo', codigo)
      .eq('activo', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ valido: false, mensaje: 'Código inválido' })
    }

    // Verificar si está expirado
    if (new Date(data.expira_at) < new Date()) {
      return NextResponse.json({ valido: false, mensaje: 'Código expirado' })
    }

    // Generar token de sesión temporal
    const sessionToken = `SESSION-${Date.now()}-${Math.random().toString(36).substring(2)}`

    return NextResponse.json({ 
      valido: true, 
      token: sessionToken,
      organizacion: data.organizacion_id
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ valido: false, mensaje: 'Error al verificar' })
  }
}
