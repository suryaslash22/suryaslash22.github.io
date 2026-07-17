import Link from "next/link";
import { profile, experience, education } from "../data";

export default function DocumentationConcept() {
  return (
    <article className="max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Introduction
      </p>
      <h1 className="mt-2 text-3xl font-semibold">{profile.name}</h1>
      <p className="mt-2 text-foreground/70">
        {profile.role} · {profile.location}
      </p>

      <p className="mt-6 leading-relaxed text-foreground/80">
        This is the reference page for my background — a quick overview of
        where I've worked, what I studied, and where to find writeups of
        individual projects. Use the sidebar to jump to project pages, or
        keep reading for the full history.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold" id="experience">
          Experience
        </h2>
        <div className="mt-4 space-y-6 border-l border-border/10 pl-5">
          {experience.map((entry) => (
            <div key={entry.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-medium">{entry.company}</h3>
                <span className="text-xs text-muted">{entry.dates}</span>
              </div>
              <p className="text-sm text-foreground/60">{entry.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold" id="education">
          Education
        </h2>
        <table className="mt-4 w-full text-sm">
          <tbody>
            {education.map((entry) => (
              <tr key={entry.degree} className="border-b border-border/10">
                <td className="py-2 pr-4">{entry.degree}</td>
                <td className="py-2 pr-4 text-foreground/60">{entry.school}</td>
                <td className="py-2 text-right text-muted">{entry.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold" id="interests">
          Interests
        </h2>
        <p className="mt-4 text-sm text-foreground/70">
          {profile.interests.join(" · ")}
        </p>
      </section>

      <section className="mt-10 rounded border border-border/10 bg-card/40 p-4">
        <p className="text-sm">
          Next:{" "}
          <Link
            href="/concepts/documentation/projects/flyable"
            className="text-accent hover:underline"
          >
            Flyable — technical case study →
          </Link>
        </p>
      </section>
    </article>
  );
}
