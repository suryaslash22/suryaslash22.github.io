import Link from "next/link";
import { flyable, projectStubs } from "../../../data";

export default function FlyableWiki() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="border-b border-border/20 pb-4">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <Link href="/concepts/wiki" className="text-foreground hover:underline">
              Sudharsan-Wiki
            </Link>
            <span>/</span>
            <span>Projects</span>
            <span>/</span>
            <span className="text-foreground">Flyable</span>
          </nav>
        </header>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row">
          <main className="flex-1">
            <h1 className="text-3xl font-semibold">{flyable.title}</h1>
            <p className="mt-1 text-muted">{flyable.tagline}</p>

            <section className="mt-8">
              <h2 className="border-b border-border/10 pb-2 text-lg font-semibold">
                Summary
              </h2>
              <p className="mt-4 leading-relaxed text-foreground/80">
                {flyable.summary}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="border-b border-border/10 pb-2 text-lg font-semibold">
                Problem
              </h2>
              <p className="mt-4 leading-relaxed text-foreground/80">
                {flyable.problem}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="border-b border-border/10 pb-2 text-lg font-semibold">
                Approach
              </h2>
              <p className="mt-4 leading-relaxed text-foreground/80">
                {flyable.approach}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="border-b border-border/10 pb-2 text-lg font-semibold">
                Outcome
              </h2>
              <p className="mt-4 leading-relaxed text-foreground/80">
                {flyable.outcome}
              </p>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="border-b border-border/10 pb-2 text-lg font-semibold">
                Notes
              </h2>
              {flyable.body.map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-foreground/70">
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="mt-8">
              <h2 className="border-b border-border/10 pb-2 text-lg font-semibold">
                See also
              </h2>
              <ul className="mt-4 space-y-1 text-sm">
                {projectStubs
                  .filter((p) => p.slug !== "flyable")
                  .map((p) => (
                    <li key={p.slug} className="text-foreground/60">
                      {p.title} — {p.oneLiner}
                    </li>
                  ))}
                <li>
                  <Link href="/concepts/wiki" className="text-accent hover:underline">
                    Sudharsan-Wiki (home)
                  </Link>
                </li>
              </ul>
            </section>
          </main>

          <aside className="w-full shrink-0 border border-border/20 p-4 text-sm lg:w-64">
            <p className="font-semibold text-foreground">Infobox</p>
            <dl className="mt-3 space-y-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">Type</dt>
                <dd>Side project</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">Status</dt>
                <dd>Active prototype</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">Stack</dt>
                <dd>{flyable.stack.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">Coverage</dt>
                <dd>40+ European routes</dd>
              </div>
            </dl>
          </aside>
        </div>

        <footer className="mt-16 border-t border-border/20 pt-6 text-xs text-muted">
          <p>Other explorations of this homepage:</p>
          <nav className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <Link className="underline underline-offset-4 hover:text-foreground" href="/concepts/editorial">editorial</Link>
            <Link className="underline underline-offset-4 hover:text-foreground" href="/concepts/documentation">documentation</Link>
            <Link className="underline underline-offset-4 hover:text-foreground" href="/concepts/minimal">minimal</Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
