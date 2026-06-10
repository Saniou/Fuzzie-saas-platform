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
    <nav className="flex h-screen w-16 shrink-0 flex-col justify-between gap-6 border-r bg-card/40 px-2 py-6 backdrop-blur-xl transition-all duration-300 md:w-60 md:px-3">
      <div className="flex flex-col gap-6 overflow-hidden">
        {/* Логотип */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 font-bold md:justify-start md:px-1"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Zap className="h-5 w-5" />
          </span>
          <span className="hidden text-lg md:inline">fuzzie.</span>
        </Link>

        <Separator />

        {/* Навігація з підписами */}
        <ul className="flex flex-col gap-1.5">
          {menuOptions.map((menuItem) => {
            const selected = pathName === menuItem.href
            return (
              <li key={menuItem.name}>
                <Link
                  href={menuItem.href}
                  className={clsx(
                    'group flex items-center justify-center gap-3 rounded-lg py-1 text-sm font-medium transition-all duration-300 md:justify-start md:px-2 md:py-1.5',
                    selected
                      ? 'md:bg-primary/10 md:text-primary'
                      : 'text-muted-foreground hover:text-foreground md:hover:bg-muted/60'
                  )}
                >
                  <span
                    className={clsx(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                      selected
                        ? 'bg-primary/15 text-primary'
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
        <div className="flex items-center justify-center gap-2 md:justify-between md:px-1">
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
