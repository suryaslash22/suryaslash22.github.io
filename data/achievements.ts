import type { LucideIcon } from "lucide-react";
import { Crown, Trophy, Globe2, Plane } from "lucide-react";

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  link?: string;
  linkLabel?: string;
}

export const achievementItems: AchievementItem[] = [
  {
    id: "chess",
    title: "Competitive Chess",
    description:
      "FIDE-rated international player. Represented India at the World Youth Chess Championships.",
    icon: Crown,
    link: "https://ratings.fide.com/profile/5069424",
    linkLabel: "FIDE profile",
  },
  {
    id: "scrabble",
    title: "Competitive Scrabble",
    description: "Internationally rated Scrabble player. Currently ranked #1 in Germany.",
    icon: Trophy,
    link: "https://wespa.xerafin.net/player.html?id=22653",
    linkLabel: "WESPA profile",
  },
  {
    id: "harvard-mun",
    title: "Harvard Model United Nations",
    description: "Best Delegate award, Harvard Model United Nations, Beijing (2009).",
    icon: Globe2,
  },
  {
    id: "international",
    title: "International Experience",
    description:
      "Lived, studied, and worked across India, the UAE, Switzerland, Germany, and the United States.",
    icon: Plane,
  },
];
