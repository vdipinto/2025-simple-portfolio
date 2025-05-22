'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import NextImage from 'next/image'

type Image = {
  id: string
  url: string
  alt?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  uploadedAt: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (image: Image) => void
}

export default function MediaLibrary({ open, onClose, onSelect }: Props) {
  const [images, setImages] = useState<Image[]>([])

  useEffect(() => {
    if (!open) return
    const fetchImages = async () => {
      const res = await fetch('/api/images')
      const data = await res.json()
      setImages(data)
    }

    fetchImages()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select an image</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
            {images.map((image) => (
              <button
                key={image.id}
                className="border rounded overflow-hidden hover:ring-2 ring-primary transition-all"
                onClick={() => {
                  onSelect(image)
                  onClose()
                }}
              >
                <NextImage
                  src={image.url}
                  alt={image.alt || ''}
                  width={400} // or something matching your layout
                  height={128}
                  className="object-cover w-full h-32"
                />
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
