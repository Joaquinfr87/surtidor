import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  variant?: 'icon' | 'full'
}

const sizeMap: Record<string, number> = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}

export function Logo({
  className,
  size = 'md',
  showText = true,
  variant = 'full',
}: LogoProps) {
  const iconSize = sizeMap[size]

  if (variant === 'icon') {
    return (
      <div
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg',
          className
        )}
        style={{ width: iconSize, height: iconSize }}
      >
        <Image
          src="/logo.svg"
          alt="Tunari Logo"
          width={iconSize}
          height={iconSize}
          className="object-contain"
          priority
        />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="relative shrink-0 overflow-hidden rounded-lg"
        style={{ width: iconSize, height: iconSize }}
      >
        <Image
          src="/logo.svg"
          alt="Tunari Logo"
          width={iconSize}
          height={iconSize}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="grid flex-1 text-left leading-tight">
          <span className="truncate text-sm font-semibold">
            Surtidor
          </span>
          <span className="truncate text-xs text-muted-foreground">
            Tunari
          </span>
        </div>
      )}
    </div>
  )
}
