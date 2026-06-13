'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

/**
 * Завантажує фото профілю напряму в Clerk (без зовнішнього Uploadcare).
 * Clerk стає джерелом аватара — тож фото зверху-справа теж оновлюється,
 * а URL зберігаємо в БД для відображення в Settings.
 */
export const onUploadAvatar = async (
  formData: FormData
): Promise<{ ok: boolean; url?: string; message: string }> => {
  const user = await currentUser()
  if (!user) return { ok: false, message: 'Not authenticated' }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: 'No file selected' }
  }
  if (!file.type.startsWith('image/')) {
    return { ok: false, message: 'Please choose an image' }
  }

  try {
    const clerk = await clerkClient()
    const updated = await clerk.users.updateUserProfileImage(user.id, { file })
    const url = updated.imageUrl

    await db.user.update({
      where: { clerkId: user.id },
      data: { profileImage: url },
    })

    return { ok: true, url, message: 'Photo updated' }
  } catch (e: any) {
    console.error('Avatar upload failed:', e)
    return { ok: false, message: e?.message ?? 'Upload failed' }
  }
}

export const onRemoveAvatar = async (): Promise<{
  ok: boolean
  message: string
}> => {
  const user = await currentUser()
  if (!user) return { ok: false, message: 'Not authenticated' }

  await db.user.update({
    where: { clerkId: user.id },
    data: { profileImage: '' },
  })
  return { ok: true, message: 'Photo removed' }
}
