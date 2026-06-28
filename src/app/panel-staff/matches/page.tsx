'use client'

import { useState, useEffect } from 'react'

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/matches')
      const data = await res.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Cargando coincidencias...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🔍 Coincidencias Detectadas</h1>
      
      {matches.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-lg">
          <p className="text-yellow-700">No hay coincidencias pendientes de revisión.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">Match #{match.codigo}</h3>
                  <p className="text-gray-600">Confianza: {match.confianza}%</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Menor reportado: {match.menor_reportado?.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    Menor hallado: {match.menor_hallado?.nombre}
                  </p>
                </div>
                <div className="space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    ✅ Aprobar
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                    ❌ Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
 )
}
