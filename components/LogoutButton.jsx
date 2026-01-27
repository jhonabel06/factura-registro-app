// components/LogoutButton.jsx
"use client"

import { useRouter } from 'next/navigation'
import PropTypes from 'prop-types'
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

LogoutButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

export default LogoutButton