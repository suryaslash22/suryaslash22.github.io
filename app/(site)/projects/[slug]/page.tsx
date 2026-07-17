import Link from "next/link";
import { notFound } from "next/navigation";
import { projectItems } from "@/data/projects";
import { projectContent } from "../../project-content";
import { idToSlug, slugToId } from "../../lib/slug";

export function generateStaticParams() {
  return projectItems.map((project) => ({ slug: idToSlug(project.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectItems.find((p) => p.id === slugToId(slug));
  return { title: project?.title ?? "Project" };
}

export default async function ProjectDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = slugToId(slug);
  const project = projectItems.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const content = projectContent[project.id];

  const links = [
    project.liveUrl ? { label: "Live", href: project.liveUrl } : null,
    project.githubUrl ? { label: "GitHub", href: project.githubUrl } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <article>
      <p className="text-sm text-neutral-500">
        <Link
          href="/projects"
          className="hover:text-sky-700 hover:underline"
        >
          Projects
        </Link>{" "}
        / {project.title}
      </p>

      <h1 className="mt-2 text-3xl font-semibold text-neutral-900">{project.title}</h1>

      {links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-sky-400 hover:text-sky-700"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900">Overview</h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          {project.longDescription ?? project.description}
        </p>
      </section>

      {content && (
        <>
          <section className="mt-10 border-t border-neutral-200 pt-8">
            <h2 className="text-lg font-semibold text-neutral-900">Problem</h2>
            <p className="mt-3 leading-relaxed text-neutral-700">{content.problem}</p>
          </section>

          <section className="mt-10 border-t border-neutral-200 pt-8">
            <h2 className="text-lg font-semibold text-neutral-900">Solution</h2>
            <p className="mt-3 leading-relaxed text-neutral-700">{content.solution}</p>
          </section>

          <section className="mt-10 border-t border-neutral-200 pt-8">
            <h2 className="text-lg font-semibold text-neutral-900">Architecture</h2>
            <p className="mt-3 leading-relaxed text-neutral-700">
              {content.architecture}
            </p>
          </section>
        </>
      )}

      <section className="mt-10 border-t border-neutral-200 pt-8">
        <h2 className="text-lg font-semibold text-neutral-900">Technology Stack</h2>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-700">
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </section>

      {content && (
        <>
          <section className="mt-10 border-t border-neutral-200 pt-8">
            <h2 className="text-lg font-semibold text-neutral-900">Challenges</h2>
            <p className="mt-3 leading-relaxed text-neutral-700">{content.challenges}</p>
          </section>

          <section className="mt-10 border-t border-neutral-200 pt-8">
            <h2 className="text-lg font-semibold text-neutral-900">Lessons Learned</h2>
            <p className="mt-3 leading-relaxed text-neutral-700">
              {content.lessonsLearned}
            </p>
          </section>
        </>
      )}

      <section className="mt-10 border-t border-neutral-200 pt-8">
        <h2 className="text-lg font-semibold text-neutral-900">Media</h2>
        {project.imageSrc ? (
          <img
            src={project.imageSrc}
            alt={`${project.title} preview`}
            className="mt-3 max-w-md rounded border border-neutral-200"
          />
        ) : (
          <p className="mt-3 text-sm text-neutral-500">No media available.</p>
        )}
      </section>

      <section className="mt-10 border-t border-neutral-200 pt-8">
        <Link
          href="/projects"
          className="text-sm text-sky-700 hover:underline"
        >
          ← Back to all projects
        </Link>
      </section>
    </article>
  );
}
