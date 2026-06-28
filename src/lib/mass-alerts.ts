// Sistema de Alertas Masivas
// SMS, Email y notificaciones push para emergencias

export interface AlertaMasiva {
  id: string
  tipo: 'sms' | 'email' | 'push' | 'todas'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  titulo: string
  mensaje: string
  destinatarios: string[]
  estado: 'pendiente' | 'enviando' | 'enviado' | 'fallido' | 'cancelado'
  fecha_creacion: Date
  fecha_envio?: Date
  estadisticas: {
    total_destinatarios: number
    enviados: number
    fallidos: number
    leidos: number
  }
}

export interface PlantillaAlerta {
  id: string
  nombre: string
  tipo: 'emergencia' | 'busqueda' | 'evacuacion' | 'informacion'
  asunto: string
  cuerpo: string
  variables: string[]
}

export const PLANTILLAS_ALERTA: PlantillaAlerta[] = [
  {
    id: 'emergencia_critica',
    nombre: 'Emergencia Crítica',
    tipo: 'emergencia',
    asunto: '🚨 ALERTA DE EMERGENCIA CRÍTICA',
    cuerpo: 'Se ha declarado una emergencia crítica en {ubicacion}. {descripcion}. Por favor, siga las instrucciones de las autoridades.',
    variables: ['ubicacion', 'descripcion']
  },
  {
    id: 'busqueda_menor',
    nombre: 'Búsqueda de Menor',
    tipo: 'busqueda',
    asunto: '👶 BÚSQUEDA DE MENOR DESAPARECIDO',
    cuerpo: 'Se busca a {nombre_menor}, {edad} años. Última ubicación: {ubicacion}. Descripción: {descripcion}. Si tiene información, contacte al {telefono}.',
    variables: ['nombre_menor', 'edad', 'ubicacion', 'descripcion', 'telefono']
  },
  {
    id: 'evacuacion_inmediata',
    nombre: 'Evacuación Inmediata',
    tipo: 'evacuacion',
    asunto: '🚨 ORDEN DE EVACUACIÓN INMEDIATA',
    cuerpo: 'Se ordena evacuación inmediata de {zona}. Diríjase al punto de evacuación más cercano: {punto_evacuacion}. Prioridad absoluta para niños y personas vulnerables.',
    variables: ['zona', 'punto_evacuacion']
  },
  {
    id: 'informacion_general',
    nombre: 'Información General',
    tipo: 'informacion',
    asunto: '📢 INFORMACIÓN IMPORTANTE',
    cuerpo: '{mensaje}. Para más información, contacte al {telefono}.',
    variables: ['mensaje', 'telefono']
  }
]

export class MassAlertSystem {
  private alertas: AlertaMasiva[] = []
  private plantillas: PlantillaAlerta[] = PLANTILLAS_ALERTA

  crearAlerta(
    tipo: 'sms' | 'email' | 'push' | 'todas',
    prioridad: 'baja' | 'media' | 'alta' | 'critica',
    titulo: string,
    mensaje: string,
    destinatarios: string[]
  ): AlertaMasiva {
    const alerta: AlertaMasiva = {
      id: `ALT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      tipo,
      prioridad,
      titulo,
      mensaje,
      destinatarios,
      estado: 'pendiente',
      fecha_creacion: new Date(),
      estadisticas: {
        total_destinatarios: destinatarios.length,
        enviados: 0,
        fallidos: 0,
        leidos: 0
      }
    }
    this.alertas.push(alerta)
    return alerta
  }

  crearAlertaDesdePlantilla(
    plantilla_id: string,
    variables: Record<string, string>,
    destinatarios: string[],
    tipo: 'sms' | 'email' | 'push' | 'todas' = 'todas'
  ): AlertaMasiva | null {
    const plantilla = this.plantillas.find(p => p.id === plantilla_id)
    if (!plantilla) return null

    let cuerpo = plantilla.cuerpo
    Object.keys(variables).forEach(key => {
      cuerpo = cuerpo.replace(`{${key}}`, variables[key])
    })

    return this.crearAlerta(
      tipo,
      plantilla.tipo === 'emergencia' ? 'critica' : 'alta',
      plantilla.asunto,
      cuerpo,
      destinatarios
    )
  }

  enviarAlerta(alerta_id: string): boolean {
    const alerta = this.alertas.find(a => a.id === alerta_id)
    if (!alerta || alerta.estado !== 'pendiente') return false

    alerta.estado = 'enviando'
    alerta.fecha_envio = new Date()

    // Simular envío (en producción, esto se integraría con servicios reales)
    setTimeout(() => {
      alerta.estado = 'enviado'
      alerta.estadisticas.enviados = alerta.destinatarios.length
      alerta.estadisticas.fallidos = Math.floor(Math.random() * alerta.destinatarios.length * 0.1)
      console.log(`📢 Alerta enviada: ${alerta.titulo}`)
    }, 2000)

    return true
  }

  enviarAlertaCritica(mensaje: string, ubicacion: string): AlertaMasiva {
    const alerta = this.crearAlertaDesdePlantilla(
      'emergencia_critica',
      { ubicacion, descripcion: mensaje },
      [], // En producción, esto sería la lista de contactos de emergencia
      'todas'
    )

    if (alerta) {
      this.enviarAlerta(alerta.id)
    }

    return alerta!
  }

  obtenerAlertasPorEstado(estado: string): AlertaMasiva[] {
    return this.alertas.filter(a => a.estado === estado)
  }

  obtenerAlertasCriticas(): AlertaMasiva[] {
    return this.alertas.filter(a => a.prioridad === 'critica')
  }

  cancelarAlerta(alerta_id: string): boolean {
    const alerta = this.alertas.find(a => a.id === alerta_id)
    if (alerta && alerta.estado === 'pendiente') {
      alerta.estado = 'cancelado'
      return true
    }
    return false
  }

  obtenerEstadisticas() {
    return {
      total_alertas: this.alertas.length,
      por_estado: {
        pendiente: this.alertas.filter(a => a.estado === 'pendiente').length,
        enviando: this.alertas.filter(a => a.estado === 'enviando').length,
        enviado: this.alertas.filter(a => a.estado === 'enviado').length,
        fallido: this.alertas.filter(a => a.estado === 'fallido').length
      },
      por_tipo: {
        sms: this.alertas.filter(a => a.tipo === 'sms').length,
        email: this.alertas.filter(a => a.tipo === 'email').length,
        push: this.alertas.filter(a => a.tipo === 'push').length,
        todas: this.alertas.filter(a => a.tipo === 'todas').length
      },
      total_destinatarios: this.alertas.reduce((sum, a) => sum + a.estadisticas.total_destinatarios, 0),
      total_enviados: this.alertas.reduce((sum, a) => sum + a.estadisticas.enviados, 0),
      total_fallidos: this.alertas.reduce((sum, a) => sum + a.estadisticas.fallidos, 0)
    }
  }

  agregarPlantilla(plantilla: Omit<PlantillaAlerta, 'id'>): PlantillaAlerta {
    const nuevaPlantilla: PlantillaAlerta = {
      ...plantilla,
      id: `TPL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    }
    this.plantillas.push(nuevaPlantilla)
    return nuevaPlantilla
  }

  obtenerPlantillas(): PlantillaAlerta[] {
    return this.plantillas
  }
}

// Singleton instance
export const massAlertSystem = new MassAlertSystem()
