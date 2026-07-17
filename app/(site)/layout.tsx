import type { Metadata } from "next";
import Sidebar from "./sidebar";

export const metadata: Metadata = {
  title: {
    default: "Sudharsan Surya",
    template: "%s · Sudharsan Surya",
  },
  description:
    "Sudharsan Surya's portfolio — background, experience, projects, and contact info.",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto flex max-w-6xl flex-col md:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 px-6 py-10 sm:px-10 md:py-14">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
