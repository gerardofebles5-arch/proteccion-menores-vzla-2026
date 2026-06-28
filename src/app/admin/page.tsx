'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Clave secreta del superadministrador (NO en código, usar variable de entorno)
    const CLAVE_SECRETA = process.env.NEXT_PUBLIC_ADMIN_KEY || 'SUPER-ADMIN-2026'

    if (clave === CLAVE_SECRETA) {
      localStorage.setItem('superadmin_token', Date.now().toString())
      router.push('/admin/dashboard')
    } else {
      setError('Clave incorrecta')
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
              Clave de Acceso
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
