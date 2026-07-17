import type { Metadata } from "next";
import Link from "next/link";
import { projectItems } from "@/data/projects";
import { idToSlug } from "../lib/slug";

export const metadata: Metadata = { title: "Projects" };

export default function DocsPortfolioProjects() {
  return (
    <article>
      <h1 className="text-3xl font-semibold text-neutral-900">Projects</h1>
      <p className="mt-2 text-neutral-600">
        A record of what I&apos;ve built, from thesis work to weekend projects.
      </p>

      <div className="mt-10 space-y-8">
        {projectItems.map((project) => (
          <section
            key={project.id}
            className="border-t border-neutral-200 pt-6 first:border-t-0 first:pt-0"
          >
            <h2 className="text-xl font-semibold text-neutral-900">
              <Link
                href={`/projects/${idToSlug(project.id)}`}
                className="hover:text-sky-700 hover:underline"
              >
                {project.title}
              </Link>
            </h2>
            <p className="mt-2 leading-relaxed text-neutral-700">
              {project.description}
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
              {project.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              <Link
                href={`/projects/${idToSlug(project.id)}`}
                className="text-sky-700 hover:underline"
              >
                Read case study →
              </Link>
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
