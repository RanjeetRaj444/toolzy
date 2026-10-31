# Toolzy — Free Online Tools

A fast, privacy-friendly collection of free online tools. 100% static (HTML/CSS/JS), no
backend, no build step, no cost to run. Everything runs in the visitor's browser.

## Current tools (Milestone 1)

- Word Counter
- Password Generator
- Case Converter
- Age Calculator
- Percentage Calculator
- QR Code Generator

Plus: Home, About, Contact, Privacy Policy, Terms, 404, sitemap and robots.txt
(the pages Google AdSense requires).

## Run it locally

Just open `index.html` in a browser. Or serve it (recommended, so paths behave like production):

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy for free

Any static host works. Easiest options (all have a free tier):

### Netlify (drag & drop — no account tools needed)
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. You get a live URL instantly (e.g. `your-site.netlify.app`).

### Netlify / Vercel / Cloudflare Pages (via GitHub)
1. Push this folder to a GitHub repository.
2. Connect the repo in Netlify/Vercel/Cloudflare Pages.
3. Build command: *(none)*. Publish directory: `/` (the root).

### GitHub Pages
1. Push to GitHub, enable Pages on the `main` branch, root folder.

## Before going live — find & replace these placeholders

| Placeholder | Replace with |
|---|---|
| `https://example.com` | Your real domain (in every HTML `<link rel="canonical">`, Open Graph, `sitemap.xml`, `robots.txt`) |
| `hello@toolzy.example.com` | Your real contact email (`contact.html`) |
| `Toolzy` | Your final brand name, if you change it |

## After deploying

1. **Google Search Console** — add your site, verify, submit `sitemap.xml`.
2. **Wait for traffic + add a few more tools** (Milestone 2) before applying to AdSense.
3. **Google AdSense** — apply once the site has real content and some visitors.
   When approved, replace each `<div class="ad-slot">…</div>` with your AdSense ad unit code.

## Tech notes

- No frameworks, no dependencies except a tiny CDN QR library (`qrcodejs`) on the QR page.
- Light/dark theme with a manual toggle (remembers choice via localStorage).
- Each tool page is self-contained and individually SEO-optimised (title, description, canonical).
