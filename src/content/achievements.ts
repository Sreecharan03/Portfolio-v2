import type { SourceKind } from "./sources";

/**
 * Headline numbers animate from zero to `count` when they scroll into view.
 * Only real, sourced values are animated; `display` is what is finally shown.
 */
export interface HeadlineStat {
  id: string;
  count?: number;
  display: string;
  prefix?: string;
  suffix?: string;
  label: string;
  context: string;
  source: SourceKind;
  asOf?: string;
  href?: string;
}

export const headlineStats: HeadlineStat[] = [
  {
    id: "leetcode-rating",
    count: 1898,
    display: "1,898",
    label: "LeetCode contest rating",
    context: "Knight badge · top 4.74% of rated contestants · 29 contests",
    source: "profile",
    asOf: "Oct 2026",
    href: "https://leetcode.com/u/sreecharan_12082003/",
  },
  {
    id: "leetcode-solved",
    count: 757,
    display: "757",
    label: "LeetCode problems solved",
    context: "305 easy · 380 medium · 72 hard",
    source: "profile",
    asOf: "Oct 2026",
    href: "https://leetcode.com/u/sreecharan_12082003/",
  },
  {
    id: "codevita",
    count: 5127,
    display: "5,127",
    label: "TCS CodeVita Season 12",
    context: "Global rank",
    source: "certificate",
  },
  {
    id: "smart-interviews",
    count: 159,
    display: "159",
    suffix: " / 35,859",
    label: "Smart Interviews · Smart Coder",
    context: "Global rank · certified Smart Coder, 2024",
    source: "certificate",
  },
  {
    id: "hackathons",
    count: 3,
    display: "3rd",
    suffix: " ×2",
    label: "Andhra Pradesh hackathon placings",
    context: "“Predictive Protection” and “Health – Care Saver”, as team lead",
    source: "email",
  },
  {
    id: "team",
    count: 12,
    display: "12",
    label: "Team members led",
    context: "Technical lead, SenseMinds 360 at AISmartLive Solutions",
    source: "reported",
  },
];

export interface Recognition {
  title: string;
  issuer: string;
  date?: string;
  detail: string;
  source: SourceKind;
  href?: string;
}

export const recognitions: Recognition[] = [
  {
    title: "Special Initiative Award",
    issuer: "TCS Gems · Tata Consultancy Services",
    date: "Jun 2026",
    detail: "Awarded at TCS Pune for outperforming the entire training cohort in high- and low-level design (HLD and LLD).",
    source: "certificate",
  },
  {
    title: "8 job offers from a tier-3 college",
    issuer: "TCS Digital · Infosys (DSE) · Cognizant (GenC) · Tech Mahindra (ASE) · Rudder Analytics · Joora Drones · AISmartLive Solutions · AAYS Advisory (contract)",
    detail: "Chose TCS Digital for growth and the strongest project.",
    source: "reported",
  },
  {
    title: "Third prize — “Predictive Protection”",
    issuer: "Andhra Pradesh hackathon",
    detail: "Predictive-maintenance platform (SenseMinds 360). Team lead; designed the solution and built the proof of concept.",
    source: "email",
  },
  {
    title: "Third position — “Health – Care Saver”",
    issuer: "Andhra Pradesh hackathon",
    detail: "Smart-watch tracking with live diabetes readings and notifications. Team lead; designed the solution and built the proof of concept.",
    source: "email",
  },
  {
    title: "Champion Certificate",
    issuer: "AMD × TCS AI Hackathon",
    date: "Aug 2026",
    detail: "Awarded “in recognition of participation and enthusiasm”.",
    source: "certificate",
  },
  {
    title: "Co-author, IJIRT publication",
    issuer: "International Journal of Innovative Research in Technology",
    date: "Mar 2025",
    detail: "Summarization with a Custom Fine-Tuned LLaMA Model via Instruction-Based Training.",
    source: "publication",
    href: "#research",
  },
  {
    title: "CodeChef 3★",
    issuer: "CodeChef",
    date: "Oct 2026",
    detail: "Rating 1634, highest 1654.",
    source: "profile",
    href: "https://www.codechef.com/users/sreecharan_2k3",
  },
  {
    title: "654 problems solved",
    issuer: "GeeksforGeeks",
    date: "Oct 2026",
    detail: "Coding score 1,797 · institute rank 6 · 343 problems of the day.",
    source: "profile",
    href: "https://www.geeksforgeeks.org/profile/sree_charan",
  },
];
