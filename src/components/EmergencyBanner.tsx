'use client'

import { AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function EmergencyBanner() {
  const [showBanner, setShowBanner] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false)
    }, 10000) // Oculta después de 10 segundos

    return () => clearTimeout(timer)
  }, [])

  if (!showBanner) return null

  return (
    <div className="bg-red-600 text-white py-2 px-4 animate-pulse">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle size={20} />
          <span className="font-bold">EMERGENCIA NACIONAL ACTIVA</span>
        </div>
        <div className="text-sm">
          <span>⚠️ No entregues niños sin verificación • Reporta a 911</span>
        </div>
        <button 
          onClick={() => setShowBanner(false)}
          className="text-white hover:text-gray-200"
          aria-label="Cerrar alerta"
        >
          ✕
        </button>
      </div>
    </div>
  )
}