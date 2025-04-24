const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  await prisma.image.createMany({
    data: [
      {
        url: 'https://placekitten.com/800/600',
        alt: 'Kitten 1',
        width: 800,
        height: 600,
        mimeType: 'image/jpeg',
      },
      {
        url: 'https://placekitten.com/700/500',
        alt: 'Kitten 2',
        width: 700,
        height: 500,
        mimeType: 'image/jpeg',
      },
      {
        url: 'https://placekitten.com/640/480',
        alt: 'Kitten 3',
        width: 640,
        height: 480,
        mimeType: 'image/jpeg',
      },
    ],
    skipDuplicates: true,
  })

  console.log('🌱 Seeded images successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
