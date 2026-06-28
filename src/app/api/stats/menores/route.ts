import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('menores_hallados')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    return NextResponse.json({ count: count || 0 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ count: 0 })
  }
}
