'use client'
import React, { useState, useEffect } from 'react'
import UploadCareButton from './uploadcare-button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type Props = {
  userImage: string | null
  onDelete?: () => Promise<any>
  onUpload: (url: string) => Promise<any>
}

const ProfilePicture = ({ userImage, onDelete, onUpload }: Props) => {
  const router = useRouter()
  const [localImage, setLocalImage] = useState(userImage ?? '')

  useEffect(() => {
    setLocalImage(userImage ?? '')
  }, [userImage])

  const handleUpload = async (cdnUrl: string) => {
    setLocalImage(cdnUrl)
    await onUpload(cdnUrl)
    router.refresh()
  }

  const onRemoveProfileImage = async () => {
    await onDelete?.()
    setLocalImage('')
    router.refresh()
  }

  return (
    <div className="flex flex-col">
      <p className="text-lg text-white">Profile Picture</p>
      <div className="flex h-[30vh] flex-col items-center justify-center">
        {localImage ? (
          <>
            <div className="relative h-full w-2/12">
              <Image
                src={localImage}
                alt="User_Image"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <Button
              onClick={onRemoveProfileImage}
              className="bg-transparent text-white/70 hover:bg-transparent hover:text-white"
              type="button"
            >
              <X /> Remove Logo
            </Button>
          </>
        ) : (
          <UploadCareButton onUpload={handleUpload} />
        )}
      </div>
    </div>
  )
}

export default ProfilePicture
