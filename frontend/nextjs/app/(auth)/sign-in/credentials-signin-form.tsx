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

import { IUserSignIn } from '@/types'
import { signInWithCredentials } from '@/lib/actions/user.actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignInSchema } from '@/lib/validator'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { useRouter } from 'next/navigation'

export default function CredentialsSignInForm() {

  const router = useRouter()
  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
  })

  const { control, handleSubmit } = form

  const onSubmit = async (data: IUserSignIn) => {
    try {
      const result = await signInWithCredentials({
        email: data.email,
        password: data.password,
      })

      // Check if the result indicates an error
      if (result?.error) {
        console.error("Sign in error:", result.error)
        return
      }

      router.push("/")
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }
      console.error("Unexpected error:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 w-[95%] mx-auto">
        <div className="space-y-8">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center mt-8">
            <Button className="w-2/5" type="submit">Sign In</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
