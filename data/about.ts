import type { LucideIcon } from "lucide-react";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
  Target,
  Heart,
} from "lucide-react";

export interface AboutBentoItem {
  id: string;
  title: string;
  value: string;
  icon: LucideIcon;
  className?: string;
}

export const aboutContent = {
  eyebrow: "About",
  title: "Building reliable software for real-world impact",
  paragraphs: [
    "I'm a software engineer passionate about building reliable, scalable software that solves real-world problems. Throughout my career I've worked across startups, enterprise environments, and international organizations, giving me experience with both rapid product development and large-scale engineering practices.",
    "Outside software, I enjoy competitive chess, competitive Scrabble, languages, and exploring how technology can make everyday tasks simpler and more accessible.",
    "I'm based in Düsseldorf, Germany, and have lived, studied, and worked across India, Switzerland, Germany, and the United States.",
  ],
};

export const aboutBentoItems: AboutBentoItem[] = [
  {
    id: "education",
    title: "Education",
    value: "M.Sc. Applied Computer Science — SRH Heidelberg",
    icon: GraduationCap,
    className: "md:col-span-2",
  },
  {
    id: "focus",
    title: "Current Focus",
    value: "Full-stack applications, AI-assisted workflows, and accessibility",
    icon: Target,
    className: "md:col-span-2",
  },
  {
    id: "languages",
    title: "Languages",
    value: "English, German, Tamil",
    icon: Languages,
    className: "md:col-span-1",
  },
  {
    id: "experience",
    title: "Experience",
    value: "Startups, enterprise, international organizations",
    icon: Briefcase,
    className: "md:col-span-1",
  },
  {
    id: "interests",
    title: "Interests",
    value: "Chess, Scrabble, languages, AI, accessibility, travel",
    icon: Heart,
    className: "md:col-span-2",
  },
  {
    id: "location",
    title: "Location",
    value: "Düsseldorf, Germany",
    icon: MapPin,
    className: "md:col-span-1",
  },
];
