import Link from "next/link";
import { profile, experience, education, projectStubs } from "../data";

export default function WikiConcept() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="border-b border-border/20 pb-4">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span className="text-foreground">Sudharsan-Wiki</span>
            <span>·</span>
            <a href="#experience" className="hover:text-foreground hover:underline">Experience</a>
            <a href="#education" className="hover:text-foreground hover:underline">Education</a>
            <a href="#projects" className="hover:text-foreground hover:underline">Projects</a>
            <a href="#interests" className="hover:text-foreground hover:underline">Interests</a>
          </nav>
        </header>

        <main className="mt-10">
          <h1 className="text-3xl font-semibold">{profile.name}</h1>
          <p className="mt-1 text-muted">
            {profile.role} · {profile.location}
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-foreground/80">
            This page is the personal index for {profile.name} — a small wiki
            of where I've worked, what I've studied, and what I've built.
            Follow the links below, or jump straight to{" "}
            <Link href="/concepts/wiki/projects/flyable" className="text-accent hover:underline">
              [[Flyable]]
            </Link>
            , the most recently updated entry.
          </p>

          <section id="experience" className="mt-12">
            <h2 className="border-b border-border/10 pb-2 text-lg font-semibold">
              Experience
            </h2>
            <ul className="mt-4 divide-y divide-border/10">
              {experience.map((entry) => (
                <li key={entry.company} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="font-medium">{entry.company}</span>
                    <span className="text-sm text-muted">{entry.dates}</span>
                  </div>
                  <p className="text-sm text-foreground/70">{entry.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                    {entry.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section id="education" className="mt-12">
            <h2 className="border-b border-border/10 pb-2 text-lg font-semibold">
              Education
            </h2>
            <ul className="mt-4 space-y-2">
              {education.map((entry) => (
                <li key={entry.degree} className="flex flex-wrap justify-between gap-x-4 text-sm">
                  <span>
                    {entry.degree} — <span className="text-muted">{entry.school}</span>
                  </span>
                  <span className="text-muted">{entry.year}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="projects" className="mt-12">
            <h2 className="border-b border-border/10 pb-2 text-lg font-semibold">
              Projects
            </h2>
            <ul className="mt-4 space-y-3">
              {projectStubs.map((p) =>
                p.slug === "flyable" ? (
                  <li key={p.slug} className="text-sm">
                    <Link href="/concepts/wiki/projects/flyable" className="text-accent hover:underline">
                      {p.title}
                    </Link>{" "}
                    <span className="text-foreground/60">— {p.oneLiner}</span>
                  </li>
                ) : (
                  <li key={p.slug} className="text-sm text-foreground/60">
                    <span className="text-foreground/80">{p.title}</span> — {p.oneLiner}
                    <span className="ml-1 text-xs text-muted">(stub, no page yet)</span>
                  </li>
                )
              )}
            </ul>
          </section>

          <section id="interests" className="mt-12">
            <h2 className="border-b border-border/10 pb-2 text-lg font-semibold">
              Interests
            </h2>
            <p className="mt-4 text-sm text-foreground/70">
              {profile.interests.join(" · ")}
            </p>
          </section>

          <section className="mt-12 border-t border-border/10 pt-4 text-xs text-muted">
            <p>Backlinks: none yet — this is a root page.</p>
          </section>
        </main>

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
