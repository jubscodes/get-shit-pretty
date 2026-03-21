import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { getChangelogSlugs, getChangelogPost } from "@/lib/content";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { mdxComponents } from "@/components/mdx-components";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getChangelogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getChangelogPost(slug);

  if (!post) {
    return { title: "Post not found -- Get Shit Pretty" };
  }

  return {
    title: `${post.title} -- Get Shit Pretty`,
    description: post.excerpt,
  };
}

function formatDate(dateString: string): { display: string; iso: string } {
  const date = new Date(dateString);
  const display = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return { display: display.toUpperCase(), iso: dateString };
}

async function compileMdx(source: string) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
  });
  const { default: MdxContent } = await run(String(compiled), {
    ...runtime,
    baseUrl: import.meta.url,
  });
  return MdxContent;
}

export default async function ChangelogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getChangelogPost(slug);

  if (!post) {
    notFound();
  }

  const { display, iso } = formatDate(post.date);
  const MdxContent = await compileMdx(post.content);

  return (
    <div className="max-w-2xl mx-auto px-gsp-4 sm:px-gsp-6 lg:px-gsp-12">
      <article aria-labelledby="post-title">
        {/* Back link */}
        <nav aria-label="Breadcrumb" className="pt-gsp-8">
          <Link
            href="/changelog"
            className="text-body-sm text-muted-foreground hover:text-primary transition-colors"
            style={{
              transitionDuration: "var(--gsp-motion-normal)",
              transitionTimingFunction: "var(--gsp-motion-easing)",
            }}
          >
            &larr; Back to Changelog
          </Link>
        </nav>

        {/* Post header */}
        <header>
          <time
            dateTime={iso}
            className="text-overline text-muted-foreground mt-gsp-8 block"
          >
            {display}
          </time>

          <h1
            id="post-title"
            className="text-h1 text-foreground tracking-tight mt-2"
          >
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div
              className="mt-gsp-4 flex flex-wrap gap-2"
              role="list"
              aria-label="Tags"
            >
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" role="listitem">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <Separator className="my-gsp-8" aria-hidden="true" />

        {/* Prose body */}
        <div>
          <MdxContent components={mdxComponents} />
        </div>

        {/* Post footer */}
        <Separator className="my-gsp-8" aria-hidden="true" />

        <nav aria-label="Breadcrumb" className="pb-gsp-16">
          <Link
            href="/changelog"
            className="text-body-sm text-muted-foreground hover:text-primary transition-colors"
            style={{
              transitionDuration: "var(--gsp-motion-normal)",
              transitionTimingFunction: "var(--gsp-motion-easing)",
            }}
          >
            &larr; Back to Changelog
          </Link>
        </nav>
      </article>
    </div>
  );
}
