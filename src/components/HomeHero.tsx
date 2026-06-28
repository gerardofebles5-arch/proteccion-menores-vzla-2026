export default function HomeHero() {
  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-4 md:p-8 rounded-2xl shadow-xl mb-6 md:mb-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">🚨 Emergencia Sismos Venezuela 2026</h1>
        <p className="text-base md:text-xl mb-4 md:mb-6">
          Sistema seguro de <strong>protección y reunificación familiar</strong> para menores afectados por los sismos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-center">
          <div className="bg-white/20 p-3 md:p-4 rounded-lg backdrop-blur-sm">
            <div className="text-xl md:text-2xl font-bold">⚠️ Doble Ciego</div>
            <div className="text-xs md:text-sm">Los datos de menores están cifrados y protegidos</div>
          </div>
          <div className="bg-white/20 p-3 md:p-4 rounded-lg backdrop-blur-sm">
            <div className="text-xl md:text-2xl font-bold">🔒 Verificado</div>
            <div className="text-xs md:text-sm">Solo ONGs autorizadas acceden a datos sensibles</div>
          </div>
          <div className="bg-white/20 p-3 md:p-4 rounded-lg backdrop-blur-sm">
            <div className="text-xl md:text-2xl font-bold">📱 Offline</div>
            <div className="text-xs md:text-sm">Funciona sin conexión en zonas de desastre</div>
          </div>
        </div>
      </div>
    </div>
  )
}