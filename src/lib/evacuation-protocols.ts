// Sistema de Protocolos de Evacuación y Refugios
// Procedimientos estandarizados para emergencias

export interface PuntoEvacuacion {
  id: string
  nombre: string
  ubicacion: {
    latitud: number
    longitud: number
    direccion: string
  }
  capacidad: number
  capacidad_actual: number
  tipo: 'temporal' | 'permanente' | 'emergencia'
  servicios: string[]
  estado: 'activo' | 'lleno' | 'inactivo' | 'mantenimiento'
  contacto: {
    telefono: string
    responsable: string
  }
  accesibilidad: boolean
}

export interface RutaEvacuacion {
  id: string
  nombre: string
  origen: string
  destino: string
  puntos_intermedios: string[]
  distancia_km: number
  tiempo_estimado_minutos: number
  estado: 'segura' | 'riesgosa' | 'bloqueada'
  tipo_transporte: 'pie' | 'vehiculo' | 'ambulancia' | 'helicoptero'
  condiciones: string[]
}

export interface PlanEvacuacion {
  id: string
  nombre: string
  tipo_emergencia: 'sismo' | 'inundacion' | 'deslizamiento' | 'incendio' | 'trata'
  zona_afectada: string
  nivel_riesgo: 'bajo' | 'medio' | 'alto' | 'critico'
  puntos_evacuacion: string[]
  rutas: string[]
  prioridades: {
    poblacion: string[]
    recursos: string[]
  }
  procedimientos: {
    pre_evacuacion: string[]
    durante_evacuacion: string[]
    post_evacuacion: string[]
  }
  fecha_creacion: Date
  ultima_actualizacion: Date
  estado: 'activo' | 'inactivo' | 'ejecucion'
}

export const PROCEDIMIENTOS_EVACUACION = {
  PRE_EVACUACION: [
    'Verificar que todos los puntos de evacuación estén activos',
    'Confirmar capacidad disponible en refugios',
    'Notificar a personal de emergencia',
    'Preparar vehículos de transporte',
    'Verificar suministros médicos y de emergencia',
    'Identificar población vulnerable (niños, ancianos, discapacitados)',
    'Establecer puntos de reunión seguros',
    'Preparar documentación de identificación'
  ],
  DURANTE_EVACUACION: [
    'Mantener la calma y seguir instrucciones',
    'Priorizar seguridad de niños y personas vulnerables',
    'Usar rutas establecidas y seguras',
    'No regresar por objetos personales',
    'Mantener comunicación constante',
    'Registrar personas evacuadas',
    'Proporcionar primeros auxilios si es necesario',
    'Mantener grupos familiares unidos'
  ],
  POST_EVACUACION: [
    'Realizar conteo de personas evacuadas',
    'Verificar estado de salud de evacuados',
    'Registrar en sistema de seguimiento',
    'Proporcionar alojamiento temporal',
    'Coordinar con servicios de salud',
    'Notificar a familiares',
    'Documentar el proceso',
    'Evaluar necesidad de asistencia adicional'
  ]
}

export class EvacuationManagement {
  private puntosEvacuacion: PuntoEvacuacion[] = []
  private rutasEvacuacion: RutaEvacuacion[] = []
  private planesEvacuacion: PlanEvacuacion[] = []

  // Gestión de Puntos de Evacuación
  agregarPuntoEvacuacion(punto: Omit<PuntoEvacuacion, 'id'>): PuntoEvacuacion {
    const nuevoPunto: PuntoEvacuacion = {
      ...punto,
      id: `PEV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    }
    this.puntosEvacuacion.push(nuevoPunto)
    return nuevoPunto
  }

  obtenerPuntosActivos(): PuntoEvacuacion[] {
    return this.puntosEvacuacion.filter(p => p.estado === 'activo')
  }

  obtenerPuntosPorCapacidad(): PuntoEvacuacion[] {
    return this.puntosEvacuacion
      .filter(p => p.estado === 'activo')
      .sort((a, b) => (b.capacidad - b.capacidad_actual) - (a.capacidad - a.capacidad_actual))
  }

  actualizarCapacidad(punto_id: string, nueva_capacidad_actual: number): boolean {
    const punto = this.puntosEvacuacion.find(p => p.id === punto_id)
    if (punto) {
      punto.capacidad_actual = nueva_capacidad_actual
      if (punto.capacidad_actual >= punto.capacidad) {
        punto.estado = 'lleno'
      }
      return true
    }
    return false
  }

  // Gestión de Rutas de Evacuación
  agregarRutaEvacuacion(ruta: Omit<RutaEvacuacion, 'id'>): RutaEvacuacion {
    const nuevaRuta: RutaEvacuacion = {
      ...ruta,
      id: `RUT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    }
    this.rutasEvacuacion.push(nuevaRuta)
    return nuevaRuta
  }

