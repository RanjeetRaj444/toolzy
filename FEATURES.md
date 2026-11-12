# Toolzy — Feature Documentation & Architecture Specification

**Toolzy** is an ultra-fast, privacy-first web utility platform offering 64+ free online tools that run 100% in the user's browser without backend processing, user accounts, or server uploads.

- **Production Domain:** `https://toolzy-7eo.pages.dev/`
- **Architecture:** 100% Static Web Application (HTML5, CSS3, Vanilla ES6 JavaScript)
- **Deployment Host:** Cloudflare Pages (Direct Upload via Wrangler CLI)
- **Primary Repository:** GitHub (`main` branch)

---

## 1. Core Platform Features

### 1.1 Progressive Web App (PWA) & Offline Capability
- **Service Worker (`sw.js`):** Employs a stale-while-revalidate caching strategy for static stylesheets, scripts, brand vectors, and pages. Navigating offline seamlessly serves cached copies.
- **Web App Manifest (`site.webmanifest`):** Configures app name, standalone display mode, brand theme colors (`#635bff`), SVG icons, and quick-launch app shortcuts (Word Counter, EMI Calculator, QR Generator, Image Compressor).
- **Zero Internet Requirement:** Once loaded, calculations, text formatting, image compression, PDF operations, and speech synthesis continue to function completely offline.

### 1.2 Favorites & Bookmarking System (⭐)
- **Save to Favorites:** On any tool page, users can click **"☆ Save"** to star the tool. The state toggles to **"★ Saved"** with an amber highlight.
- **Personalized Shelf (`#favBar`):** On the homepage, favorited tools are dynamically displayed in a high-visibility quick-access bar directly above the tools grid.
- **Storage:** Persisted locally via `localStorage['toolzy-favs']` with zero tracking.

### 1.3 Recently Used History Shelf (⚡)
- Automatically tracks the last 5 visited tools in `localStorage['toolzy-recent']`.
- Renders an interactive quick-jump chip carousel on the homepage so returning visitors can resume work instantly.

### 1.4 Live Search & Keyboard Shortcuts
- **Instant Client-Side Filtering:** Filters all 64 tools by title, category, and descriptive keyword tags in real time as the user types.
- **Keyboard Shortcut (`/`):** Pressing the `/` key anywhere on the homepage immediately focuses the search bar.
- **Zero Results Fallback:** Graceful empty state when no matching tool is found.

### 1.5 Category Navigation & Shareable Hashes
- Quick category filter pills: `All`, `Calculators`, `Finance`, `Image`, `PDF`, `Text & Writing`, `Developer`, `Generators`, `Crypto & More`.
- URL Hash Synchronization: Navigating to `/#calc`, `/#finance`, or `/#dev` automatically selects that category filter on page load.

### 1.6 One-Click Native Sharing & Clipboard Copy
- Every tool header includes a **"Share 🔗"** action button.
- Uses `navigator.share` on mobile devices (iOS/Android) for native OS share sheets; falls back to instant clipboard URL copy with a toast notification on desktop.

### 1.7 Drag-and-Drop File Upload Zones
- Automatically converts standard file inputs on image and PDF tools into styled drag-and-drop dropzones.
- Highlights on dragover, accepts drop events via `DataTransfer` API, and displays filename confirmations with an explicit privacy badge (`🔒 Processed in your browser — files never leave your device`).

### 1.8 Dark & Light Theme Modes
- Custom CSS variable color tokens for light and dark palettes.
- Auto-detects system `prefers-color-scheme` on first visit.
- Manual toggle in header persists user preference in `localStorage['toolzy-theme']`.

### 1.9 Cookie & Privacy Consent Banner
- Minimalist, non-blocking compliance banner at the bottom of the screen.
- Informs visitors about local storage and anonymous analytics while highlighting client-side privacy.
- Remembers dismissal in `localStorage['toolzy-consent']`.

---

## 2. Complete Tool Catalog (64 Tools)

### Category A: Calculators & Everyday Math (11 Tools)
1. **Word Counter (`/tools/word-counter`):** Words, characters, reading time, sentences, and paragraphs.
2. **Percentage Calculator (`/tools/percentage-calculator`):** Percentage of, percentage increase/decrease, ratios.
3. **Age Calculator (`/tools/age-calculator`):** Exact age in years, months, days, total days, next birthday countdown.
4. **BMI Calculator (`/tools/bmi-calculator`):** Body Mass Index, health category, ideal weight ranges.
5. **GPA Calculator (`/tools/gpa-calculator`):** Grade Point Average across 4.0 scale with custom credits.
6. **Area Calculator (`/tools/area-calculator`):** Rectangles, triangles, circles, trapezoids, polygons.
7. **Days Between Dates (`/tools/days-between`):** Date difference calculator with business days exclusion.
8. **Due Date Calculator (`/tools/due-date-calculator`):** Pregnancy due date estimation based on LMP.
9. **Tip Calculator (`/tools/tip-calculator`):** Bill splitting, custom tip percentage, per-person breakdown.
10. **Calorie Calculator (`/tools/calorie-calculator`):** Daily BMR & TDEE energy expenditure calculation.
11. **Unit Converter (`/tools/unit-converter`):** Length, mass, temperature, speed, volume, and area.

