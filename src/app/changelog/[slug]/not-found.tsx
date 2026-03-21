import Link from "next/link";

export default function ChangelogPostNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-gsp-4 sm:px-gsp-6 lg:px-gsp-12">
      <div className="text-center py-gsp-16">
        <p className="text-h2 text-muted-foreground" aria-hidden="true">
          {"\u25c7"}
        </p>
        <h1 className="text-h1 text-foreground mt-gsp-4">Post not found</h1>
        <p className="text-body text-muted-foreground mt-gsp-4">
          The changelog entry you are looking for does not exist.
        </p>
        <div className="mt-gsp-8">
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
        </div>
      </div>
    </div>
  );
}
