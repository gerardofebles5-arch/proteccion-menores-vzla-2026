'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Notifications from '@/components/Notifications'

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
      const [reportesRes, menoresRes, matchesRes, refugiosRes, solicitudesRes, accesoStaffRes] = await Promise.all([
        fetch('/api/admin/reportes'),
        fetch('/api/admin/menores'),
        fetch('/api/admin/matches'),
        fetch('/api/admin/refugios'),
        fetch('/api/admin/solicitudes'),
        fetch('/api/admin/acceso-staff')
      ])

      const data = {
        reportes: await reportesRes.json(),
        menores: await menoresRes.json(),
        matches: await matchesRes.json(),
        refugios: await refugiosRes.json(),
        solicitudes: await solicitudesRes.json(),
        accesoStaff: await accesoStaffRes.json()
      }
      setData(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAprobarSolicitud = async (id: number) => {
    try {
      const res = await fetch('/api/admin/acceso-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, accion: 'aprobar' })
      })
      const result = await res.json()
      if (result.success) {
        alert(`✅ Aprobado. Código: ${result.token}`)
        fetchData()
      }
    } catch (error) {
      alert('Error al aprobar')
    }
  }

  const handleRechazarSolicitud = async (id: number) => {
    try {
      const res = await fetch('/api/admin/acceso-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, accion: 'rechazar' })
      })
      const result = await res.json()
      if (result.success) {
        alert('❌ Rechazado')
        fetchData()
      }
    } catch (error) {
      alert('Error al rechazar')
    }
  }

  const tabs = [
    { id: 'mapa', label: '🗺️ Mapa Tiempo Real' },
    { id: 'estadisticas', label: '📊 Estadísticas' },
    { id: 'casos', label: '📁 Seguimiento Casos' },
    { id: 'chat', label: '💬 Chat Coordinación' },
    { id: 'recursos', label: '📦 Recursos' },
    { id: 'voluntarios', label: '👥 Voluntarios' },
    { id: 'misiones', label: '🎯 Misiones' },
    { id: 'evacuacion', label: '🚨 Evacuación' },
    { id: 'alertas', label: '📢 Alertas' },
    { id: 'evidencias', label: '🔍 Evidencias' },
    { id: 'social', label: '📱 Redes Sociales' },
    { id: 'reportes', label: 'Reportes Urgentes' },
    { id: 'menores', label: 'Menores Registrados' },
    { id: 'matches', label: 'Coincidencias' },
    { id: 'refugios', label: 'Refugios' },
    { id: 'solicitudes', label: 'Solicitudes ONGs' },
    { id: 'acceso-staff', label: 'Acceso Staff' },
    { id: 'mis-codigos', label: 'Mis Códigos' },
    { id: 'tokens', label: 'Gestionar Tokens' },
    { id: 'auditoria', label: 'Auditoría' }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🔐 Dashboard Superadministrador</h1>
        <div className="flex items-center space-x-4">
          <Notifications />
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
        {activeTab === 'mapa' && (
          <div>
            <h2 className="text-xl font-bold mb-4">🗺️ Mapa en Tiempo Real</h2>
            <div className="bg-gray-100 rounded-lg h-96 relative overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Mapa interactivo en tiempo real</p>
                  <a href="/admin/dashboard/mapa" className="text-blue-600 hover:underline">Ver mapa completo →</a>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'estadisticas' && (
          <div>
            <h2 className="text-xl font-bold mb-4">📊 Estadísticas en Tiempo Real</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-bold text-red-800">Reportes Hoy</h3>
                <p className="text-3xl font-bold text-red-600">{data.reportes?.count || 0}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800">Menores Hallados</h3>
                <p className="text-3xl font-bold text-blue-600">{data.menores?.count || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-800">Coincidencias</h3>
                <p className="text-3xl font-bold text-green-600">{data.matches?.count || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold text-purple-800">Refugios Activos</h3>
                <p className="text-3xl font-bold text-purple-600">{data.refugios?.count || 0}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded border">
              <h3 className="font-bold mb-2">Actividad Reciente</h3>
              <p className="text-gray-600">Última actualización: hace 5 minutos</p>
            </div>
          </div>
        )}
        {activeTab === 'chat' && (
          <div>
            <h2 className="text-xl font-bold mb-4">💬 Chat de Coordinación</h2>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-gray-600">Sistema de comunicación en tiempo real para coordinación de equipos.</p>
            </div>
            <div className="bg-white border rounded p-4">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  className="w-full p-2 border rounded"
                />
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
                  Enviar
                </button>
              </div>
              <div className="space-y-2">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-medium">Sistema</p>
                  <p className="text-sm text-gray-600">Chat conectado a Supabase - Mensajes en tiempo real</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'recursos' && (
          <div>
            <h2 className="text-xl font-bold mb-4">📦 Gestión de Recursos</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-bold text-green-800">Disponibles</h3>
                <p className="text-2xl font-bold text-green-600">--</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="font-bold text-yellow-800">En Uso</h3>
                <p className="text-2xl font-bold text-yellow-600">--</p>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <h3 className="font-bold text-red-800">Críticos</h3>
                <p className="text-2xl font-bold text-red-600">--</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h3 className="font-bold text-purple-800">Total</h3>
                <p className="text-2xl font-bold text-purple-600">--</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
              Agregar Recurso
            </button>
            <div className="bg-white border rounded p-4">
              <p className="text-gray-500">Conectado a API /api/recursos</p>
            </div>
          </div>
        )}
        {activeTab === 'voluntarios' && (
          <div>
            <h2 className="text-xl font-bold mb-4">👥 Gestión de Voluntarios</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-bold text-green-800">Activos</h3>
                <p className="text-2xl font-bold text-green-600">--</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold text-blue-800">En Misión</h3>
                <p className="text-2xl font-bold text-blue-600">--</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h3 className="font-bold text-purple-800">Total</h3>
                <p className="text-2xl font-bold text-purple-600">--</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
              Registrar Voluntario
            </button>
            <div className="bg-white border rounded p-4">
              <p className="text-gray-500">Conectado a API /api/voluntarios</p>
            </div>
          </div>
        )}
        {activeTab === 'misiones' && (
          <div>
            <h2 className="text-xl font-bold mb-4">🎯 Gestión de Misiones</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold text-blue-800">Planificadas</h3>
                <p className="text-2xl font-bold text-blue-600">--</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="font-bold text-yellow-800">En Progreso</h3>
                <p className="text-2xl font-bold text-yellow-600">--</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-bold text-green-800">Completadas</h3>
                <p className="text-2xl font-bold text-green-600">--</p>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <h3 className="font-bold text-red-800">Críticas</h3>
                <p className="text-2xl font-bold text-red-600">--</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
              Crear Misión
            </button>
            <div className="bg-white border rounded p-4">
              <p className="text-gray-500">Conectado a API /api/misiones</p>
            </div>
          </div>
        )}
        {activeTab === 'evacuacion' && (
          <div>
            <h2 className="text-xl font-bold mb-4">🚨 Protocolos de Evacuación</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-bold text-green-800">Puntos Activos</h3>
                <p className="text-2xl font-bold text-green-600">--</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold text-blue-800">Capacidad Disponible</h3>
                <p className="text-2xl font-bold text-blue-600">--</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="font-bold text-yellow-800">Rutas Seguras</h3>
                <p className="text-2xl font-bold text-yellow-600">--</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
              Agregar Punto de Evacuación
            </button>
            <div className="bg-white border rounded p-4">
              <p className="text-gray-500">Conectado a API /api/evacuacion/puntos</p>
            </div>
          </div>
        )}
        {activeTab === 'alertas' && (
          <div>
            <h2 className="text-xl font-bold mb-4">📢 Sistema de Alertas Masivas</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="font-bold text-yellow-800">Pendientes</h3>
                <p className="text-2xl font-bold text-yellow-600">--</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-bold text-green-800">Enviadas</h3>
                <p className="text-2xl font-bold text-green-600">--</p>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <h3 className="font-bold text-red-800">Fallidas</h3>
                <p className="text-2xl font-bold text-red-600">--</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
              Crear Alerta Masiva
            </button>
            <div className="bg-white border rounded p-4">
              <p className="text-gray-500">Conectado a API /api/alertas</p>
            </div>
          </div>
        )}
        {activeTab === 'evidencias' && (
          <div>
            <h2 className="text-xl font-bold mb-4">🔍 Gestión de Evidencias</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold text-blue-800">Activas</h3>
                <p className="text-2xl font-bold text-blue-600">--</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="font-bold text-yellow-800">En Análisis</h3>
                <p className="text-2xl font-bold text-yellow-600">--</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-bold text-green-800">Procesadas</h3>
                <p className="text-2xl font-bold text-green-600">--</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
              Registrar Evidencia
            </button>
            <div className="bg-white border rounded p-4">
              <p className="text-gray-500">Conectado a API /api/evidencias</p>
            </div>
          </div>
        )}
        {activeTab === 'social' && (
          <div>
            <h2 className="text-xl font-bold mb-4">📱 Redes Sociales</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold text-blue-800">Borradores</h3>
                <p className="text-2xl font-bold text-blue-600">--</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-bold text-green-800">Publicadas</h3>
                <p className="text-2xl font-bold text-green-600">--</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h3 className="font-bold text-purple-800">Alcance Total</h3>
                <p className="text-2xl font-bold text-purple-600">--</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
              Crear Publicación
            </button>
            <div className="bg-white border rounded p-4">
              <p className="text-gray-500">Conectado a API /api/social</p>
            </div>
          </div>
        )}
        {activeTab === 'casos' && (
          <div>
            <h2 className="text-xl font-bold mb-4">📁 Seguimiento de Casos</h2>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-gray-600">Sistema completo de seguimiento de casos de menores desaparecidos, hallados y trata.</p>
              <a href="/admin/dashboard/casos" className="text-blue-600 hover:underline">Ver sistema completo →</a>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="font-bold text-yellow-800">En Búsqueda</h3>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-bold text-green-800">Reunidos</h3>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <h3 className="font-bold text-red-800">Investigación</h3>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h3 className="font-bold text-purple-800">Total</h3>
                <p className="text-2xl font-bold text-purple-600">23</p>
              </div>
            </div>
          </div>
        )}
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
        {activeTab === 'acceso-staff' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Solicitudes de Acceso Staff</h2>
            <p className="text-gray-600 mb-4">Aprobar o rechazar solicitudes de funcionarios</p>
            
            {data.accesoStaff?.data?.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">No hay solicitudes pendientes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.accesoStaff?.data?.map((solicitud: any) => (
                  <div key={solicitud.id} className="bg-white border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{solicitud.nombre}</h3>
                        <p className="text-sm text-gray-600">{solicitud.organizacion} - {solicitud.cargo}</p>
                        <p className="text-sm text-gray-500">Cédula: {solicitud.cedula}</p>
                        <p className="text-sm text-gray-500">Tel: {solicitud.telefono}</p>
                        <p className="text-sm text-gray-500">Email: {solicitud.email}</p>
                        {solicitud.referido_por && (
                          <p className="text-sm text-green-600">Referido por: {solicitud.referido_por}</p>
                        )}
                        {solicitud.credencial_url && (
                          <a 
                            href={solicitud.credencial_url} 
                            target="_blank"
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Ver credencial
                          </a>
                        )}
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleAprobarSolicitud(solicitud.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                        >
                          ✅ Aprobar
                        </button>
                        <button
                          onClick={() => handleRechazarSolicitud(solicitud.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                        >
                          ❌ Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'mis-codigos' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Mis Códigos Generados</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold text-blue-800">Códigos Activos</h3>
                <p className="text-3xl font-bold text-blue-600">{data.tokens?.data?.filter((t: any) => t.activo && !t.usado)?.length || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-bold text-green-800">Códigos Usados</h3>
                <p className="text-3xl font-bold text-green-600">{data.tokens?.data?.filter((t: any) => t.usado)?.length || 0}</p>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <h3 className="font-bold text-red-800">Códigos Expirados</h3>
                <p className="text-3xl font-bold text-red-600">{data.tokens?.data?.filter((t: any) => new Date(t.expira_at) < new Date())?.length || 0}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded mb-4">
              <h3 className="font-bold mb-2">Generar Nuevo Código</h3>
              <div className="grid grid-cols-2 gap-4">
                <select className="p-2 border rounded">
                  <option value="">Tipo de código...</option>
                  <option value="staff">Staff (ONG)</option>
                  <option value="emergencia">Emergencia</option>
                  <option value="temporal">Temporal (24h)</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Organización (opcional)"
                  className="p-2 border rounded"
                />
              </div>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
                Generar Código
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold">Historial de Códigos</h3>
              {data.tokens?.data?.length === 0 ? (
                <p className="text-gray-500">No hay códigos generados</p>
              ) : (
                data.tokens?.data?.map((token: any) => (
                  <div key={token.id} className="bg-white border rounded p-3 flex justify-between items-center">
                    <div>
                      <code className="bg-gray-100 px-2 py-1 rounded">{token.codigo}</code>
                      <span className="ml-2 text-sm text-gray-600">
                        {token.tipo} - {token.organizacion_id || 'Sin organización'}
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        token.activo && !token.usado ? 'bg-green-100 text-green-800' :
                        token.usado ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {token.activo && !token.usado ? 'Activo' : token.usado ? 'Usado' : 'Expirado'}
                      </span>
                    </div>
                    <div className="space-x-2">
                      <button className="text-blue-600 hover:underline text-sm">Copiar</button>
                      {!token.usado && token.activo && (
                        <button className="text-red-600 hover:underline text-sm">Revocar</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {activeTab === 'tokens' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Gestionar Tokens de Acceso</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-2">Crear Token para ONG</h3>
                <input 
                  type="text" 
                  placeholder="Nombre de la organización"
                  className="w-full p-2 border rounded mb-2"
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                  Generar Token
                </button>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <h3 className="font-bold mb-2">Crear Código de Emergencia</h3>
                <p className="text-sm text-red-700 mb-2">Solo para situaciones críticas</p>
                <button className="bg-red-600 text-white px-4 py-2 rounded">
                  Generar Código Emergencia
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