### Category B: Finance & Investment (10 Tools)
12. **EMI Calculator (`/tools/emi-calculator`):** Monthly loan installment, total interest, and amortization curve.
13. **SIP Calculator (`/tools/sip-calculator`):** Monthly mutual fund systematic investment compound growth.
14. **FD Calculator (`/tools/fd-calculator`):** Fixed deposit compound interest and maturity amount.
15. **Mortgage Calculator (`/tools/mortgage-calculator`):** Home loan planning with property taxes and insurance.
16. **GST Calculator (`/tools/gst-calculator`):** Inclusive and exclusive goods and services tax calculator.
17. **Discount Calculator (`/tools/discount-calculator`):** Sale price, discount amount, and savings.
18. **Currency Converter (`/tools/currency-converter`):** Live foreign exchange rates across global currencies.
19. **Invoice Generator (`/tools/invoice-generator`):** Professional PDF/printable invoices created client-side.
20. **Fuel Cost Calculator (`/tools/fuel-cost-calculator`):** Trip fuel expense estimation by mileage and fuel price.
21. **Electricity Bill Calculator (`/tools/electricity-bill-calculator`):** Appliance wattage to monthly kWh and cost.

### Category C: Text & Writing (6 Tools)
22. **Text to Speech Reader (`/tools/text-to-speech`):** 🎙️ Convert written text into speech using native system voices, speed, and pitch controls.
23. **Case Converter (`/tools/case-converter`):** UPPERCASE, lowercase, Title Case, Sentence case, camelCase, slug.
24. **Lorem Ipsum Generator (`/tools/lorem-ipsum`):** Dummy placeholder paragraphs, sentences, and lists.
25. **Text Diff Checker (`/tools/text-diff`):** Side-by-side text comparison with highlighted additions and deletions.
26. **Markdown Preview (`/tools/markdown-preview`):** Live Markdown editor and HTML renderer.
27. **Font Generator (`/tools/font-generator`):** Unicode fancy stylized text for social media bios.

### Category D: Image & Media Processing (10 Tools)
28. **Image Compressor (`/tools/image-compressor`):** Browser Canvas image compression (lossless, balanced, smallest).
29. **Image Converter (`/tools/image-converter`):** Convert between PNG, JPG, WebP, and AVIF formats.
30. **Image Resizer (`/tools/image-resizer`):** Pixel and percentage dimensions resizing with aspect ratio lock.
31. **HEIC to JPG (`/tools/heic-to-jpg`):** Apple iPhone photo format converter.
32. **Watermark Tool (`/tools/watermark`):** Stamp custom text or logo watermarks onto photos.
33. **Meme Generator (`/tools/meme-generator`):** Add top and bottom captions to popular meme templates.
34. **Image to Text (OCR) (`/tools/image-to-text`):** Extract text from screenshots and photos client-side.
35. **Color Converter (`/tools/color-converter`):** HEX, RGB, HSL, and CMYK bidirectional conversion.
36. **Color Palette Generator (`/tools/color-palette-generator`):** Harmonious color schemes and exportable palettes.
37. **Contrast Checker (`/tools/contrast-checker`):** WCAG 2.1 accessibility color contrast ratio validator.

### Category E: PDF Document Utilities (4 Tools)
38. **Image to PDF (`/tools/image-to-pdf`):** Combine multiple images into a clean PDF document.
39. **Merge PDF (`/tools/merge-pdf`):** Combine multiple PDF documents into one.
40. **Split PDF (`/tools/split-pdf`):** Extract page ranges from existing PDFs.
41. **PDF to Images (`/tools/pdf-to-images`):** Render PDF pages into downloadable high-res image files.

