'use client'

import { useState } from 'react'

export default function DenunciaInternaPage() {
  const [formData, setFormData] = useState({
    tipo_denuncia: '',
    descripcion: '',
    evidencia: null as File | null,
    ubicacion: '',
    fecha_incidente: ''
  })
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)

    try {
      const response = await fetch('/api/denuncia-interna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Denuncia enviada de forma anónima y segura. Su identidad está protegida.')
        setFormData({ tipo_denuncia: '', descripcion: '', evidencia: null, ubicacion: '', fecha_incidente: '' })
      } else {
        alert('❌ Error al enviar denuncia')
      }
    } catch (error) {
      alert('❌ Error de conexión')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-red-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">🛡️ Denuncia Interna Anónima</h1>
        <p className="text-red-200 mb-6">
          Sistema seguro para reportar comportamientos sospechosos, abuso o trata de personas.
          <strong> SU IDENTIDAD ESTÁ COMPLETAMENTE PROTEGIDA.</strong>
        </p>

        <div className="bg-red-800 p-4 rounded mb-6">
          <h3 className="font-bold text-white mb-2">⚠️ Tipos de denuncias:</h3>
          <ul className="text-red-200 text-sm space-y-1">
            <li>• Comportamiento sospechoso con menores</li>
            <li>• Intento de apropiación irregular</li>
            <li>• Violación de protocolos de seguridad</li>
            <li>• Acceso no autorizado a datos sensibles</li>
            <li>• Sospecha de infiltración por tratantes</li>
            <li>• Cualquier situación que ponga en riesgo a los menores</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-red-200 mb-1">
              Tipo de Denuncia *
            </label>
            <select
              required
              value={formData.tipo_denuncia}
              onChange={(e) => setFormData({...formData, tipo_denuncia: e.target.value})}
              className="w-full p-3 border border-red-700 rounded bg-red-950 text-white focus:ring-2 focus:ring-red-500"
            >
              <option value="">Seleccionar...</option>
              <option value="comportamiento_sospechoso">Comportamiento sospechoso</option>
              <option value="apropiacion_irregular">Intento de apropiación irregular</option>
              <option value="violacion_protocolos">Violación de protocolos</option>
              <option value="acceso_no_autorizado">Acceso no autorizado</option>
              <option value="infiltracion">Sospecha de infiltración</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-200 mb-1">
              Descripción Detallada *
            </label>
            <textarea
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows={6}
              className="w-full p-3 border border-red-700 rounded bg-red-950 text-white focus:ring-2 focus:ring-red-500"
              placeholder="Describa detalladamente lo que observó, incluyendo fechas, horas, personas involucradas y cualquier detalle relevante..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-200 mb-1">
              Ubicación del Incidente
            </label>
            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
              className="w-full p-3 border border-red-700 rounded bg-red-950 text-white focus:ring-2 focus:ring-red-500"
              placeholder="Refugio, dirección, institución..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-200 mb-1">
              Fecha del Incidente
            </label>
            <input
              type="date"
              value={formData.fecha_incidente}
              onChange={(e) => setFormData({...formData, fecha_incidente: e.target.value})}
              className="w-full p-3 border border-red-700 rounded bg-red-950 text-white focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="bg-red-950 p-4 rounded border border-red-700">
            <p className="text-red-300 text-sm">
              <strong>🔒 Privacidad Garantizada:</strong> Esta denuncia es 100% anónima.
              No se registra su IP, identidad ni ninguna información personal.
              Los datos están cifrados con seguridad militar.
            </p>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg disabled:opacity-50 text-lg"
          >
            {enviando ? 'Enviando de forma segura...' : 'ENVIAR DENUNCIA ANÓNIMA'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-red-300 text-sm">
            Si es una emergencia inmediata, llame al: <strong>911</strong> o <strong>0800-DEFENDE</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
