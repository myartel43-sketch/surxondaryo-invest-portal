import type { Lang } from "@/i18n";
import { L, type LocalizedText } from "./localized-content";

export type District = { id:string; name:LocalizedText; zone:LocalizedText; land:string; power:string; gas:string; water:string; projects:number };
export const districts: District[] = [
 {id:"angor",name:L("Ангор тумани","Ангорский район","Angor district","安戈尔区"),zone:L("«Ангор» кичик саноат зонаси","Малая промышленная зона «Ангор»","Angor small industrial zone","安戈尔小型工业区"),land:"48 ha",power:"5 MW",gas:"3,000 m³/h",water:"1,200 m³/day",projects:14},
 {id:"termiz",name:L("Термиз шаҳри","Город Термез","Termez city","铁尔梅兹市"),zone:L("«Термиз» эркин иқтисодий зонаси","Свободная экономическая зона «Термез»","Termez free economic zone","铁尔梅兹自由经济区"),land:"112 ha",power:"18 MW",gas:"9,500 m³/h",water:"4,000 m³/day",projects:37},
 {id:"denov",name:L("Денов тумани","Денауский район","Denov district","杰纳乌区"),zone:L("«Денов агро-кластер» зонаси","Зона «Денау агрокластер»","Denov agro-cluster zone","杰纳乌农业集群区"),land:"76 ha",power:"9 MW",gas:"4,200 m³/h",water:"6,500 m³/day",projects:21},
 {id:"sherobod",name:L("Шеробод тумани","Шерабадский район","Sherabad district","谢拉巴德区"),zone:L("«Шеробод» қурилиш материаллари зонаси","Зона строительных материалов «Шерабад»","Sherabad building materials zone","谢拉巴德建材区"),land:"95 ha",power:"12 MW",gas:"6,000 m³/h",water:"2,100 m³/day",projects:11},
 {id:"qumqorgon",name:L("Қумқўрғон тумани","Кумкурганский район","Kumkurgan district","库姆库尔干区"),zone:L("«Қумқўрғон» тўқимачилик зонаси","Текстильная зона «Кумкурган»","Kumkurgan textile zone","库姆库尔干纺织区"),land:"54 ha",power:"7 MW",gas:"3,800 m³/h",water:"3,300 m³/day",projects:9},
 {id:"boysun",name:L("Бойсун тумани","Байсунский район","Boysun district","拜松区"),zone:L("«Бойсун» туризм ва тоғ-кон зонаси","Туристическая и горнодобывающая зона «Байсун»","Boysun tourism and mining zone","拜松旅游矿业区"),land:"130 ha",power:"6 MW",gas:"2,400 m³/h",water:"1,800 m³/day",projects:6},
];

export type Project = {title:LocalizedText;sector:LocalizedText;amount:string;jobs:number;status:LocalizedText;district:LocalizedText};
export const projects:Project[] = [
 {title:L("Термиз логистика ҳаби","Термезский логистический хаб","Termez logistics hub","铁尔梅兹物流枢纽"),sector:L("Логистика","Логистика","Logistics","物流"),amount:"USD 240m",jobs:1200,status:L("Инвестор изланмоқда","Поиск инвестора","Seeking investor","寻找投资者"),district:L("Термиз шаҳри","Город Термез","Termez city","铁尔梅兹市")},
 {title:L("Тўқимачилик тўлиқ цикл кластери","Текстильный кластер полного цикла","Full-cycle textile cluster","全周期纺织集群"),sector:L("Тўқимачилик","Текстиль","Textiles","纺织"),amount:"USD 85m",jobs:2400,status:L("Лойиҳа тайёр","Проект готов","Project ready","项目已就绪"),district:L("Қумқўрғон","Кумкурган","Kumkurgan","库姆库尔干")},
 {title:L("Мармар ва оҳактош қайта ишлаш","Переработка мрамора и известняка","Marble and limestone processing","大理石和石灰石加工"),sector:L("Қурилиш материаллари","Строительные материалы","Building materials","建材"),amount:"USD 42m",jobs:560,status:L("Ер ажратилган","Земля выделена","Land allocated","土地已划拨"),district:L("Шеробод","Шерабад","Sherabad","谢拉巴德")},
 {title:L("Мева-сабзавот муздатиш комплекси","Комплекс заморозки фруктов и овощей","Fruit and vegetable freezing complex","果蔬冷冻综合体"),sector:L("Агросаноат","Агропромышленность","Agribusiness","农业加工"),amount:"USD 31m",jobs:780,status:L("Қурилиш босқичида","На стадии строительства","Under construction","建设中"),district:L("Денов","Денау","Denov","杰纳乌")},
 {title:L("100 МВт қуёш электр станцияси","Солнечная электростанция 100 МВт","100 MW solar power plant","100兆瓦太阳能电站"),sector:L("Энергетика","Энергетика","Energy","能源"),amount:"USD 96m",jobs:320,status:L("Инвестор изланмоқда","Поиск инвестора","Seeking investor","寻找投资者"),district:L("Ангор","Ангор","Angor","安戈尔")},
 {title:L("Бойсун экотуризм резорти","Экотуристический курорт Байсун","Boysun eco-tourism resort","拜松生态旅游度假区"),sector:L("Туризм","Туризм","Tourism","旅游"),amount:"USD 18m",jobs:410,status:L("Лойиҳа тайёр","Проект готов","Project ready","项目已就绪"),district:L("Бойсун","Байсун","Boysun","拜松")},
];

export const exportPartners:{country:LocalizedText;share:number;goods:LocalizedText}[] = [
 {country:L("Афғонистон","Афганистан","Afghanistan","阿富汗"),share:30.2,goods:L("Цемент, озиқ-овқат, электр энергия","Цемент, продукты питания, электроэнергия","Cement, food, electricity","水泥、食品、电力")},
 {country:L("БАА","ОАЭ","UAE","阿联酋"),share:26.3,goods:L("Мева-сабзавот, тўқимачилик","Фрукты, овощи, текстиль","Fruit, vegetables, textiles","果蔬、纺织品")},
 {country:L("Хитой","Китай","China","中国"),share:12.4,goods:L("Минерал хомашё, пахта толаси","Минеральное сырьё, хлопковое волокно","Mineral raw materials, cotton fibre","矿产原料、棉纤维")},
 {country:L("Россия","Россия","Russia","俄罗斯"),share:9.8,goods:L("Мева-сабзавот, консерва","Фрукты, овощи, консервы","Fruit, vegetables, canned goods","果蔬、罐头")},
 {country:L("Қозоғистон","Казахстан","Kazakhstan","哈萨克斯坦"),share:6.1,goods:L("Қурилиш материаллари","Строительные материалы","Building materials","建材")},
 {country:L("Бошқа давлатлар","Другие страны","Other countries","其他国家"),share:15.2,goods:L("Турли маҳсулотлар","Различная продукция","Various products","多种产品")},
];

export function local(value:LocalizedText, lang:Lang){return value[lang] ?? value.uz;}
