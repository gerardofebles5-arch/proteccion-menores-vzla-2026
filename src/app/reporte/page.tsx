'use client'

import { useState } from 'react'
import { AlertTriangle, Camera, Mic, Upload } from 'lucide-react'

export default function ReportePage() {
  const [tipoReporte, setTipoReporte] = useState('intento_rapto')
  const [ubicacion, setUbicacion] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [descripcionSospechoso, setDescripcionSospechoso] = useState('')
  const [archivos, setArchivos] = useState<File[]>([])
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    
    try {
      // Subir archivos primero
      const archivosUrls = []
      for (const archivo of archivos) {
        const formData = new FormData()
        formData.append('file', archivo)
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        if (data.url) archivosUrls.push(data.url)
      }

      // Enviar reporte
      const response = await fetch('/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: tipoReporte,
          ubicacion,
          descripcion,
          descripcion_sospechoso: descripcionSospechoso,
          archivos_url: archivosUrls,
          nombre_reportante: '',
          telefono_reportante: ''
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`✅ Reporte enviado. Código de seguimiento: ${data.codigo}`)
        // Reset form
        setUbicacion('')
        setDescripcion('')
        setDescripcionSospechoso('')
        setArchivos([])
      } else {
        alert('❌ Error al enviar reporte')
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error de conexión')
    } finally {
      setEnviando(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArchivos(Array.from(e.target.files))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <div className="flex items-center">
          <AlertTriangle className="text-red-600 mr-2" size={24} />
          <h1 className="text-2xl font-bold text-red-700">🚨 Reporte de Emergencia</h1>
        </div>
        <p className="text-red-600 mt-2">
          Use este formulario solo para situaciones de <strong>riesgo inmediato</strong>.
          Para búsqueda de familiares, use la sección "Buscar Hijo/a".
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Situación *
          </label>
          <select
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 emergency-input"
            required
          >
            <option value="intento_rapto">Intento de rapto/secuestro en progreso</option>
            <option value="menor_solo">Menor solo/desamparado en zona de riesgo</option>
            <option value="falso_funcionario">Persona haciéndose pasar por funcionario/autoridad</option>
            <option value="movimiento_sospechoso">Vehículos o personas merodeando refugios</option>
            <option value="otro">Otra situación de riesgo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación Exacta *
          </label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Ej: Refugio Escuela Bolívar, Calle Principal #123, Caracas"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 emergency-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción Detallada *
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describa lo que está viendo, hora, características..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 emergency-input"
            required
          />
        </div>

        {tipoReporte === 'intento_rapto' || tipoReporte === 'falso_funcionario' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Sospechoso
            </label>
            <textarea
              value={descripcionSospechoso}
              onChange={(e) => setDescripcionSospechoso(e.target.value)}
              placeholder="Apariencia, ropa, vehículo, placa, etc."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        ) : null}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evidencia Multimedia (opcional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto text-gray-400" size={48} />
            <p className="text-gray-500 mt-2">Arrastre fotos, videos o audios aquí</p>
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleFileSelect}
              className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            {archivos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">{archivos.length} archivo(s) seleccionado(s)</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-700 text-sm">
            <strong>⚠️ Importante:</strong> En caso de rapto en progreso, llame primero al <strong>911</strong> o <strong>0800-SECUESTRO</strong>.
            Este sistema complementa pero no reemplaza la respuesta policial inmediata.
          </p>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {enviando ? 'Enviando...' : '🚨 ENVIAR REPORTE DE EMERGENCIA'}
        </button>
      </form>
    </div>
  )
}