export type NavItem = {
  key: string;
  to: string;
  children?: NavItem[];
};

/** Main navigation tree. Labels come from the i18n dictionary (`nav.*`). */
export const NAV: NavItem[] = [
  { key: "nav.home", to: "/" },
  {
    key: "nav.group.about",
    to: "/leadership",
    children: [
      { key: "nav.leadership", to: "/leadership" },
      { key: "nav.structure", to: "/structure" },
      { key: "nav.staff", to: "/staff" },
      { key: "nav.documents", to: "/documents" },
    ],
  },
  {
    key: "nav.group.invest",
    to: "/investments",
    children: [
      { key: "nav.investments", to: "/investments" },
      { key: "nav.projects", to: "/projects" },
      { key: "nav.land", to: "/land" },
      { key: "nav.map", to: "/map" },
    ],
  },
  { key: "nav.industry", to: "/industry" },
  { key: "nav.export", to: "/export" },
  { key: "nav.services", to: "/services" },
  {
    key: "nav.group.info",
    to: "/news",
    children: [
      { key: "nav.news", to: "/news" },
      { key: "nav.media", to: "/media" },
    ],
  },
  { key: "nav.contacts", to: "/contacts" },
];

export const CONTACTS = {
  phones: ["+998 (76) 224-14-15"],
  email: "info@surxondaryo-invest.uz",
  stir: "207274432",
  coords: { lat: 37.2242, lon: 67.2783 },
};

export type StatItem = {
  key: string;
  value: number;
  unitKey: string;
  decimals?: number;
};

/** Placeholder figures — replaced by admin-managed values in a later stage. */
export const STATS: StatItem[] = [
  { key: "stats.trade", value: 1413.8, unitKey: "stats.unit.mln" },
  { key: "stats.export", value: 372.5, unitKey: "stats.unit.mln" },
  { key: "stats.projects", value: 111, unitKey: "stats.unit.pcs" },
  { key: "stats.jobs", value: 2230, unitKey: "stats.unit.people" },
  { key: "stats.partners", value: 24, unitKey: "stats.unit.pcs" },
  { key: "stats.investment", value: 875, unitKey: "stats.unit.mln" },
];
