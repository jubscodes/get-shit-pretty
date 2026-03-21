import type { Metadata } from "next";
import Link from "next/link";
import { getChangelogEntries } from "@/lib/content";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Changelog -- Get Shit Pretty",
  description:
    "All notable changes to Get Shit Pretty, the design engineering system for AI coding agents.",
};

function formatDate(dateString: string): { display: string; iso: string } {
  const date = new Date(dateString);
  const display = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  return { display: display.toUpperCase(), iso: dateString };
}

export default function ChangelogPage() {
  const entries = getChangelogEntries();

  return (
    <div className="max-w-2xl mx-auto px-gsp-4 sm:px-gsp-6 lg:px-gsp-12">
      <h1 className="text-h1 text-foreground tracking-tight pt-gsp-16 pb-gsp-8">
        Changelog
      </h1>

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div role="feed" aria-label="Changelog entries">
          {entries.map((entry, index) => {
            const { display, iso } = formatDate(entry.date);

            return (
              <div key={entry.slug}>
                {index > 0 && (
                  <Separator className="my-gsp-8" aria-hidden="true" />
                )}

                <article
                  aria-posinset={index + 1}
                  aria-setsize={entries.length}
                >
                  <time
                    dateTime={iso}
                    className="text-overline text-muted-foreground"
                  >
                    {display}
                  </time>

                  <h2 className="mt-2">
                    <Link
                      href={`/changelog/${entry.slug}`}
                      className="text-h2 text-foreground tracking-tight hover:text-primary transition-colors"
                      style={{
                        transitionDuration: "var(--gsp-motion-normal)",
                        transitionTimingFunction: "var(--gsp-motion-easing)",
                      }}
                    >
                      {entry.title}
                    </Link>
                  </h2>

                  <p className="text-body-sm text-muted-foreground leading-relaxed mt-3 max-w-prose">
                    {entry.excerpt}
                  </p>

                  {entry.tags.length > 0 && (
                    <div
                      className="mt-4 flex flex-wrap gap-2"
                      role="list"
                      aria-label="Tags"
                    >
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" role="listitem">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom spacing */}
      <div className="pb-gsp-16" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-gsp-16">
      <p className="text-h2 text-muted-foreground" aria-hidden="true">
        {"\u25c7"}
      </p>
      <p className="text-body text-muted-foreground mt-gsp-4">
        Nothing here yet.
      </p>
      <div className="mt-gsp-6">
        <Button variant="outline" render={<a href="https://github.com/jubscodes/get-shit-pretty" target="_blank" rel="noopener noreferrer" />}>
          Watch on GitHub
        </Button>
      </div>
    </div>
  );
}
