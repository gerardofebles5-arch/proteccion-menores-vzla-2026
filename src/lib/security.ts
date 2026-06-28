// Sistema de Seguridad Extrema para Protección de Menores
// Nivel: Militar/Crítico

import crypto from 'crypto'

// Claves de cifrado (deben estar en variables de entorno)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const IV_LENGTH = 16

// Lista negra de IPs conocidas de tratantes
const BLACKLISTED_IPS: string[] = [
  // IPs de redes de trata conocidas (ejemplo)
  // Se puede expandir con bases de datos de interpol
]

// Países de alto riesgo para trata
const HIGH_RISK_COUNTRIES = [
  'XX', // Código de país para países de alto riesgo
  // Se puede expandir con datos de interpol/onu
]

// Patrones de comportamiento sospechoso
const SUSPICIOUS_PATTERNS = {
  multipleReportsSameIP: 3, // Más de 3 reportes desde misma IP en 1 hora
  rapidAccessAttempts: 5, // Más de 5 intentos de acceso en 1 minuto
  unusualDataAccess: 10, // Acceso a más de 10 registros en 1 minuto
  locationMismatch: true, // IP no coincide con ubicación reportada
  timeAnomaly: true, // Acceso en horarios inusuales (2am-5am)
  bulkDataRequests: true // Solicitudes masivas de datos
}

// Cifrado AES-256-GCM
export function encryptData(data: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv)
  
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
}

// Descifrado AES-256-GCM
export function decryptData(encryptedData: string): string {
  const parts = encryptedData.split(':')
  const iv = Buffer.from(parts[0], 'hex')
  const authTag = Buffer.from(parts[1], 'hex')
  const encrypted = parts[2]
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

// Hash de datos sensibles (para comparación sin revelar datos)
export function hashSensitiveData(data: string): string {
  return crypto.createHash('sha256').update(data + process.env.SALT || 'default-salt').digest('hex')
}

// Generación de token seguro
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Validación de IP
export function isIPBlacklisted(ip: string): boolean {
  return BLACKLISTED_IPS.includes(ip)
}

// Detección de VPN/Proxy
export function detectVPN(ip: string): boolean {
  // Implementación básica - se puede mejorar con servicios externos
  const vpnIndicators = ['vpn', 'proxy', 'tor', 'vps']
  return vpnIndicators.some(indicator => ip.toLowerCase().includes(indicator))
}

// Validación de geolocalización
export function validateGeolocation(userLocation: any, ipLocation: any): boolean {
  // Verificar que la ubicación reportada coincida con la IP
  const distance = calculateDistance(
    userLocation.lat, userLocation.lng,
    ipLocation.lat, ipLocation.lng
  )
  
  // Si la distancia es mayor a 50km, es sospechoso
  return distance <= 50
}

// Cálculo de distancia entre dos coordenadas (Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radio de la tierra en km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Sistema de reputación dinámica
export class ReputationSystem {
  private scores: Map<string, number> = new Map()
  
  constructor() {
    this.loadScores()
  }
  
  private loadScores() {
    // Cargar puntuaciones de base de datos
  }
  
  public updateScore(userId: string, action: 'positive' | 'negative', weight: number = 1) {
    const currentScore = this.scores.get(userId) || 50 // Base 
    const change = action === 'positive' ? weight : -weight
    const newScore = Math.max(0, Math.min(100, currentScore + change))
    this.scores.set(userId, newScore)
    this.saveScore(userId, newScore)
  }
  
  public getScore(userId: string): number {
    return this.scores.get(userId) || 50
  }
  
  public isTrusted(userId: string): boolean {
    return this.getScore(userId) >= 70
  }
  
  public isSuspicious(userId: string): boolean {
    return this.getScore(userId) <= 30
  }
  
  private saveScore(userId: string, score: number) {
    // Guardar en base de datos
  }
}

// Sistema de alertas tempranas
export class EarlyWarningSystem {
  private alerts: Array<any> = []
  
  public checkForAnomalies(userId: string, action: string, context: any): boolean {
    const anomalies = []
    
    // Verificar velocidad de acciones
    if (this.isTooFast(userId, action)) {
      anomalies.push('Velocidad de acciones sospechosa')
    }
    
    // Verificar patrón de acceso
    if (this.hasUnusualPattern(userId, action)) {
      anomalies.push('Patrón de acceso inusual')
    }
    
    // Verificar acceso a datos sensibles
    if (this.isAccessingSensitiveData(userId, action)) {
      anomalies.push('Acceso a datos sensibles')
    }
    
    if (anomalies.length > 0) {
      this.triggerAlert(userId, anomalies, context)
      return true
    }
    
    return false
  }
  
  private isTooFast(userId: string, action: string): boolean {
    // Implementar lógica de velocidad
    return false
  }
  
  private hasUnusualPattern(userId: string, action: string): boolean {
    // Implementar lógica de patrones
    return false
  }
  
  private isAccessingSensitiveData(userId: string, action: string): boolean {
    const sensitiveActions = ['view_all_children', 'export_data', 'bulk_access']
    return sensitiveActions.includes(action)
  }
  
  private triggerAlert(userId: string, anomalies: string[], context: any) {
    const alert = {
      userId,
      anomalies,
      context,
      timestamp: new Date(),
      severity: anomalies.length > 2 ? 'critical' : 'warning'
    }
    
    this.alerts.push(alert)
    this.notifyAdmin(alert)
  }
  
  private notifyAdmin(alert: any) {
    // Notificar al administrador
    console.log('🚨 ALERTA DE SEGURIDAD:', alert)
  }
}

// Singleton instances
export const reputationSystem = new ReputationSystem()
export const earlyWarningSystem = new EarlyWarningSystem()
