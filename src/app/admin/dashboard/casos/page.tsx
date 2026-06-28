'use client'

import { useState } from 'react'
import { Search, Filter, Plus, Eye, Edit, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function CasosDashboardPage() {
  const [casos, setCasos] = useState([
    { id: 1, codigo: 'CAS-001', tipo: 'desaparecido', estado: 'busqueda', menor: 'María González', ubicacion: 'Caracas', fecha: '2026-06-28', prioridad: 'alta' },
    { id: 2, codigo: 'CAS-002', tipo: 'hallado', estado: 'reunion', menor: 'José Rodríguez', ubicacion: 'Los Ruices', fecha: '2026-06-27', prioridad: 'media' },
    { id: 3, codigo: 'CAS-003', tipo: 'trata', estado: 'investigacion', menor: 'Anónimo', ubicacion: 'El Cafetal', fecha: '2026-06-28', prioridad: 'critica' },
    { id: 4, codigo: 'CAS-004', tipo: 'desaparecido', estado: 'busqueda', menor: 'Carlos Méndez', ubicación: 'Petare', fecha: '2026-06-26', prioridad: 'alta' },
  ])

  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  const casosFiltrados = casos.filter(caso => {
    if (filtro !== 'todos' && caso.estado !== filtro) return false
    if (busqueda && !caso.codigo.toLowerCase().includes(busqueda.toLowerCase()) && !caso.menor.toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'busqueda': return <Clock className="text-yellow-600" />
      case 'reunion': return <CheckCircle className="text-green-600" />
      case 'investigacion': return <AlertTriangle className="text-red-600" />
      default: return <Clock className="text-gray-600" />
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-100 text-red-800'
      case 'alta': return 'bg-orange-100 text-orange-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📁 Seguimiento de Casos</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2">
          <Plus size={20} />
          <span>Nuevo Caso</span>
        </button>
      </div>

      <div className="mb-6 flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="todos">Todos los estados</option>
          <option value="busqueda">En búsqueda</option>
          <option value="reunion">Reunión familiar</option>
          <option value="investigacion">Investigación</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-bold text-yellow-800">En Búsqueda</h3>
          <p className="text-3xl font-bold text-yellow-600">{casos.filter(c => c.estado === 'busqueda').length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-800">Reunidos</h3>
          <p className="text-3xl font-bold text-green-600">{casos.filter(c => c.estado === 'reunion').length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-bold text-red-800">Investigación</h3>
          <p className="text-3xl font-bold text-red-600">{casos.filter(c => c.estado === 'investigacion').length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-bold text-purple-800">Total Casos</h3>
          <p className="text-3xl font-bold text-purple-600">{casos.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Menor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {casosFiltrados.map((caso) => (
              <tr key={caso.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{caso.codigo}</td>
                <td className="px-6 py-4 capitalize">{caso.tipo}</td>
                <td className="px-6 py-4">{caso.menor}</td>
                <td className="px-6 py-4">{caso.ubicacion}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getEstadoIcon(caso.estado)}
                    <span className="capitalize">{caso.estado}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs capitalize ${getPrioridadColor(caso.prioridad)}`}>
                    {caso.prioridad}
                  </span>
                </td>
                <td className="px-6 py-4">{caso.fecha}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:underline">
                      <Eye size={18} />
                    </button>
                    <button className="text-green-600 hover:underline">
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
