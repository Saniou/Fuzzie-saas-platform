'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { onCloneTemplate } from '../_actions/clone-template'

export default function UseTemplateButton({ templateId }: { templateId: string }) {
  const [pending, start] = useTransition()
  const router = useRouter()

  const onUse = () =>
    start(async () => {
      try {
        const res = await onCloneTemplate(templateId)
        if (!res.ok || !res.id) {
          toast.error(res.message)
          return
        }
        toast.success(res.message)
        router.push(`/workflows/editor/${res.id}`)
        router.refresh()
      } catch (e) {
        console.error(e)
        toast.error('Failed to use template')
      }
    })

  return (
    <Button onClick={onUse} disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Plus className="mr-2 h-4 w-4" />
      )}
      Use template
    </Button>
  )
}
