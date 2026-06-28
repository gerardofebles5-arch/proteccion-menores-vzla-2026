// Integración con Redes Sociales para Difusión
// Twitter, Facebook, Instagram para alertas de menores

export interface PublicacionSocial {
  id: string
  plataforma: 'twitter' | 'facebook' | 'instagram' | 'todas'
  tipo: 'alerta_menor' | 'informacion' | 'emergencia' | 'actualizacion'
  contenido: {
    texto: string
    imagen?: string
    video?: string
    hashtags: string[]
    menciones: string[]
  }
  estado: 'borrador' | 'programado' | 'publicado' | 'eliminado'
  fecha_programada?: Date
  fecha_publicacion?: Date
  estadisticas: {
    alcance: number
    likes: number
    compartidos: number
    comentarios: number
  }
  caso_relacionado?: string
}

export class SocialIntegration {
  private publicaciones: PublicacionSocial[] = []

  crearPublicacion(
    plataforma: 'twitter' | 'facebook' | 'instagram' | 'todas',
    tipo: 'alerta_menor' | 'informacion' | 'emergencia' | 'actualizacion',
    texto: string,
    hashtags: string[] = [],
    menciones: string[] = [],
    caso_relacionado?: string
  ): PublicacionSocial {
    const publicacion: PublicacionSocial = {
      id: `SOC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      plataforma,
      tipo,
      contenido: {
        texto,
        hashtags,
        menciones
      },
      estado: 'borrador',
      estadisticas: {
        alcance: 0,
        likes: 0,
        compartidos: 0,
        comentarios: 0
      },
      caso_relacionado
    }
    this.publicaciones.push(publicacion)
    return publicacion
  }

  generarAlertaMenor(
    nombre: string,
    edad: string,
    ultima_ubicacion: string,
    descripcion: string,
    contacto: string
  ): PublicacionSocial {
    const texto = `🚨 ALERTA: Búsqueda de ${nombre}, ${edad} años. Última ubicación: ${ultima_ubicacion}. ${descripcion}. Si tiene información, contacte al ${contacto}. #BusquedaMenor #Ayuda #Venezuela`
    
    return this.crearPublicacion(
      'todas',
      'alerta_menor',
      texto,
      ['#BusquedaMenor', '#Ayuda', '#Venezuela', '#ProteccionInfantil'],
      ['@CECODAP', '@UNICEF_Venezuela', '@CruzRojaVE']
    )
  }

  generarEmergencia(
    tipo: string,
    ubicacion: string,
    instruccion: string
  ): PublicacionSocial {
    const texto = `🚨 EMERGENCIA ${tipo.toUpperCase()}: ${ubicacion}. ${instruccion}. Manténgase informado y siga instrucciones oficiales. #EmergenciaVzla #Seguridad`
    
    return this.crearPublicacion(
      'todas',
      'emergencia',
      texto,
      ['#EmergenciaVzla', '#Seguridad', '@ProteccionCivil']
    )
  }

  programarPublicacion(publicacion_id: string, fecha: Date): boolean {
    const publicacion = this.publicaciones.find(p => p.id === publicacion_id)
    if (publicacion && publicacion.estado === 'borrador') {
      publicacion.estado = 'programado'
      publicacion.fecha_programada = fecha
      return true
    }
    return false
  }

  publicarAhora(publicacion_id: string): boolean {
    const publicacion = this.publicaciones.find(p => p.id === publicacion_id)
    if (publicacion && (publicacion.estado === 'borrador' || publicacion.estado === 'programado')) {
      publicacion.estado = 'publicado'
      publicacion.fecha_publicacion = new Date()
      console.log(`📱 Publicación en ${publicacion.plataforma}:`, publicacion.contenido.texto)
      return true
    }
    return false
  }

  obtenerPublicacionesPorEstado(estado: string): PublicacionSocial[] {
    return this.publicaciones.filter(p => p.estado === estado)
  }

  obtenerPublicacionesPorCaso(caso_id: string): PublicacionSocial[] {
    return this.publicaciones.filter(p => p.caso_relacionado === caso_id)
  }

  actualizarEstadisticas(publicacion_id: string, estadisticas: Partial<PublicacionSocial['estadisticas']>): boolean {
    const publicacion = this.publicaciones.find(p => p.id === publicacion_id)
    if (publicacion) {
      publicacion.estadisticas = { ...publicacion.estadisticas, ...estadisticas }
      return true
    }
    return false
  }

  eliminarPublicacion(publicacion_id: string): boolean {
    const publicacion = this.publicaciones.find(p => p.id === publicacion_id)
    if (publicacion) {
      publicacion.estado = 'eliminado'
      return true
    }
    return false
  }

  obtenerEstadisticasGenerales() {
    return {
      total_publicaciones: this.publicaciones.length,
      por_estado: {
        borrador: this.publicaciones.filter(p => p.estado === 'borrador').length,
        programado: this.publicaciones.filter(p => p.estado === 'programado').length,
        publicado: this.publicaciones.filter(p => p.estado === 'publicado').length,
        eliminado: this.publicaciones.filter(p => p.estado === 'eliminado').length
      },
      por_plataforma: {
        twitter: this.publicaciones.filter(p => p.plataforma === 'twitter' || p.plataforma === 'todas').length,
        facebook: this.publicaciones.filter(p => p.plataforma === 'facebook' || p.plataforma === 'todas').length,
        instagram: this.publicaciones.filter(p => p.plataforma === 'instagram' || p.plataforma === 'todas').length
      },
      alcance_total: this.publicaciones.reduce((sum, p) => sum + p.estadisticas.alcance, 0),
      likes_total: this.publicaciones.reduce((sum, p) => sum + p.estadisticas.likes, 0),
      compartidos_total: this.publicaciones.reduce((sum, p) => sum + p.estadisticas.compartidos, 0)
    }
  }

  obtenerHashtagsPopulares(): Array<{ hashtag: string; usos: number }> {
    const hashtagCounts: Record<string, number> = {}
    
    this.publicaciones.forEach((p: PublicacionSocial) => {
      p.contenido.hashtags.forEach((hashtag: string) => {
        hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1
      })
    })
    
    return Object.entries(hashtagCounts)
      .map(([hashtag, usos]) => ({ hashtag, usos }))
      .sort((a, b) => b.usos - a.usos)
      .slice(0, 10)
  }

  generarReporteImpacto(caso_id?: string) {
    const publicaciones = caso_id 
      ? this.obtenerPublicacionesPorCaso(caso_id)
      : this.publicaciones.filter(p => p.estado === 'publicado')
    
    return {
      caso_id,
      publicaciones_analizadas: publicaciones.length,
      alcance_total: publicaciones.reduce((sum, p) => sum + p.estadisticas.alcance, 0),
      engagement_total: publicaciones.reduce((sum, p) => sum + p.estadisticas.likes + p.estadisticas.compartidos + p.estadisticas.comentarios, 0),
      plataformas_utilizadas: Array.from(new Set(publicaciones.map(p => p.plataforma))),
      fecha_generacion: new Date()
    }
  }
}

export const socialIntegration = new SocialIntegration()
