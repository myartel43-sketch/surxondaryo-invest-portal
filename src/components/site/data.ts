import { transliterateUzbek, type Lang } from "@/i18n";

export const local = (
  value: string | Partial<Record<Lang, string>>,
  lang: Lang,
): string => {
  if (typeof value === "string") {
    return lang === "uzl" ? transliterateUzbek(value) : value;
  }

  if (lang === "uzl") {
    return (
      value.uzl ??
      transliterateUzbek(
        value.uz ?? value.ru ?? value.en ?? value.zh ?? "",
      )
    );
  }

  return value[lang] ?? value.uz ?? value.ru ?? value.en ?? value.zh ?? "";
};

export type PortalProject = {
  title: string;
  description?: string;
  sector: string;
  amount: string;
  jobs: number | string;
  status: string;
  district: string;
  image_url?: string;
};

export const projects: PortalProject[] = [
  {
    title: "Тўқимачилик маҳсулотлари ишлаб чиқариш",
    description:
      "Замонавий тўқимачилик маҳсулотларини ишлаб чиқариш ва экспорт қилиш лойиҳаси.",
    sector: "Енгил саноат",
    amount: "25 млн АҚШ доллари",
    jobs: 650,
    status: "Амалга оширилмоқда",
    district: "Термиз шаҳри",
  },
  {
    title: "Мева-сабзавотни қайта ишлаш мажмуаси",
    description:
      "Қишлоқ хўжалиги маҳсулотларини сақлаш, қайта ишлаш ва қадоқлаш мажмуаси.",
    sector: "Озиқ-овқат саноати",
    amount: "18 млн АҚШ доллари",
    jobs: 420,
    status: "Инвестор изланмоқда",
    district: "Денов тумани",
  },
  {
    title: "Логистика ва омборхона маркази",
    description:
      "Халқаро транспорт йўлакларига хизмат кўрсатувчи логистика маркази.",
    sector: "Логистика",
    amount: "32 млн АҚШ доллари",
    jobs: 300,
    status: "Таклиф этилади",
    district: "Термиз тумани",
  },
];

export type DistrictLand = {
  id: number;
  name: string;
  zone: string;
  land: string;
  power: string;
  gas: string;
  water: string;
};

export const districts: DistrictLand[] = [
  {
    id: 1,
    name: "Термиз тумани",
    zone: "Термиз эркин иқтисодий зонаси",
    land: "12,4 га",
    power: "Мавжуд",
    gas: "Мавжуд",
    water: "Мавжуд",
  },
  {
    id: 2,
    name: "Ангор тумани",
    zone: "Ангор кичик саноат зонаси",
    land: "8,7 га",
    power: "Мавжуд",
    gas: "Мавжуд",
    water: "Мавжуд",
  },
  {
    id: 3,
    name: "Денов тумани",
    zone: "Денов саноат ҳудуди",
    land: "15,2 га",
    power: "Мавжуд",
    gas: "Мавжуд",
    water: "Қисман мавжуд",
  },
];

export type ExportPartner = {
  country: string;
  share: number;
  goods: string;
};

export const exportPartners: ExportPartner[] = [
  {
    country: "Хитой",
    share: 28,
    goods: "Тўқимачилик, қишлоқ хўжалиги ва озиқ-овқат маҳсулотлари",
  },
  {
    country: "Россия",
    share: 24,
    goods: "Мева-сабзавот, тўқимачилик ва тайёр саноат маҳсулотлари",
  },
  {
    country: "Афғонистон",
    share: 18,
    goods: "Қурилиш материаллари, озиқ-овқат ва саноат маҳсулотлари",
  },
  {
    country: "Қозоғистон",
    share: 12,
    goods: "Қишлоқ хўжалиги, тўқимачилик ва қурилиш маҳсулотлари",
  },
  {
    country: "Бошқа давлатлар",
    share: 18,
    goods: "Турли саноат ва экспорт маҳсулотлари",
  },
];
