export default function EmergencyCards() {
  const contacts = [
    { name: 'Emergencias Generales', number: '911', color: 'red' },
    { name: 'CICPC Antirapto', number: '0800-SECUESTRO', color: 'blue' },
    { name: 'Fiscalía Protección', number: '0800-FISCA-00', color: 'green' },
    { name: 'Defensoría del Pueblo', number: '0800-DEFENDE', color: 'purple' },
  ]

  const colorClasses = {
    red: 'border-red-500 hover:bg-red-50 text-red-600',
    blue: 'border-blue-500 hover:bg-blue-50 text-blue-600',
    green: 'border-green-500 hover:bg-green-50 text-green-600',
    purple: 'border-purple-500 hover:bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">📞 Líneas de Emergencia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {contacts.map((contact) => (
          <a
            key={contact.number}
            href={`tel:${contact.number}`}
            className={`p-3 md:p-4 rounded-lg border-2 ${colorClasses[contact.color as keyof typeof colorClasses]} transition-colors`}
          >
            <div className="font-bold text-gray-800 text-sm md:text-base">{contact.name}</div>
            <div className={`font-mono text-base md:text-lg`}>{contact.number}</div>
          </a>
        ))}
      </div>
      <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
        Estas líneas son operadas por organismos oficiales venezolanos.
        Marca inmediatamente si presencias un delito en progreso.
      </p>
    </div>
  )
}
