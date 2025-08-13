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
import { toast } from 'sonner'
import { onFlowPublish } from '../_actions/workflow-connections'

type Props = {
  name: string
  description: string
  id: string
  publish: boolean | null
}

const Workflow = ({ description, id, name, publish }: Props) => {
  const [isPending, startTransition] = useTransition()
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

  return (
    <Card className="flex w-full flex-row items-center justify-between">
      <CardHeader className="flex flex-col gap-4">
        <Link href={`/workflows/editor/${id}`}>
          <div className="flex flex-row gap-2">
            <Image
              src="/googleDrive.png"
              alt="Google Drive"
              height={30}
              width={30}
              className="object-contain"
            />
            <Image
              src="/notion.png"
              alt="Notion"
              height={30}
              width={30}
              className="object-contain"
            />
            <Image
              src="/discord.png"
              alt="Discord"
              height={30}
              width={30}
              className="object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </Link>
      </CardHeader>

      <div className="flex flex-col items-center gap-2 p-4">
        <Label htmlFor={`publish-${id}`} className="text-muted-foreground">
          {isPublished ? 'On' : 'Off'}
        </Label>
        <Switch
          id={`publish-${id}`}
          checked={isPublished}
          disabled={isPending}
          onCheckedChange={handleToggle}
        />
      </div>
    </Card>
  )
}

export default Workflow
