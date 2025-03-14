'use client'
import { useRouter } from 'next/navigation'

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
import { IUserSignUp } from '@/types'
import { registerUser, signInWithCredentials } from '@/lib/actions/user.actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignUpSchema } from '@/lib/validator'
import { isRedirectError } from 'next/dist/client/components/redirect'



export default function SignUpForm() {
  const router = useRouter()

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      organisation: '',
    }
  })

  const { control, handleSubmit } = form

  const onSubmit = async (data: IUserSignUp) => {
    try {
      const res = await registerUser(data)
      console.log("Register response:", res)

      if (!res.success) {
        return
      }
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      })
      router.push('/')
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }

    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 w-[95%] mx-auto">
        <div className='space-y-8'>
          <FormField
            control={control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Confirm Password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='organisation'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Organisation</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Organisation Name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center mt-8">
            <Button className="w-2/5" type='submit'>Sign Up</Button>
          </div>
          
        </div>
      </form>
    </Form>
  )
}