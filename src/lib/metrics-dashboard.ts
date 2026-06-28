// Dashboard de Métricas y KPIs Avanzado
// Análisis de datos y rendimiento del sistema

export interface Metrica {
  id: string
  nombre: string
  valor: number
  unidad: string
  tendencia: 'ascendente' | 'descendente' | 'estable'
  cambio_porcentaje: number
  periodo: 'hoy' | 'semana' | 'mes' | 'anio'
  categoria: 'operacional' | 'seguridad' | 'impacto' | 'eficiencia'
}

export interface KPI {
  id: string
  nombre: string
  descripcion: string
  objetivo: number
  valor_actual: number
  estado: 'excelente' | 'bueno' | 'aceptable' | 'critico'
  historial: { fecha: Date; valor: number }[]
}

export class MetricsDashboard {
  private metricas: Metrica[] = []
  private kpis: KPI[] = []

  constructor() {
    this.inicializarMetricas()
    this.inicializarKPIs()
  }

  private inicializarMetricas() {
    this.metricas = [
      {
        id: 'reportes_hoy',
        nombre: 'Reportes Hoy',
        valor: 15,
        unidad: 'reportes',
        tendencia: 'ascendente',
        cambio_porcentaje: 25,
        periodo: 'hoy',
        categoria: 'operacional'
      },
      {
        id: 'menores_hallados',
        nombre: 'Menores Hallados',
        valor: 8,
        unidad: 'menores',
        tendencia: 'ascendente',
        cambio_porcentaje: 33,
        periodo: 'hoy',
        categoria: 'impacto'
      },
      {
        id: 'tiempo_respuesta',
        nombre: 'Tiempo de Respuesta Promedio',
        valor: 12,
        unidad: 'minutos',
        tendencia: 'descendente',
        cambio_porcentaje: -15,
        periodo: 'hoy',
        categoria: 'eficiencia'
      },
      {
        id: 'alertas_seguridad',
        nombre: 'Alertas de Seguridad',
        valor: 3,
        unidad: 'alertas',
        tendencia: 'descendente',
        cambio_porcentaje: -40,
        periodo: 'hoy',
        categoria: 'seguridad'
      },
      {
        id: 'refugios_activos',
        nombre: 'Refugios Activos',
        valor: 12,
        unidad: 'refugios',
        tendencia: 'estable',
        cambio_porcentaje: 0,
        periodo: 'hoy',
        categoria: 'operacional'
      },
      {
        id: 'voluntarios_activos',
        nombre: 'Voluntarios Activos',
        valor: 45,
        unidad: 'personas',
        tendencia: 'ascendente',
        cambio_porcentaje: 10,
        periodo: 'hoy',
        categoria: 'operacional'
      },
      {
        id: 'casos_resueltos',
        nombre: 'Casos Resueltos',
        valor: 23,
        unidad: 'casos',
        tendencia: 'ascendente',
        cambio_porcentaje: 18,
        periodo: 'semana',
        categoria: 'impacto'
      },
      {
        id: 'satisfaccion_usuarios',
        nombre: 'Satisfacción de Usuarios',
        valor: 4.5,
        unidad: 'estrellas',
        tendencia: 'ascendente',
        cambio_porcentaje: 12,
        periodo: 'mes',
        categoria: 'impacto'
      }
    ]
  }

  private inicializarKPIs() {
    this.kpis = [
      {
        id: 'tiempo_respuesta_objetivo',
        nombre: 'Tiempo de Respuesta',
        descripcion: 'Tiempo promedio de respuesta a reportes urgentes',
        objetivo: 10,
        valor_actual: 12,
        estado: 'aceptable',
        historial: []
      },
      {
        id: 'tasa_resolucion',
        nombre: 'Tasa de Resolución',
        descripcion: 'Porcentaje de casos resueltos exitosamente',
        objetivo: 85,
        valor_actual: 78,
        estado: 'bueno',
        historial: []
      },
      {
        id: 'cobertura_refugios',
        nombre: 'Cobertura de Refugios',
        descripcion: 'Porcentaje de zonas con refugios activos',
        objetivo: 90,
        valor_actual: 75,
        estado: 'aceptable',
        historial: []
      },
      {
        id: 'indice_seguridad',
        nombre: 'Índice de Seguridad',
        descripcion: 'Puntuación de seguridad del sistema (0-100)',
        objetivo: 95,
        valor_actual: 92,
        estado: 'excelente',
        historial: []
      },
      {
        id: 'eficiencia_recursos',
        nombre: 'Eficiencia de Recursos',
        descripcion: 'Porcentaje de recursos utilizados eficientemente',
        objetivo: 80,
        valor_actual: 85,
        estado: 'excelente',
        historial: []
      }
    ]
  }

  obtenerMetricasPorCategoria(categoria: string): Metrica[] {
    return this.metricas.filter(m => m.categoria === categoria)
  }

  actualizarMetrica(id: string, nuevoValor: number): boolean {
    const metrica = this.metricas.find(m => m.id === id)
    if (metrica) {
      const cambio = ((nuevoValor - metrica.valor) / metrica.valor) * 100
      metrica.valor = nuevoValor
      metrica.cambio_porcentaje = cambio
      metrica.tendencia = cambio > 0 ? 'ascendente' : cambio < 0 ? 'descendente' : 'estable'
      return true
    }
    return false
  }

  actualizarKPI(id: string, nuevoValor: number): boolean {
    const kpi = this.kpis.find(k => k.id === id)
    if (kpi) {
      kpi.valor_actual = nuevoValor
      kpi.historial.push({ fecha: new Date(), valor: nuevoValor })
      
      const porcentaje = (nuevoValor / kpi.objetivo) * 100
      if (porcentaje >= 95) kpi.estado = 'excelente'
      else if (porcentaje >= 80) kpi.estado = 'bueno'
      else if (porcentaje >= 60) kpi.estado = 'aceptable'
      else kpi.estado = 'critico'
      
      return true
    }
    return false
  }

  obtenerKPIsCriticos(): KPI[] {
    return this.kpis.filter(k => k.estado === 'critico')
  }

  obtenerResumenEjecutivo() {
    return {
      metricas_operacionales: this.obtenerMetricasPorCategoria('operacional'),
      metricas_seguridad: this.obtenerMetricasPorCategoria('seguridad'),
      metricas_impacto: this.obtenerMetricasPorCategoria('impacto'),
      metricas_eficiencia: this.obtenerMetricasPorCategoria('eficiencia'),
      kpis_criticos: this.obtenerKPIsCriticos(),
      kpis_excelentes: this.kpis.filter(k => k.estado === 'excelente'),
      tendencias_positivas: this.metricas.filter(m => m.tendencia === 'ascendente').length,
      tendencias_negativas: this.metricas.filter(m => m.tendencia === 'descendente').length
    }
  }

  generarReporteRendimiento() {
    const resumen = this.obtenerResumenEjecutivo()
    
    return {
      fecha_generacion: new Date(),
      resumen,
      recomendaciones: this.generarRecomendaciones(),
      alertas: this.generarAlertas(),
      proximos_pasos: this.generarProximosPasos()
    }
  }

  private generarRecomendaciones(): string[] {
    const recomendaciones = []
    const kpisCriticos = this.obtenerKPIsCriticos()
    kpisCriticos.forEach(kpi => {
      recomendaciones.push(`Priorizar mejora en ${kpi.nombre}: actual ${kpi.valor_actual}, objetivo ${kpi.objetivo}`)
    })
    
    if (recomendaciones.length === 0) {
      recomendaciones.push('Mantener rendimiento actual y buscar oportunidades de mejora continua')
    }
    
    return recomendaciones
  }

  private generarAlertas(): Array<{ tipo: string; mensaje: string; severidad: string }> {
    const alertas: Array<{ tipo: string; mensaje: string; severidad: string }> = []
    this.kpis.forEach(kpi => {
      if (kpi.estado === 'critico') {
        alertas.push({
          tipo: 'kpi_critico',
          mensaje: `KPI crítico: ${kpi.nombre} (${kpi.valor_actual}/${kpi.objetivo})`,
          severidad: 'alta'
        })
      }
    })
    return alertas
  }

  private generarProximosPasos(): string[] {
    return ['Actualizar métricas en próxima revisión (24h)', 'Revisar asignación de recursos']
  }

  exportarDatos(formato: 'json' | 'csv'): string {
    if (formato === 'json') {
      return JSON.stringify({
        metricas: this.metricas,
        kpis: this.kpis,
        fecha_exportacion: new Date()
      }, null, 2)
    }
    
    let csv = 'Tipo,Nombre,Valor,Unidad,Tendencia,Cambio%,Periodo,Categoria\n'
    this.metricas.forEach(m => {
      csv += `Metrica,${m.nombre},${m.valor},${m.unidad},${m.tendencia},${m.cambio_porcentaje},${m.periodo},${m.categoria}\n`
    })
    return csv
  }
}

export const metricsDashboard = new MetricsDashboard()
