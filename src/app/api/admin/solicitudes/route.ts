import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('solicitudes_organismos')
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
