import Link from "next/link";
import { flyable } from "../../../data";

export default function FlyableDocs() {
  return (
    <article className="max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Projects / Flyable
      </p>
      <h1 className="mt-2 text-3xl font-semibold">{flyable.title}</h1>
      <p className="mt-2 text-foreground/70">{flyable.tagline}</p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold" id="summary">
          Summary
        </h2>
        <p className="mt-3 leading-relaxed text-foreground/80">
          {flyable.summary}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold" id="problem">
          Problem
        </h2>
        <p className="mt-3 leading-relaxed text-foreground/80">
          {flyable.problem}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold" id="approach">
          Approach
        </h2>
        <p className="mt-3 leading-relaxed text-foreground/80">
          {flyable.approach}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold" id="stack">
          Stack
        </h2>
        <ul className="mt-3 space-y-1 rounded border border-border/10 bg-card/40 p-4 font-mono text-sm">
          {flyable.stack.map((tech) => (
            <li key={tech} className="text-foreground/80">
              <span className="text-accent">→</span> {tech}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold" id="outcome">
          Outcome
        </h2>
        <p className="mt-3 leading-relaxed text-foreground/80">
          {flyable.outcome}
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold" id="notes">
          Additional notes
        </h2>
        {flyable.body.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-foreground/70">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="mt-10 rounded border border-border/10 bg-card/40 p-4">
        <p className="text-sm">
          <Link href="/concepts/documentation" className="text-accent hover:underline">
            ← Back to overview
          </Link>
        </p>
      </section>
    </article>
  );
}
