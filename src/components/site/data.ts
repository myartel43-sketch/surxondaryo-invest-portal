import type { Lang } from "@/i18n";

export const local = (value: string | Partial<Record<Lang, string>>, lang: Lang): string => {
  if (typeof value === "string") return value;
  return value[lang] ?? value.uz ?? value.ru ?? value.en ?? value.zh ?? "";
};

export type District = {
  id: string;
  name: string;
  x: number;
  y: number;
  zone: string;
  land: string;
  power: string;
  gas: string;
  water: string;
  ownership: string;
  projects: number;
};

export const districts: District[] = [
  {
    id: "angor",
    name: "Ангор тумани",
    x: 34,
    y: 72,
    zone: "«Ангор» кичик саноат зонаси",
    land: "48 га (бўш: 20 га)",
    power: "5 МВт",
    gas: "3 000 м³/соат",
    water: "1 200 м³/кун",
    ownership: "Давлат мулки, ижара 49 йил",
    projects: 14,
  },
  {
    id: "termiz",
    name: "Термиз шаҳри",
    x: 45,
    y: 86,
    zone: "«Термиз» эркин иқтисодий зонаси",
    land: "112 га (бўш: 31 га)",
    power: "18 МВт",
    gas: "9 500 м³/соат",
    water: "4 000 м³/кун",
    ownership: "ЭИЗ резидентлиги, солиқ имтиёзлари",
    projects: 37,
  },
  {
    id: "denov",
    name: "Денов тумани",
    x: 74,
    y: 26,
    zone: "«Денов агро-кластер» зонаси",
    land: "76 га (бўш: 24 га)",
    power: "9 МВт",
    gas: "4 200 м³/соат",
    water: "6 500 м³/кун",
    ownership: "Давлат мулки, аукцион орқали",
    projects: 21,
  },
  {
    id: "sherobod",
    name: "Шеробод тумани",
    x: 26,
    y: 46,
    zone: "«Шеробод» қурилиш материаллари зонаси",
    land: "95 га (бўш: 40 га)",
    power: "12 МВт",
    gas: "6 000 м³/соат",
    water: "2 100 м³/кун",
    ownership: "Давлат мулки, ижара 25 йил",
    projects: 11,
  },
  {
    id: "qumqorgon",
    name: "Қумқўрғон тумани",
    x: 60,
    y: 46,
    zone: "«Қумқўрғон» тўқимачилик зонаси",
    land: "54 га (бўш: 17 га)",
    power: "7 МВт",
    gas: "3 800 м³/соат",
    water: "3 300 м³/кун",
    ownership: "Хусусий-давлат шериклиги",
    projects: 9,
  },
  {
    id: "boysun",
    name: "Бойсун тумани",
    x: 46,
    y: 18,
    zone: "«Бойсун» туризм ва тоғ-кон зонаси",
    land: "130 га (бўш: 62 га)",
    power: "6 МВт",
    gas: "2 400 м³/соат",
    water: "1 800 м³/кун",
    ownership: "Давлат мулки, инвестиция шарти билан",
    projects: 6,
  },
];

export const stats = [
  { label: "Ташқи савдо айланмаси", value: 790.9, suffix: " млн $", note: "+86,2% ўсиш" },
  { label: "Экспорт улуши", value: 64.2, suffix: "%", note: "савдо айланмасидан" },
  { label: "Ҳамкор давлатлар", value: 76, suffix: " та", note: "дунё бўйлаб" },
  { label: "Ишга туширилган лойиҳалар", value: 8000, suffix: "+", note: "5 млрд $ дан ортиқ" },
];

export const projects = [
  {
    title: "Термиз логистика ҳаби",
    sector: "Логистика",
    amount: "240 млн $",
    jobs: 1200,
    status: "Инвестор изланмоқда",
    district: "Термиз шаҳри",
  },
  {
    title: "Тўқимачилик тўлиқ цикл кластери",
    sector: "Тўқимачилик",
    amount: "85 млн $",
    jobs: 2400,
    status: "Лойиҳа тайёр",
    district: "Қумқўрғон",
  },
  {
    title: "Мармар ва оҳактош қайта ишлаш",
    sector: "Қурилиш материаллари",
    amount: "42 млн $",
    jobs: 560,
    status: "Ер ажратилган",
    district: "Шеробод",
  },
  {
    title: "Мева-сабзавот муздатиш комплекси",
    sector: "Агросаноат",
    amount: "31 млн $",
    jobs: 780,
    status: "Қурилиш босқичида",
    district: "Денов",
  },
  {
    title: "100 МВт қуёш электр станцияси",
    sector: "Энергетика",
    amount: "96 млн $",
    jobs: 320,
    status: "Инвестор изланмоқда",
    district: "Ангор",
  },
  {
    title: "Бойсун экотуризм резорти",
    sector: "Туризм",
    amount: "18 млн $",
    jobs: 410,
    status: "Лойиҳа тайёр",
    district: "Бойсун",
  },
];

export const exportPartners = [
  { country: "Афғонистон", share: 30.2, goods: "Цемент, озиқ-овқат, электр энергия" },
  { country: "БАА", share: 26.3, goods: "Мева-сабзавот, тўқимачилик" },
  { country: "Хитой", share: 12.4, goods: "Минерал хомашё, пахта толаси" },
  { country: "Россия", share: 9.8, goods: "Мева-сабзавот, консерва" },
  { country: "Қозоғистон", share: 6.1, goods: "Қурилиш материаллари" },
  { country: "Бошқа 71 давлат", share: 15.2, goods: "Турли маҳсулотлар" },
];
