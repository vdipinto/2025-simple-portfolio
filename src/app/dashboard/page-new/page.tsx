/* ───────── app/dashboard/page-new/page.tsx ───────── */
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "@/components/ui/TiptapEditor";
import { createPage, PageFormState } from "@/actions/pageActions";
import { slugify } from "@/lib/slugify";
import MediaLibraryClient from "@/components/dashboard/MediaLibraryClient";
import { toast } from "sonner";
import clsx from "clsx";
import Image from "next/image";
import type { JSONContent } from "@tiptap/react";
import { Button } from "@/components/ui/button"

function hasErrors(
  s: PageFormState | null
): s is Extract<PageFormState, { success: false }> {
  return s !== null && !s.success;
}

export default function CreatePage() {
  const router = useRouter();
  const editorRef = useRef<{ getContent: () => JSONContent }>(null);

  // local state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [featuredImage, setFeaturedImage] =
    useState<{ id: string; url: string } | null>(null);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [formState, setFormState] = useState<PageFormState | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSlug(slugify(title));
  }, [title]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const content = editorRef.current?.getContent();
    const formData = new FormData(e.currentTarget);

    formData.set("content", JSON.stringify(content));
    formData.set("seoTitle", seoTitle);
    formData.set("seoDescription", seoDescription);

    if (featuredImage) {
      formData.set("featuredImageId", featuredImage.id);
      formData.set("seoImageId", featuredImage.id);
    } else {
      formData.set("featuredImageId", "");
      formData.set("seoImageId", "");
    }

    startTransition(async () => {
      const result = await createPage(undefined, formData);

      if (result.success) {
        toast.success("Page created!");
        router.push("/dashboard/all-pages"); // 👉 make this route/list
      } else {
        toast.error(result.errors?.general || "Failed to create page");
        setFormState(result);
      }
    });
  };


  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">New Page</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border p-2 rounded"
          placeholder="Page title"
        />
        {hasErrors(formState) && formState.errors.title && (
          <p className="text-red-600 text-sm mt-1">{formState.errors.title}</p>
        )}

        {/* Slug */}
        <input
          name="slug"
          value={slug}
          readOnly
          className={clsx(
            "w-full border p-2 rounded",
            hasErrors(formState) && formState.errors.slug && "border-red-500"
          )}
        />
        {hasErrors(formState) && formState.errors.slug && (
          <p className="text-red-600 text-sm mt-1">{formState.errors.slug}</p>
        )}

        {/* Publish toggle */}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" />
          Publish immediately
        </label>

        {/* Featured image picker */}
        <div className="border p-3 rounded">
          <div className="mb-2 font-medium text-sm">Featured Image</div>

          {featuredImage ? (
            <Image
              src={featuredImage.url}
              alt="Featured"
              width={800}
              height={320}
              className="w-full h-40 object-cover rounded mb-2"
            />
          ) : (
            <p className="text-sm text-gray-500 mb-2">No image selected.</p>
          )}

          <button
            type="button"
            className="text-sm underline text-blue-600"
            onClick={() => setMediaOpen(true)}
          >
            {featuredImage ? "Replace Image" : "Select Image"}
          </button>

          <input
            type="hidden"
            name="featuredImageId"
            value={featuredImage?.id || ""}
          />
        </div>

        {/* Selection type of page */}
        <div>
          <label className="block text-sm font-medium mb-1">Page Type</label>
          <select
            name="type"
            defaultValue="GENERAL"
            className="w-full border p-2 rounded"
          >
            <option value="GENERAL">General</option>
            <option value="SERVICES">Services</option>
          </select>
        </div>

        {/* SEO fields */}
        <div>
          <label className="block text-sm font-medium mb-1">SEO Title</label>
          <input
            name="seoTitle"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <div className="flex justify-between text-sm text-zinc-500 mt-1">
            <span className={seoTitle.length > 60 ? "text-orange-600" : ""}>
              {seoTitle.length} / 60
            </span>
            {hasErrors(formState) && formState.errors.seoTitle && (
              <span className="text-red-600">
                {formState.errors.seoTitle}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            SEO Description
          </label>
          <textarea
            name="seoDescription"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={3}
            className="w-full border p-2 rounded"
            required
          />
          <div className="flex justify-between text-sm text-zinc-500 mt-1">
            <span
              className={seoDescription.length > 160 ? "text-orange-600" : ""}
            >
              {seoDescription.length} / 160
            </span>
            {hasErrors(formState) && formState.errors.seoDescription && (
              <span className="text-red-600">
                {formState.errors.seoDescription}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="border rounded p-2">
          <TiptapEditor
            ref={editorRef}
            content={{ type: "doc", content: [] }}
          />
          {hasErrors(formState) && formState.errors.content && (
            <p className="text-red-600 text-sm mt-2">
              {formState.errors.content}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="default"
          disabled={isPending}
          className="w-40"
        >
          {isPending && (
            <span className="inline-block w-4 h-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin" />
          )}
          {isPending ? "Saving..." : "Create Page"}
        </Button>
      </form>

      {/* Media picker modal */}
      <MediaLibraryClient
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(img) => {
          setFeaturedImage(img);
          setMediaOpen(false);
        }}
      />
    </div>
  );
}
