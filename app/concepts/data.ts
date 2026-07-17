// Shared placeholder content for the /concepts design exploration.
// Not wired into the production site — used only by app/concepts/**.

export const profile = {
  name: "Sudharsan Surya",
  role: "Full-Stack Software Engineer",
  location: "Düsseldorf, Germany",
  interests: ["Chess", "Scrabble", "Languages", "AI", "Travel"],
};

export type ExperienceEntry = {
  company: string;
  title: string;
  dates: string;
  description: string;
};

export const experience: ExperienceEntry[] = [
  {
    company: "Airbus",
    title: "Software Engineer, Flight Operations Tooling",
    dates: "2024 — Present",
    description:
      "Building internal tooling for flight-ops data pipelines, working closely with operations analysts to turn raw telemetry into decision-ready dashboards. Owns a Python/TypeScript service that reconciles scheduling data across three regional systems.",
  },
  {
    company: "Ketl.io",
    title: "Founding Engineer",
    dates: "2023 — 2024",
    description:
      "First engineering hire at an early-stage climate-tech startup, shipping the initial product from prototype to first paying customers. Built the core web app in Next.js and designed the event-tracking backend that powers the analytics dashboard.",
  },
  {
    company: "UNFPA",
    title: "Software Engineer, Data Systems (Contract)",
    dates: "2022 — 2023",
    description:
      "Developed internal reporting tools for reproductive health program data across field offices in East Africa. Migrated a legacy spreadsheet-based workflow to a small React/Node application, cutting monthly reporting time from days to hours.",
  },
  {
    company: "Page Vault",
    title: "Software Engineer",
    dates: "2020 — 2022",
    description:
      "Worked on the web-capture and evidence-archival platform used by legal teams, focused on the rendering pipeline and PDF export fidelity. Introduced automated visual-regression testing that caught rendering bugs before they reached customers.",
  },
  {
    company: "Freelance Projects",
    title: "Independent Software Consultant",
    dates: "2019 — 2020",
    description:
      "Took on short-term contracts for small businesses and early-stage founders, building marketing sites, booking systems, and internal tools. Worked directly with non-technical clients to scope, estimate, and ship within tight budgets.",
  },
];

export type EducationEntry = {
  degree: string;
  school: string;
  year: string;
};

export const education: EducationEntry[] = [
  {
    degree: "M.Sc. Applied Computer Science",
    school: "SRH Heidelberg",
    year: "2022",
  },
  {
    degree: "B.Sc. Computer Science",
    school: "Webster University Geneva",
    year: "2019",
  },
];

export const flyable = {
  title: "Flyable",
  tagline: "A flight-delay forecasting tool for casual travelers",
  summary:
    "Flyable predicts the likelihood of a flight delay before you book, using historical on-time performance, weather patterns, and airport congestion data — surfaced as a simple risk score instead of a wall of raw statistics.",
  problem:
    "Flight-delay data is publicly available but scattered across airline APIs, aviation authorities, and weather services, none of which are built for a traveler trying to answer one question: 'Should I worry about this flight?' Existing tools either bury the signal in dashboards meant for analysts or don't account for route-specific and seasonal patterns at all.",
  approach:
    "I started by pulling three years of historical on-time performance data for the busiest European routes, then layered in METAR weather records and airport-level congestion indices. A gradient-boosted model estimates delay probability per route and departure window, which I intentionally compressed into a three-tier risk label (Low / Moderate / High) rather than exposing a raw probability — testing with a handful of frequent flyers showed a number without context was routinely ignored.",
  stack: [
    "Next.js",
    "TypeScript",
    "Python",
    "scikit-learn",
    "PostgreSQL",
    "Vercel",
  ],
  outcome:
    "The prototype now covers 40+ European routes and has been used informally by a small group of beta testers to plan connections with tighter buffers. Accuracy on held-out data sits around 78% for the three-tier classification, comfortably ahead of the airline's own on-time percentage as a naive baseline.",
  body: [
    "The most interesting part of building Flyable wasn't the modeling — it was figuring out what a 'delay' should even mean to a traveler. Airlines report on-time performance against scheduled departure, but a 12-minute delay on a long-haul flight with a generous connection is irrelevant, while the same delay on a 45-minute domestic hop before a tight connection can ruin a trip. I ended up modeling delay risk relative to a traveler-specified buffer rather than an absolute threshold, which meant reframing the whole prediction target midway through the project.",
    "Weather data turned out to be a much stronger predictor than I expected for short-haul European routes, particularly winter fog patterns at a handful of airports that show up disproportionately in the delay tail. Congestion indices helped more with midday and evening departures, when knock-on delays from earlier flights dominate. Combining the two data sources meant reconciling very different update frequencies — weather forecasts refresh hourly, congestion data is closer to daily — which pushed me toward a simple caching layer instead of trying to keep everything live.",
    "The current version is deliberately narrow in scope: no booking integration, no push notifications, just a lookup tool. That constraint was intentional — I wanted to validate that the risk score itself was useful before investing in the surrounding product. The next iteration under consideration is a lightweight email digest for travelers who want a risk check a few days before departure, once the model has more route coverage.",
  ],
};

export type ProjectStub = {
  slug: string;
  title: string;
  oneLiner: string;
};

export const projectStubs: ProjectStub[] = [
  {
    slug: "flyable",
    title: "Flyable",
    oneLiner: "Flight-delay risk forecasting for casual travelers.",
  },
  {
    slug: "routine",
    title: "Routine",
    oneLiner: "A minimalist habit tracker built around weekly streaks instead of daily guilt.",
  },
  {
    slug: "lingoboard",
    title: "Lingoboard",
    oneLiner: "Spaced-repetition flashcards generated automatically from articles you're already reading.",
  },
];
