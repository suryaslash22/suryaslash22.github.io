export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  caseStudyUrl: string;
  imageClass: string;
  heightClass: string;
  imageSrc?: string;
  featured?: boolean;
}

export const projectItems: ProjectItem[] = [
  {
    id: "proj-been",
    title: "Been",
    description:
      "An interactive map tracking every country I've visited, lived in, or called home, with notes and highlights for each stop.",
    longDescription:
      "Been is a personal side project: an interactive world map that plots everywhere I've traveled, studied, or lived, each marked with a short note on the visit. Built as a lightweight static app to explore geospatial data rendering without any backend.",
    technologies: ["Astro", "JavaScript", "GeoJSON", "SVG Maps"],
    liveUrl: "/been/index.html",
    githubUrl: "",
    caseStudyUrl: "",
    imageClass: "from-teal-500/20 to-cyan-600/10",
    heightClass: "min-h-[280px]",
    featured: false,
  },
  {
    id: "proj-flyable",
    title: "Flyable",
    description:
      "Master's thesis project: an accessible flight booking platform empowering users with disabilities via assistive technologies, customizability options, and real-time flight info.",
    longDescription:
      "Built as a Master's thesis at SRH Heidelberg, Flyable is an accessible flight booking platform empowering users with disabilities via assistive technologies, customizability options, and real-time flight info. The platform prioritizes clarity, guidance, and inclusive design patterns to serve users with different abilities and needs.",
    technologies: ["Vue.js", "Express", "Node.js", "Firebase"],
    liveUrl: "",
    githubUrl: "https://github.com/suryaslash22/flyable",
    caseStudyUrl: "",
    imageClass: "from-blue-500/20 to-indigo-600/10",
    heightClass: "min-h-[280px]",
    featured: false,
  },
  {
    id: "proj-ascension",
    title: "Ascension",
    description:
      "Endless climber 2D videogame with single-player, multiplayer, and co-op modes, built in Unity.",
    technologies: ["Unity", "C#"],
    liveUrl: "",
    githubUrl: "https://github.com/suryaslash22/ascension-the-game",
    caseStudyUrl: "",
    imageClass: "from-lime-500/20 to-green-600/10",
    heightClass: "min-h-[270px]",
    featured: false,
  },
  {
    id: "proj-techstop",
    title: "TechStop",
    description:
      "Online retail management system helping vendors manage inventory, orders, and storefronts.",
    technologies: ["Python", "Django", "HTML", "CSS", "SQLite"],
    liveUrl: "",
    githubUrl: "",
    caseStudyUrl: "",
    imageClass: "from-orange-500/20 to-red-600/10",
    heightClass: "min-h-[300px]",
    featured: false,
  },
  {
    id: "proj-task-manager",
    title: "Task Manager",
    description:
      "Web-based productivity and task organization tool for managing personal and team workflows.",
    technologies: ["Angular", "Express", "Node.js", "MongoDB"],
    liveUrl: "",
    githubUrl: "https://github.com/suryaslash22/task-manager-mean-stack",
    caseStudyUrl: "",
    imageClass: "from-fuchsia-500/20 to-purple-600/10",
    heightClass: "min-h-[280px]",
    featured: false,
  },
  {
    id: "proj-page-vault",
    title: "Page Vault",
    description:
      "Web scraping and automation tools for digital preservation, built with Python and modern APIs for large-scale content archival.",
    longDescription:
      "Page Vault provides scalable automation and web scraping tools for digital preservation. The platform collects, processes, and archives web content at scale using Python-based scrapers and APIs.",
    technologies: ["Python", "Selenium", "FastAPI", "MongoDB", "Automation"],
    liveUrl: "",
    githubUrl: "",
    caseStudyUrl: "",
    imageClass: "from-emerald-500/20 to-teal-600/10",
    heightClass: "min-h-[340px]",
    imageSrc: "/images/projects/page-vault.png",
    featured: false,
  },
  {
    id: "proj-madison",
    title: "Madison Benton",
    description:
      "Personal website for an actress, with a focus on clear presentation and polished visual storytelling.",
    technologies: ["HTML", "CSS", "Responsive Design"],
    liveUrl: "",
    githubUrl: "",
    caseStudyUrl: "",
    imageClass: "from-cyan-500/20 to-sky-600/10",
    heightClass: "min-h-[290px]",
    imageSrc: "/images/projects/madison-benton.png",
    featured: false,
  },
  {
    id: "proj-icbinv",
    title: "I Can't Believe It's Not Vegan",
    description:
      "Android app for vegans designed for a class project at NYU, centered on usability and accessible information discovery.",
    technologies: ["Android", "Java", "UI Design"],
    liveUrl: "http://tinyurl.com/surya-icbinv",
    githubUrl: "",
    caseStudyUrl: "",
    imageClass: "from-amber-500/20 to-orange-600/10",
    heightClass: "min-h-[260px]",
    imageSrc: "/images/projects/icbinv.png",
    featured: false,
  },
  {
    id: "proj-pba",
    title: "Pokemon Battle Arena",
    description:
      "Browser-based game built for a CBSE Grade 12 final project, with a focus on game design and user engagement.",
    technologies: ["HTML", "CSS", "JavaScript", "Game Design"],
    liveUrl: "https://xxfracxx.github.io/PBA-Site/team.htm",
    githubUrl: "",
    caseStudyUrl: "",
    imageClass: "from-rose-500/20 to-pink-600/10",
    heightClass: "min-h-[320px]",
    imageSrc: "/images/projects/pokemon-battle-arena.png",
    featured: false,
  },
];
