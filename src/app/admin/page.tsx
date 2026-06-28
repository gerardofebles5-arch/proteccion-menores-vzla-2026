'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Credenciales del superadministrador
    const USUARIO_ADMIN = 'salomon'
    const CLAVE_ADMIN = 'Elsoldemivida1'

    if (usuario === USUARIO_ADMIN && clave === CLAVE_ADMIN) {
      localStorage.setItem('superadmin_token', Date.now().toString())
      localStorage.setItem('superadmin_user', usuario)
      router.push('/admin/dashboard')
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4">🔐 Acceso Superadministrador</h1>
        <p className="text-gray-400 mb-6 text-sm">
          Acceso restringido al propietario del sistema.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-red-500"
              placeholder="Usuario"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-red-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900 border-l-4 border-red-500 p-3 rounded">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg"
          >
            ACCEDER
          </button>
        </form>
      </div>
    </div>
  )
}
