export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  date: string;
  description: string;
  technologies: string[];
}

export const experienceItems: ExperienceItem[] = [
  {
    id: "beep",
    company: "BEEP!",
    role: "Tech Lead",
    location: "Düsseldorf, Germany",
    date: "Mar 2025 — Present",
    description:
      "Lead architecture and full-stack development of the \"BEEP! Scan & Go\" retail app that allows customers to scan items in stores and pay directly via smartphone. Define and steer the technical roadmap, coordinate development sprints, and ensure the platform's scalability, performance, and compliance (payment, data-flow, GDPR/TSE-compatibility). Collaborate with business stakeholders and retail partners to integrate payment systems and existing POS infrastructures, enabling seamless store onboarding with minimal hardware overhead.",
    technologies: ["Flutter", "Firebase", "Google Cloud Platform", "TypeScript", "Git"],
  },
  {
    id: "airbus",
    company: "Airbus",
    role: "Software Development Intern",
    location: "Hamburg, Germany",
    date: "Oct 2023 — Mar 2024",
    description:
      "Collaborated within the Flight Test Analysis teams to develop a software solution for efficient visualization of data, from design to deployment. Engaged in optimization of software systems critical to aerospace operations, acquiring practical knowledge in aviation standards and regulations.",
    technologies: ["Python", "Dash", "HTML", "CSS", "JavaScript", "Git"],
  },
  {
    id: "ketl",
    company: "Ketl.io",
    role: "Backend Developer",
    location: "Geneva, Switzerland",
    date: "Mar 2022 — Jun 2022",
    description:
      "Assisted an early-stage startup with the evolution of their tech stack for enhanced scalability and performance. Integrated newer technologies with existing microservices architecture.",
    technologies: ["Python", "MongoDB", "Docker", "gRPC"],
  },
  {
    id: "page-vault",
    company: "Page Vault",
    role: "Freelance Backend Developer",
    location: "Chicago, USA",
    date: "Oct 2019 — May 2021",
    description:
      "Researched and identified alternate web capturing solutions for large websites. Developed automated social media scraping tools utilized for litigation in the US.",
    technologies: ["Python", "HTML", "Selenium"],
  },
  {
    id: "ficsa",
    company: "FICSA",
    role: "Web Technician Intern",
    location: "Geneva, Switzerland",
    date: "Aug 2020 — Dec 2020",
    description:
      "Led a small team to modernize and boost the communications and online presence of a small NGO that primarily deals with UN staff associations. Designed and implemented a chatbot to bolster outreach.",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: "premier-properties",
    company: "Premier Properties",
    role: "Freelance Backend Developer",
    location: "New York, USA",
    date: "Jun 2018 — Sep 2018",
    description:
      "Introduced web scraping and data extraction strategies to a small realty agency. Built Python scripts to navigate through and extract key online data, leading to a 700% increase in total number of leads.",
    technologies: ["Python", "HTML", "Selenium"],
  },
  {
    id: "unfpa",
    company: "United Nations Population Fund (UNFPA)",
    role: "Media Intern",
    location: "New York, USA",
    date: "Apr 2017 — Jun 2017",
    description:
      "Migrated and updated the previous UNFPA website to a newer version, along with designing new websites and templates for their intranet.",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
];
