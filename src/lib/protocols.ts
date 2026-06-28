// Sistema de Protocolos y Procedimientos Estandarizados
// Basado en normativas internacionales: ONU, UNICEF, Convención Derechos del Niño

export const PROTOCOLS = {
  // Protocolo de Reporte Urgente
  URGENTE_REPORT: {
    nombre: 'Protocolo de Reporte Urgente',
    descripcion: 'Procedimiento estándar para reportar situaciones de emergencia',
    pasos: [
      {
        paso: 1,
        accion: 'Verificar seguridad inmediata',
        descripcion: 'Antes de reportar, asegure que usted y el menor estén fuera de peligro inmediato',
        tiempo: 'Inmediato'
      },
      {
        paso: 2,
        accion: 'Documentar observación',
        descripcion: 'Registre fecha, hora, ubicación exacta, descripción del menor y situación',
        tiempo: '2-5 minutos'
      },
      {
        paso: 3,
        accion: 'Reportar al sistema',
        descripcion: 'Ingrese el reporte en el sistema con todos los detalles disponibles',
        tiempo: '3-5 minutos'
      },
      {
        paso: 4,
        accion: 'Contactar servicios de emergencia',
        descripcion: 'Si es crítico, llame al 911 o líneas de ayuda locales',
        tiempo: 'Inmediato si crítico'
      },
      {
        paso: 5,
        accion: 'Mantener vigilancia',
        descripcion: 'No abandone la situación hasta que llegue ayuda oficial',
        tiempo: 'Hasta llegada de ayuda'
      }
    ],
    alertas: [
      'Intento de rapto visible',
      'Niño solo en zona de riesgo',
      'Movimiento sospechoso cerca de refugios',
      'Situación de violencia o abuso',
      'Niño en estado de emergencia médica'
    ]
  },

  // Protocolo de Búsqueda de Menor
  MISSING_CHILD: {
    nombre: 'Protocolo de Búsqueda de Menor Desaparecido',
    descripcion: 'Procedimiento para reportar y buscar menores desaparecidos',
    pasos: [
      {
        paso: 1,
        accion: 'Verificar ubicación última conocida',
        descripcion: 'Confirme dónde fue visto por última vez y cuándo',
        tiempo: 'Inmediato'
      },
      {
        paso: 2,
        accion: 'Recopilar información del menor',
        descripcion: 'Nombre, edad, características físicas, ropa, fotos recientes',
        tiempo: '5-10 minutos'
      },
      {
        paso: 3,
        accion: 'Reportar al sistema',
        descripcion: 'Complete el formulario de reporte con toda la información',
        tiempo: '10-15 minutos'
      },
      {
        paso: 4,
        accion: 'Contactar autoridades',
        descripcion: 'CICPC, Protección Civil, líneas de ayuda',
        tiempo: 'Inmediato'
      },
      {
        paso: 5,
        accion: 'Difusión controlada',
        descripcion: 'El sistema difundirá información solo a organismos autorizados',
        tiempo: 'Automático'
      },
      {
        paso: 6,
        accion: 'Seguimiento continuo',
        descripcion: 'Manténgase en contacto con el sistema para actualizaciones',
        tiempo: 'Continuo'
      }
    ],
    tiempo_critico: 'Primeras 24 horas son cruciales'
  },

  // Protocolo de Denuncia de Trata
  TRAFFICKING_REPORT: {
    nombre: 'Protocolo de Denuncia de Trata de Personas',
    descripcion: 'Procedimiento para reportar sospechas de trata',
    pasos: [
      {
        paso: 1,
        accion: 'NO intervenir directamente',
        descripcion: 'Su seguridad es prioritaria. No confronte a sospechosos',
        tiempo: 'Inmediato'
      },
      {
        paso: 2,
        accion: 'Documentar evidencia',
        descripcion: 'Fotos, videos, ubicación, descripción de personas involucradas',
        tiempo: 'Seguro y rápido'
      },
      {
        paso: 3,
        accion: 'Reportar al sistema',
        descripcion: 'Use el formulario de denuncia de trata',
        tiempo: '5-10 minutos'
      },
      {
        paso: 4,
        accion: 'Contactar autoridades especializadas',
        descripcion: 'CICPC división trata, líneas de ayuda internacionales',
        tiempo: 'Inmediato'
      },
      {
        paso: 5,
        accion: 'Proteger identidad',
        descripcion: 'El sistema mantiene su identidad protegida',
        tiempo: 'Automático'
      }
    ],
    indicadores: [
      'Anuncios sospechosos en plataformas de venta',
      'Menores acompañados por adultos no familiares',
      'Señales de control o coacción',
      'Traslados frecuentes sin explicación',
      'Menores trabajando en condiciones inapropiadas'
    ]
  },

  // Protocolo de Refugio
  SHELTER_PROTOCOL: {
    nombre: 'Protocolo de Gestión de Refugios',
    descripcion: 'Procedimientos estándar para operación de refugios',
    pasos: [
      {
        paso: 1,
        accion: 'Registro de refugio',
        descripcion: 'Reportar ubicación, capacidad, recursos disponibles',
        tiempo: 'Al establecer refugio'
      },
      {
        paso: 2,
        accion: 'Verificación de seguridad',
        descripcion: 'Inspección de instalaciones y protocolos de seguridad',
        tiempo: 'Periódico'
      },
      {
        paso: 3,
        accion: 'Registro de menores',
        descripcion: 'Sistema de registro de menores ingresados con protección de datos',
        tiempo: 'Al ingreso'
      },
      {
        paso: 4,
        accion: 'Coordinación con ONGs',
        descripcion: 'Comunicación con organismos autorizados para seguimiento',
        tiempo: 'Continuo'
      },
      {
        paso: 5,
        accion: 'Actualización de capacidad',
        descripcion: 'Reportar cambios en capacidad y disponibilidad',
        tiempo: 'Diario'
      }
    ],
    requisitos: [
      'Personal verificado y capacitado',
      'Protocolos de seguridad activos',
      'Acceso a servicios médicos',
      'Alimentación y agua potable',
      'Espacios seguros para menores',
      'Comunicación con autoridades'
    ]
  },

  // Protocolo de Reunión Familiar
  FAMILY_REUNION: {
    nombre: 'Protocolo de Reunión Familiar',
    descripcion: 'Procedimiento para reunir menores con sus familias',
    pasos: [
      {
        paso: 1,
        accion: 'Verificación de identidad',
        descripcion: 'Confirmar identidad de los reclamantes mediante documentación oficial',
        tiempo: 'Crítico'
      },
      {
        paso: 2,
        accion: 'Validación de relación',
        descripcion: 'Verificar relación familiar mediante bases de datos oficiales',
        tiempo: 'Crítico'
      },
      {
        paso: 3,
        accion: 'Evaluación de seguridad',
        descripcion: 'Evaluar que la reunificación sea segura para el menor',
        tiempo: 'Obligatorio'
      },
      {
        paso: 4,
        accion: 'Documentación del proceso',
        descripcion: 'Registro completo del proceso de reunificación',
        tiempo: 'Obligatorio'
      },
      {
        paso: 5,
        accion: 'Seguimiento post-reunión',
        description: 'Monitoreo del bienestar del menor después de la reunificación',
        tiempo: '30 días'
      }
    ],
    protecciones: [
      'Doble ciego de ubicación',
      'Verificación de antecedentes',
      'Evaluación psicológica',
      'Consentimiento del menor (según edad)',
      'Coordinación con servicios sociales'
    ]
  },

  // Protocolo de Emergencia Médica
  MEDICAL_EMERGENCY: {
    nombre: 'Protocolo de Emergencia Médica',
    descripcion: 'Procedimiento para situaciones médicas críticas',
    pasos: [
      {
        paso: 1,
        accion: 'Evaluar estado vital',
        descripcion: 'Verificar respiración, pulso, nivel de conciencia',
        tiempo: 'Inmediato'
      },
      {
        paso: 2,
        accion: 'Llamar emergencias médicas',
        descripcion: '911 o servicios médicos locales',
        tiempo: 'Inmediato'
      },
      {
        paso: 3,
        accion: 'Primeros auxilios básicos',
        descripcion: 'Solo si está capacitado y seguro',
        tiempo: 'Hasta llegada de ayuda'
      },
      {
        paso: 4,
        accion: 'Reportar al sistema',
        descripcion: 'Documentar la situación médica',
        tiempo: 'Cuando sea seguro'
      },
      {
        paso: 5,
        accion: 'Coordinar con refugios médicos',
        descripcion: 'Si el menor necesita transporte a centro médico',
        tiempo: 'Según necesidad'
      }
    ]
  },

  // Protocolo de Coordinación con ONGs
  ONG_COORDINATION: {
    nombre: 'Protocolo de Coordinación con Organismos',
    descripcion: 'Procedimientos para coordinación con ONGs y autoridades',
    pasos: [
      {
        paso: 1,
        accion: 'Verificación de organismo',
        descripcion: 'Confirmar que el organismo está autorizado',
        tiempo: 'Pre-contacto'
      },
      {
        paso: 2,
        accion: 'Canal oficial de comunicación',
        descripcion: 'Usar canales oficiales del sistema para coordinación',
        tiempo: 'Siempre'
      },
      {
        paso: 3,
        accion: 'Documentación de intercambio',
        descripcion: 'Registro de todas las comunicaciones y acciones',
        tiempo: 'Obligatorio'
      },
      {
        paso: 4,
        accion: 'Protección de datos',
        descripcion: 'Solo compartir información necesaria y autorizada',
        tiempo: 'Siempre'
      },
      {
        paso: 5,
        accion: 'Seguimiento de acciones',
        descripcion: 'Monitorear el progreso de las acciones coordinadas',
        tiempo: 'Continuo'
      }
    ],
    organismos_autorizados: [
      'FUNDANA',
      'CECODAP',
      'UNICEF',
      'Cruz Roja',
      'Protección Civil',
      'CPNNA',
      'CICPC',
      'Defensoría del Pueblo'
    ]
  }
}

export function getProtocol(tipo: string) {
  return PROTOCOLS[tipo as keyof typeof PROTOCOLS] || null
}

export function validarProtocolo(tipo: string, paso: number): boolean {
  const protocolo = getProtocol(tipo)
  if (!protocolo) return false
  return paso >= 1 && paso <= protocolo.pasos.length
}

export function getProximoPaso(tipo: string, pasoActual: number) {
  const protocolo = getProtocol(tipo)
  if (!protocolo) return null
  return protocolo.pasos.find(p => p.paso === pasoActual + 1) || null
}
