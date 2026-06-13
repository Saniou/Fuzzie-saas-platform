// Клієнтська утиліта: вирізає квадратну область із зображення (для аватара)
// і повертає Blob. Використовується разом із react-easy-crop.

export type PixelArea = {
  x: number
  y: number
  width: number
  height: number
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', (e) => reject(e))
    img.crossOrigin = 'anonymous'
    img.src = url
  })
}

/** Вирізає область `area` й масштабує до квадрата `size`×`size`, повертає PNG Blob. */
export async function getCroppedBlob(
  imageSrc: string,
  area: PixelArea,
  size = 512
): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  canvas.width = size
  canvas.height = size

  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    size,
    size
  )

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas is empty'))),
      'image/png'
    )
  })
}
