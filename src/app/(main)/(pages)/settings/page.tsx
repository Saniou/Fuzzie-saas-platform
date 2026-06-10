import ProfileForm from '@/components/forms/profile-form'
import React from 'react'
import ProfilePicture from './_components/profile-picture'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

type Props = {}

const Settings = async (props: Props) => {
  const authUser = await currentUser()
  if (!authUser) return null

  const user = await db.user.findUnique({ where: { clerkId: authUser.id } })
  const removeProfileImage = async () => {
    'use server'
    const response = await db.user.update({
      where: {
        clerkId: authUser.id,
      },
      data: {
        profileImage: '',
      },
    })
    return response
  }

  const uploadProfileImage = async (image: string) => {
    'use server'
    const id = authUser.id
    const response = await db.user.update({
      where: {
        clerkId: id,
      },
      data: {
        profileImage: image,
      },
    })

    return response
  }

  const updateUserInfo = async (name: string) => {
    'use server'

    const updateUser = await db.user.update({
      where: {
        clerkId: authUser.id,
      },
      data: {
        name,
      },
    })
    return updateUser
  }

  return (
    <div className="flex flex-col gap-4 p-10">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>
      <div className="flex flex-col gap-6 p-6">
        <section className="rounded-xl border-2 bg-gradient-to-br from-card to-card/50 p-6 transition-all duration-300 hover:shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">User Profile</h2>
            <p className="text-base text-muted-foreground">
              Add or update your information
            </p>
          </div>
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
        </section>
      </div>
    </div>
  )
}

export default Settings