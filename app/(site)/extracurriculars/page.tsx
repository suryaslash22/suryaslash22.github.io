import type { Metadata } from "next";
import { achievementItems } from "@/data/achievements";

export const metadata: Metadata = { title: "Extracurriculars" };

export default function DocsPortfolioExtracurriculars() {
  return (
    <article>
      <h1 className="text-3xl font-semibold text-neutral-900">Extracurriculars</h1>
      <p className="mt-2 text-neutral-600">A few things I do outside the day job.</p>

      <div className="mt-10 space-y-8">
        {achievementItems.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <section
              key={achievement.id}
              className="border-t border-neutral-200 pt-6 first:border-t-0 first:pt-0"
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
                <Icon className="h-4 w-4 text-sky-700" aria-hidden="true" />
                {achievement.title}
              </h2>
              <p className="mt-2 leading-relaxed text-neutral-700">
                {achievement.description}
              </p>
              {achievement.link && (
                <p className="mt-2 text-sm">
                  <a
                    href={achievement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 hover:underline"
                  >
                    {achievement.linkLabel ?? achievement.link}
                  </a>
                </p>
              )}
            </section>
          );
        })}
      </div>
    </article>
  );
}
