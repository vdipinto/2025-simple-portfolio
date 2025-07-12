import { prisma } from "@/lib/db";
import ProjectList from "@/components/ui/projectList";
import type { Project } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AllProjectsDashboardPage() {
  const projects: Project[] = await prisma.project.findMany({
    // where: { published: true }, // optional filter
    orderBy: { createdAt: "desc" },
    cacheStrategy: { ttl: 60 },
  });

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Projects (Admin)</h1>
      <ProjectList projects={projects} showEditLinks />
    </main>
  );
}
