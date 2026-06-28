// Sistema de Documentación Legal y Reportes Oficiales
// Basado en normativas venezolanas e internacionales

export const LEGAL_DOCUMENTS = {
  // Marco Legal Venezolano
  VENEZUELA: {
    'LOPNA': {
      nombre: 'Ley Orgánica para la Protección del Niño y del Adolescente',
      descripcion: 'Marco legal principal para protección infantil en Venezuela',
      articulos_clave: [
        { articulo: 8, descripcion: 'Derecho a la vida y a un nivel de vida adecuado' },
        { articulo: 32, descripcion: 'Derecho a ser protegido contra abuso, explotación y violencia' },
        { articulo: 55, descripcion: 'Obligación del Estado de proteger a niños y adolescentes' },
        { articulo: 126, descripcion: 'Medidas de protección para niños en situación de riesgo' }
      ]
    },
    'CONSTITUCION': {
      nombre: 'Constitución de la República Bolivariana de Venezuela',
      descripcion: 'Derechos fundamentales de niños y adolescentes',
      articulos_clave: [
        { articulo: 78, descripcion: 'Derecho a la protección por parte del Estado' },
        { articulo: 84, descripcion: 'Derecho a la educación y cuidado' }
      ]
    }
  },

  // Normativas Internacionales
  INTERNACIONAL: {
    'CONVENCION_DERECHOS_NINO': {
      nombre: 'Convención sobre los Derechos del Niño (ONU)',
      descripcion: 'Tratado internacional de derechos humanos',
      articulos_clave: [
        { articulo: 11, descripcion: 'Medidas contra la traslación ilícita y retención' },
        { articulo: 19, descripcion: 'Protección contra el abuso y la negligencia' },
        { articulo: 34, descripcion: 'Protección contra la explotación sexual' }
      ]
    },
    'PROTOCOLO_PALERMO': {
      nombre: 'Protocolo de Palermo (ONU)',
      descripcion: 'Protocolo para prevenir, reprimir y sancionar la trata de personas',
      articulos_clave: [
        { articulo: 2, descripcion: 'Definición de trata de personas' },
        { articulo: 5, descripcion: 'Criminalización de la trata' }
      ]
    }
  }
}

export interface ReporteOficial {
  id: string
  tipo: 'reporte_urgente' | 'denuncia_trata' | 'menor_desaparecido' | 'reunion_familiar'
  fecha_creacion: Date
  creador: string
  estado: 'borrador' | 'en_revision' | 'aprobado' | 'archivado'
  contenido: {
    descripcion: string
    ubicacion: string
    involucrados: string[]
    evidencias: string[]
    testigos: string[]
    acciones_tomadas: string[]
  }
  referencias_legales: string[]
  firmas: {
    funcionario: string
    cargo: string
    fecha: Date
  }[]
}

export function generarReporteOficial(tipo: string, datos: any): ReporteOficial {
  return {
    id: `REP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    tipo: tipo as any,
    fecha_creacion: new Date(),
    creador: datos.creador || 'Sistema',
    estado: 'borrador',
    contenido: {
      descripcion: datos.descripcion || '',
      ubicacion: datos.ubicacion || '',
      involucrados: datos.involucrados || [],
      evidencias: datos.evidencias || [],
      testigos: datos.testigos || [],
      acciones_tomadas: datos.acciones_tomadas || []
    },
    referencias_legales: obtenerReferenciasLegales(tipo),
    firmas: []
  }
}

export function obtenerReferenciasLegales(tipo: string): string[] {
  const referencias: Record<string, string[]> = {
    'reporte_urgente': ['LOPNA Art. 32', 'LOPNA Art. 126', 'Constitución Art. 78'],
    'denuncia_trata': ['Protocolo de Palermo Art. 2', 'Protocolo de Palermo Art. 5', 'LOPNA Art. 32'],
    'menor_desaparecido': ['LOPNA Art. 55', 'Constitución Art. 78', 'Convención Art. 11'],
    'reunion_familiar': ['LOPNA Art. 126', 'Convención Art. 9', 'Convención Art. 10']
  }
  
  return referencias[tipo] || []
}

export function firmarReporte(reporte: ReporteOficial, funcionario: string, cargo: string): ReporteOficial {
  return {
    ...reporte,
    firmas: [
      ...reporte.firmas,
      {
        funcionario,
        cargo,
        fecha: new Date()
      }
    ]
  }
}

export function exportarReportePDF(reporte: ReporteOficial): string {
  // En producción, esto generaría un PDF real
  return `PDF generado para reporte ${reporte.id}`
}

export function generarActaReunion(datos: any) {
  return {
    id: `ACTA-${Date.now()}`,
    fecha: new Date(),
    tipo: 'reunion_coordinacion',
    participantes: datos.participantes || [],
    temas_tratados: datos.temas || [],
    acuerdos: datos.acuerdos || [],
    proxima_reunion: datos.proxima_reunion || null,
    firmas: []
  }
}
