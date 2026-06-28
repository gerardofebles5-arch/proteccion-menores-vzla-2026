'use client'

import { useState } from 'react'

export default function ContactoOrganismosPage() {
  const [formData, setFormData] = useState({
    organizacion: '',
    nombre_contacto: '',
    email: '',
    telefono: '',
    tipo_integracion: '',
    mensaje: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contacto-organismos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      
      if (result.success) {
        alert('✅ Solicitud enviada. Nos pondremos en contacto pronto.')
        setFormData({ organizacion: '', nombre_contacto: '', email: '', telefono: '', tipo_integracion: '', mensaje: '' })
      } else {
        alert('❌ Error al enviar')
      }
    } catch (error) {
      alert('❌ Error de conexión')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🤝 Contacto para Organismos</h1>
      <p className="text-gray-600 mb-6">
        Coordinación oficial para integración de sistemas, intercambio de datos y colaboración en la emergencia.
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Organización *</label>
          <input
            type="text"
            required
            value={formData.organizacion}
            onChange={(e) => setFormData({...formData, organizacion: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ej: FUNDANA, CECODAP, Cruz Roja"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Contacto *</label>
            <input
              type="text"
              required
              value={formData.nombre_contacto}
              onChange={(e) => setFormData({...formData, nombre_contacto: e.target.value})}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="contacto@organizacion.org"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Integración Deseada *</label>
          <select
            required
            value={formData.tipo_integracion}
            onChange={(e) => setFormData({...formData, tipo_integracion: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Seleccionar...</option>
            <option value="api">Integración de APIs</option>
            <option value="data">Intercambio de bases de datos</option>
            <option value="refugios">Reporte de refugios activos</option>
            <option value="coordinacion">Coordinación general</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje Detallado *</label>
          <textarea
            required
            value={formData.mensaje}
            onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Describa qué tipo de integración necesita y cómo podemos colaborar..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
        >
          ENVIAR SOLICITUD
        </button>
      </form>

      <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-bold text-yellow-800 mb-2">⚡ Respuesta Rápida</h3>
        <p className="text-sm text-yellow-700">
          Para emergencias que requieren coordinación inmediata, llame al: <strong>0800-DEFENDE</strong> (Defensoría del Pueblo)
        </p>
      </div>
    </div>
  )
}
