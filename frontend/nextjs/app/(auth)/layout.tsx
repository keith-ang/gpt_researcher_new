import React from "react";
import { Card } from '@/components/ui/card'

export default function AuthLayout({children}: {children: React.ReactNode}){
  return (
    <main className="h-screen flex items-center justify-center">
      <Card className="flex flex-col items-center justify-evenly w-full max-w-md p-6">
        {children}
      </Card>
    </main>
  )
}