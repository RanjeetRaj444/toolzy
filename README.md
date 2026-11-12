# Toolzy — Free, Fast & Private Online Tools

A comprehensive suite of 64+ free, privacy-friendly online utilities. Built with 100% vanilla web technologies (HTML5, CSS3, modern JavaScript) with **zero backend**, **no build steps**, and **no server-side data uploads**. Everything runs right in the visitor's browser.

🌐 **Live URL:** [https://toolzy-7eo.pages.dev/](https://toolzy-7eo.pages.dev/)  
📁 **Complete Documentation:** See [FEATURES.md](./FEATURES.md) for full catalog and feature breakdown.

---

## 🌟 Key Highlights

- **64+ Browser-Native Tools:** Calculators, text processors, image editors, PDF utilities, generators, and developer helpers.
- **100% Client-Side Privacy:** Files, passwords, and sensitive inputs never leave the user's device.
- **PWA & Offline Ready:** Integrated Service Worker (`sw.js`) and Web Manifest (`site.webmanifest`) allow Toolzy to be installed as a native app and run offline.
- **Favorites & Recents System:** Quick-access shelves powered by `localStorage` (★ Star favorite tools, ⚡ View recently used tools).
- **SEO & Google Search Console Ready:**
  - XML Sitemap with 68 canonical URLs (`sitemap.xml`)
  - RSS 2.0 Feed for rapid bot indexing (`rss.xml`)
  - OpenSearch 1.1 description (`opensearch.xml`)
  - Schema.org JSON-LD structured data (`WebApplication`, `BreadcrumbList`, `FAQPage`, `WebSite`, `Organization`) on every page.
  - Comprehensive contextual internal linking across all tool categories.
- **Google AdSense Ready:**
  - Standard compliant `/ads.txt`
  - Clean HTML without placeholder ad violations
  - Essential legal & identity pages (`about.html`, `contact.html`, `privacy-policy.html`, `terms.html`, `404.html`)
  - GDPR/privacy consent banner.
- **Modern UX:**
  - Dark/Light mode toggle with persistence
  - Instant live fuzzy search with keyboard shortcut (`/`)
  - Drag-and-drop file processing zones
  - Responsive layout optimized for mobile, tablet, and desktop.

---

## 🚀 Running Locally

Open `index.html` directly in your browser, or serve it locally:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .
```

Then navigate to `http://localhost:8000`.

---

## ☁️ Deployment

Toolzy is configured for continuous static hosting on **Cloudflare Pages**, **Netlify**, or **Vercel**:

- **Cloudflare Pages:**
  ```bash
  npx wrangler pages deploy . --project-name=toolzy --branch=main
  ```
- **Custom Headers & Redirects:**
  - `_headers`: Caching rules (immutable 1-year cache for CSS/JS, revalidate for sitemaps and service worker).
  - `_redirects`: Clean URL canonicals and `/ads.txt` case-handling.

---

## 📄 License & Attribution

Created & maintained by **Ranjeet Raj**. Free to use under the MIT License.
