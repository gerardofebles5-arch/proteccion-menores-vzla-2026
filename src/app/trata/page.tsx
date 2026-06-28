'use client'

import { useState } from 'react'
import { AlertTriangle, Link, Image, Shield } from 'lucide-react'

export default function TrataPage() {
  const [plataforma, setPlataforma] = useState('vinted')
  const [urlDenunciada, setUrlDenunciada] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [capturas, setCapturas] = useState<File[]>([])
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    
    try {
      // Subir capturas
      const capturasUrls = []
      for (const captura of capturas) {
        const formData = new FormData()
        formData.append('file', captura)
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        if (data.url) capturasUrls.push(data.url)
      }

      // Enviar denuncia
      const response = await fetch('/api/trata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plataforma,
          url_denunciada: urlDenunciada,
          descripcion,
          capturas_url: capturasUrls,
          nombre_denunciante: '',
          contacto_denunciante: ''
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`✅ Denuncia registrada. Código: ${data.codigo}\nSe enviará a Fiscalía y CICPC.`)
        // Reset form
        setUrlDenunciada('')
        setDescripcion('')
        setCapturas([])
      } else {
        alert('❌ Error al enviar denuncia')
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error de conexión')
    } finally {
      setEnviando(false)
    }
  }

  const señalesAlerta = [
    'Precios exageradamente altos para juguetes/comunes',
    'Descripciones que detallan características físicas de niños',
    'Formas de pago anónimas o en efectivo',
    'Fotos de niños sin adultos en contexto de "venta"',
    'Contacto solo por mensajes privados/cifrados',
    'Ubicaciones vagas o cambiantes'
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded">
        <div className="flex items-center">
          <Shield className="text-purple-600 mr-2" size={24} />
          <h1 className="text-2xl font-bold text-purple-700">⚠️ Denuncia de Trata Disfrazada</h1>
        </div>
        <p className="text-purple-600 mt-2">
          Reporte anónimo de anuncios sospechosos en plataformas de comercio (Vinted, OLX, etc.)
          que puedan estar disfrazando trata de menores como venta de juguetes/ropa.
        </p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
        <h3 className="font-bold text-yellow-800 mb-2">🔍 Señales de Alerta (Modus Operandi Detectado)</h3>
        <ul className="list-disc pl-5 text-yellow-700 text-sm space-y-1">
          {señalesAlerta.map((señal, idx) => (
            <li key={idx}>{señal}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plataforma donde vio el anuncio *
          </label>
          <select
            value={plataforma}
            onChange={(e) => setPlataforma(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="vinted">Vinted</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook Marketplace</option>
            <option value="telegram">Telegram</option>
            <option value="whatsapp">WhatsApp Grupos</option>
            <option value="olx">OLX</option>
            <option value="mercadolibre">Mercado Libre</option>
            <option value="tiktok">TikTok</option>
            <option value="otro">Otra plataforma</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL del Anuncio Sospechoso
          </label>
          <div className="flex items-center">
            <Link className="text-gray-400 mr-2" size={20} />
            <input
              type="url"
              value={urlDenunciada}
              onChange={(e) => setUrlDenunciada(e.target.value)}
              placeholder="https://www.vinted.es/items/..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Copie y pegue el enlace completo si está disponible</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción Detallada *
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describa qué le parece sospechoso: precio, descripción, fotos, método de contacto..."
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capturas de Pantalla (opcional pero crucial)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Image className="mx-auto text-gray-400" size={48} />
            <p className="text-gray-500 mt-2">Suba capturas del anuncio, chat, perfil del vendedor</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && setCapturas(Array.from(e.target.files))}
              className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {capturas.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">{capturas.length} captura(s) seleccionada(s)</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 text-sm">
            <strong>🚨 Acción Inmediata:</strong> Estas denuncias se envían automáticamente a:
            <strong> Fiscalía de Protección + CICPC + INTERPOL Venezuela</strong>.
            Mantenga la evidencia original sin modificar.
          </p>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {enviando ? 'Enviando...' : '⚠️ ENVIAR DENUNCIA A AUTORIDADES'}
        </button>
      </form>
    </div>
  )
}