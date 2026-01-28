'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function NoRolePage() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Acceso Pendiente</CardTitle>
          <CardDescription>
            Tu cuenta ha sido creada pero aún no tiene un rol asignado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Un administrador debe asignarte un rol para que puedas acceder a las funciones del sistema.
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Los roles disponibles son:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Admin:</strong> Acceso completo a todas las funciones
              </li>
              <li>
                <strong>Caja:</strong> Solo acceso a página POS
              </li>
              <li>
                <strong>Registrador:</strong> Acceso a registro de facturación, dashboard y POS
              </li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Por favor, contacta con el administrador del sistema para solicitar un rol.
          </p>

          <Button onClick={handleLogout} className="w-full mt-4">
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
