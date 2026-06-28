// Sistema de Gestión de Evidencia
// Manejo seguro de evidencias para casos legales

export interface Evidencia {
  id: string
  caso_id: string
  tipo: 'foto' | 'video' | 'audio' | 'documento' | 'testimonio' | 'fisica'
  descripcion: string
  archivo_url?: string
  ubicacion_fisica?: string
  fecha_recoleccion: Date
  recolectado_por: string
  cadena_custodia: {
    fecha: Date
    responsable: string
    accion: string
    observaciones: string
  }[]
  estado: 'activa' | 'analisis' | 'procesada' | 'archivada'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  clasificacion: 'publica' | 'restringida' | 'confidencial' | 'secreta'
  metadata: {
    formato?: string
    tamaño?: number
    resolucion?: string
    duracion?: string
    hash?: string
  }
}

export class EvidenceManagement {
  private evidencias: Evidencia[] = []

  agregarEvidencia(evidencia: Omit<Evidencia, 'id' | 'cadena_custodia'>): Evidencia {
    const nuevaEvidencia: Evidencia = {
      ...evidencia,
      id: `EVI-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      cadena_custodia: [
        {
          fecha: new Date(),
          responsable: evidencia.recolectado_por,
          accion: 'Recolección inicial',
          observaciones: 'Evidencia registrada en sistema'
        }
      ]
    }
    this.evidencias.push(nuevaEvidencia)
    return nuevaEvidencia
  }

  obtenerEvidenciasPorCaso(caso_id: string): Evidencia[] {
    return this.evidencias.filter(e => e.caso_id === caso_id)
  }

  obtenerEvidenciasPorTipo(tipo: string): Evidencia[] {
    return this.evidencias.filter(e => e.tipo === tipo)
  }

  actualizarCadenaCustodia(evidencia_id: string, responsable: string, accion: string, observaciones: string): boolean {
    const evidencia = this.evidencias.find(e => e.id === evidencia_id)
    if (evidencia) {
      evidencia.cadena_custodia.push({
        fecha: new Date(),
        responsable,
        accion,
        observaciones
      })
      return true
    }
    return false
  }

  actualizarEstado(evidencia_id: string, nuevo_estado: 'activa' | 'analisis' | 'procesada' | 'archivada'): boolean {
    const evidencia = this.evidencias.find(e => e.id === evidencia_id)
    if (evidencia) {
      evidencia.estado = nuevo_estado
      return true
    }
    return false
  }

  obtenerEvidenciasCriticas(): Evidencia[] {
    return this.evidencias.filter(e => e.prioridad === 'critica')
  }

  generarReporteCadenaCustodia(evidencia_id: string): any {
    const evidencia = this.evidencias.find(e => e.id === evidencia_id)
    if (!evidencia) return null

    return {
      evidencia_id: evidencia.id,
      caso_id: evidencia.caso_id,
      tipo: evidencia.tipo,
      descripcion: evidencia.descripcion,
      cadena_custodia: evidencia.cadena_custodia,
      fecha_generacion: new Date(),
      generado_por: 'Sistema'
    }
  }

  validarIntegridad(evidencia_id: string): boolean {
    // En producción, esto verificaría el hash del archivo
    const evidencia = this.evidencias.find(e => e.id === evidencia_id)
    return evidencia !== undefined
  }

  obtenerEstadisticas() {
    return {
      total_evidencias: this.evidencias.length,
      por_tipo: this.evidencias.reduce((acc, e) => {
        acc[e.tipo] = (acc[e.tipo] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      por_estado: this.evidencias.reduce((acc, e) => {
        acc[e.estado] = (acc[e.estado] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      por_clasificacion: this.evidencias.reduce((acc, e) => {
        acc[e.clasificacion] = (acc[e.clasificacion] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      criticas: this.evidencias.filter(e => e.prioridad === 'critica').length
    }
  }

  exportarEvidencias(caso_id: string, formato: 'json' | 'csv'): string {
    const evidencias = this.obtenerEvidenciasPorCaso(caso_id)
    
    if (formato === 'json') {
      return JSON.stringify({
        caso_id,
        evidencias,
        fecha_exportacion: new Date()
      }, null, 2)
    }

    let csv = 'ID,Tipo,Descripcion,Fecha,Estado,Prioridad,Clasificacion\n'
    evidencias.forEach(e => {
      csv += `${e.id},${e.tipo},"${e.descripcion}",${e.fecha_recoleccion.toISOString()},${e.estado},${e.prioridad},${e.clasificacion}\n`
    })
    
    return csv
  }
}

export const evidenceManagement = new EvidenceManagement()
