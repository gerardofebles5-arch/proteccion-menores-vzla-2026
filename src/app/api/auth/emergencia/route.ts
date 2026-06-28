import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { codigo } = await req.json()

    // Códigos de emergencia predefinidos (generados por superadmin)
    const { data, error } = await supabaseAdmin
      .from('tokens')
      .select('*')
      .eq('codigo', codigo)
      .eq('tipo', 'emergencia')
      .eq('activo', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ valido: false, mensaje: 'Código de emergencia inválido' })
    }

    // Verificar si está expirado
    if (new Date(data.expira_at) < new Date()) {
      return NextResponse.json({ valido: false, mensaje: 'Código expirado' })
    }

    // Generar token de sesión
    const sessionToken = `EMERGENCY-${Date.now()}-${Math.random().toString(36).substring(2)}`

    // Marcar como usado
    await supabaseAdmin
      .from('tokens')
      .update({ usado: true, usado_at: new Date().toISOString() })
      .eq('id', data.id)

    return NextResponse.json({ 
      valido: true, 
      token: sessionToken,
      tipo: 'emergencia'
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ valido: false, mensaje: 'Error al verificar' })
  }
}