### Category F: Developer & Coding Utilities (9 Tools)
42. **JSON Formatter (`/tools/json-formatter`):** Format, prettify, validate, and minify JSON data.
43. **Base64 Encoder/Decoder (`/tools/base64`):** Encode and decode text or data URLs with UTF-8 support.
44. **Hash Generator (`/tools/hash-generator`):** Generate SHA-256, SHA-512, MD5, and SHA-1 checksums via Web Crypto.
45. **URL Encoder/Decoder (`/tools/url-encoder`):** Encode and decode query strings and special characters.
46. **Timestamp Converter (`/tools/timestamp-converter`):** Unix epoch milliseconds to human dates and vice versa.
47. **JSON ↔ YAML Converter (`/tools/json-yaml-converter`):** Bidirectional config file syntax conversion.
48. **Regex Tester (`/tools/regex-tester`):** Test regular expressions with live match groups and flag toggles.
49. **JWT Decoder (`/tools/jwt-decoder`):** Decode and inspect JWT claims, expiration, and header payloads.
50. **UUID Generator (`/tools/uuid-generator`):** Generate cryptographically secure v4 UUIDs in bulk.

### Category G: Random Generators & Social (11 Tools)
51. **Password Generator (`/tools/password-generator`):** Cryptographically secure passwords with strength meter.
52. **QR Code Generator (`/tools/qr-generator`):** Custom QR codes for URLs, WiFi credentials, and text.
53. **Barcode Generator (`/tools/barcode-generator`):** Code 128, EAN, and UPC barcodes.
54. **Business Name Generator (`/tools/business-name-generator`):** Creative domain and company name brainstorming.
55. **Username Generator (`/tools/username-generator`):** Social media handle and gaming gamer-tag ideas.
56. **Band Name Generator (`/tools/band-name-generator`):** Musical artist and group moniker ideas.
57. **Podcast Name Generator (`/tools/podcast-name-generator`):** Show title brainstorming by genre.
58. **Random Picker (`/tools/random-picker`):** Spin the wheel / randomize decisions from a custom list.
59. **Slug Generator (`/tools/slug-generator`):** SEO URL slug creator with stop-word stripping.
60. **Hashtag Generator (`/tools/hashtag-generator`):** Instagram, TikTok, and Twitter hashtag recommendations.

### Category H: Crypto, Time & Live Feeds (4 Tools)
61. **Live Crypto Prices (`/tools/crypto-tracker`):** Real-time cryptocurrency prices, 24h change, and volume.
62. **Math Problem Solver (`/tools/math-solver`):** Step-by-step arithmetic and algebraic equation evaluations.
63. **Time Zone Converter (`/tools/timezone-converter`):** Compare international clock times across global cities.
64. **Weather Forecast (`/tools/weather-forecast`):** Worldwide 7-day weather, temperature, humidity, and wind forecasts via Open-Meteo.

---

## 3. SEO & Google Search Console Architecture

1. **Clean URL Structure:**
   - Every tool is accessed via clean URLs (e.g. `/tools/word-counter` instead of `/tools/word-counter.html`).
   - Self-referencing `<link rel="canonical">` tags on every page ensure zero duplicate content penalties.
2. **Schema.org Structured Data (`@graph`):**
   - Homepage: `WebSite` (with `SearchAction`), `Organization`, and `FAQPage`.
   - Tool Pages: `WebApplication` (free pricing offer), `BreadcrumbList`, and `FAQPage`.
3. **Sitemaps & Discovery Feeds:**
   - `sitemap.xml`: Complete indexed URL list for Googlebot.
   - `rss.xml`: Fast-indexing RSS 2.0 feed with RFC 822 timestamps.
   - `opensearch.xml`: Native browser search bar integration.
   - `robots.txt`: Grants universal crawl access and explicitly references both sitemaps.
4. **Contextual Internal Topical Linking:**
   - Deep cross-links embedded within the prose and FAQs of related tools to maximize internal PageRank distribution.

---

## 4. Google AdSense & Compliance Architecture

1. **`ads.txt` Integration:**
   - Standard IAB-compliant `/ads.txt` deployed at domain root containing publisher identifier:
     `google.com, pub-6506203240622280, DIRECT, f08c47fec0942fa0`
   - Case-insensitive redirect rules in `_redirects` (`/Ads.txt`, `/Add.txt` -> `/ads.txt`).
2. **AdSense Script Tag:**
   - Clean async script loader in `<head>` of all 70 HTML files:
     `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6506203240622280" crossorigin="anonymous"></script>`
3. **Empty Ad Slot Masking:**
   - `.ad-slot { display: none; }` prevents empty placeholder boxes from triggering "Under Construction" or "Low Value Content" rejections during review.
4. **Mandatory Policy & E-E-A-T Pages:**
   - `about.html`: Explicit documentation of creator (Ranjeet Raj), client-side privacy mission, and tech stack.
   - `contact.html`: Working direct email address (`ranjeetraj44666@gmail.com`).
   - `privacy-policy.html`: Exhaustive GDPR/CCPA disclosures, cookie policy, third-party advertising disclosures.
   - `terms.html`: Transparent terms of service and disclaimer of warranties.
   - `404.html`: Custom error page with quick links back to all tools.
