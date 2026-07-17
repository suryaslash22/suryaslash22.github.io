import Link from "next/link";
import { profile, experience, education, projectStubs } from "../data";

export default function EditorialConcept() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-2xl px-6 py-24 sm:py-32">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">
          {profile.location}
        </p>

        <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
          {profile.name}
        </h1>

        <p className="mt-4 text-xl text-muted">{profile.role}</p>

        <p className="mt-10 max-w-prose text-lg leading-relaxed text-foreground/90">
          I build software for teams who need to move quickly without breaking
          the things that matter. Most recently that has meant flight-operations
          tooling at Airbus; before that, a founding role at an early-stage
          climate startup, and a handful of years spent between contract work
          and legal-tech. Outside of work I play a fair amount of chess and
          Scrabble, and I am slowly working through a list of languages I have
          no practical reason to learn.
        </p>

        <section className="mt-20">
          <h2 className="font-serif text-2xl">Where I've worked</h2>
          <div className="mt-8 space-y-10">
            {experience.map((entry) => (
              <div key={entry.company} className="max-w-prose">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-medium">{entry.company}</h3>
                  <span className="text-sm text-muted">{entry.dates}</span>
                </div>
                <p className="mt-1 text-base text-foreground/80">{entry.title}</p>
                <p className="mt-2 leading-relaxed text-foreground/70">
                  {entry.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-2xl">Education</h2>
          <div className="mt-8 space-y-4">
            {education.map((entry) => (
              <div key={entry.degree} className="flex flex-wrap justify-between gap-x-4 max-w-prose">
                <p>
                  {entry.degree} <span className="text-muted">— {entry.school}</span>
                </p>
                <span className="text-sm text-muted">{entry.year}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-2xl">A recent piece</h2>
          <div className="mt-8 max-w-prose">
            <Link
              href="/concepts/editorial/projects/flyable"
              className="group inline-block"
            >
              <h3 className="text-lg font-medium underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-foreground">
                Flyable — a flight-delay forecasting tool for casual travelers
              </h3>
            </Link>
            <p className="mt-2 leading-relaxed text-foreground/70">
              Notes on turning three years of aviation delay data into a
              three-tier risk score people actually trust.
            </p>
          </div>
          <ul className="mt-6 space-y-2 max-w-prose">
            {projectStubs
              .filter((p) => p.slug !== "flyable")
              .map((p) => (
                <li key={p.slug} className="text-foreground/70">
                  <span className="text-foreground">{p.title}</span> — {p.oneLiner}
                </li>
              ))}
          </ul>
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
