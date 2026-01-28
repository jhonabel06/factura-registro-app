'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRoles } from '@/hooks/useUserRoles'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function DashboardPage() {
  const { roles, isLoading, isAdmin, hasRole } = useUserRoles()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="FacturaOCR"
        description="Bienvenido al dashboard"
      />
      
      <div className="container py-4 md:py-8 md:ml-48 px-4 md:px-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Bienvenido al sistema</p>
      </div>

      {/* Información del usuario */}
      <Card className="mb-6 md:mb-8">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-lg md:text-xl">Tu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            <div>
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Roles Asignados:</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {roles.length === 0 ? (
                  <Badge variant="destructive" className="text-xs">Sin rol</Badge>
                ) : (
                  roles.map((role) => (
                    <Badge key={role.id} variant="default" className="text-xs">
                      {role.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones según roles */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Admin Panel */}
        {isAdmin && (
          <Card className="border-blue-200">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Badge className="text-xs">Admin</Badge>
                Gestión del Sistema
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Acceso total a todas las funciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin">
                <Button size="sm" className="w-full">Gestionar Usuarios y Roles</Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                Asigna y revoca roles de usuarios
              </p>
            </CardContent>
          </Card>
        )}

        {/* Registro de Facturación */}
        {(isAdmin || hasRole('Registrador')) && (
          <Card className="border-green-200">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Registrador</Badge>
                Facturas
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Registro y gestión de facturas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/register-invoice">
                <Button size="sm" className="w-full">Ver Facturas</Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                Registra y consulta facturas
              </p>
            </CardContent>
          </Card>
        )}

        {/* POS */}
        {(isAdmin || hasRole('Caja') || hasRole('Registrador')) && (
          <Card className="border-purple-200">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Caja/Registrador</Badge>
                Punto de Venta
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Sistema POS (En desarrollo)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" disabled className="w-full">
                POS (Próximamente)
              </Button>
              <p className="text-xs text-muted-foreground">
                Esta funcionalidad se está desarrollando
              </p>
            </CardContent>
          </Card>
        )}

        {/* Invoices Dashboard */}
        {(isAdmin || hasRole('Registrador')) && (
          <Card className="border-orange-200">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Registrador</Badge>
                Análisis
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Dashboard de facturas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/">
                <Button size="sm" className="w-full">Dashboard de Facturas</Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                Visualiza estadísticas y análisis
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Información sobre roles si no tiene ninguno */}
      {roles.length === 0 && (
        <Card className="mt-6 md:mt-8 border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-base md:text-lg text-yellow-900">Sin Rol Asignado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs md:text-sm text-yellow-800">
              Actualmente no tienes un rol asignado. Contacta a un administrador para solicitar acceso a las funciones del sistema.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
    </div>
  )
}
