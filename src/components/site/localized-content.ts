import type { Lang } from "@/i18n";

export type LocalizedText = Record<Lang, string>;
export const L = (uz:string, ru:string, en:string, zh:string): LocalizedText => ({uz,ru,en,zh});

export const homeText = {
  heroTitle: L("Инвестициялар — келажак тараққиётининг асоси","Инвестиции — основа будущего развития","Investment is the foundation of future growth","投资是未来发展的基础"),
  heroSubtitle: L("Сурхондарё вилояти инвестициялар, саноат ва савдо бошқармасининг расмий портали","Официальный портал Управления инвестиций, промышленности и торговли Сурхандарьинской области","Official portal of the Surkhandarya Regional Department of Investment, Industry and Trade","苏尔汉河州投资、工业和贸易管理局官方门户"),
  becomeInvestor: L("Инвестор бўлинг","Стать инвестором","Become an investor","成为投资者"),
  why: L("Нега Сурхондарё вилоятига инвестиция киритиш керак?","Почему стоит инвестировать в Сурхандарьинскую область?","Why invest in Surkhandarya region?","为什么投资苏尔汉河州？"),
  mapGo: L("Картага ўтиш","Открыть карту","Open map","打开地图"),
  latestNews: L("Сўнгги янгиликлар","Последние новости","Latest news","最新消息"),
  featuredProject: L("Инвестицион лойиҳалар","Инвестиционные проекты","Investment projects","投资项目"),
  newsDate: L("30.07.2026 · Иқтисод","30.07.2026 · Экономика","30.07.2026 · Economy","2026.07.30 · 经济"),
  newsTitle: L("Сурхондарёда янги инвестиция лойиҳалари муҳокама қилинди","В Сурхандарье обсудили новые инвестиционные проекты","New investment projects discussed in Surkhandarya","苏尔汉河州讨论新投资项目"),
  newsDesc: L("Янги саноат қувватлари ва экспорт имкониятларини кенгайтириш бўйича вазифалар белгиланди.","Определены задачи по запуску новых промышленных мощностей и расширению экспортных возможностей.","Priorities were set for launching new industrial capacity and expanding export opportunities.","确定了启动新工业产能和扩大出口机会的任务。"),
  projectSector: L("Саноат","Промышленность","Industry","工业"),
  projectTitle: L("Текстиль маҳсулотлари ишлаб чиқариш комплекси","Комплекс по производству текстильной продукции","Textile manufacturing complex","纺织品生产综合体"),
  projectDistrict: L("Шўрчи тумани","Шурчинский район","Shurchi district","舒尔奇区"),
  projectAmount: L("25 млн АҚШ доллари","25 млн долларов США","USD 25 million","2500万美元"),
  projectStatus: L("Амалдаги","Действующий","Active","进行中"),
};

export const statsText = [
  [L("Умумий инвестициялар ҳажми","Общий объём инвестиций","Total investment volume","投资总额"), L("млн АҚШ доллари","млн долларов США","USD million","百万美元")],
  [L("Амалга оширилган лойиҳалар","Реализованные проекты","Implemented projects","已实施项目"), L("та","ед.","projects","个")],
  [L("Яратилган иш ўринлари","Созданные рабочие места","Jobs created","新增就业岗位"), L("та","мест","jobs","个")],
  [L("Ҳамкор давлатлар","Страны-партнёры","Partner countries","合作国家"), L("та","стран","countries","个")],
  [L("Экспорт ҳажми","Объём экспорта","Export volume","出口额"), L("млн АҚШ доллари","млн долларов США","USD million","百万美元")],
] as const;

export const advantagesText = [
  [L("Стратегик жойлашув","Стратегическое расположение","Strategic location","战略位置"),L("Марказий Осиё ва Афғонистон бозорларига яқин","Близость к рынкам Центральной Азии и Афганистана","Close to Central Asian and Afghan markets","靠近中亚和阿富汗市场")],
  [L("Халқаро транспорт коридорлари","Международные транспортные коридоры","International transport corridors","国际运输走廊"),L("Автомобиль, темир йўл ва ҳаво йўллари мавжуд","Автомобильные, железнодорожные и воздушные маршруты","Road, rail and air connections","公路、铁路和航空连接")],
  [L("Ёш ва малакали меҳнат ресурслари","Молодые и квалифицированные кадры","Young and skilled workforce","年轻且熟练的劳动力"),L("Ишчи кучининг катта қисми ёшлардан иборат","Значительную часть рабочей силы составляет молодёжь","A large share of the workforce is young","劳动力中青年占比较高")],
  [L("Солиқ имтиёзлари","Налоговые льготы","Tax incentives","税收优惠"),L("Инвесторлар учун кенг солиқ енгилликлари","Широкий набор льгот для инвесторов","A broad range of investor incentives","为投资者提供多种优惠")],
  [L("Белгиланган ер участкалари","Подготовленные земельные участки","Prepared land plots","已准备土地"),L("Тайёр инфратузилма билан таъминланган майдонлар","Площадки с готовой инфраструктурой","Sites with ready infrastructure","配套基础设施完善的地块")],
  [L("Давлат томонидан қўллаб-қувватлаш","Государственная поддержка","Government support","政府支持"),L("Ҳукумат ва маҳаллий ҳокимлик ёрдами","Поддержка правительства и местных органов власти","Support from government and local authorities","政府及地方机构支持")],
] as const;

