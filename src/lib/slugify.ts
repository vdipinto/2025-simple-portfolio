export function slugify(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')         // Replace spaces and underscores with -
      .replace(/[^\w-]+/g, '')         // Remove non-word characters except hyphen
      .replace(/--+/g, '-')            // Replace multiple dashes with a single dash
      .replace(/^-+|-+$/g, '')         // Trim leading/trailing dashes
  }
  