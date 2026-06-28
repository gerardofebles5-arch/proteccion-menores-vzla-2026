'use client'

import { useState, useEffect } from 'react'
import { MapPin, AlertTriangle, Home, Users } from 'lucide-react'

export default function MapaDashboardPage() {
  const [markers, setMarkers] = useState<any[]>([])
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    // Simular datos de ubicaciones en tiempo real
    const mockData = [
      { id: 1, tipo: 'reporte', lat: 10.4806, lng: -66.9036, descripcion: 'Reporte urgente - Caracas', estado: 'activo' },
      { id: 2, tipo: 'menor', lat: 10.4910, lng: -66.8748, descripcion: 'Menor hallado - Los Ruices', estado: 'activo' },
      { id: 3, tipo: 'refugio', lat: 10.4760, lng: -66.8920, descripcion: 'Refugio activo - Petare', estado: 'activo' },
      { id: 4, tipo: 'reporte', lat: 10.5050, lng: -66.9150, descripcion: 'Sospecha de trata - El Cafetal', estado: 'critico' },
      { id: 5, tipo: 'menor', lat: 10.4680, lng: -66.8800, descripcion: 'Menor desaparecido - La Trinidad', estado: 'busqueda' },
    ]
    setMarkers(mockData)
  }, [])

  const filteredMarkers = filter === 'todos' ? markers : markers.filter(m => m.tipo === filter)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🗺️ Mapa en Tiempo Real</h1>
      
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setFilter('todos')}
          className={`px-4 py-2 rounded ${filter === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('reporte')}
          className={`px-4 py-2 rounded ${filter === 'reporte' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
        >
          Reportes
        </button>
        <button
          onClick={() => setFilter('menor')}
          className={`px-4 py-2 rounded ${filter === 'menor' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Menores
        </button>
        <button
          onClick={() => setFilter('refugio')}
          className={`px-4 py-2 rounded ${filter === 'refugio' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Refugios
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-red-600" />
            <span className="font-bold text-red-800">Reportes Activos</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{markers.filter(m => m.tipo === 'reporte').length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="text-blue-600" />
            <span className="font-bold text-blue-800">Menores en Sistema</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{markers.filter(m => m.tipo === 'menor').length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Home className="text-green-600" />
            <span className="font-bold text-green-800">Refugios Activos</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{markers.filter(m => m.tipo === 'refugio').length}</p>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg h-96 relative overflow-hidden">
        {/* Placeholder de mapa - en producción usaría Leaflet o Google Maps */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 text-gray-400" size={48} />
            <p className="text-gray-500">Mapa interactivo en tiempo real</p>
            <p className="text-sm text-gray-400">Integrar con Leaflet/Google Maps para funcionalidad completa</p>
          </div>
        </div>

        {/* Marcadores simulados */}
        {filteredMarkers.map((marker) => (
          <div
            key={marker.id}
            className="absolute cursor-pointer group"
            style={{
              left: `${(marker.lng + 67) * 10}%`,
              top: `${(marker.lat - 10.4) * 100}%`
            }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              marker.tipo === 'reporte' ? 'bg-red-500' :
              marker.tipo === 'menor' ? 'bg-blue-500' :
              'bg-green-500'
            }`}>
              <MapPin className="text-white" size={16} />
            </div>
            <div className="hidden group-hover:block absolute bg-white p-2 rounded shadow-lg text-xs w-48 z-10">
              <p className="font-bold">{marker.descripcion}</p>
              <p className="text-gray-500">Estado: {marker.estado}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Últimas actualizaciones</h3>
        <div className="space-y-2">
          {markers.slice(0, 3).map((marker) => (
            <div key={marker.id} className="bg-white p-3 rounded border flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                marker.estado === 'critico' ? 'bg-red-500' :
                marker.estado === 'activo' ? 'bg-green-500' :
                'bg-yellow-500'
              }`} />
              <div className="flex-1">
                <p className="font-medium">{marker.descripcion}</p>
                <p className="text-sm text-gray-500">Hace 5 minutos</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                marker.tipo === 'reporte' ? 'bg-red-100 text-red-800' :
                marker.tipo === 'menor' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {marker.tipo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
