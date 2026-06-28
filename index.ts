// src/types/index.ts
// Tipos TypeScript para toda la plataforma

export type RolUsuario = 'admin_ong' | 'rescatista_campo' | 'ciudadano'
export type EstadoMenor = 'hallado' | 'en_proceso' | 'reunificado' | 'alta_alerta'
export type NivelMatch = 'pendiente' | 'aprobado' | 'rechazado' | 'escalado_cicpc'
export type TipoReporte = 'intento_rapto' | 'menor_solo' | 'menor_desaparecido' | 'falso_funcionario' | 'movimiento_sospechoso' | 'otro'
export type PlataformaTrata = 'vinted' | 'instagram' | 'facebook' | 'telegram' | 'whatsapp' | 'olx' | 'mercadolibre' | 'tiktok' | 'otro'
export type NivelUrgencia = 'critico' | 'urgente' | 'moderado'

export interface MenorHallado {
  id: string
  codigo: string
  refugio_id: string
  nombre_posible?: string
  edad_min: number
  edad_max: number
  genero: string
  descripcion_fisica: string
  ropa_descripcion?: string
  palabras_clave?: string
  foto_url?: string
  audio_url?: string
  estado: EstadoMenor
  salud: string
  condicion_entrega: string
  intento_retiro_no_autorizado: boolean
  detalle_intento?: string
  created_at: string
}

export interface ReporteDesaparecido {
  id: string
  codigo: string
  nombre_reportante?: string
  nombre_menor?: string
  edad?: number
  genero?: string
  descripcion_fisica: string
  ropa_descripcion?: string
  senas_particulares?: string
  foto_previa_url?: string
  fecha_desaparicion?: string
  lugar_desaparicion?: string
  created_at: string
}

export interface Match {
  id: string
  menor_id: string
  reporte_id: string
  porcentaje_coincidencia: number
  campos_coincidentes: string[]
  estado: NivelMatch
  revisado_por?: string
  notas_revisor?: string
  created_at: string
  // Joins
  menor?: MenorHallado
  reporte?: ReporteDesaparecido
}

export interface ReporteUrgente {
  tipo: TipoReporte
  ubicacion: string
  descripcion: string
  descripcion_sospechoso?: string
  nombre_reportante?: string
  telefono_reportante?: string
  archivos_url?: string[]
}

export interface DenunciaTrata {
  plataforma: PlataformaTrata
  url_denunciada?: string
  descripcion: string
  capturas_url?: string[]
  nombre_denunciante?: string
  contacto_denunciante?: string
}
