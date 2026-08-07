PUBLIC AI — WORKING FIX

WHY IT FAILED
The website was calling /functions/v1/admin-ai.
admin-ai validates an authenticated Supabase user session.
A normal website visitor only has the publishable/anon key, so verifyUser() returned false and the function returned 401.

WHAT THIS FIX DOES
1. Keeps admin-ai protected.
2. Adds a separate Edge Function:
   supabase/functions/public-ai/index.ts
3. Public AI can only answer public portal questions.
4. Public component now calls:
   /functions/v1/public-ai
5. The chat displays the real server error in parentheses if something is still misconfigured.

STEP 1 — DEPLOY PUBLIC-AI IN SUPABASE

Supabase Dashboard:
Edge Functions → Create new function

Function name:
public-ai

Delete the template code and paste all code from:
supabase/functions/public-ai/index.ts

Deploy function.

STEP 2 — FUNCTION SETTINGS

Open:
Edge Functions → public-ai → Settings

For a public website function:
Turn OFF:
Verify JWT with legacy secret

Save changes.

The function itself does NOT expose OPENAI_API_KEY.
The API key stays in Supabase Secrets.

STEP 3 — CHECK SECRETS

Edge Functions → Secrets

Must exist:
OPENAI_API_KEY
OPENAI_MODEL

OPENAI_MODEL can be the same value already used by admin-ai.

STEP 4 — GITHUB

Upload src folder from this patch with replacement.

Changed frontend file:
src/components/site/PublicAIAssistant.tsx

Commit:
Fix public AI endpoint

Wait for Vercel Ready and press Ctrl+Shift+R once.

TEST
Ask:
менга раҳбарият керак

If there is still a problem, the chat now shows the exact server error, for example:
(401 ...)
(OPENAI_API_KEY ...)
(model ...)
instead of only a generic connection message.
