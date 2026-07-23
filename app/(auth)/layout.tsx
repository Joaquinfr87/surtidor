import { Logo } from '@/components/ui/logo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 overflow-hidden bg-gradient-to-br from-background via-background to-muted p-4 dark:from-background dark:via-background dark:to-zinc-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 size-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-yellow-500/5 blur-3xl" />
      </div>

      {/* Card wrapper with animation */}
      <div className="animate-fade-in-up relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Logo size="xl" />
            <span className="text-sm font-medium text-muted-foreground">Sistema de Control de Surtidores</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
