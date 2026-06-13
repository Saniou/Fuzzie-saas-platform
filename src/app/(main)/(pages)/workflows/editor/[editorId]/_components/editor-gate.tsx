'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MonitorSmartphone, ArrowLeft } from 'lucide-react'

function EditorPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MonitorSmartphone className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Best on a bigger screen</h2>
        <p className="max-w-sm text-muted-foreground">
          The drag-and-drop workflow editor needs more room than a phone gives.
          Open it on a desktop or tablet to build and connect your automation.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/workflows">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to workflows
        </Link>
      </Button>
    </div>
  )
}

/**
 * Показує редактор лише на десктопі (≥1024px); на малих екранах — заглушку.
 * children рендеримо тільки на десктопі, тож важкий ReactFlow на мобільному
 * взагалі не монтується.
 */
export default function EditorGate({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // До монтування (і на SSR) — заглушка, щоб уникнути mount ReactFlow на мобільному
  if (!mounted || !isDesktop) return <EditorPlaceholder />
  return <>{children}</>
}
