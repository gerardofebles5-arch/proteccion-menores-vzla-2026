import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('matches')
      .select('*')
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ matches: data || [] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ matches: [] })
  }
}
