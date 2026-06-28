'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('reportes')
  const [data, setData] = useState<any>({})

  useEffect(() => {
    const token = localStorage.getItem('superadmin_token')
    if (!token) {
      router.push('/admin')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [reportesRes, menoresRes, matchesRes, refugiosRes, solicitudesRes] = await Promise.all([
        fetch('/api/admin/reportes'),
        fetch('/api/admin/menores'),
        fetch('/api/admin/matches'),
        fetch('/api/admin/refugios'),
        fetch('/api/admin/solicitudes')
      ])

      const data = {
        reportes: await reportesRes.json(),
        menores: await menoresRes.json(),
        matches: await matchesRes.json(),
        refugios: await refugiosRes.json(),
        solicitudes: await solicitudesRes.json()
      }
      setData(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const tabs = [
    { id: 'reportes', label: 'Reportes Urgentes' },
    { id: 'menores', label: 'Menores Registrados' },
    { id: 'matches', label: 'Coincidencias' },
    { id: 'refugios', label: 'Refugios' },
    { id: 'solicitudes', label: 'Solicitudes ONGs' },
    { id: 'tokens', label: 'Gestionar Tokens' },
    { id: 'auditoria', label: 'Auditoría' }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🔐 Dashboard Superadministrador</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('superadmin_token')
            router.push('/')
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {activeTab === 'reportes' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Reportes Urgentes</h2>
            <p className="text-gray-600">Total: {data.reportes?.count || 0}</p>
            {/* Lista de reportes */}
          </div>
        )}
        {activeTab === 'menores' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Menores Registrados</h2>
            <p className="text-gray-600">Total: {data.menores?.count || 0}</p>
            {/* Lista de menores */}
          </div>
        )}
        {activeTab === 'matches' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Coincidencias</h2>
            <p className="text-gray-600">Total: {data.matches?.count || 0}</p>
            {/* Lista de matches */}
          </div>
        )}
        {activeTab === 'refugios' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Refugios Activos</h2>
            <p className="text-gray-600">Total: {data.refugios?.count || 0}</p>
            {/* Lista de refugios */}
          </div>
        )}
        {activeTab === 'solicitudes' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Solicitudes de Organismos</h2>
            <p className="text-gray-600">Total: {data.solicitudes?.count || 0}</p>
            {/* Lista de solicitudes */}
          </div>
        )}
        {activeTab === 'tokens' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Gestionar Tokens de Acceso</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-2">Crear Nuevo Token</h3>
                <input 
                  type="text" 
                  placeholder="Nombre de la organización"
                  className="w-full p-2 border rounded mb-2"
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                  Generar Token
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'auditoria' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Auditoría Completa</h2>
            <p className="text-gray-600">Registro de todos los accesos al sistema</p>
            {/* Tabla de auditoría */}
          </div>
        )}
      </div>
    </div>
  )
}
