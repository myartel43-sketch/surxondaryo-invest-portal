SURXONDARYO — FULL TRANSLATION + AI ADMIN

WHAT IS INCLUDED
1. RuntimeTranslator:
   - translates remaining hard-coded interface text;
   - supports Uzbek Cyrillic, Uzbek Latin, Russian, English and Chinese;
   - translates placeholders, titles and aria-labels;
   - dynamic Supabase content continues to use its existing multilingual fields.

2. New premium administration dashboard:
   - modern responsive design;
   - 5-language counter;
   - integrated AI assistant;
   - existing ContentManagers, ExtraManagers, settings and map links are preserved.

3. AI assistant:
   - official news drafting;
   - investment project descriptions;
   - translation into one language or all 5 languages;
   - grammar/style improvement;
   - admin Q&A;
   - protected by the current Supabase admin session.

FILES TO UPLOAD
Upload the complete src folder to GitHub with replacement.

SUPABASE EDGE FUNCTION
The folder:
supabase/functions/admin-ai

must be deployed as an Edge Function named:
admin-ai

SUPABASE DASHBOARD STEPS
1. Open Supabase project.
2. Edge Functions → Deploy a new function.
3. Function name: admin-ai
4. Upload/paste supabase/functions/admin-ai/index.ts.
5. Open Project Settings → Edge Functions → Secrets.
6. Add:
   OPENAI_API_KEY = your OpenAI project API key
7. Optional:
   OPENAI_MODEL = gpt-5
8. Deploy the function.

CLI ALTERNATIVE
supabase functions deploy admin-ai
supabase secrets set OPENAI_API_KEY=YOUR_KEY
supabase secrets set OPENAI_MODEL=gpt-5

SECURITY
Never add OPENAI_API_KEY to:
- GitHub source files;
- VITE_* variables;
- browser code;
- Vercel client environment variables.

The key must stay in Supabase Secrets.

NO SQL IS REQUIRED.

GITHUB COMMIT
Add full translations and AI admin assistant

AFTER DEPLOYMENT
1. Wait for Vercel status Ready.
2. Open /admin.
3. Press Ctrl + Shift + R.
4. Test AI assistant.
