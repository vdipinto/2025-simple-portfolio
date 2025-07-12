"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteProjectBySlug } from "@/actions/projectActions";

type Project = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
};

type Props = {
  projects: Project[];
  showEditLinks?: boolean;
};

export default function ProjectList({ projects, showEditLinks = false }: Props) {
  const [localProjects, setLocalProjects] = useState(projects);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (slug: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const formData = new FormData();
    formData.append("slug", slug);

    startTransition(async () => {
      const res = await deleteProjectBySlug(null, formData);

      if (res?.success) {
        toast.success("Project deleted");
        setLocalProjects((prev) => prev.filter((p) => p.slug !== slug));
      } else {
        toast.error(res?.message ?? "Failed to delete project");
      }
    });
  };

  return (
    <ul className="space-y-4">
      {localProjects.map((project) => (
        <li
          key={project.id}
          className="flex items-center justify-between px-4 py-2 border rounded hover:bg-gray-50"
        >
          <div>
            <Link
              href={`/case-study/${project.slug}`}
              className="text-blue-600 hover:underline"
            >
              {project.title}
            </Link>

            {showEditLinks && !project.published && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                Draft
              </span>
            )}
          </div>

          {showEditLinks && (
            <div className="flex items-center gap-4">
              <Link
                href={`/dashboard/all-projects/edit/${project.slug}`}
                className="text-sm text-gray-500 hover:underline"
              >
                Edit
              </Link>

              <button
                disabled={isPending}
                onClick={() => handleDelete(project.slug)}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
