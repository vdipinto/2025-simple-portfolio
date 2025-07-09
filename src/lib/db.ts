import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// Create base client
const base = new PrismaClient({
  datasourceUrl: process.env.PRISMA_ACCELERATE_URL,
})

// Apply Accelerate extension
const extended = withAccelerate()(base)

// ✅ Tell TypeScript: this is a PrismaClient with your models *and* cacheStrategy support
const prisma = extended as PrismaClient & typeof extended

// Optional singleton (for hot reloads in dev)
const globalForPrisma = globalThis as unknown as {
  prisma: typeof prisma
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { prisma }
