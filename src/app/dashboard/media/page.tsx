import { getAllImages } from '@/actions/actions'
import MediaManager from '@/components/dashboard/MediaManager';

export default async function MediaPage() {
  const imagesRaw = await getAllImages();

  // Map over images and convert uploadedAt from Date to string
  const images = imagesRaw.map(image => ({
    ...image,
    uploadedAt: image.uploadedAt.toISOString(),
  }));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Media Library</h1>
      <MediaManager images={images} />
    </div>
  );
}

