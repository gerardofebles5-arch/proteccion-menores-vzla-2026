// Sistema de Gestión de Recursos y Voluntarios
// Coordinación de recursos para respuesta a emergencias

export interface Recurso {
  id: string
  tipo: 'medico' | 'alimentacion' | 'agua' | 'refugio' | 'transporte' | 'comunicacion' | 'equipo' | 'personal'
  nombre: string
  cantidad: number
  unidad: string
  ubicacion: string
  estado: 'disponible' | 'en_uso' | 'mantenimiento' | 'agotado'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  asignado_a?: string
  fecha_actualizacion: Date
}

export interface Voluntario {
  id: string
  nombre: string
  cedula: string
  telefono: string
  email: string
  habilidades: string[]
  disponibilidad: 'completa' | 'parcial' | 'limitada'
  ubicacion: string
  estado: 'activo' | 'inactivo' | 'en_mision'
  certificaciones: string[]
  experiencia_previa: string
  fecha_registro: Date
  ultima_mision?: Date
}

export interface Mision {
  id: string
  nombre: string
  tipo: 'busqueda' | 'rescate' | 'evacuacion' | 'asistencia' | 'coordinacion'
  ubicacion: string
  fecha_inicio: Date
  fecha_fin?: Date
  estado: 'planificada' | 'en_progreso' | 'completada' | 'suspendida'
  personal_asignado: string[]
  recursos_asignados: string[]
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  descripcion: string
}

export class ResourceManagement {
  private recursos: Recurso[] = []
  private voluntarios: Voluntario[] = []
  private misiones: Mision[] = []

  // Gestión de Recursos
  agregarRecurso(recurso: Omit<Recurso, 'id' | 'fecha_actualizacion'>): Recurso {
    const nuevoRecurso: Recurso = {
      ...recurso,
      id: `REC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      fecha_actualizacion: new Date()
    }
    this.recursos.push(nuevoRecurso)
    return nuevoRecurso
  }

  obtenerRecursosDisponibles(tipo?: string): Recurso[] {
    let disponibles = this.recursos.filter(r => r.estado === 'disponible')
    if (tipo) {
      disponibles = disponibles.filter(r => r.tipo === tipo)
    }
    return disponibles
  }

  asignarRecurso(recurso_id: string, mision_id: string): boolean {
    const recurso = this.recursos.find(r => r.id === recurso_id)
    if (recurso && recurso.estado === 'disponible') {
      recurso.estado = 'en_uso'
      recurso.asignado_a = mision_id
      recurso.fecha_actualizacion = new Date()
      return true
    }
    return false
  }

  liberarRecurso(recurso_id: string): boolean {
    const recurso = this.recursos.find(r => r.id === recurso_id)
    if (recurso) {
      recurso.estado = 'disponible'
      recurso.asignado_a = undefined
      recurso.fecha_actualizacion = new Date()
      return true
    }
    return false
  }

  // Gestión de Voluntarios
  registrarVoluntario(voluntario: Omit<Voluntario, 'id' | 'fecha_registro'>): Voluntario {
    const nuevoVoluntario: Voluntario = {
      ...voluntario,
      id: `VOL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      fecha_registro: new Date()
    }
    this.voluntarios.push(nuevoVoluntario)
    return nuevoVoluntario
  }

  obtenerVoluntariosDisponibles(habilidad?: string): Voluntario[] {
    let disponibles = this.voluntarios.filter(v => 
      v.estado === 'activo' && v.disponibilidad !== 'limitada'
    )
    if (habilidad) {
      disponibles = disponibles.filter(v => v.habilidades.includes(habilidad))
    }
    return disponibles
  }

  asignarVoluntario(voluntario_id: string, mision_id: string): boolean {
    const voluntario = this.voluntarios.find(v => v.id === voluntario_id)
    if (voluntario && voluntario.estado === 'activo') {
      voluntario.estado = 'en_mision'
      voluntario.ultima_mision = new Date()
      return true
    }
    return false
  }

