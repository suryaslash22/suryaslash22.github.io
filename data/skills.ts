export interface SkillCategory {
  id: string;
  title: string;
  technologies: string[];
  className?: string;
}

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    technologies: ["Angular", "Vue.js", "Flutter", "HTML", "CSS", "TypeScript"],
    className: "md:col-span-2 md:row-span-1",
  },
  {
    id: "backend",
    title: "Backend",
    technologies: ["Python", "C++", "NodeJS", "ExpressJS", "Django", "Dash"],
    className: "md:col-span-1",
  },
  {
    id: "databases",
    title: "Databases",
    technologies: ["MongoDB", "SQL"],
    className: "md:col-span-1",
  },
  {
    id: "devops",
    title: "DevOps",
    technologies: ["Docker", "Git", "Google Cloud Platform", "Agile"],
    className: "md:col-span-2",
  },
  {
    id: "automation",
    title: "Automation",
    technologies: ["Selenium"],
    className: "md:col-span-1",
  },
  {
    id: "tools",
    title: "Tools",
    technologies: ["Unity Game Engine", "Adobe Photoshop", "MS Office"],
    className: "md:col-span-1",
  },
];
