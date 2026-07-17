import Link from "next/link";
import { flyable } from "../../../data";

export default function FlyableMinimal() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-background px-6 py-16 text-foreground sm:px-10">
      <div />

      <main className="mx-auto w-full max-w-md">
        <Link
          href="/concepts/minimal"
          className="text-xs text-foreground/40 hover:text-foreground/70"
        >
          ← Sudharsan Surya
        </Link>

        <h1 className="mt-6 text-2xl font-medium">{flyable.title}</h1>
        <p className="mt-1 text-foreground/60">{flyable.tagline}</p>

        <p className="mt-8 leading-relaxed text-foreground/80">
          {flyable.summary}
        </p>

        <p className="mt-6 leading-relaxed text-foreground/70">
          {flyable.approach}
        </p>

        <p className="mt-6 leading-relaxed text-foreground/70">
          {flyable.outcome}
        </p>

        <p className="mt-8 text-sm text-foreground/40">
          {flyable.stack.join(" · ")}
        </p>
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
