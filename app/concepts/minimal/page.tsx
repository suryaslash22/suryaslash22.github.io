import Link from "next/link";
import { profile } from "../data";

export default function MinimalConcept() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-background px-6 py-16 text-foreground sm:px-10">
      <div />

      <main className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-medium">{profile.name}</h1>
        <p className="mt-1 text-foreground/60">{profile.role}</p>
        <p className="text-foreground/60">{profile.location}</p>

        <p className="mt-8 leading-relaxed text-foreground/80">
          I write software, mostly for aviation and startup teams. Currently
          at Airbus, previously a founding engineer at Ketl.io.
        </p>

        <div className="mt-10 flex flex-col gap-1.5 text-sm">
          <Link
            href="/concepts/minimal/projects/flyable"
            className="w-fit text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Flyable, a project →
          </Link>
          <a
            href="mailto:suryaslash22@gmail.com"
            className="w-fit text-foreground/60 underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            suryaslash22@gmail.com
          </a>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-md text-xs text-foreground/40">
        <nav className="flex flex-wrap gap-x-3 gap-y-1">
          <Link className="hover:text-foreground/70" href="/concepts/editorial">editorial</Link>
          <Link className="hover:text-foreground/70" href="/concepts/wiki">wiki</Link>
          <Link className="hover:text-foreground/70" href="/concepts/documentation">documentation</Link>
        </nav>
      </footer>
    </div>
  );
}
