// src/app/(main)/(pages)/workflows/editor/page.tsx
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export default async function Page() {
  const user = await currentUser()
  if (!user) {
    redirect('/sign-in')
  }

  let wf = await db.workflows.findFirst({
    where: { userId: user.id },
  })

  if (!wf) {
    wf = await db.workflows.create({
      data: {
        userId: user.id,
        name: 'Untitled',
        description: '',
        nodes: '[]',
        edges: '[]',
        slackChannels: [],
        publish: false,
      },
    })
  }

  // редірект на конкретний редактор
  redirect(`/workflows/${wf.id}/editor`)
}
