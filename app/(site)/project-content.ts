export interface ProjectContent {
  problem: string;
  solution: string;
  architecture: string;
  challenges: string;
  lessonsLearned: string;
}

export const projectContent: Record<string, ProjectContent> = {
  "proj-flyable": {
    problem:
      "Flight booking flows are often visually dense and inconsistent, which creates real barriers for travelers using screen readers, keyboard navigation, or assistive technology. As part of a Master's thesis at SRH Heidelberg, the goal was to investigate how an accessibility-first approach could reshape a high-stakes booking flow without sacrificing clarity for any user.",
    solution:
      "Flyable is a flight booking platform that empowers users with disabilities via assistive technologies, customizability options, and real-time flight info. Every step of the booking flow — search, selection, passenger details, and confirmation — was designed with explicit focus states, descriptive labeling, and progressive disclosure so users are never left guessing what happens next.",
    architecture:
      "The application is built with Vue.js on the frontend, backed by an Express and Node.js API, with Firebase providing authentication, real-time data sync, and hosting for live flight information. Components were structured so accessibility semantics (roles, labels, focus order) live close to the markup rather than being layered on top, making the accessible behavior easier to verify and maintain.",
    challenges:
      "The hardest part was balancing accessibility best practices against the visual density that flight search naturally involves — many filters, dates, and fare options competing for attention. Iterating on layout to keep the interface scannable for sighted users while remaining fully navigable via keyboard and screen reader required several rounds of usability testing and revision.",
    lessonsLearned:
      "Designing for accessibility from the start is significantly cheaper than retrofitting it later, and it tends to improve the experience for every user, not just those relying on assistive technology. The thesis work also reinforced that accessibility is a design discipline as much as an engineering one — decisions about hierarchy and language matter as much as ARIA attributes.",
  },
  "proj-page-vault": {
    problem:
      "Organizations that need to preserve web content for legal or compliance purposes face a moving target: pages change, get taken down, or render dynamically, making manual archiving unreliable at scale.",
    solution:
      "Page Vault provides automation and web scraping tooling that captures, processes, and archives web content reliably and repeatably. Python-based scrapers handle the collection layer while a FastAPI service exposes archival jobs and results through a clean API.",
    architecture:
      "Selenium drives headless browser sessions to capture dynamic, JavaScript-rendered pages faithfully, while FastAPI coordinates job scheduling and exposes endpoints for triggering and querying archive runs. Captured content and metadata are persisted in MongoDB, chosen for its flexibility with semi-structured page data.",
    challenges:
      "Web scraping at scale means handling an unpredictable web: sites with anti-automation measures, inconsistent DOM structures, and rate limits. Building scrapers resilient enough to keep working as target sites changed required defensive coding and ongoing maintenance.",
    lessonsLearned:
      "Reliability matters more than cleverness in automation systems — a scraper that fails loudly and predictably is far more valuable than one that silently produces incomplete archives. This project also underscored the importance of good logging and observability when systems run unattended.",
  },
  "proj-icbinv": {
    problem: "Vegan users often struggle to quickly identify suitable products and dishes while shopping or eating out.",
    solution:
      "An Android app built for a class project at NYU that surfaces vegan-friendly options with an emphasis on usability and quick information discovery.",
    architecture: "Native Android application written in Java with a focus on simple, accessible UI patterns.",
    challenges: "Designing a clear information hierarchy within the constraints of a class project timeline.",
    lessonsLearned: "Usability testing early, even on a small project, surfaces friction points that are easy to miss otherwise.",
  },
  "proj-pba": {
    problem: "A CBSE Grade 12 final project required building an engaging, self-contained browser game from scratch.",
    solution: "Pokemon Battle Arena, a browser-based game focused on game design mechanics and player engagement.",
    architecture: "Built with vanilla HTML, CSS, and JavaScript, with game state managed directly in the browser.",
    challenges: "Balancing game mechanics and keeping the experience engaging without a game engine or framework.",
    lessonsLearned: "Constraints (no framework, limited time) forced simpler, more maintainable solutions.",
  },
  "proj-madison": {
    problem: "An actress needed a personal website to present her work clearly to casting contacts and visitors.",
    solution: "A clean personal website emphasizing clear presentation and polished visual storytelling.",
    architecture: "Built with HTML and CSS using a responsive layout.",
    challenges: "Balancing visual polish with fast load times and simple maintenance for a non-technical client.",
    lessonsLearned: "Client work sharpens the ability to translate vague visual preferences into concrete design decisions.",
  },
  "proj-ascension": {
    problem: "Wanted to explore 2D game mechanics and networked play by building a self-contained videogame from scratch.",
    solution: "Ascension, an endless climber with single-player, multiplayer, and co-op modes built in Unity.",
    architecture: "Built with the Unity Game Engine and C#, with shared climbing/scoring logic reused across single-player and networked modes.",
    challenges: "Keeping multiplayer and co-op state in sync while preserving smooth, responsive single-player controls.",
    lessonsLearned: "Designing core mechanics to be mode-agnostic from the start made adding multiplayer far less disruptive than bolting it on later.",
  },
  "proj-task-manager": {
    problem: "Small teams and individuals needed a lightweight way to organize and track tasks without heavyweight project-management tooling.",
    solution: "Task Manager, a web-based productivity tool for creating, assigning, and tracking tasks.",
    architecture: "Built with Angular on the frontend and an Express/Node.js API backed by MongoDB for flexible task and user data.",
    challenges: "Designing a data model flexible enough for both personal to-do lists and simple team workflows.",
    lessonsLearned: "A clear separation between API and UI made it straightforward to iterate on the task data model without reworking the frontend.",
  },
  "proj-been": {
    problem: "Wanted a simple, personal way to visualize the countries visited, lived in, or called home over the years, rather than a list.",
    solution: "Been, an interactive world map that marks each visited country with short notes on the visit.",
    architecture: "A static Astro app rendering an SVG world map from a GeoJSON country layer, with visit data stored in a plain JSON file and no backend.",
    challenges: "Keeping the map interactive and readable across screen sizes, especially on mobile, without a heavier mapping library.",
    lessonsLearned: "A fully static, JSON-driven approach was more than enough for a small personal dataset — no database or backend was needed.",
  },
  "proj-techstop": {
    problem: "Small vendors needed an affordable way to manage online retail operations — inventory, orders, and storefronts — without complex enterprise software.",
    solution: "TechStop, an online retail management system for vendors to manage products, orders, and storefronts.",
    architecture: "Built with Python and Django, using SQLite for storage and server-rendered HTML/CSS templates for the vendor-facing UI.",
    challenges: "Balancing a simple, approachable vendor UI with enough flexibility to handle varied product catalogs.",
    lessonsLearned: "Django's built-in admin and ORM significantly sped up building out CRUD-heavy retail management features.",
  },
};
