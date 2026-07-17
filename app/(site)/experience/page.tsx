import type { Metadata } from "next";
import { experienceItems } from "@/data/experience";

export const metadata: Metadata = { title: "Experience" };

export default function DocsPortfolioExperience() {
  return (
    <article>
      <h1 className="text-3xl font-semibold text-neutral-900">Experience</h1>
      <p className="mt-2 text-neutral-600">
        A record of where I&apos;ve worked and what I built.
      </p>

      <div className="mt-10 space-y-10">
        {experienceItems.map((entry) => (
          <section
            key={entry.id}
            className="border-t border-neutral-200 pt-6 first:border-t-0 first:pt-0"
          >
            <h2 className="text-xl font-semibold text-neutral-900">{entry.company}</h2>
            <p className="mt-1 text-sm text-neutral-600">
              {entry.role}
              {entry.location ? ` · ${entry.location}` : ""}
            </p>
            <p className="text-sm text-neutral-500">{entry.date}</p>

            <div className="mt-4">
              <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                Responsibilities
              </h3>
              <p className="mt-2 leading-relaxed text-neutral-700">{entry.description}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                Technologies
              </h3>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-700">
                {entry.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
