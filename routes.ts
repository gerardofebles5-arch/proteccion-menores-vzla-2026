// src/app/api/reportes/route.ts
// Endpoint: POST /api/reportes — Ciudadanos envían reportes urgentes

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ReporteUrgente } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: ReporteUrgente & { archivos_url?: string[] } = await req.json()

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
        telefono_reportante: body.telefono_reportante, // cifrar en producción
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

// ============================================================
// src/app/api/menores/route.ts
// Endpoint: POST /api/menores — Staff registra menor hallado
// ============================================================

// import { NextRequest, NextResponse } from 'next/server'
// import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST_menores(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    // Verificar rol
    const { data: usuario } = await supabaseAdmin
      .from('usuarios')
      .select('rol, bloqueado, refugio:refugios(codigo)')
      .eq('id', user.id)
      .single()

    if (!usuario || usuario.bloqueado) {
      return NextResponse.json({ error: 'Acceso denegado o cuenta bloqueada' }, { status: 403 })
    }

    if (!['admin_ong', 'rescatista_campo'].includes(usuario.rol)) {
      return NextResponse.json({ error: 'Rol insuficiente' }, { status: 403 })
    }

    const body = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'

    const { data, error } = await supabaseAdmin
      .from('menores_hallados')
      .insert({
        refugio_id: body.refugio_id,
        registrado_por: user.id,
        nombre_posible: body.nombre_posible,
        edad_min: body.edad_min,
        edad_max: body.edad_max,
        genero: body.genero,
        descripcion_fisica: body.descripcion_fisica,
        ropa_descripcion: body.ropa_descripcion,
        palabras_clave: body.palabras_clave,
        foto_url: body.foto_url,
        audio_url: body.audio_url,
        salud: body.salud,
        condicion_entrega: body.condicion_entrega || 'requiere_verificacion_completa',
        intento_retiro_no_autorizado: body.intento_retiro || false,
        detalle_intento: body.detalle_intento,
      })
      .select('codigo, id')
      .single()

    if (error) throw error

    await supabaseAdmin.from('audit_log').insert({
      usuario_id: user.id,
      accion: 'MENOR_REGISTRADO',
      tabla_afectada: 'menores_hallados',
      registro_id: data.id,
      ip_address: ip,
      metadata: { codigo: data.codigo }
    })

    return NextResponse.json({ success: true, codigo: data.codigo, id: data.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// ============================================================
// src/app/api/trata/route.ts
// Endpoint: POST /api/trata — Denunciar sitio de trata
// ============================================================

export async function POST_trata(req: NextRequest) {
  try {
    const body = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'

    if (!body.plataforma || !body.descripcion) {
      return NextResponse.json({ error: 'Campos requeridos: plataforma, descripcion' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('denuncias_trata')
      .insert({
        plataforma: body.plataforma,
        url_denunciada: body.url_denunciada,
        descripcion: body.descripcion,
        capturas_url: body.capturas_url || [],
        nombre_denunciante: body.nombre_denunciante || 'Anónimo',
        contacto_denunciante: body.contacto_denunciante,
      })
      .select('codigo')
      .single()

    if (error) throw error

    await supabaseAdmin.from('audit_log').insert({
      accion: 'DENUNCIA_TRATA_CREADA',
      tabla_afectada: 'denuncias_trata',
      ip_address: ip,
      metadata: { plataforma: body.plataforma, codigo: data.codigo }
    })

    return NextResponse.json({ success: true, codigo: data.codigo })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// ============================================================
// src/app/api/matches/route.ts
// Endpoint: GET /api/matches — Panel: ver matches pendientes
// Endpoint: PATCH /api/matches — Aprobar/rechazar match (HITL)
// ============================================================

export async function GET_matches(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const { data: usuario } = await supabaseAdmin
      .from('usuarios')
      .select('rol, bloqueado')
      .eq('id', user.id)
      .single()

    if (!usuario || usuario.bloqueado || usuario.rol !== 'admin_ong') {
      return NextResponse.json({ error: 'Solo Admin_ONG puede ver matches' }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from('matches')
      .select(`
        *,
        menor:menores_hallados(codigo, genero, edad_min, edad_max, descripcion_fisica, ropa_descripcion, senas_particulares, created_at),
        reporte:reportes_desaparecidos(codigo, nombre_menor, genero, edad, descripcion_fisica, ropa_descripcion, senas_particulares, created_at)
      `)
      .eq('estado', 'pendiente')
      .order('porcentaje_coincidencia', { ascending: false })

    if (error) throw error

    // Registrar que el admin vio los matches
    await supabaseAdmin.from('audit_log').insert({
      usuario_id: user.id,
      accion: 'MATCHES_CONSULTADOS',
      tabla_afectada: 'matches',
      metadata: { count: data.length }
    })

    return NextResponse.json({ matches: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PATCH_matches(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseAdmin.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const { data: usuario } = await supabaseAdmin
      .from('usuarios').select('rol').eq('id', user.id).single()

    if (usuario?.rol !== 'admin_ong') {
      return NextResponse.json({ error: 'Solo Admin_ONG puede aprobar/rechazar matches' }, { status: 403 })
    }

    const { match_id, accion, notas } = await req.json()

    if (accion === 'aprobar') {
      // Llamar función SQL que maneja el HITL completo
      const { error } = await supabaseAdmin.rpc('fn_aprobar_reunificacion', {
        p_match_id: match_id,
        p_notas: notas
      })
      if (error) throw error
    } else if (accion === 'rechazar') {
      await supabaseAdmin
        .from('matches')
        .update({ estado: 'rechazado', revisado_por: user.id, notas_revisor: notas })
        .eq('id', match_id)
    } else if (accion === 'escalar') {
      await supabaseAdmin
        .from('matches')
        .update({ estado: 'escalado_cicpc', revisado_por: user.id })
        .eq('id', match_id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// ============================================================
// src/app/api/tokens/route.ts
// Endpoint: POST /api/tokens — Admin_ONG genera token de rescatista
// ============================================================

export async function POST_tokens(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseAdmin.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const { para_nombre, refugio } = await req.json()

    // La función SQL verifica internamente que el usuario sea admin_ong
    const { data, error } = await supabaseAdmin.rpc('fn_generar_token', {
      p_para_nombre: para_nombre,
      p_refugio: refugio
    })

    if (error) throw error

    return NextResponse.json({ success: true, token: data })
  } catch (err: any) {
    if (err.message?.includes('Solo Admin_ONG')) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
