// components/LogoutButton.jsx
"use client"

import { useRouter } from 'next/navigation'
import { supabase } from '../supabaseClient'

const LogoutButton = ({ className, children }) => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (!error) {
        router.push('/login') // redirect to login page
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  return (
    <button onClick={handleLogout} className={`cursor-pointer ${className}`}>
      {children || 'Cerrar sesión'}
    </button>
  )
}

export default LogoutButton