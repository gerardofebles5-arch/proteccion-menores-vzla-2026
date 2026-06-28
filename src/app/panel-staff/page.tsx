'use client'

import { useState, useEffect } from 'react'

export default function PanelStaffPage() {
  const [stats, setStats] = useState({
    menoresActivos: 0,
    reportesHoy: 0,
    matchesPendientes: 0,
    refugiosActivos: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [menoresRes, reportesRes, matchesRes, refugiosRes] = await Promise.all([
        fetch('/api/stats/menores'),
        fetch('/api/stats/reportes'),
        fetch('/api/stats/matches'),
        fetch('/api/stats/refugios')
      ])

      const menores = await menoresRes.json()
      const reportes = await reportesRes.json()
      const matches = await matchesRes.json()
      const refugios = await refugiosRes.json()

      setStats({
        menoresActivos: menores.count || 0,
        reportesHoy: reportes.count || 0,
        matchesPendientes: matches.count || 0,
        refugiosActivos: refugios.count || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🔍 Panel Staff - ONGs Verificadas</h1>
        <p className="text-gray-600">Solo personal autorizado puede ver esta información</p>
      </div>

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

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-left">
            <div className="font-bold">Ver Matches</div>
            <div className="text-sm opacity-80">Revisar coincidencias</div>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-left">
            <div className="font-bold">Registrar Menor</div>
            <div className="text-sm opacity-80">Nuevo hallazgo</div>
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-left">
            <div className="font-bold">Auditoría</div>
            <div className="text-sm opacity-80">Ver accesos</div>
          </button>
        </div>
      </div>
    </div>
  )
}
