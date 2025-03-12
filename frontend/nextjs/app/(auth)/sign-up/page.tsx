import SignUpForm from "./signup-form"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Sign Up</h1>
      <SignUpForm />
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>
    </>
  )
}
