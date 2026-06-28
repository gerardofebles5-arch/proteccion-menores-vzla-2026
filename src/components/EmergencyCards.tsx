export default function EmergencyCards() {
  const contacts = [
    { name: 'Emergencias Generales', number: '911', color: 'red' },
    { name: 'CICPC Antirapto', number: '0800-SECUESTRO', color: 'blue' },
    { name: 'Fiscalía Protección', number: '0800-FISCA-00', color: 'green' },
    { name: 'Defensoría del Pueblo', number: '0800-DEFENDE', color: 'purple' },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📞 Líneas de Emergencia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <a
            key={contact.number}
            href={`tel:${contact.number}`}
            className={`p-4 rounded-lg border-2 border-${contact.color}-500 hover:bg-${contact.color}-50 transition-colors`}
          >
            <div className="font-bold text-gray-800">{contact.name}</div>
            <div className={`text-${contact.color}-600 font-mono text-lg`}>{contact.number}</div>
          </a>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Estas líneas son operadas por organismos oficiales venezolanos.
        Marca inmediatamente si presencias un delito en progreso.
      </p>
    </div>
  )
}
