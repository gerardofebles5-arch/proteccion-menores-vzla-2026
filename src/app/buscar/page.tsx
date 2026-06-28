'use client'

import { useState } from 'react'

export default function BuscarPage() {
  const [formData, setFormData] = useState({
    nombreNino: '',
    edad: '',
    lugarVisto: '',
    telefonoPadre: ''
  })

  const [codigoSeguimiento, setCodigoSeguimiento] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/menores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombreNino,
          edad: parseInt(formData.edad),
          lugar_hallado: formData.lugarVisto,
          telefono_contacto: formData.telefonoPadre,
          refugio_id: 'temporal' // Se asignará cuando se implemente autenticación
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setCodigoSeguimiento(result.codigo)
      } else {
        alert('Error al enviar reporte. Intenta nuevamente.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión. Verifica tu internet.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  if (codigoSeguimiento) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-green-800 mb-4">✅ Reporte Registrado</h1>
          <p className="text-green-700 mb-4">
            Tu reporte ha sido registrado de forma segura en nuestro sistema de doble ciego.
          </p>
          <div className="bg-white p-4 rounded border-2 border-green-300 mb-4">
            <p className="text-sm text-gray-600 mb-1">Código de seguimiento:</p>
            <p className="text-3xl font-mono font-bold text-green-700">{codigoSeguimiento}</p>
          </div>
          <p className="text-sm text-green-600 mb-4">
            Guarda este código. Lo necesitarás para consultar el estado de tu reporte.
          </p>
          <div className="bg-yellow-50 p-4 rounded border border-yellow-300">
            <h3 className="font-bold text-yellow-800 mb-2">⚠️ Importante</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• El sistema buscará coincidencias automáticamente</li>
              <li>• Solo si hay un match probable, te contactaremos</li>
              <li>• Tu información nunca se hace pública</li>
              <li>• Si tienes información urgente, llama al 0800-SECUESTRO</li>
            </ul>
          </div>
          <button
            onClick={() => setCodigoSeguimiento(null)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Registrar otro reporte
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">👶 Reportar Menor Desaparecido</h1>
        <p className="text-gray-600 mb-4 text-sm">
          Formulario rápido para emergencia. Solo campos esenciales.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del niño/a *</label>
            <input
              type="text"
              name="nombreNino"
              required
              value={formData.nombreNino}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Edad *</label>
            <input
              type="number"
              name="edad"
              required
              value={formData.edad}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Años"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lugar donde fue visto *</label>
            <input
              type="text"
              name="lugarVisto"
              required
              value={formData.lugarVisto}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Zona, refugio, dirección"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tu teléfono *</label>
            <input
              type="tel"
              name="telefonoPadre"
              required
              value={formData.telefonoPadre}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="0414-123-4567"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            ENVIAR RÁPIDO
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Sistema seguro y cifrado. Datos protegidos por ONGs verificadas.
        </p>
      </div>
    </div>
  )
}
