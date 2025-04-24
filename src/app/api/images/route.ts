import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: { uploadedAt: 'desc' },
    })
    return NextResponse.json(images)
  } catch (error) {
    console.error('[API_IMAGES_GET]', error)
    return NextResponse.json(
      { error: 'Failed to load images' },
      { status: 500 }
    )
  }
}