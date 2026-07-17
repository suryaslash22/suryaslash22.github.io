"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { profileData } from "@/data/profile";

const primaryNav = [
  { href: "/", label: "Introduction" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/extracurriculars", label: "Extracurriculars" },
  { href: "/contact", label: "Contact" },
];

const externalNav = [
  { href: profileData.github, label: "GitHub" },
  { href: profileData.linkedin, label: "LinkedIn" },
  { href: profileData.resumeUrl, label: "Resume" },
];

const archiveNav = [
  { href: "/archive/index.html", label: "Previous website" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 space-y-6">
      <div>
        <ul className="space-y-1">
          {primaryNav.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`block border-l-2 py-1 pl-3 text-sm transition-colors ${
                    isActive
                      ? "border-sky-600 font-medium text-neutral-900"
                      : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <p className="pl-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
          External
        </p>
        <ul className="mt-2 space-y-1">
          {externalNav.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-l-2 border-transparent py-1 pl-3 text-sm text-neutral-500 transition-colors hover:border-neutral-300 hover:text-sky-700"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="pl-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
          Archive
        </p>
        <ul className="mt-2 space-y-1">
          {archiveNav.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-l-2 border-transparent py-1 pl-3 text-sm text-neutral-500 transition-colors hover:border-neutral-300 hover:text-sky-700"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 md:hidden">
        <Link href="/" className="text-sm font-semibold text-neutral-900">
          {profileData.name}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded border border-neutral-200 px-3 py-1 text-sm text-neutral-700"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-b border-neutral-200 transition-[max-height] duration-200 ease-in-out md:hidden ${
          open ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-6">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-neutral-200 px-6 py-10 md:block">
        <Link href="/" className="block">
          <p className="text-sm font-semibold text-neutral-900">{profileData.name}</p>
        </Link>
        <NavLinks />
      </aside>
    </>
  );
}
