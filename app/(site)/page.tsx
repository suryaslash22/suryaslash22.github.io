import Link from "next/link";
import { profileData } from "@/data/profile";
import { experienceItems } from "@/data/experience";
import { aboutBentoItems } from "@/data/about";

const focusItems = [
  "Building modern, accessible web applications",
  "Exploring AI-assisted development workflows",
  "Improving accessibility across the products I build",
  "Learning continuously — new tools, patterns, and languages",
];

const companyNames = experienceItems.map((e) => e.company).join(", ");

function bentoValue(id: string, fallback: string) {
  return aboutBentoItems.find((item) => item.id === id)?.value ?? fallback;
}

export default function DocsPortfolioHome() {
  return (
    <article>
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">{profileData.name}</h1>
        <p className="mt-1 text-neutral-600">{profileData.title}</p>
        <p className="mt-4 leading-relaxed text-neutral-700">
          A full-stack software engineer who enjoys turning complex problems into
          software that is reliable, accessible, and pleasant to use.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-neutral-900">Welcome</h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          This is a documentation-style version of my portfolio — the same
          background and work, presented as a simple set of reference pages
          instead of a marketing-style homepage. Use the sidebar to browse
          through my experience, projects, skills, and how to reach me.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-neutral-900">Current Focus</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-neutral-700">
          {focusItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-neutral-900">Professional Snapshot</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="w-40 shrink-0 font-medium text-neutral-900">Education</dt>
            <dd className="text-neutral-700">
              {bentoValue(
                "education",
                "M.Sc. Applied Computer Science, SRH Heidelberg; B.Sc. Computer Science, Webster University Geneva"
              )}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="w-40 shrink-0 font-medium text-neutral-900">Experience</dt>
            <dd className="text-neutral-700">4+ years — {companyNames}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="w-40 shrink-0 font-medium text-neutral-900">Current Location</dt>
            <dd className="text-neutral-700">{profileData.location}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="w-40 shrink-0 font-medium text-neutral-900">Interests</dt>
            <dd className="text-neutral-700">
              {bentoValue("interests", "Chess, Scrabble, Languages, AI, Travel")}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-neutral-900">Explore</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/projects", label: "Projects" },
            { href: "/experience", label: "Experience" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition-colors hover:border-sky-300 hover:text-sky-700"
            >
              {link.label} →
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
