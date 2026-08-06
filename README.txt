STAFF PHOTO MANUAL CONTROLS

New controls in the admin staff editor:
- Upload photo from PC
- Cover or contain mode
- Manual scale: 70–180%
- Horizontal position: 0–100%
- Vertical position: 0–100%
- Card image height: 220–520 px
- Live preview
- Reset to defaults

INSTALLATION

STEP 1 — SUPABASE
Open SQL Editor and run:
  supabase/staff-photo-settings.sql

STEP 2 — GITHUB
Upload the complete src folder with replacement.

Files replaced:
  src/components/admin/ExtraManagers.tsx
  src/lib/extra-content-api.ts
  src/routes/leadership.tsx

Commit:
  Add manual staff photo sizing and positioning

STEP 3 — VERCEL
Wait for Ready, then refresh with Ctrl + Shift + R.

USAGE
Admin → Ходимлар → edit employee.
Adjust the sliders while watching the preview, then press Save.
