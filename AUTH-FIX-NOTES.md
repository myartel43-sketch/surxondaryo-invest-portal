# Admin login route fix

This version fixes the endless `Текширилмоқда...` screen by making `src/routes/admin.tsx` a layout route with `<Outlet />` and moving the dashboard to `src/routes/admin.index.tsx`.

After upload, verify that these files exist in GitHub:
- `src/routes/admin.tsx`
- `src/routes/admin.index.tsx`
- `src/routes/admin.login.tsx`

Vercel must redeploy the commit containing all three files.
