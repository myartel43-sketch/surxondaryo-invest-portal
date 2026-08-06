SURXONDARYO PORTAL — CONSOLIDATED UPDATE

Этот пакет объединяет все согласованные изменения в одну версию.

ИСПРАВЛЕНО
1. Главная страница работает на 5 языках:
   - ўзбекча кирилл
   - O‘zbekcha lotin
   - русский
   - English
   - 中文

2. Раздел документов:
   - показывает только файлы из Supabase;
   - кнопка «Файлни очиш» открывает именно загруженный файл;
   - кнопка скачивания использует тот же file_url.

3. Главная карта:
   - показывает точки, созданные администратором;
   - основная страница /map показывает нарисованные полигоны, линии, прямоугольники и маркеры;
   - обычная и спутниковая карта;
   - красивый новый дизайн.

4. Последние новости и приоритетный проект:
   - данные загружаются из Supabase;
   - после добавления через админку автоматически появляются на главной странице.

5. Футер:
   - удалён белый квадрат вокруг герба;
   - оставлен чистый герб с аккуратной тенью;
   - подписи переведены.

6. Боковое меню админки:
   - добавлена постоянная кнопка AI ёрдамчи;
   - при нажатии открывает встроенного помощника /admin#ai-assistant.

ФАЙЛЫ
src/routes/index.tsx
src/routes/documents.tsx
src/routes/map.tsx
src/components/site/DocumentsPage.tsx
src/components/site/PublicInvestmentMap.tsx
src/components/layout/SiteFooter.tsx
src/components/admin/AdminSidebar.tsx

УСТАНОВКА
1. Распакуйте архив.
2. Загрузите всю папку src в GitHub с заменой.
3. Commit:
   Consolidate translations dynamic content map documents and AI
4. Дождитесь Vercel Ready.
5. Нажмите Ctrl + Shift + R.

SQL запускать не требуется, если таблицы news, investment_projects, documents и map_objects уже созданы.
