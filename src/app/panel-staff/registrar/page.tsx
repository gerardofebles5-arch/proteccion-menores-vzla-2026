'use client'

import { useState } from 'react'

export default function RegistrarPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    genero: '',
    lugar_hallado: '',
    refugio: '',
    observaciones: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/menores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`✅ Menor registrado. Código: ${result.codigo}`)
        setFormData({ nombre: '', edad: '', genero: '', lugar_hallado: '', refugio: '', observaciones: '' })
      } else {
        alert('❌ Error al registrar')
      }
    } catch (error) {
      alert('❌ Error de conexión')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">👶 Registrar Menor Hallado</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Edad *</label>
            <input
              type="number"
              required
              value={formData.edad}
              onChange={(e) => setFormData({...formData, edad: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
            <select
              value={formData.genero}
              onChange={(e) => setFormData({...formData, genero: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">-</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Refugio</label>
            <input
              type="text"
              value={formData.refugio}
              onChange={(e) => setFormData({...formData, refugio: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nombre del refugio"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lugar donde fue hallado *</label>
          <input
            type="text"
            required
            value={formData.lugar_hallado}
            onChange={(e) => setFormData({...formData, lugar_hallado: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded"
        >
          REGISTRAR MENOR
        </button>
      </form>
    </div>
  )
}
