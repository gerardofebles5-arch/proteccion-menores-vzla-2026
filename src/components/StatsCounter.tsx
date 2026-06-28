'use client'

import { useState, useEffect } from 'react'

export default function StatsCounter() {
  const [stats, setStats] = useState({
    menoresActivos: 0,
    reportesHoy: 0,
    matchesPendientes: 0,
    refugiosActivos: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        menoresActivos: Math.min(prev.menoresActivos + 1, 847),
        reportesHoy: Math.min(prev.reportesHoy + 1, 156),
        matchesPendientes: Math.min(prev.matchesPendientes + 1, 23),
        refugiosActivos: Math.min(prev.refugiosActivos + 1, 42)
      }))
    }, 100)

    setTimeout(() => clearInterval(interval), 2000)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-blue-600">{stats.menoresActivos}</div>
        <div className="text-sm text-gray-600">Menores Registrados</div>
      </div>
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-red-600">{stats.reportesHoy}</div>
        <div className="text-sm text-gray-600">Reportes Hoy</div>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-yellow-600">{stats.matchesPendientes}</div>
        <div className="text-sm text-gray-600">Matches Pendientes</div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-green-600">{stats.refugiosActivos}</div>
        <div className="text-sm text-gray-600">Refugios Activos</div>
      </div>
    </div>
  )
}
