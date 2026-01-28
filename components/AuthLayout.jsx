"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import SidebarNext from './SidebarNext'

export default function AuthLayout({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => data.subscription?.unsubscribe()
  }, [])

  if (loading) return <>{children}</>

  return (
    <div>
      {session && <SidebarNext />}
      <div className={session ? 'ml-0 md:ml-40' : ''}>{children}</div>
    </div>
  )
}
