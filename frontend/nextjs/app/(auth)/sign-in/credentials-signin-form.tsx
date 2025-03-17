'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { IUserSignIn } from '@/types'
import { signInWithCredentials } from '@/lib/actions/user.actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignInSchema } from '@/lib/validator'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { useRouter } from 'next/navigation'
import { Spinner } from '@chakra-ui/react'
import { cn } from '@/lib/utils'

export default function CredentialsSignInForm() {
  const router = useRouter()
  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { control, handleSubmit, setError } = form
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)

  const onSubmit = async (data: IUserSignIn) => {
    try {
      // Clear any previous errors
      setAuthError(null)
      setIsSigningIn(true)
      
      const result = await signInWithCredentials({
        email: data.email,
        password: data.password,
      })

      // Check if the result indicates an error
      if (result?.error) {
        console.error("Sign in error:", result.error)
        
        // Set the auth error message for display
        setAuthError(result.error)
        
        // Map specific error messages to form fields
        if (result.error.includes("Email not found")) {
          setError("email", { 
            type: "manual", 
            message: "Email not found" 
          })
        } else if (result.error.includes("Invalid password")) {
          setError("password", { 
            type: "manual", 
            message: "Invalid password" 
          })
        }
        
        setIsSigningIn(false)
        return
      }

      // If successful, navigate to home
      setIsNavigating(true)
      router.push("/")
      // Don't set isSigningIn to false here as we're navigating away
      
    } catch (error: any) {
      // Only reset signing in state if we're not navigating
      if (!isNavigating) {
        setIsSigningIn(false)
      }
      
      if (isRedirectError(error)) {
        throw error
      }
      
      console.error("Unexpected error:", error)
      setAuthError(error.message || "An unexpected error occurred")
    } 
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 w-[95%] mx-auto">
        <div className="space-y-8">
          {/* Display authentication errors at the top of the form */}
          {authError && (
            <div className="p-4 border border-red-500 bg-red-50 rounded-md text-red-600">
              <p className="flex items-center">
                <span className="mr-2 text-xl">⚠️</span>
                {authError}
              </p>
            </div>
          )}
          
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter email address" 
                    {...field}                    
                    className={cn(
                      isSigningIn && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isSigningIn}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                    className={cn(
                      isSigningIn && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isSigningIn}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center mt-8">
            <Button className="w-2/5" type="submit" disabled={isSigningIn}>
              {isSigningIn ? (
                <>
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Signing In...
                </> 
              ) : "Sign In"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}