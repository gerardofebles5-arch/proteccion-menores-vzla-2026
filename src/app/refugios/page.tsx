'use client'

import { useState } from 'react'

export default function RefugiosPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    capacidad: '',
    ocupacion_actual: '',
    contacto: '',
    telefono: '',
    tipo: 'general'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/refugios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      
      if (result.success) {
        alert('✅ Refugio registrado. Gracias por reportar.')
        setFormData({ nombre: '', direccion: '', capacidad: '', ocupacion_actual: '', contacto: '', telefono: '', tipo: 'general' })
      } else {
        alert('❌ Error al registrar')
      }
    } catch (error) {
      alert('❌ Error de conexión')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🏠 Reportar Refugio Activo</h1>
      <p className="text-gray-600 mb-6">
        Si representas un organismo oficial, reporta refugios activos para ayudar en la coordinación.
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Refugio *</label>
          <input
            type="text"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ej: Escuela Bolívar"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
          <input
            type="text"
            required
            value={formData.direccion}
            onChange={(e) => setFormData({...formData, direccion: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Dirección completa"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad *</label>
            <input
              type="number"
              required
              value={formData.capacidad}
              onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Personas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación Actual *</label>
            <input
              type="number"
              required
              value={formData.ocupacion_actual}
              onChange={(e) => setFormData({...formData, ocupacion_actual: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Personas"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Refugio</label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({...formData, tipo: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="general">General</option>
            <option value="menores">Especializado en Menores</option>
            <option value="familias">Familias</option>
            <option value="medico">Médico</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contacto Responsable *</label>
            <input
              type="text"
              required
              value={formData.contacto}
              onChange={(e) => setFormData({...formData, contacto: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
            <input
              type="tel"
              required
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="0414-123-4567"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded"
        >
          REPORTAR REFUGIO
        </button>
      </form>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-2">📞 Coordinación con Organismos</h3>
        <p className="text-sm text-blue-700 mb-2">
          Para integración de APIs o coordinación directa:
        </p>
        <a href="/contacto-organismos" className="text-blue-600 hover:text-blue-800 font-medium">
          Formulario de Contacto para Organismos →
        </a>
      </div>
    </div>
  )
}
