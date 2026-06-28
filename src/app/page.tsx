import HomeHero from '@/components/HomeHero'
import EmergencyCards from '@/components/EmergencyCards'
import StatsCounter from '@/components/StatsCounter'

export default function HomePage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <HomeHero />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <h2 className="text-lg md:text-xl font-bold text-red-700 mb-2 md:mb-3">🚨 Reporte Urgente</h2>
          <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">Si ves un intento de rapto, un niño solo, o movimiento sospechoso cerca de refugios.</p>
          <a 
            href="/reporte" 
            className="inline-block w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 md:py-2 px-4 rounded transition-colors text-center"
          >
            Reportar Ahora →
          </a>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <h2 className="text-lg md:text-xl font-bold text-blue-700 mb-2 md:mb-3">👶 Buscar Hijo/a</h2>
          <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">Si perdiste contacto con tu hijo/a durante los sismos. Reporte seguro y cifrado.</p>
          <a 
            href="/buscar" 
            className="inline-block w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 md:py-2 px-4 rounded transition-colors text-center"
          >
            Buscar Mi Hijo/a →
          </a>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <h2 className="text-lg md:text-xl font-bold text-purple-700 mb-2 md:mb-3">⚠️ Denunciar Trata</h2>
          <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">Si ves anuncios sospechosos (Vinted, OLX, etc.) que puedan ser trata disfrazada.</p>
          <a 
            href="/trata" 
            className="inline-block w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 md:py-2 px-4 rounded transition-colors text-center"
          >
            Denunciar Trata →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <h2 className="text-lg md:text-xl font-bold text-green-700 mb-2 md:mb-3">🏠 Refugios</h2>
          <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">Ubicación de refugios activos y puntos de reunión seguros.</p>
          <a 
            href="/refugios" 
            className="inline-block w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 md:py-2 px-4 rounded transition-colors text-center"
          >
            Ver Refugios →
          </a>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
          <h2 className="text-lg md:text-xl font-bold text-orange-700 mb-2 md:mb-3">🤝 Contacto ONGs</h2>
          <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">Contacto directo con organizaciones especializadas en protección infantil.</p>
          <a 
            href="/contacto-organismos" 
            className="inline-block w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 md:py-2 px-4 rounded transition-colors text-center"
          >
            Contactar ONGs →
          </a>
        </div>
      </div>
      
      <StatsCounter />
      
      <EmergencyCards />
      
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <h3 className="font-bold text-yellow-800 text-base md:text-lg">⚠️ Seguridad del Sistema</h3>
        <p className="text-yellow-700 text-sm md:text-base mt-1">
          Este sistema utiliza <strong>doble ciego</strong> para proteger la ubicación de los niños.
          Solo personal verificado de ONGs (FUNDANA, CECODAP, UNICEF) puede ver datos sensibles.
          Todos los accesos son auditados y bloqueados ante comportamiento sospechoso.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-bold text-blue-800 text-base md:text-lg">📱 Acceso Público</h3>
        <p className="text-blue-700 text-sm md:text-base mt-1">
          Este sistema es de acceso público. No necesitas cuenta para reportar casos, buscar menores o acceder a información de refugios.
          Solo el panel de administración requiere autenticación.
        </p>
      </div>
    </div>
  )
}