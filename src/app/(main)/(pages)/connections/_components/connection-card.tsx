import { ConnectionTypes } from '@/lib/types'
import React from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

type Props = {
  type: ConnectionTypes
  icon: string
  title: ConnectionTypes
  description: string
  callback?: () => void
  connected: {} & any
}

const ConnectionCard = ({
  description,
  type,
  icon,
  title,
  connected,
}: Props) => {
  const isConnected = connected[type]

  return (
    <Card className="group flex w-full flex-col gap-2 border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:hover:scale-[1.01]">
      <CardHeader className="flex min-w-0 flex-col gap-4">
        <div className="flex w-fit flex-row gap-2 rounded-lg bg-muted/40 p-3 transition-colors duration-300 group-hover:bg-muted">
          <Image
            src={icon}
            alt={title}
            height={32}
            width={32}
            className="object-contain"
          />
        </div>
        <div>
          <CardTitle className="text-lg transition-colors duration-300 group-hover:text-primary">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="flex w-full items-center justify-start gap-2 px-6 pb-6 pt-0 sm:w-auto sm:justify-center sm:p-6">
        {isConnected ? (
          <div className="flex items-center gap-2 rounded-lg border-2 border-green-500/30 bg-green-500/10 px-4 py-2 font-semibold text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            Connected
          </div>
        ) : (
          <Link
            href={
              title == 'Discord'
                ? process.env.NEXT_PUBLIC_DISCORD_REDIRECT!
                : title == 'Notion'
                ? process.env.NEXT_PUBLIC_NOTION_AUTH_URL!
                : title == 'Slack'
                ? process.env.NEXT_PUBLIC_SLACK_REDIRECT!
                : '#'
            }
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition-transform duration-300 hover:scale-105"
          >
            Connect
          </Link>
        )}
      </div>
    </Card>
  )
}

export default ConnectionCard