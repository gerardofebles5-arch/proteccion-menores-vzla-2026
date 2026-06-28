// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente con service_role para operaciones del servidor (API routes)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================================
// Subida de archivos cifrada a Supabase Storage
// Todos los archivos van a buckets privados
// ============================================================

export async function subirArchivo(
  archivo: File,
  bucket: 'evidencias-reportes' | 'fotos-menores' | 'capturas-trata',
  carpeta: string
): Promise<string | null> {
  const ext = archivo.name.split('.').pop()
  const nombre = `${carpeta}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(nombre, archivo, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error subiendo archivo:', error)
    return null
  }

  return data.path
}

export async function subirMultiplesArchivos(
  archivos: File[],
  bucket: 'evidencias-reportes' | 'fotos-menores' | 'capturas-trata',
  carpeta: string
): Promise<string[]> {
  const urls = await Promise.all(
    archivos.map(archivo => subirArchivo(archivo, bucket, carpeta))
  )
  return urls.filter(Boolean) as string[]
}

// URL firmada temporal (solo para personal autorizado en el panel)
export async function obtenerUrlFirmada(
  bucket: string,
  path: string,
  segundos: number = 300 // 5 minutos máximo
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, segundos)

  if (error) return null
  return data.signedUrl
}
