'use client'

import { Users } from 'lucide-react'

const credentials = [
  { role: 'Admin', email: 'admin@surtidor.com', password: 'admin123' },
  { role: 'Supervisor', email: 'supervisor@surtidor.com', password: 'super123' },
  { role: 'Operador', email: 'operador@surtidor.com', password: 'oper123' },
  { role: 'Auditor', email: 'auditor@surtidor.com', password: 'audi123' },
]

export function DemoCredentials() {
  return (
    <div className="mt-4 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
      <div className="mb-2 flex items-center justify-center gap-1.5 font-medium">
        <Users className="size-3.5" />
        Credenciales de prueba
      </div>
      <div className="space-y-1.5">
        {credentials.map((cred) => (
          <div key={cred.role} className="flex items-center justify-between">
            <span className="font-medium">{cred.role}:</span>
            <span className="font-mono">{cred.email} / {cred.password}</span>
          </div>
        ))}
      </div>
    </div>
  )
}