  liberarVoluntario(voluntario_id: string): boolean {
    const voluntario = this.voluntarios.find(v => v.id === voluntario_id)
    if (voluntario) {
      voluntario.estado = 'activo'
      return true
    }
    return false
  }

  // Gestión de Misiones
  crearMision(mision: Omit<Mision, 'id' | 'fecha_inicio'>): Mision {
    const nuevaMision: Mision = {
      ...mision,
      id: `MIS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      fecha_inicio: new Date()
    }
    this.misiones.push(nuevaMision)
    return nuevaMision
  }

  asignarPersonalAMision(mision_id: string, voluntario_id: string): boolean {
    const mision = this.misiones.find(m => m.id === mision_id)
    if (mision && !mision.personal_asignado.includes(voluntario_id)) {
      mision.personal_asignado.push(voluntario_id)
      return this.asignarVoluntario(voluntario_id, mision_id)
    }
    return false
  }

  asignarRecursoAMision(mision_id: string, recurso_id: string): boolean {
    const mision = this.misiones.find(m => m.id === mision_id)
    if (mision && !mision.recursos_asignados.includes(recurso_id)) {
      mision.recursos_asignados.push(recurso_id)
      return this.asignarRecurso(recurso_id, mision_id)
    }
    return false
  }

  completarMision(mision_id: string): boolean {
    const mision = this.misiones.find(m => m.id === mision_id)
    if (mision) {
      mision.estado = 'completada'
      mision.fecha_fin = new Date()
      
      // Liberar recursos y personal
      mision.personal_asignado.forEach(v_id => this.liberarVoluntario(v_id))
      mision.recursos_asignados.forEach(r_id => this.liberarRecurso(r_id))
      
      return true
    }
    return false
  }

  // Análisis y Reportes
  obtenerEstadisticas() {
    return {
      recursos: {
        total: this.recursos.length,
        disponibles: this.recursos.filter(r => r.estado === 'disponible').length,
        en_uso: this.recursos.filter(r => r.estado === 'en_uso').length,
        por_tipo: this.recursos.reduce((acc, r) => {
          acc[r.tipo] = (acc[r.tipo] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      },
      voluntarios: {
        total: this.voluntarios.length,
        activos: this.voluntarios.filter(v => v.estado === 'activo').length,
        en_mision: this.voluntarios.filter(v => v.estado === 'en_mision').length,
        por_habilidad: this.voluntarios.reduce((acc, v) => {
          v.habilidades.forEach(h => {
            acc[h] = (acc[h] || 0) + 1
          })
          return acc
        }, {} as Record<string, number>)
      },
      misiones: {
        total: this.misiones.length,
        en_progreso: this.misiones.filter(m => m.estado === 'en_progreso').length,
        completadas: this.misiones.filter(m => m.estado === 'completada').length,
        por_prioridad: this.misiones.reduce((acc, m) => {
          acc[m.prioridad] = (acc[m.prioridad] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    }
  }

  obtenerAlertasCriticas() {
    const alertas = []
    
    // Recursos críticos agotados
    this.recursos
      .filter(r => r.prioridad === 'critica' && r.estado === 'agotado')
      .forEach(r => {
        alertas.push({
          tipo: 'recurso_agotado',
          mensaje: `Recurso crítico agotado: ${r.nombre}`,
          severidad: 'critica'
        })
      })
    
    // Voluntarios insuficientes
    const voluntariosActivos = this.voluntarios.filter(v => v.estado === 'activo').length
    const misionesEnProgreso = this.misiones.filter(m => m.estado === 'en_progreso').length
    if (voluntariosActivos < misionesEnProgreso * 2) {
      alertas.push({
        tipo: 'voluntarios_insuficientes',
        mensaje: 'Voluntarios insuficientes para misiones activas',
        severidad: 'alta'
      })
    }
    
    return alertas
  }
}

// Singleton instance
export const resourceManagement = new ResourceManagement()
