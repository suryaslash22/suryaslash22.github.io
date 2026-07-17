import Link from "next/link";

const nav = [
  {
    heading: "Overview",
    links: [{ href: "/concepts/documentation", label: "Introduction" }],
  },
  {
    heading: "Projects",
    links: [
      { href: "/concepts/documentation/projects/flyable", label: "Flyable" },
    ],
  },
  {
    heading: "Other concepts",
    links: [
      { href: "/concepts/editorial", label: "Editorial" },
      { href: "/concepts/wiki", label: "Wiki" },
      { href: "/concepts/minimal", label: "Minimal" },
    ],
  },
];

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden w-56 shrink-0 border-r border-border/10 px-6 py-10 md:block">
          <Link href="/concepts/documentation" className="text-sm font-semibold">
            Sudharsan Surya — Docs
          </Link>
          <nav className="mt-8 space-y-6">
            {nav.map((group) => (
              <div key={group.heading}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {group.heading}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 px-6 py-10 sm:px-10">{children}</div>
      </div>
    </div>
  );
}
