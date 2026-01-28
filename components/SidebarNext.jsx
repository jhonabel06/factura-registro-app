"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default function SidebarNext() {
  const pathname = usePathname() || '/'
  const [isOpen, setIsOpen] = useState(false)

  const navItem = (href, label) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        onClick={() => setIsOpen(false)}
        className={`block rounded-lg p-3 transition-colors hover:bg-gray-700 ${
          isActive ? 'bg-blue-600 text-white' : 'text-gray-300'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <>
      {/* Botón hamburguesa - solo en móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay - solo en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-48 bg-gray-800 p-6 text-white shadow-lg z-40 transition-transform duration-300 md:w-40 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="pt-12 md:pt-0">
          <ul className="space-y-4">
            <li>{navItem('/', 'Dashboard')}</li>
            <li>{navItem('/register-invoice', 'Registrar Factura')}</li>
            {/* <li>{navItem('/HistorialPagos', 'Pagos')}</li>
            <li>{navItem('/orders', 'Órdenes')}</li>
            <li>{navItem('/products', 'Productos')}</li>
            <li>{navItem('/Configuracion-General', 'Configuración')}</li> */}
            <li>
              <LogoutButton className="block w-full rounded-lg p-3 text-left text-gray-300 transition-colors hover:bg-gray-700">
                Cerrar sesión
              </LogoutButton>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
