# OPENROUTER AI SETUP

The portal AI has been migrated to OpenRouter.

Default model:
OPENROUTER_MODEL=openrouter/free

`openrouter/free` automatically selects an available free text model.

## 1. Create OpenRouter API key

Open OpenRouter and create an API key.

## 2. Supabase Secrets

Supabase -> Edge Functions -> Secrets

Add:

OPENROUTER_API_KEY = your OpenRouter key
OPENROUTER_MODEL = openrouter/free

The old OPENAI_API_KEY / OPENAI_MODEL and GEMINI_API_KEY / GEMINI_MODEL
are not used by the new functions.

## 3. public-ai

Supabase -> Edge Functions -> public-ai -> Code

Replace the full code with:
supabase/functions/public-ai/index.ts

Deploy the function.

Settings:
Verify JWT with legacy secret = OFF

## 4. admin-ai

Supabase -> Edge Functions -> admin-ai -> Code

Replace the full code with:
supabase/functions/admin-ai/index.ts

Deploy the function.

Do NOT make the admin assistant public.
Its code still verifies an authenticated Supabase administrator session.

## 5. GitHub / Vercel

Upload this project to GitHub if you also want the repository to contain
the OpenRouter Edge Function sources.

The public frontend still calls:
/functions/v1/public-ai

So the visible website AI component does not need a new endpoint.

## 6. Test

Public website:
менга раҳбарият ҳақида маълумот бер

Admin:
Prepare a short official news item.

If an error remains, inspect:
Supabase -> Edge Functions -> public-ai -> Logs
or
Supabase -> Edge Functions -> admin-ai -> Logs
