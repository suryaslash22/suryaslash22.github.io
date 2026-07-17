import type { Metadata } from "next";
import Link from "next/link";
import { profileData } from "@/data/profile";

export const metadata: Metadata = { title: "Contact" };

export default function DocsPortfolioContact() {
  return (
    <article>
      <h1 className="text-3xl font-semibold text-neutral-900">Get in touch</h1>
      <p className="mt-4 leading-relaxed text-neutral-700">
        {profileData.contactMessage}
      </p>

      <table className="mt-10 w-full text-sm">
        <tbody>
          <tr className="border-b border-neutral-200">
            <td className="py-2 pr-4 text-neutral-500">Email</td>
            <td className="py-2">
              <a
                href={`mailto:${profileData.email}`}
                className="text-sky-700 hover:underline"
              >
                {profileData.email}
              </a>
            </td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="py-2 pr-4 text-neutral-500">GitHub</td>
            <td className="py-2">
              <a
                href={profileData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 hover:underline"
              >
                {profileData.github}
              </a>
            </td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="py-2 pr-4 text-neutral-500">LinkedIn</td>
            <td className="py-2">
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 hover:underline"
              >
                {profileData.linkedin}
              </a>
            </td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="py-2 pr-4 text-neutral-500">Location</td>
            <td className="py-2 text-neutral-700">{profileData.locationFull}</td>
          </tr>
          <tr>
            <td className="py-2 pr-4 text-neutral-500">Resume</td>
            <td className="py-2">
              <a
                href={profileData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 hover:underline"
              >
                Download CV
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <section className="mt-10 border-t border-neutral-200 pt-6">
        <Link href="/" className="text-sm text-sky-700 hover:underline">
          ← Back to overview
        </Link>
      </section>
    </article>
  );
}