  obtenerRutasSeguras(): RutaEvacuacion[] {
    return this.rutasEvacuacion.filter(r => r.estado === 'segura')
  }

  obtenerRutaMasCorta(origen: string, destino: string): RutaEvacuacion | null {
    const rutas = this.rutasEvacuacion
      .filter(r => r.origen === origen && r.destino === destino && r.estado === 'segura')
      .sort((a, b) => a.tiempo_estimado_minutos - b.tiempo_estimado_minutos)
    
    return rutas[0] || null
  }

  // Gestión de Planes de Evacuación
  crearPlanEvacuacion(plan: Omit<PlanEvacuacion, 'id' | 'fecha_creacion' | 'ultima_actualizacion'>): PlanEvacuacion {
    const nuevoPlan: PlanEvacuacion = {
      ...plan,
      id: `PLN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      fecha_creacion: new Date(),
      ultima_actualizacion: new Date()
    }
    this.planesEvacuacion.push(nuevoPlan)
    return nuevoPlan
  }

  activarPlanEvacuacion(plan_id: string): boolean {
    const plan = this.planesEvacuacion.find(p => p.id === plan_id)
    if (plan) {
      plan.estado = 'ejecucion'
      plan.ultima_actualizacion = new Date()
      return true
    }
    return false
  }

  obtenerPlanActivo(tipo_emergencia: string): PlanEvacuacion | null {
    return this.planesEvacuacion.find(p => 
      p.tipo_emergencia === tipo_emergencia && p.estado === 'activo'
    ) || null
  }

  // Análisis y Alertas
  evaluarCapacidadTotal(): {
    total_capacidad: number
    capacidad_disponible: number
    capacidad_usada: number
    porcentaje_uso: number
  } {
    const puntosActivos = this.obtenerPuntosActivos()
    const totalCapacidad = puntosActivos.reduce((sum, p) => sum + p.capacidad, 0)
    const capacidadUsada = puntosActivos.reduce((sum, p) => sum + p.capacidad_actual, 0)
    
    return {
      total_capacidad: totalCapacidad,
      capacidad_disponible: totalCapacidad - capacidadUsada,
      capacidad_usada: capacidadUsada,
      porcentaje_uso: totalCapacidad > 0 ? (capacidadUsada / totalCapacidad) * 100 : 0
    }
  }

  obtenerAlertasEvacuacion() {
    const alertas = []
    
    // Puntos llenos
    this.puntosEvacuacion
      .filter(p => p.estado === 'lleno')
      .forEach(p => {
        alertas.push({
          tipo: 'punto_lleno',
          mensaje: `Punto de evacuación lleno: ${p.nombre}`,
          severidad: 'alta',
          punto_id: p.id
        })
      })
    
    // Rutas bloqueadas
    this.rutasEvacuacion
      .filter(r => r.estado === 'bloqueada')
      .forEach(r => {
        alertas.push({
          tipo: 'ruta_bloqueada',
          mensaje: `Ruta de evacuación bloqueada: ${r.nombre}`,
          severidad: 'critica',
          ruta_id: r.id
        })
      })
    
    // Capacidad crítica
    const capacidad = this.evaluarCapacidadTotal()
    if (capacidad.porcentaje_uso > 80) {
      alertas.push({
        tipo: 'capacidad_critica',
        mensaje: `Capacidad de evacuación al ${capacidad.porcentaje_uso.toFixed(1)}%`,
        severidad: 'alta'
      })
    }
    
    return alertas
  }

  generarReporteEvacuacion(plan_id: string) {
    const plan = this.planesEvacuacion.find(p => p.id === plan_id)
    if (!plan) return null
    
    return {
      plan: plan.nombre,
      tipo_emergencia: plan.tipo_emergencia,
      zona_afectada: plan.zona_afectada,
      nivel_riesgo: plan.nivel_riesgo,
      puntos_activos: this.obtenerPuntosActivos().length,
      rutas_seguras: this.obtenerRutasSeguras().length,
      capacidad_disponible: this.evaluarCapacidadTotal().capacidad_disponible,
      alertas: this.obtenerAlertasEvacuacion(),
      timestamp: new Date()
    }
  }
}

// Singleton instance
export const evacuationManagement = new EvacuationManagement()
