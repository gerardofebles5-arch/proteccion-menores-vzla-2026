'use client'

import { useState, useEffect } from 'react'
import { Bell, X, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface Notification {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  message: string
  timestamp: Date
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Simular notificaciones en tiempo real
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'critical',
        message: '🚨 Nuevo reporte de trata detectado en El Cafetal',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: '2',
        type: 'warning',
        message: '⚠️ Intento de acceso desde IP sospechosa',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: '3',
        type: 'success',
        message: '✅ Menor hallado y reunido con familia',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '4',
        type: 'info',
        message: '📊 5 nuevos refugios reportados activos',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      }
    ]

    setNotifications(mockNotifications)

    // Simular actualización en tiempo real
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? 'critical' : 'info',
        message: `Nueva actividad detectada - ${new Date().toLocaleTimeString()}`,
        timestamp: new Date()
      }
      setNotifications(prev => [newNotification, ...prev].slice(0, 10))
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="text-red-600" />
      case 'warning': return <AlertTriangle className="text-yellow-600" />
      case 'success': return <CheckCircle className="text-green-600" />
      default: return <Info className="text-blue-600" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'success': return 'bg-green-50 border-green-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  const unreadCount = notifications.length

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold">Notificaciones</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500">No hay notificaciones</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b ${getBgColor(notification.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t">
            <button className="w-full text-blue-600 hover:underline text-sm">
              Marcar todas como leídas
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
