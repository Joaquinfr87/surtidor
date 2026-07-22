import { Suspense } from 'react'
import { RegisterForm } from '@/components/forms/register-form'

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md px-4">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
