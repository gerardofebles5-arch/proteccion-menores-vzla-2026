'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroStaffPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    organizacion: '',
    cargo: '',
    cedula: '',
    telefono: '',
    email: '',
    credencial: null as File | null,
    referido_por: ''
  })
  const [enviando, setEnviando] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)

    try {
      // Subir credencial
      let credencialUrl = ''
      if (formData.credencial) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', formData.credencial)
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload
        })
        const uploadData = await uploadRes.json()
        if (uploadData.url) credencialUrl = uploadData.url
      }

      const response = await fetch('/api/auth/solicitar-acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          credencial_url: credencialUrl
        })
      })

      const data = await response.json()

      if (data.success) {
        if (data.aprobadoAutomaticamente) {
          alert(`✅ ¡APROBADO AUTOMÁTICAMENTE!\n\nSu código de acceso es: ${data.token}\n\nPuntaje: ${data.validacion.puntaje}/${data.validacion.umbral}\nRazones: ${data.validacion.razones.join(', ')}`)
          router.push('/panel-staff/acceso')
        } else {
          alert(`⏳ Solicitud enviada. Revisión manual requerida.\n\nPuntaje: ${data.validacion.puntaje}/${data.validacion.umbral}\nRazones: ${data.validacion.razones.join(', ')}`)
          router.push('/panel-staff/acceso')
        }
      } else {
        alert(`❌ ${data.error || 'Error al enviar solicitud'}`)
      }
    } catch (error) {
      alert('❌ Error de conexión')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Solicitud de Acceso Staff</h1>
      <p className="text-gray-600 mb-6">
        Verifique su identidad como funcionario oficial. El sistema validará automáticamente su solicitud.
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cédula *</label>
            <input
              type="text"
              required
              value={formData.cedula}
              onChange={(e) => setFormData({...formData, cedula: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="V-XXXXXXXX-X"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organización *</label>
          <select
            required
            value={formData.organizacion}
            onChange={(e) => setFormData({...formData, organizacion: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Seleccionar...</option>
            <optgroup label="ONGs Principales">
              <option value="FUNDANA">FUNDANA</option>
              <option value="CECODAP">CECODAP</option>
              <option value="UNICEF">UNICEF</option>
              <option value="Cruz Roja">Cruz Roja</option>
              <option value="Aldeas SOS">Aldeas SOS</option>
              <option value="Save the Children">Save the Children</option>
              <option value="World Vision">World Vision</option>
              <option value="Plan International">Plan International</option>
              <option value="Caritas">Caritas</option>
            </optgroup>
            <optgroup label="Gobierno y Entes Públicos">
              <option value="Protección Civil">Protección Civil</option>
              <option value="CPNNA">CPNNA</option>
              <option value="Defensoría del Pueblo">Defensoría del Pueblo</option>
              <option value="CICPC">CICPC</option>
              <option value="Fiscalía">Fiscalía</option>
              <option value="Ministerio Público">Ministerio Público</option>
              <option value="Ministerio de Educación">Ministerio de Educación</option>
              <option value="Ministerio de Salud">Ministerio de Salud</option>
              <option value="Ministerio de la Familia">Ministerio de la Familia</option>
              <option value="INN">INN</option>
              <option value="IVSS">IVSS</option>
              <option value="Policía Nacional">Policía Nacional</option>
              <option value="Guardia Nacional">Guardia Nacional</option>
              <option value="Bomberos">Bomberos</option>
              <option value="Fundación del Niño">Fundación del Niño</option>
            </optgroup>
            <optgroup label="Universidades">
              <option value="UCAB">UCAB</option>
              <option value="USB">USB</option>
              <option value="UCV">UCV</option>
              <option value="UNESR">UNESR</option>
              <option value="ULA">ULA</option>
              <option value="UDO">UDO</option>
              <option value="UNELLEZ">UNELLEZ</option>
            </optgroup>
            <optgroup label="Otras Instituciones">
              <option value="Gobernaciones">Gobernaciones</option>
              <option value="Alcaldías">Alcaldías</option>
              <option value="Consejos Comunales">Consejos Comunales</option>
              <option value="Comités de Salud">Comités de Salud</option>
              <option value="Comités de Educación">Comités de Educación</option>
              <option value="otra">Otra (especificar en cargo)</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
          <input
            type="text"
            required
            value={formData.cargo}
            onChange={(e) => setFormData({...formData, cargo: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ej: Trabajador Social, Coordinador, etc."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Credencial Oficial (Foto) *</label>
          <input
            type="file"
            required
            accept="image/*"
            onChange={(e) => setFormData({...formData, credencial: e.target.files?.[0] || null})}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Suba foto de su credencial oficial o carné de identificación
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Referido por (opcional)</label>
          <input
            type="text"
            value={formData.referido_por}
            onChange={(e) => setFormData({...formData, referido_por: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Nombre de funcionario ya verificado"
          />
          <p className="text-xs text-gray-500 mt-1">
            Si conoce a alguien ya verificado, agilizaremos el proceso
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-blue-700">
            <strong>⚡ Validación automática:</strong> Sistema inteligente que valida organización, email oficial, cédula, cargo, teléfono y más. Aprobación en segundos si cumple criterios (60+ puntos).
          </p>
          <p className="text-sm text-blue-700 mt-1">
            <strong>🛡️ Seguridad avanzada:</strong> Detección automática de fraude con análisis de patrones, IPs, emails temporales y comportamientos sospechosos.
          </p>
          <p className="text-sm text-blue-700 mt-1">
            <strong>⏱️ Revisión manual:</strong> Si no cumple criterios, será revisado manualmente (menos de 1 hora).
          </p>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
        >
          {enviando ? 'Enviando...' : 'ENVIAR SOLICITUD'}
        </button>
      </form>
    </div>
  )
}
