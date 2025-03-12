// app/sign-in/page.tsx
import CredentialsSignInForm from './credentials-signin-form'
import Link  from "next/link"

export default function SignInPage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Sign In</h1>
      <CredentialsSignInForm />
      <p className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </>
  )
}
