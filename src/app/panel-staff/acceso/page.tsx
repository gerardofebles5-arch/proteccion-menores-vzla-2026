'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AccesoPage() {
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const [modo, setModo] = useState('codigo') // 'codigo' | 'registro' | 'emergencia'
  const router = useRouter()

  const handleSubmitCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/auth/verificar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo })
      })

      const data = await response.json()

      if (data.valido) {
        localStorage.setItem('staff_token', data.token)
        router.push('/panel-staff')
      } else {
        setError('Código inválido o expirado')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  const handleSubmitEmergencia = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/auth/emergencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo })
      })

      const data = await response.json()

      if (data.valido) {
        localStorage.setItem('staff_token', data.token)
        localStorage.setItem('emergency_access', 'true')
        router.push('/panel-staff')
      } else {
        setError('Código de emergencia inválido')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">🔐 Acceso Staff</h1>
        
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setModo('codigo')}
            className={`flex-1 py-2 px-4 rounded-lg ${modo === 'codigo' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Código
          </button>
          <button
            onClick={() => setModo('registro')}
            className={`flex-1 py-2 px-4 rounded-lg ${modo === 'registro' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Registrarse
          </button>
          <button
            onClick={() => setModo('emergencia')}
            className={`flex-1 py-2 px-4 rounded-lg ${modo === 'emergencia' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            🚨 Emergencia
          </button>
        </div>

        {modo === 'codigo' && (
          <>
            <p className="text-gray-600 mb-6">
              Ingrese el código temporal proporcionado por su organización verificada.
            </p>

            <form onSubmit={handleSubmitCodigo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Acceso
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="Ej: STAFF-ABC123"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
              >
                ACCEDER
              </button>
            </form>
          </>
        )}

        {modo === 'registro' && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Solicite acceso verificando su credencial oficial.
            </p>
            <a
              href="/panel-staff/registro"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              SOLICITAR ACCESO
            </a>
          </div>
        )}

        {modo === 'emergencia' && (
          <>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <p className="text-red-700 text-sm font-bold">
                ⚠️ SOLO PARA SITUACIONES DE EMERGENCIA
              </p>
              <p className="text-red-600 text-sm mt-1">
                Use códigos de emergencia proporcionados por el superadministrador.
              </p>
            </div>

            <form onSubmit={handleSubmitEmergencia} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Emergencia
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="Ej: EMERGENCY-XYZ"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg"
              >
                ACCEDER EMERGENCIA
              </button>
            </form>
          </>
        )}

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-500 text-center">
            ¿Problemas? Contacte a su organización o use el formulario de contacto.
          </p>
        </div>
      </div>
    </div>
  )
}
