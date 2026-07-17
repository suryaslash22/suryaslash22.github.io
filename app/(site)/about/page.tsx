import type { Metadata } from "next";
import { aboutContent } from "@/data/about";

export const metadata: Metadata = { title: "About" };

export default function DocsPortfolioAbout() {
  return (
    <article>
      <h1 className="text-3xl font-semibold text-neutral-900">About</h1>
      <p className="mt-2 text-neutral-600">{aboutContent.title}</p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900">Introduction</h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          {aboutContent.paragraphs[0]}
        </p>
      </section>

      <section className="mt-10 border-t border-neutral-200 pt-8">
        <h2 className="text-lg font-semibold text-neutral-900">Education</h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          M.Sc. Applied Computer Science, SRH Heidelberg. Prior to that, B.Sc.
          Computer Science, Webster University Geneva, after transferring from
          New York University. My studies spanned both applied engineering
          practice and a broader liberal-arts foundation, which shaped how I
          approach problems today.
        </p>
      </section>

      <section className="mt-10 border-t border-neutral-200 pt-8">
        <h2 className="text-lg font-semibold text-neutral-900">
          Professional Journey
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          {aboutContent.paragraphs[2]}
        </p>
        <p className="mt-3 leading-relaxed text-neutral-700">
          I&apos;ve worked across startups, enterprise environments, and
          international organizations, giving me experience with both rapid
          product development and large-scale engineering practices. A
          detailed breakdown of each role is available on the Experience page.
        </p>
      </section>

      <section className="mt-10 border-t border-neutral-200 pt-8">
        <h2 className="text-lg font-semibold text-neutral-900">
          Engineering Philosophy
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          I favor reliable, well-understood solutions over clever ones —
          software that keeps working after I&apos;ve moved on to the next
          problem. Accessibility and clarity aren&apos;t an afterthought for
          me; I try to build them into the first draft of a feature, not the
          last. Most of what I write is meant to be maintained by someone
          else eventually, so I try to write it that way.
        </p>
      </section>

      <section className="mt-10 border-t border-neutral-200 pt-8">
        <h2 className="text-lg font-semibold text-neutral-900">
          Outside Engineering
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          {aboutContent.paragraphs[1]}
        </p>
      </section>
    </article>
  );
}
