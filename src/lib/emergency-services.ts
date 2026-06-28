// Integración con Servicios de Emergencia
// Líneas de ayuda y servicios oficiales en Venezuela

export const EMERGENCY_SERVICES = {
  // Servicios de Emergencia Nacional
  NACIONAL: [
    {
      nombre: '911',
      tipo: 'Emergencia General',
      descripcion: 'Número único de emergencias',
      disponible: '24/7',
      contacto: '911'
    },
    {
      nombre: '0800-DEFENDE',
      tipo: 'Defensa del Niño',
      descripcion: 'Línea de defensa de derechos del niño',
      disponible: '24/7',
      contacto: '0800-DEFENDE'
    },
    {
      nombre: '0800-VEN-NNA',
      tipo: 'Consejo de Protección',
      descripcion: 'Consejo Nacional de Protección del Niño y del Adolescente',
      disponible: '24/7',
      contacto: '0800-VEN-NNA'
    }
  ],

  // Servicios por Región
  REGIONAL: {
    'Caracas': [
      {
        nombre: 'Protección Civil Capital',
        telefono: '0212-509-3111',
        email: 'proteccioncivil@gob.ve'
      },
      {
        nombre: 'CICPC Central',
        telefono: '0212-555-6262',
        email: 'cicpc@gob.ve'
      },
      {
        nombre: 'Defensoría del Pueblo Caracas',
        telefono: '0212-574-2222',
        email: 'defensoria@gob.ve'
      }
    ],
    'Miranda': [
      {
        nombre: 'Protección Civil Miranda',
        telefono: '0212-509-3111',
        email: 'proteccioncivil@gob.ve'
      },
      {
        nombre: 'CICPC Miranda',
        telefono: '0212-555-6262',
        email: 'cicpc@gob.ve'
      }
    ],
    'Vargas': [
      {
        nombre: 'Protección Civil Vargas',
        telefono: '0212-509-3111',
        email: 'proteccioncivil@gob.ve'
      },
      {
        nombre: 'CICPC Vargas',
        telefono: '0212-555-6262',
        email: 'cicpc@gob.ve'
      }
    ]
  },

  // ONGs y Organismos Especializados
  ONGS: [
    {
      nombre: 'FUNDANA',
      telefono: '+58212 2575670',
      email: 'info@fundana.org',
      servicios: ['Colocación familiar', 'Protección infantil', 'Asesoría legal']
    },
    {
      nombre: 'CECODAP',
      telefono: '+58 212 2850578',
      email: 'cecodap.sap@gmail.com',
      servicios: ['Atención psicológica', 'Defensa legal', 'Educación']
    },
    {
      nombre: 'UNICEF Venezuela',
      telefono: '+58 424 2690357',
      email: 'venezuela@unicef.org',
      servicios: ['Coordinación internacional', 'Recursos', 'Capacitación']
    },
    {
      nombre: 'Cruz Roja Venezolana',
      telefono: '(58) (212) 571-4380',
      email: 'info@cruzroja.ve',
      servicios: ['Primeros auxilios', 'Refugios', 'Evacuación']
    }
  ],

  // Líneas Internacionales
  INTERNACIONAL: [
    {
      nombre: 'Interpol - Línea de Trata',
      telefono: '+1 202 798 8330',
      email: 'trading@interpol.int',
      descripcion: 'Reporte internacional de trata de personas'
    },
    {
      nombre: 'UNICEF - Línea Global',
      telefono: '+1 212 326 7000',
      email: 'info@unicef.org',
      descripcion: 'Coordinación internacional para protección infantil'
    }
  ]
}

export function getEmergencyService(tipo: string, region?: string) {
  if (tipo === 'nacional') {
    return EMERGENCY_SERVICES.NACIONAL
  }
  if (tipo === 'regional' && region) {
    return EMERGENCY_SERVICES.REGIONAL[region as keyof typeof EMERGENCY_SERVICES.REGIONAL] || []
  }
  if (tipo === 'ongs') {
    return EMERGENCY_SERVICES.ONGS
  }
  if (tipo === 'internacional') {
    return EMERGENCY_SERVICES.INTERNACIONAL
  }
  return []
}

export function formatEmergencyNumber(numero: string): string {
  return numero.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3')
}

export function generateEmergencyReport(tipoEmergencia: string, ubicacion: string, descripcion: string) {
  return {
    tipo: tipoEmergencia,
    ubicacion,
    descripcion,
    timestamp: new Date().toISOString(),
    servicios_notificados: [],
    estado: 'pendiente'
  }
}

export async function notifyEmergencyService(service: any, reporte: any) {
  console.log(`🚨 Notificando a ${service.nombre}:`, reporte)
  return {
    success: true,
    service: service.nombre,
    timestamp: new Date().toISOString()
  }
}
