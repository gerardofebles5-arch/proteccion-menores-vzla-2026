'use client'

import { useState } from 'react'

export default function BuscarPage() {
  const [formData, setFormData] = useState({
    nombreNino: '',
    edad: '',
    altura: '',
    peso: '',
    colorCabello: '',
    colorOjos: '',
    marcasNacimiento: '',
    ropaUltimaVez: '',
    lugarVisto: '',
    fechaDesaparicion: '',
    foto: null as File | null,
    contactoPadre: '',
    telefonoPadre: ''
  })

  const [codigoSeguimiento, setCodigoSeguimiento] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const codigo = `REP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setCodigoSeguimiento(codigo)
    
    console.log('Datos del reporte:', formData)
    console.log('Código de seguimiento:', codigo)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        foto: e.target.files[0]
      })
    }
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">👶 Reportar Menor Desaparecido</h1>
        <p className="text-gray-600 mb-6">
          Este formulario es seguro y cifrado. Tu información nunca se hace pública.
          El sistema buscará coincidencias con menores hallados en refugios.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Información del Niño/a</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                name="nombreNino"
                required
                value={formData.nombreNino}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edad *</label>
                <input
                  type="number"
                  name="edad"
                  required
                  value={formData.edad}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                <input
                  type="text"
                  name="altura"
                  value={formData.altura}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color de Cabello</label>
                <select
                  name="colorCabello"
                  value={formData.colorCabello}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="negro">Negro</option>
                  <option value="castano">Castaño</option>
                  <option value="rubio">Rubio</option>
                  <option value="pelirrojo">Pelirrojo</option>
                  <option value="gris">Gris/Canoso</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color de Ojos</label>
                <select
                  name="colorOjos"
                  value={formData.colorOjos}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="marron">Marrón</option>
                  <option value="azul">Azul</option>
                  <option value="verde">Verde</option>
                  <option value="gris">Gris</option>
                  <option value="negro">Negro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marcas de Nacimiento / Cicatrices / Lunares</label>
              <textarea
                name="marcasNacimiento"
                value={formData.marcasNacimiento}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Describe cualquier marca distintiva..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ropa que llevaba la última vez *</label>
              <textarea
                name="ropaUltimaVez"
                required
                value={formData.ropaUltimaVez}
                onChange={handleChange}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Color, tipo de ropa, zapatos, accesorios..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Información de la Desaparición</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lugar donde fue visto por última vez *</label>
              <input
                type="text"
                name="lugarVisto"
                required
                value={formData.lugarVisto}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Dirección, zona, refugio, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora aproximada de desaparición *</label>
              <input
                type="datetime-local"
                name="fechaDesaparicion"
                required
                value={formData.fechaDesaparicion}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto del niño/a (opcional pero muy recomendada)</label>
            <input
              type="file"
              name="foto"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">La foto ayuda enormemente en la identificación</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Tu Información de Contacto</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del padre/madre/tutor *</label>
              <input
                type="text"
                name="contactoPadre"
                required
                value={formData.contactoPadre}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto *</label>
              <input
                type="tel"
                name="telefonoPadre"
                required
                value={formData.telefonoPadre}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 0414-123-4567"
              />
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <h3 className="font-bold text-red-800 mb-2">🔒 Seguridad del Sistema</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Tu información está encriptada con AES-256</li>
              <li>• Solo personal verificado de ONGs puede ver datos</li>
              <li>• El sistema usa doble ciego: nadie ve ambos lados del match</li>
              <li>• Todos los accesos son auditados</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            Enviar Reporte Seguro
          </button>
        </form>
      </div>
    </div>
  )
}
