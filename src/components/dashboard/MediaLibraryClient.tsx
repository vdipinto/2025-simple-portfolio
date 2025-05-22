'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { UploadButton } from '@/utils/uploadthing'
import { useEffect, useState } from 'react'
import NextImage from 'next/image'

type Image = {
  id: string
  url: string
  alt?: string | null
  uploadedAt: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (image: Image) => void
}

export default function MediaLibraryClient({
  open,
  onClose,
  onSelect,
}: Props) {
  const [images, setImages] = useState<Image[]>([])

  const refreshImages = async () => {
    try {
      const res = await fetch('/api/images')
      const data = await res.json()
      setImages(data)
    } catch (error) {
      console.error('Failed to refresh images', error)
    }
  }

  useEffect(() => {
    if (open) refreshImages()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select an image</DialogTitle>
          <DialogDescription>
            Choose or upload an image to insert into your post.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          {/* <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={() => {
              refreshImages()
            }}
            onUploadError={(error) => {
              console.error('Upload error:', error)
            }}
          /> */}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              console.log("Upload complete:", res);
            }}
            onUploadError={(error: Error) => {
              if (error.message.includes("FileSizeMismatch")) {
                alert("File too large! Please upload an image under 4MB.");
              } else {
                alert(`Upload failed: ${error.message}`);
              }
            }}
          />

        </div>

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
                  width={400} // estimate based on your layout
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
