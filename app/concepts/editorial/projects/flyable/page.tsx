import Link from "next/link";
import { flyable } from "../../../data";

export default function FlyableEditorial() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-2xl px-6 py-24 sm:py-32">
        <Link
          href="/concepts/editorial"
          className="text-sm text-muted underline underline-offset-4 hover:text-foreground"
        >
          ← Back
        </Link>

        <p className="mt-10 text-sm uppercase tracking-[0.2em] text-muted">
          Case study
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
          {flyable.title}
        </h1>
        <p className="mt-4 max-w-prose text-xl text-foreground/80">
          {flyable.tagline}
        </p>

        <p className="mt-10 max-w-prose text-lg leading-relaxed text-foreground/90">
          {flyable.summary}
        </p>

        <section className="mt-16 max-w-prose">
          <h2 className="font-serif text-2xl">The problem</h2>
          <p className="mt-4 leading-relaxed text-foreground/80">
            {flyable.problem}
          </p>
        </section>

        <section className="mt-16 max-w-prose">
          <h2 className="font-serif text-2xl">The approach</h2>
          <p className="mt-4 leading-relaxed text-foreground/80">
            {flyable.approach}
          </p>
        </section>

        <section className="mt-16 max-w-prose">
          <h2 className="font-serif text-2xl">Stack</h2>
          <p className="mt-4 leading-relaxed text-foreground/70">
            {flyable.stack.join(" · ")}
          </p>
        </section>

        <section className="mt-16 max-w-prose">
          <h2 className="font-serif text-2xl">Outcome</h2>
          <p className="mt-4 leading-relaxed text-foreground/80">
            {flyable.outcome}
          </p>
        </section>

        <section className="mt-16 max-w-prose space-y-6">
          {flyable.body.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-foreground/80">
              {paragraph}
            </p>
          ))}
        </section>

        <footer className="mt-24 border-t border-border/20 pt-8 text-sm text-muted">
          <p>Other explorations of this homepage:</p>
          <nav className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <Link className="underline underline-offset-4 hover:text-foreground" href="/concepts/wiki">wiki</Link>
            <Link className="underline underline-offset-4 hover:text-foreground" href="/concepts/documentation">documentation</Link>
            <Link className="underline underline-offset-4 hover:text-foreground" href="/concepts/minimal">minimal</Link>
          </nav>
        </footer>
      </main>
    </div>
  );
}
