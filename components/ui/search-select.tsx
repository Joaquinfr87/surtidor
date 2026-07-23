'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, ChevronDown, Search, X } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  subtitle?: string
}

interface SearchSelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  clearable?: boolean
}

export function SearchSelect({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  emptyText = 'Sin resultados',
  disabled = false,
  className,
  clearable = false,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const filtered = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.subtitle?.toLowerCase().includes(search.toLowerCase())
  )

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') {
        setOpen(false)
        setSearch('')
      }
      if (e.key === 'Enter' && filtered.length === 1) {
        onChange(filtered[0].value)
        setOpen(false)
        setSearch('')
      }
    },
    [open, filtered, onChange]
  )

  const handleSelect = (optValue: string) => {
    onChange(optValue)
    setOpen(false)
    setSearch('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          'h-8 w-full justify-between gap-2 px-2.5 text-left text-sm font-normal',
          !value && 'text-muted-foreground',
          open && 'border-ring ring-3 ring-ring/50'
        )}
      >
        <span className="flex-1 truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-0.5">
          {clearable && value && (
            <span
              role="button"
              onClick={handleClear}
              className="flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </span>
          )}
          <ChevronDown
            className={cn(
              'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </div>
      </Button>

      {open && (
        <div
          className={cn(
            'absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border bg-popover shadow-lg',
            'animate-in fade-in-0 zoom-in-95 origin-top duration-100'
          )}
        >
          <div className="border-b p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="h-7 pl-8 text-xs"
              />
            </div>
          </div>

          <div
            ref={listRef}
            className="max-h-48 overflow-y-auto p-1"
          >
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                    opt.value === value && 'bg-accent/50 font-medium text-accent-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'flex size-4 shrink-0 items-center justify-center rounded-sm border',
                      opt.value === value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-transparent'
                    )}
                  >
                    {opt.value === value && <Check className="size-3" />}
                  </span>
                  <div className="flex flex-col">
                    <span>{opt.label}</span>
                    {opt.subtitle && (
                      <span className="text-[11px] text-muted-foreground">{opt.subtitle}</span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
                {emptyText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
