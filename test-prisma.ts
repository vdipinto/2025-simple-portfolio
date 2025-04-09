import { prisma } from "@/lib/db";

async function testPrisma() {
    try {
        const post = await prisma.post.findFirst();
        console.log("✅ Prisma Connection Success! First Post:", post);
    } catch (error) {
        console.error("🚨 Prisma Error:", error);
    }
}

testPrisma();
