import { getAllImages } from '@/actions/actions'
import MediaManager from '@/components/dashboard/MediaManager';

export default async function MediaPage() {
  const images = await getAllImages()

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Media Library</h1>
      <MediaManager images={images} />
    </div>
  )
}