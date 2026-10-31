# Toolzy AI Proxy — setup guide (free, ~15 minutes)

This is the small backend that powers the **✨ AI** tab in the Math Solver.
It keeps your Gemini API key secret and makes it **impossible to exceed the free tier**,
so you can never get a surprise bill.

Everything below is free and needs **no credit card**.

---

## Step 1 — Get a free API key

### Recommended: Groq (higher free limits, no region block)
1. Go to **https://console.groq.com/keys**
2. Sign in (Google or GitHub).
3. Click **"Create API Key"**, name it `toolzy`, and copy it (starts with `gsk_`).
4. Keep it private — treat it like a password.

Groq's free tier is roughly **30 requests/min and thousands/day**, and it works
worldwide. Default model: `openai/gpt-oss-20b` (fast, strong at maths). You can switch
to `openai/gpt-oss-120b` (smarter) or `qwen/qwen3.8-27b` via the `MODEL` variable.

### Alternative: Gemini
1. Go to **https://aistudio.google.com/app/apikey** → sign in → **Create API key in new project**.
2. Copy the key (looks like `AIza...`).
3. Note: Gemini's free tier is **not available in all regions** — if calls return
   `429 ... for a region`, use Groq instead. (Also: the Gemini *app* subscription,
   e.g. the Jio one, does NOT provide an API key.)

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
   - For Groq (recommended): Name `GROQ_KEY`, Value = your `gsk_...` key → **Save**.
   - For Gemini instead: Name `GEMINI_KEY`, Value = your `AIza...` key, **and** add a
     Variable `PROVIDER` = `gemini`.

### Step 2c — (optional) Tune the limits
Add these as plain **Variables** (not secrets) to change the defaults:

| Variable | Default | Meaning |
|---|---|---|
| `PROVIDER` | `groq` | `groq` or `gemini` |
| `MODEL` | `llama-3.1-8b-instant` (groq) | Which model to use |
| `DAILY_CAP` | `1400` | Global hard stop per day (keeps you inside the free tier) |
| `PER_IP_DAILY` | `5` | Free questions per visitor per day |
| `ALLOW_ORIGIN` | `*` | Set to your site, e.g. `https://ranjeetraj444.github.io`, once live |

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
