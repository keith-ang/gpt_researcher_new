'use client'
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'

export default function LogoutButton() {
  const handleLogout = async () => {
    // signOut will clear the session and redirect to the provided callback URL
    await signOut({ callbackUrl: '/' })
  }

  return (
    <Button onClick={handleLogout} className="w-2/5">
      Logout
    </Button>
  )
}
