import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src/content/changelog");

export interface ChangelogEntry {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  slug: string;
}

export interface ChangelogPost extends ChangelogEntry {
  content: string;
}

export function getChangelogEntries(): ChangelogEntry[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"));

  const entries: ChangelogEntry[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data } = matter(raw);

    return {
      title: data.title ?? "",
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      tags: data.tags ?? [],
      slug: data.slug ?? file.replace(/\.mdx$/, ""),
    };
  });

  return entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getChangelogSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data } = matter(raw);
      return data.slug ?? file.replace(/\.mdx$/, "");
    });
}

export function getChangelogPost(slug: string): ChangelogPost | null {
  if (!fs.existsSync(CONTENT_DIR)) {
    return null;
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const fileSlug = data.slug ?? file.replace(/\.mdx$/, "");

    if (fileSlug === slug) {
      return {
        title: data.title ?? "",
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
        tags: data.tags ?? [],
        slug: fileSlug,
        content,
      };
    }
  }

  return null;
}
