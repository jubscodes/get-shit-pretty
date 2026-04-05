import Link from "next/link";

export function SiteHeader() {
  return (
    <>
      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-primary text-primary-foreground px-4 py-2 rounded-sm font-sans text-body-sm"
      >
        Skip to content
      </a>

      <header
        className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm"
        role="banner"
      >
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-gsp-4 sm:px-gsp-6 lg:px-gsp-8">
          {/* Brand mark */}
          <Link
            href="/"
            className="font-mono font-bold text-body-sm tracking-wide text-gsp-bright transition-colors hover:text-primary"
            style={{
              transitionDuration: "var(--gsp-motion-normal)",
              transitionTimingFunction: "var(--gsp-motion-easing)",
            }}
          >
            /gsp {"\u25c7\u25c7"}
          </Link>

          {/* Navigation */}
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-gsp-6">
              <li>
                <Link
                  href="/changelog"
                  className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
                  style={{
                    transitionDuration: "var(--gsp-motion-normal)",
                    transitionTimingFunction: "var(--gsp-motion-easing)",
                  }}
                >
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/jubscodes/get-shit-pretty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="GitHub repository (opens in new tab)"
                  style={{
                    transitionDuration: "var(--gsp-motion-normal)",
                    transitionTimingFunction: "var(--gsp-motion-easing)",
                  }}
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
