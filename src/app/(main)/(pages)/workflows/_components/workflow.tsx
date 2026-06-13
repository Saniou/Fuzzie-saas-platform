'use client'

import React, { useState, useTransition } from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Loader2, Play } from 'lucide-react'
import { toast } from 'sonner'
import { onFlowPublish, onRunWorkflow } from '../_actions/workflow-connections'

type Props = {
  name: string
  description: string
  id: string
  publish: boolean | null
}

const Workflow = ({ description, id, name, publish }: Props) => {
  const [isPending, startTransition] = useTransition()
  const [isRunning, startRun] = useTransition()
  const [isPublished, setIsPublished] = useState(!!publish) // локальний стан

  const handleToggle = (checked: boolean) => {
    setIsPublished(checked) // оновлюємо одразу для UI

    startTransition(async () => {
      try {
        const msg = await onFlowPublish(id, checked)
        if (msg) toast.success(msg)
      } catch (e) {
        console.error(e)
        toast.error('Failed to update publish state')
        setIsPublished(!checked) // повертаємо назад якщо помилка
      }
    })
  }

  const handleRun = () => {
    startRun(async () => {
      try {
        const res = await onRunWorkflow(id)
        if (!res.ok) toast.error(res.message)
        else if (res.status === 'partial') toast.warning(res.message)
        else toast.success(res.message)
      } catch (e) {
        console.error(e)
        toast.error('Failed to run workflow')
      }
    })
  }

  return (
    <Card className="group flex w-full flex-row items-center justify-between border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
      <CardHeader className="flex flex-col gap-4">
        <Link href={`/workflows/editor/${id}`}>
          <div className="mb-3 flex w-fit flex-row gap-1 rounded-lg bg-muted/40 p-2 transition-colors duration-300 group-hover:bg-muted">
            <Image
              src="/googleDrive.png"
              alt="Google Drive"
              height={28}
              width={28}
              className="object-contain"
            />
            <Image
              src="/notion.png"
              alt="Notion"
              height={28}
              width={28}
              className="object-contain"
            />
            <Image
              src="/discord.png"
              alt="Discord"
              height={28}
              width={28}
              className="object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-lg transition-colors duration-300 group-hover:text-primary">
              {name}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </Link>
      </CardHeader>

      <div className="flex items-center gap-4 p-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRun}
          disabled={isRunning}
          className="gap-2"
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run
        </Button>
        <div className="flex flex-col items-center gap-2">
          <Label
            htmlFor={`publish-${id}`}
            className="text-xs text-muted-foreground"
          >
            {isPublished ? 'On' : 'Off'}
          </Label>
          <Switch
            id={`publish-${id}`}
            checked={isPublished}
            disabled={isPending}
            onCheckedChange={handleToggle}
          />
        </div>
      </div>
    </Card>
  )
}

export default Workflow
