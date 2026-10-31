# Toolzy AI Proxy — setup guide (free, ~15 minutes)

This is the small backend that powers the **✨ AI** tab in the Math Solver.
It keeps your Gemini API key secret and makes it **impossible to exceed the free tier**,
so you can never get a surprise bill.

Everything below is free and needs **no credit card**.

---

## Step 1 — Get a free Gemini API key

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account.
3. Click **"Create API key"** → **Create API key in new project**.
4. Copy the key (looks like `AIza...`). Keep it private — treat it like a password.

> Note: this free *API key* is separate from the Gemini app subscription (e.g. the Jio one).
> Any Google account can create this key for free.

---

## Step 2 — Deploy the Worker on Cloudflare (free)

1. Create a free account at **https://dash.cloudflare.com**.
2. In the left menu: **Workers & Pages** → **Create** → **Create Worker**.
3. Give it a name (e.g. `toolzy-ai`) → **Deploy** (the default hello-world is fine for now).
4. Click **Edit code**. Delete everything, then paste the full contents of
   [`worker.js`](worker.js) from this folder. Click **Deploy**.

### Step 2a — Add the KV storage (for the daily counters)
1. **Workers & Pages** → **KV** → **Create a namespace**, name it `COUNTERS` → Add.
2. Open your worker → **Settings** → **Variables and Secrets** → **KV Namespace Bindings**
   → **Add binding**:
   - Variable name: `COUNTERS`
   - KV namespace: select the `COUNTERS` you just made → **Save**.

### Step 2b — Add your key as a secret
1. Same **Settings → Variables and Secrets** page → **Add** a **Secret**:
   - Name: `GEMINI_KEY`
   - Value: paste your `AIza...` key → **Save**.

### Step 2c — (optional) Tune the limits
Add these as plain **Variables** (not secrets) if you want to change the defaults:

| Variable | Default | Meaning |
|---|---|---|
| `MODEL` | `gemini-2.0-flash` | Which Gemini model to use |
| `DAILY_CAP` | `1400` | Hard stop for the whole site per day (stay under the free limit) |
| `PER_IP_DAILY` | `5` | Free questions per visitor per day |
| `ALLOW_ORIGIN` | `*` | Set to your site, e.g. `https://yoursite.com`, once live |

---

## Step 3 — Connect it to the site

1. Copy your Worker's URL (shown after deploy, like `https://toolzy-ai.YOURNAME.workers.dev`).
2. Open [`../tools/math-solver.html`](../tools/math-solver.html).
3. Find this line near the bottom (in the `<script>`):
   ```js
   var AI_PROXY_URL = "";          // <-- paste your deployed Worker URL here
   ```
4. Paste your URL between the quotes:
   ```js
   var AI_PROXY_URL = "https://toolzy-ai.YOURNAME.workers.dev";
   ```
5. Save, re-deploy your site. The **✨ AI** tab is now live.

---

## How you're protected from any cost

- The Worker counts every call. When the site hits `DAILY_CAP` (default 1400), it **stops
  calling Gemini** and tells users to try tomorrow — so you never cross the free ~1500/day.
- Each visitor is limited to `PER_IP_DAILY` (default 5) questions/day.
- Gemini's **free tier never charges** — billing only starts if *you* explicitly upgrade.
  As long as you don't enable billing on the Google project, the worst case is "quota
  reached", never a charge.

---

## Next milestone — "buy more questions" (paid tier, for profit)

The quota system is already built to support this. Later we'll add:
- A payment step (Razorpay — India friendly) to buy question packs.
- A per-user balance stored in the same KV namespace.
- Optional: enable Gemini's cheap paid tier for paid users only, so their payment covers
  the (tiny) API cost and the rest is profit.

No rewrite needed — it slots into this same Worker.
