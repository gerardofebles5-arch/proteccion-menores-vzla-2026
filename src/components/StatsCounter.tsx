'use client'

import { useState, useEffect } from 'react'

export default function StatsCounter() {
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-gray-100 p-4 rounded-lg text-center animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

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
