import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('auditoria_accesos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ accesos: data || [] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ accesos: [] })
  }
}
