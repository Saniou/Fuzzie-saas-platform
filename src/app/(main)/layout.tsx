import Sidebar from '@/components/sidebar'
import React from 'react'
import InfoBar from '@/components/infobar'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

type Props = {
  children: React.ReactNode
}

const Layout = async (props: Props) => {
  const authUser = await currentUser()
  const email = authUser?.emailAddresses[0]?.emailAddress

  // Гарантуємо, що для залогіненого Clerk-користувача існує рядок User у БД.
  // У проді це робить clerk-webhook; локально (без ngrok-вебхука) — цей fallback,
  // інакше створення воркфлоу падає на FK Workflows_userId_fkey.
  //
  // Upsert по email (стабільний ідентифікатор), а не по clerkId: при зміні
  // Clerk-інстансу той самий email отримує новий clerkId. Оновлюємо clerkId на
  // актуальний — FK Workflows_userId_fkey має ON UPDATE CASCADE, тож наявні
  // воркфлоу автоматично переходять на новий clerkId.
  if (authUser && email) {
    await db.user.upsert({
      where: { email },
      update: { clerkId: authUser.id },
      create: {
        clerkId: authUser.id,
        email,
        name: authUser.firstName ?? '',
        profileImage: authUser.imageUrl ?? '',
      },
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex w-full min-w-0 flex-col overflow-hidden">
        <InfoBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {props.children}
        </main>
      </div>
    </div>
  )
}

export default Layout
