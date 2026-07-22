import { Suspense } from 'react'
import { LoginForm } from '@/components/forms/login-form'

export default function LoginPage() {
  return (
    <div className="w-full max-w-md px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
