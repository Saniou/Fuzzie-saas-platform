import ProfileForm from '@/components/forms/profile-form'
import React from 'react'
import ProfilePicture from './_components/profile-picture'
import TriggerKey from './_components/trigger-key'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { User as UserIcon, KeyRound } from 'lucide-react'

type Props = {}

// Картка-секція у мінімалістичному стилі застосунку
function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border-2 bg-gradient-to-br from-card to-card/50 p-6 transition-all duration-300 hover:shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

const Settings = async (props: Props) => {
  const authUser = await currentUser()
  if (!authUser) return null

  const [user, workflows] = await Promise.all([
    db.user.findUnique({ where: { clerkId: authUser.id } }),
    db.workflows.findMany({
      where: { userId: authUser.id },
      select: { id: true, name: true },
    }),
  ])

  const removeProfileImage = async () => {
    'use server'
    return db.user.update({
      where: { clerkId: authUser.id },
      data: { profileImage: '' },
    })
  }

  const uploadProfileImage = async (image: string) => {
    'use server'
    return db.user.update({
      where: { clerkId: authUser.id },
      data: { profileImage: image },
    })
  }

  const updateUserInfo = async (name: string) => {
    'use server'
    return db.user.update({
      where: { clerkId: authUser.id },
      data: { name },
    })
  }

  const appUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-4 md:p-6 text-3xl md:text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>

      <div className="flex flex-col gap-6 p-2 md:p-6">
        {/* Trigger API — унікальна фіча: запуск воркфлоу ззовні за ключем */}
        <SectionCard
          icon={KeyRound}
          title="Trigger API"
          description="Run your workflows from anywhere with a personal key"
        >
          <TriggerKey
            apiKey={user?.apiKey ?? null}
            appUrl={appUrl}
            workflows={workflows}
          />
        </SectionCard>

        {/* Profile */}
        <SectionCard
          icon={UserIcon}
          title="User Profile"
          description="Add or update your information"
        >
          <div className="flex flex-col gap-8">
            <ProfilePicture
              onDelete={removeProfileImage}
              userImage={user?.profileImage || ''}
              onUpload={uploadProfileImage}
            />
            <ProfileForm
              user={user}
              onUpdate={updateUserInfo}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

export default Settings
