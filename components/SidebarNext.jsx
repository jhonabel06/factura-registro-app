"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default function SidebarNext() {
  const pathname = usePathname() || '/'

  const navItem = (href, label) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={`block rounded-lg p-3 transition-colors hover:bg-gray-700 ${
          isActive ? 'bg-blue-600 text-white' : 'text-gray-300'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-40 bg-gray-800 p-6 text-white shadow-lg">
      <nav>
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
  )
}
