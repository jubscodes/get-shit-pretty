import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border" role="contentinfo">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-gsp-4 px-gsp-4 py-gsp-8 sm:flex-row sm:px-gsp-6 lg:px-gsp-8">
        {/* Brand mark */}
        <p className="text-body-sm text-muted-foreground font-mono">
          /gsp: {"\u25c7\u25c7"}
        </p>

        {/* Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-gsp-2 text-caption text-muted-foreground">
            <li>
              <Link
                href="https://www.npmjs.com/package/get-shit-pretty"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
                style={{
                  transitionDuration: "var(--gsp-motion-normal)",
                  transitionTimingFunction: "var(--gsp-motion-easing)",
                }}
              >
                npm
              </Link>
            </li>
            <li aria-hidden="true">{"\u00b7"}</li>
            <li>
              <Link
                href="https://github.com/jubscodes/get-shit-pretty"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
                style={{
                  transitionDuration: "var(--gsp-motion-normal)",
                  transitionTimingFunction: "var(--gsp-motion-easing)",
                }}
              >
                GitHub
              </Link>
            </li>
            <li aria-hidden="true">{"\u00b7"}</li>
            <li>
              <Link
                href="https://github.com/jubscodes/get-shit-pretty/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
                style={{
                  transitionDuration: "var(--gsp-motion-normal)",
                  transitionTimingFunction: "var(--gsp-motion-easing)",
                }}
              >
                MIT
              </Link>
            </li>
            <li aria-hidden="true">{"\u00b7"}</li>
            <li>
              <span>
                Set in{" "}
                <Link
                  href="https://pangrampangram.com/products/model"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                  style={{
                    transitionDuration: "var(--gsp-motion-normal)",
                    transitionTimingFunction: "var(--gsp-motion-easing)",
                  }}
                >
                  PP Model
                </Link>
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
