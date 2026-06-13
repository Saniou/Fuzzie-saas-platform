'use client'
import React, {
  useState,
  useEffect,
  useRef,
  useTransition,
  useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Cropper from 'react-easy-crop'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Upload, X, Loader2, ZoomIn } from 'lucide-react'
import { onUploadAvatar, onRemoveAvatar } from '../_actions/avatar'
import { getCroppedBlob, type PixelArea } from '@/lib/crop-image'

type Props = {
  userImage: string | null
}

const ProfilePicture = ({ userImage }: Props) => {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [localImage, setLocalImage] = useState(userImage ?? '')
  const [pending, start] = useTransition()

  // Стан кадрування
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [areaPixels, setAreaPixels] = useState<PixelArea | null>(null)

  useEffect(() => {
    setLocalImage(userImage ?? '')
  }, [userImage])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCropSrc(URL.createObjectURL(file))
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    if (fileRef.current) fileRef.current.value = ''
  }

  const onCropComplete = useCallback((_: unknown, area: PixelArea) => {
    setAreaPixels(area)
  }, [])

  const saveCrop = () => {
    if (!cropSrc || !areaPixels) return
    start(async () => {
      try {
        const blob = await getCroppedBlob(cropSrc, areaPixels)
        const fd = new FormData()
        fd.append('file', new File([blob], 'avatar.png', { type: 'image/png' }))
        const res = await onUploadAvatar(fd)
        if (res.ok && res.url) {
          setLocalImage(res.url)
          toast.success(res.message)
          setCropSrc(null)
          router.refresh()
        } else {
          toast.error(res.message)
        }
      } catch (e) {
        console.error(e)
        toast.error('Failed to process image')
      }
    })
  }

  const removeImage = () =>
    start(async () => {
      const res = await onRemoveAvatar()
      if (res.ok) {
        setLocalImage('')
        toast.success(res.message)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    })

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-muted-foreground">Profile picture</p>

      <div className="flex items-center gap-5">
        {/* Прев'ю */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted/30">
          {localImage ? (
            <Image src={localImage} alt="Profile" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Upload className="h-6 w-6 opacity-50" />
            </div>
          )}
        </div>

        {/* Дії */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => fileRef.current?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {localImage ? 'Change photo' : 'Upload photo'}
          </Button>

          {localImage && (
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={removeImage}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" /> Remove
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            PNG or JPG. You can position &amp; zoom before saving.
          </p>
        </div>
      </div>

      {/* Діалог кадрування */}
      <Dialog
        open={!!cropSrc}
        onOpenChange={(open) => {
          if (!open && !pending) setCropSrc(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Position your photo</DialogTitle>
          </DialogHeader>

          <div className="relative h-72 w-full overflow-hidden rounded-lg bg-muted">
            {cropSrc && (
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="flex items-center gap-3 px-1">
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCropSrc(null)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button onClick={saveCrop} disabled={pending} className="gap-2">
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfilePicture
