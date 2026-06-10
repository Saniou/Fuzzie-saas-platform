'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { menuOptions } from '@/lib/constant'
import clsx from 'clsx'
import { Separator } from '@/components/ui/separator'
import { Zap } from 'lucide-react'
import { ModeToggle } from '../global/mode-toggle'

type Props = {}

const MenuOptions = (props: Props) => {
  const pathName = usePathname()

  return (
    <nav className="flex h-screen w-16 shrink-0 flex-col justify-between gap-6 border-r bg-card/40 px-3 py-6 backdrop-blur-xl transition-all duration-300 md:w-60">
      <div className="flex flex-col gap-6 overflow-hidden">
        {/* Логотип */}
        <Link
          href="/"
          className="flex items-center gap-2 px-1 font-bold"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Zap className="h-5 w-5" />
          </span>
          <span className="hidden text-lg md:inline">fuzzie.</span>
        </Link>

        <Separator />

        {/* Навігація з підписами */}
        <ul className="flex flex-col gap-1">
          {menuOptions.map((menuItem) => {
            const selected = pathName === menuItem.href
            return (
              <li key={menuItem.name}>
                <Link
                  href={menuItem.href}
                  className={clsx(
                    'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-300',
                    selected
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  )}
                >
                  <span
                    className={clsx(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                      selected
                        ? 'bg-primary/15'
                        : 'bg-muted/40 group-hover:bg-muted'
                    )}
                  >
                    <menuItem.Component selected={selected} />
                  </span>
                  <span className="hidden md:inline">{menuItem.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Нижній блок */}
      <div className="flex flex-col gap-4">
        <Separator />
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="hidden text-xs text-muted-foreground md:inline">
            Theme
          </span>
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export default MenuOptions
