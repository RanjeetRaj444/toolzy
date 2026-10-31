/**
 * Toolzy AI proxy — Cloudflare Worker
 * -----------------------------------
 * Hides your Gemini API key and makes it IMPOSSIBLE to exceed the free tier:
 *   - A global daily cap (DAILY_CAP) stops calls before the free limit is hit.
 *   - A per-visitor daily cap (PER_IP_DAILY) stops one person draining the pool.
 *
 * Bindings it needs (set in the Cloudflare dashboard — see ai-proxy/README.md):
 *   - Secret:        GEMINI_KEY      your free key from aistudio.google.com
 *   - KV namespace:  COUNTERS        stores the daily counters
 *   - Variables (optional, have sensible defaults):
 *       MODEL         default "gemini-2.0-flash"
 *       DAILY_CAP     default "1400"   (stay safely under the ~1500/day free limit)
 *       PER_IP_DAILY  default "5"
 *       ALLOW_ORIGIN  default "*"      (set to your site, e.g. https://yoursite.com)
 */

const SYSTEM_PROMPT =
  "You are a patient, friendly tutor. Solve the student's problem step by step, " +
  "showing your working clearly like a worked textbook example. Number each step. " +
  "For maths, show every calculation. For word problems, first state what is given and " +
  "what is asked, then solve. At the very end, put the final answer on its own line " +
  "starting with 'Answer:'. Keep it clear and concise. Use ** for bold. " +
  "If the input is not a solvable problem, say so briefly and politely.";

export default {
  async fetch(request, env) {
    const origin = env.ALLOW_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST")
      return json({ error: "method_not_allowed" }, 405, cors);

    // --- read input ---
    let problem = "";
    try {
      const body = await request.json();
      problem = (body.problem || "").toString().slice(0, 4000);
    } catch (e) {
      return json({ error: "bad_request" }, 400, cors);
    }
    if (!problem.trim()) return json({ error: "empty" }, 400, cors);

    if (!env.GEMINI_KEY) return json({ error: "not_configured" }, 500, cors);

    const day = ptDate();
    const DAILY_CAP = parseInt(env.DAILY_CAP || "1400", 10);
    const PER_IP_DAILY = parseInt(env.PER_IP_DAILY || "5", 10);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const gKey = "g:" + day;
    const ipKey = "ip:" + ip + ":" + day;

    // --- quota checks ---
    const [gVal, ipVal] = await Promise.all([
      env.COUNTERS.get(gKey),
      env.COUNTERS.get(ipKey),
    ]);
    const gCount = parseInt(gVal || "0", 10);
    const ipCount = parseInt(ipVal || "0", 10);

    if (gCount >= DAILY_CAP) return json({ error: "global_limit" }, 429, cors);
    if (ipCount >= PER_IP_DAILY) return json({ error: "user_limit" }, 429, cors);

    // --- call Gemini ---
    const model = env.MODEL || "gemini-2.0-flash";
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      model + ":generateContent?key=" + env.GEMINI_KEY;

    let answer = "";
    try {
      const gr = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: problem }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1400 },
        }),
      });
      const gd = await gr.json();
      if (!gr.ok) return json({ error: "ai_error", detail: gd.error ? gd.error.message : "" }, 502, cors);
      answer =
        gd.candidates &&
        gd.candidates[0] &&
        gd.candidates[0].content &&
        gd.candidates[0].content.parts &&
        gd.candidates[0].content.parts[0] &&
        gd.candidates[0].content.parts[0].text;
    } catch (e) {
      return json({ error: "ai_unreachable" }, 502, cors);
    }
    if (!answer) return json({ error: "no_answer" }, 502, cors);

    // --- increment counters (TTL ~2 days so old keys clean themselves up) ---
    const ttl = { expirationTtl: 172800 };
    await Promise.all([
      env.COUNTERS.put(gKey, String(gCount + 1), ttl),
      env.COUNTERS.put(ipKey, String(ipCount + 1), ttl),
    ]);

    return json({ answer: answer }, 200, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: Object.assign({ "Content-Type": "application/json" }, cors),
  });
}

// Pacific-time date (YYYY-MM-DD) so our counter resets when Gemini's quota does.
function ptDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date());
}
