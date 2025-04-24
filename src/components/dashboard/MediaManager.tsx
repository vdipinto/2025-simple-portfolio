'use client'

import { useTransition, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Clipboard } from 'lucide-react'
import { toast } from 'sonner'
import { deleteImage } from '@/actions/actions'
import { UploadButton } from '@/utils/uploadthing'

type Image = {
  id: string
  url: string
  alt?: string | null
  uploadedAt: string
}

type Props = {
  images: Image[]
}

export default function MediaManager({ images: initialImages }: Props) {
  const [images, setImages] = useState(initialImages)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteImage(id)

      if (res.success) {
        toast.success('Image deleted')
        setImages((prev) => prev.filter((img) => img.id !== id))
      } else {
        toast.error(res.error || 'Failed to delete image')
      }
    })
  }

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Copied image URL!')
  }

  return (
    <>
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-lg font-semibold">Uploaded Images</h2>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (!res) return
            toast.success('Image uploaded!')

            const newImage = res[0]
            setImages((prev) => [
              {
                id: newImage.key, // not the actual DB ID, just a placeholder for optimistic UI
                url: newImage.url,
                alt: newImage.name,
                uploadedAt: new Date().toISOString(),
              },
              ...prev,
            ])
          }}
          onUploadError={(error) => {
            toast.error(`Upload failed: ${error.message}`)
          }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group border rounded overflow-hidden"
          >
            <img
              src={image.url}
              alt={image.alt || ''}
              className="object-cover w-full h-40 cursor-pointer"
              onClick={() => handleCopy(image.url)}
            />

            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-red-100"
                onClick={() => handleDelete(image.id)}
                disabled={isPending}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-slate-100"
                onClick={() => handleCopy(image.url)}
              >
                <Clipboard className="w-4 h-4 text-slate-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
