"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabaseClient'
import RegistrarUsuario from '@/components/registrarUsuario'

export default function RegisterPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/')
      } else {
        setIsChecking(false)
      }
    }
    
    checkSession()
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex items-center justify-center">
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return <RegistrarUsuario />
}
