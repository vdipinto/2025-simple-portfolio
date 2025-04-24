import { getAllImages } from '@/actions/actions'
import MediaLibraryClient from './MediaLibraryClient'

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

export default async function MediaLibraryWrapper({
  open,
  onClose,
  onSelect,
}: Props) {
  const images = await getAllImages()

  return (
    <MediaLibraryClient
      open={open}
      onClose={onClose}
      onSelect={onSelect}
      images={images}
    />
  )
}
