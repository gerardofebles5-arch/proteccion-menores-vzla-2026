// Sistema de Chat Interno para Coordinación
// Comunicación segura entre equipos de respuesta

export interface MensajeChat {
  id: string
  remitente: string
  remitente_id: string
  contenido: string
  tipo: 'texto' | 'alerta' | 'coordenada' | 'archivo'
  timestamp: Date
  canal: string
  prioridad: 'baja' | 'normal' | 'alta' | 'critica'
  leido_por: string[]
  respuestas: MensajeChat[]
}

export interface CanalChat {
  id: string
  nombre: string
  tipo: 'general' | 'emergencia' | 'coordinacion' | 'regional'
  descripcion: string
  participantes: string[]
  creado_por: string
  fecha_creacion: Date
  activo: boolean
}

export const CANALES_PREDEFINIDOS: CanalChat[] = [
  {
    id: 'general',
    nombre: 'Coordinación General',
    tipo: 'general',
    descripcion: 'Canal principal para coordinación general',
    participantes: [],
    creado_por: 'sistema',
    fecha_creacion: new Date(),
    activo: true
  },
  {
    id: 'emergencias',
    nombre: 'Alertas de Emergencia',
    tipo: 'emergencia',
    descripcion: 'Canal exclusivo para situaciones críticas',
    participantes: [],
    creado_por: 'sistema',
    fecha_creacion: new Date(),
    activo: true
  },
  {
    id: 'refugios',
    nombre: 'Coordinación de Refugios',
    tipo: 'coordinacion',
    descripcion: 'Coordinación entre refugios activos',
    participantes: [],
    creado_por: 'sistema',
    fecha_creacion: new Date(),
    activo: true
  },
  {
    id: 'busqueda',
    nombre: 'Búsqueda de Menores',
    tipo: 'coordinacion',
    descripcion: 'Coordinación de operaciones de búsqueda',
    participantes: [],
    creado_por: 'sistema',
    fecha_creacion: new Date(),
    activo: true
  }
]

export class ChatCoordination {
  private mensajes: MensajeChat[] = []
  private canales: CanalChat[] = CANALES_PREDEFINIDOS

  enviarMensaje(
    remitente: string,
    remitente_id: string,
    contenido: string,
    canal: string,
    prioridad: 'baja' | 'normal' | 'alta' | 'critica' = 'normal',
    tipo: 'texto' | 'alerta' | 'coordenada' | 'archivo' = 'texto'
  ): MensajeChat {
    const mensaje: MensajeChat = {
      id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      remitente,
      remitente_id,
      contenido,
      tipo,
      timestamp: new Date(),
      canal,
      prioridad,
      leido_por: [],
      respuestas: []
    }

    this.mensajes.push(mensaje)
    
    // Si es prioridad crítica, notificar a todos
    if (prioridad === 'critica') {
      this.notificarEmergencia(mensaje)
    }

    return mensaje
  }

  obtenerMensajesCanal(canal: string): MensajeChat[] {
    return this.mensajes
      .filter(m => m.canal === canal)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  obtenerCanales(): CanalChat[] {
    return this.canales.filter(c => c.activo)
  }

  crearCanal(
    nombre: string,
    tipo: 'general' | 'emergencia' | 'coordinacion' | 'regional',
    descripcion: string,
    creado_por: string
  ): CanalChat {
    const canal: CanalChat = {
      id: `CAN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      nombre,
      tipo,
      descripcion,
      participantes: [],
      creado_por,
      fecha_creacion: new Date(),
      activo: true
    }

    this.canales.push(canal)
    return canal
  }

  agregarParticipante(canal_id: string, usuario_id: string): void {
    const canal = this.canales.find(c => c.id === canal_id)
    if (canal && !canal.participantes.includes(usuario_id)) {
      canal.participantes.push(usuario_id)
    }
  }

  marcarComoLeido(mensaje_id: string, usuario_id: string): void {
    const mensaje = this.mensajes.find(m => m.id === mensaje_id)
    if (mensaje && !mensaje.leido_por.includes(usuario_id)) {
      mensaje.leido_por.push(usuario_id)
    }
  }

  responderMensaje(mensaje_id: string, respuesta: MensajeChat): void {
    const mensaje = this.mensajes.find(m => m.id === mensaje_id)
    if (mensaje) {
      mensaje.respuestas.push(respuesta)
    }
  }

  private notificarEmergencia(mensaje: MensajeChat): void {
    console.log(`🚨 ALERTA CRÍTICA EN CANAL ${mensaje.canal}:`, mensaje.contenido)
    // En producción, esto enviaría notificaciones push, SMS, etc.
  }

  obtenerMensajesNoLeidos(usuario_id: string): MensajeChat[] {
    return this.mensajes.filter(m => !m.leido_por.includes(usuario_id))
  }

  buscarMensajes(termino: string): MensajeChat[] {
    return this.mensajes.filter(m => 
      m.contenido.toLowerCase().includes(termino.toLowerCase()) ||
      m.remitente.toLowerCase().includes(termino.toLowerCase())
    )
  }

  obtenerEstadisticas() {
    return {
      total_mensajes: this.mensajes.length,
      total_canales: this.canales.length,
      mensajes_por_canal: this.canales.map(c => ({
        nombre: c.nombre,
        cantidad: this.mensajes.filter(m => m.canal === c.id).length
      })),
      mensajes_por_prioridad: {
        critica: this.mensajes.filter(m => m.prioridad === 'critica').length,
        alta: this.mensajes.filter(m => m.prioridad === 'alta').length,
        normal: this.mensajes.filter(m => m.prioridad === 'normal').length,
        baja: this.mensajes.filter(m => m.prioridad === 'baja').length
      }
    }
  }
}

// Singleton instance
export const chatCoordination = new ChatCoordination()
