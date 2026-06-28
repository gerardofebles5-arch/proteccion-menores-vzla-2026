'use client'

import { Menu, Shield, AlertTriangle, Home, Users, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: '/', label: 'Inicio', icon: <Home size={18} /> },
    { href: '/reporte', label: 'Reporte Urgente', icon: <AlertTriangle size={18} /> },
    { href: '/buscar', label: 'Buscar Hijo/a', icon: <Users size={18} /> },
    { href: '/trata', label: 'Denunciar Trata', icon: <AlertCircle size={18} /> },
    { href: '/panel-staff', label: 'Panel Staff', icon: <Shield size={18} /> },
  ]

  const externalLinks = [
    { href: 'https://ayudaencamino.com/necesidades', label: 'Ayuda en Camino' },
    { href: 'https://venezuela-terremoto.com', label: 'Venezuela Terremoto' },
    { href: 'https://venezuelatebusca.com', label: 'Venezuela Te Busca' },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <Shield className="text-red-600" size={28} />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Protección Menores Vzla 2026</h1>
              <p className="text-xs text-gray-500">Emergencia Sismos • Sistema Seguro</p>
            </div>
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex space-x-4">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
            <div className="border-l pl-4 ml-2 flex flex-col justify-center">
              <span className="text-xs text-gray-500 block mb-2 font-semibold">🌐 RECURSOS EXTERNOS:</span>
              <div className="flex flex-col space-y-1">
                {externalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors border border-blue-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {isOpen && (
          <div className="md:hidden py-3 border-t">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}