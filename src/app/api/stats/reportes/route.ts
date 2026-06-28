import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count, error } = await supabaseAdmin
      .from('reportes_urgentes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    if (error) throw error

    return NextResponse.json({ count: count || 0 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ count: 0 })
  }
}