export const pageSubtitle: Record<string, LocalizedText> = {
 leadership:L("Бошқарма раҳбарияти, қабул кунлари ва алоқа маълумотлари.","Руководство управления, дни приёма и контакты.","Management, reception hours and contacts.","管理层、接待时间和联系方式。"),
 structure:L("Бошқарманинг ташкилий тузилмаси ва асосий бўлимлари.","Организационная структура и основные отделы управления.","Organizational structure and key departments.","组织结构和主要部门。"),
 staff:L("Ходимлар, бўлимлар ва қабул маълумотлари.","Сотрудники, отделы и сведения о приёме.","Employees, departments and reception details.","员工、部门及接待信息。"),
 investments:L("Инвесторлар учун имкониятлар, хизматлар ва лойиҳалар.","Возможности, услуги и проекты для инвесторов.","Opportunities, services and projects for investors.","面向投资者的机会、服务和项目。"),
 projects:L("Сурхондарё вилоятидаги устувор инвестиция лойиҳалари.","Приоритетные инвестиционные проекты Сурхандарьинской области.","Priority investment projects in Surkhandarya region.","苏尔汉河州重点投资项目。"),
 land:L("Бўш ер майдонлари ва мавжуд инфратузилма.","Свободные земельные участки и доступная инфраструктура.","Available land plots and infrastructure.","可用土地和基础设施。"),
 map:L("Инвестиция объектлари ва саноат зоналарининг интерактив харитаси.","Интерактивная карта инвестиционных объектов и промышленных зон.","Interactive map of investment sites and industrial zones.","投资项目和工业区互动地图。"),
 industry:L("Ҳудуднинг саноат тармоқлари ва ишлаб чиқариш салоҳияти.","Отрасли промышленности и производственный потенциал региона.","Regional industries and production potential.","区域工业和生产潜力。"),
 export:L("Экспорт географияси, маҳсулотлар ва ташқи савдо кўрсаткичлари.","География экспорта, продукция и показатели внешней торговли.","Export geography, products and foreign trade indicators.","出口地区、产品及外贸指标。"),
 services:L("Тадбиркорлар ва инвесторларга кўрсатиладиган хизматлар.","Услуги для предпринимателей и инвесторов.","Services for entrepreneurs and investors.","为企业家和投资者提供的服务。"),
 news:L("Бошқарма фаолиятига оид сўнгги янгиликлар.","Последние новости о деятельности управления.","Latest department news.","管理局最新动态。"),
 media:L("Фото, видео ва тадбирлар галереяси.","Галерея фотографий, видео и мероприятий.","Photo, video and events gallery.","图片、视频和活动画廊。"),
 documents:L("Норматив ҳужжатлар, ҳисоботлар ва шакллар.","Нормативные документы, отчёты и формы.","Regulations, reports and forms.","法规、报告和表格。"),
 contacts:L("Манзил, телефон, иш вақти ва расмий платформалар.","Адрес, телефон, часы работы и официальные платформы.","Address, phone, working hours and official platforms.","地址、电话、工作时间和官方平台。"),
 reception:L("Электрон мурожаат юбориш ва ҳолатини кузатиш.","Отправка электронного обращения и отслеживание статуса.","Submit an online appeal and track its status.","提交在线申请并跟踪状态。"),
 cabinet:L("Инвесторнинг шахсий кабинети.","Личный кабинет инвестора.","Investor personal account.","投资者个人中心。"),
};

export const uiText = {
 searchProject:L("Лойиҳа, соҳа ёки туман бўйича қидириш","Поиск по проекту, отрасли или району","Search by project, sector or district","按项目、行业或地区搜索"),
 searchStaff:L("Ходим ёки бўлим бўйича қидириш","Поиск по сотруднику или отделу","Search by employee or department","按员工或部门搜索"),
 searchDocument:L("Ҳужжат номи бўйича қидириш","Поиск по названию документа","Search documents by title","按标题搜索文件"),
 value:L("Қиймати","Стоимость","Value","投资额"), jobs:L("Иш ўрни","Рабочие места","Jobs","就业岗位"), area:L("Ҳудуд","Район","Area","地区"), status:L("Ҳолати","Статус","Status","状态"),
 landArea:L("Майдон","Площадь","Area","面积"), power:L("Электр","Электричество","Power","电力"), gas:L("Газ","Газ","Gas","燃气"), water:L("Сув","Вода","Water","供水"), viewMap:L("Харитада кўриш","Посмотреть на карте","View on map","在地图上查看"),
 officialPlatforms:L("Расмий платформалар","Официальные платформы","Official platforms","官方平台"), contactInfo:L("Алоқа маълумотлари","Контактная информация","Contact information","联系信息"),
 fullName:L("Исм ва фамилия","Имя и фамилия","Full name","姓名"), phone:L("Телефон","Телефон","Phone","电话"), subject:L("Мурожаат мавзуси","Тема обращения","Subject","主题"), message:L("Мурожаат матни","Текст обращения","Message","内容"), accepted:L("Мурожаат қабул қилинди","Обращение принято","Appeal received","申请已受理"), appealNo:L("Мурожаат рақами","Номер обращения","Appeal number","申请编号"),
 password:L("Пароль","Пароль","Password","密码"), signIn:L("Кириш","Войти","Sign in","登录"), register:L("Рўйхатдан ўтиш","Регистрация","Register","注册"), download:L("Юклаб олиш","Скачать","Download","下载"),
};
