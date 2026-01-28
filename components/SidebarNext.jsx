"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, LayoutDashboard, FileText, ShoppingCart, Settings, User } from 'lucide-react'
import { useUserRoles } from '@/hooks/useUserRoles'
import LogoutButton from './LogoutButton'
import { UserRolesDisplay } from './RoleGuard'

export default function SidebarNext() {
  const pathname = usePathname() || '/'
  const [isOpen, setIsOpen] = useState(false)
  const { isAdmin, hasRole, isLoading } = useUserRoles()

  const navItem = (href, label, icon = null) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-700 ${
          isActive ? 'bg-blue-600 text-white' : 'text-gray-300'
        }`}
      >
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </Link>
    )
  }

  if (isLoading) {
    return null
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
        className={`fixed left-0 top-0 h-screen w-48 bg-gray-800 p-6 text-white shadow-lg z-40 transition-transform duration-300 md:w-48 md:translate-x-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header del Sidebar */}
        <div className="pt-12 md:pt-0 mb-6 pb-4 border-b border-gray-700">
          <h2 className="text-lg font-bold mb-2">Menú</h2>
          <div className="text-xs">
            <UserRolesDisplay />
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {/* Dashboard - Todos excepto Sin Rol */}
            {(isAdmin || hasRole('Registrador')) && (
              <li>{navItem('/dashboard', 'Dashboard', <LayoutDashboard size={18} />)}</li>
            )}

            {/* Registro de Facturas - Admin y Registrador */}
            {(isAdmin || hasRole('Registrador')) && (
              <li>{navItem('/register-invoice', 'Registrar Factura', <FileText size={18} />)}</li>
            )}

            {/* POS - Todos excepto Admin (que lo ve pero es para otros) */}
            {(isAdmin || hasRole('Caja') || hasRole('Registrador')) && (
              <li className="text-gray-400 text-sm py-2">
                <span className="opacity-70">POS (Próximamente)</span>
              </li>
            )}

            {/* Administración - Solo Admin */}
            {isAdmin && (
              <>
                <li className="text-gray-400 text-xs uppercase tracking-wider font-semibold mt-6 mb-2">
                  Administración
                </li>
                <li>{navItem('/admin', 'Gestionar Usuarios', <User size={18} />)}</li>
                <li className="text-gray-400 text-sm py-2">
                  <span className="opacity-70">Más opciones (Próximo)</span>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Footer del Sidebar */}
        <div className="pt-4 border-t border-gray-700">
          <LogoutButton className="flex items-center gap-3 w-full rounded-lg p-3 text-left text-gray-300 transition-colors hover:bg-gray-700 hover:text-white">
            Cerrar sesión
          </LogoutButton>
        </div>
      </div>
    </>
  )
}
