'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AccesoPage() {
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">🔐 Acceso Staff</h1>
        <p className="text-gray-600 mb-6">
          Ingrese el código temporal proporcionado por su organización verificada.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-500 text-center">
            ¿No tiene código? Contacte a su organización (FUNDANA, CECODAP, UNICEF).
          </p>
        </div>
      </div>
    </div>
  )
}
