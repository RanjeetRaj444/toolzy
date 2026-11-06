/* Toolzy — shared site behaviour */
(function () {
  "use strict";

  // ===================================================================
  //  Tool registry  [slug, Title, icon, category]
  // ===================================================================
  var TOOLS = [
    ["word-counter","Word Counter","📝","text"],
    ["case-converter","Case Converter","🔤","text"],
    ["lorem-ipsum","Lorem Ipsum Generator","📄","text"],
    ["text-diff","Text Diff Checker","🔀","text"],
    ["markdown-preview","Markdown Preview","📝","text"],
    ["percentage-calculator","Percentage Calculator","📊","calc"],
    ["age-calculator","Age Calculator","🎂","calc"],
    ["bmi-calculator","BMI Calculator","⚖️","calc"],
    ["gpa-calculator","GPA Calculator","🎓","calc"],
    ["area-calculator","Area Calculator","🔺","calc"],
    ["days-between","Days Between Dates","📅","calc"],
    ["due-date-calculator","Due Date Calculator","👶","calc"],
    ["tip-calculator","Tip Calculator","💸","calc"],
    ["calorie-calculator","Calorie Calculator","🍎","calc"],
    ["unit-converter","Unit Converter","📐","calc"],
    ["emi-calculator","EMI Calculator","🏦","finance"],
    ["mortgage-calculator","Mortgage Calculator","🏠","finance"],
    ["sip-calculator","SIP Calculator","📈","finance"],
    ["fd-calculator","FD Calculator","🏛️","finance"],
    ["gst-calculator","GST Calculator","🧾","finance"],
    ["discount-calculator","Discount Calculator","🏷️","finance"],
    ["currency-converter","Currency Converter","💱","finance"],
    ["invoice-generator","Invoice Generator","🧮","finance"],
    ["fuel-cost-calculator","Fuel Cost Calculator","⛽","finance"],
    ["electricity-bill-calculator","Electricity Bill Calculator","💡","finance"],
    ["image-compressor","Image Compressor","🖼️","image"],
    ["image-converter","Image Converter","🔄","image"],
    ["image-resizer","Image Resizer","📐","image"],
    ["watermark","Add Watermark","🌊","image"],
    ["meme-generator","Meme Generator","😂","image"],
    ["heic-to-jpg","HEIC to JPG","📱","image"],
    ["image-to-text","Image to Text (OCR)","🔎","image"],
    ["color-converter","Color Converter","🎨","image"],
    ["color-palette-generator","Color Palette Generator","🌈","image"],
    ["contrast-checker","Contrast Checker","◐","image"],
    ["image-to-pdf","Image to PDF","📄","pdf"],
    ["merge-pdf","Merge PDF","🔗","pdf"],
    ["split-pdf","Split PDF","✂️","pdf"],
    ["pdf-to-images","PDF to Images","🖼️","pdf"],
    ["json-formatter","JSON Formatter","{ }","dev"],
    ["base64","Base64 Encode / Decode","🧬","dev"],
    ["hash-generator","Hash Generator","🔐","dev"],
    ["url-encoder","URL Encoder / Decoder","🔗","dev"],
    ["timestamp-converter","Timestamp Converter","⏱️","dev"],
    ["json-yaml-converter","JSON ↔ YAML","🔁","dev"],
    ["regex-tester","Regex Tester","⚡","dev"],
    ["jwt-decoder","JWT Decoder","🔓","dev"],
    ["uuid-generator","UUID Generator","🆔","dev"],
    ["password-generator","Password Generator","🔑","generator"],
    ["qr-generator","QR Code Generator","⬛","generator"],
    ["barcode-generator","Barcode Generator","▐║▌","generator"],
    ["business-name-generator","Business Name Generator","🏢","generator"],
    ["username-generator","Username Generator","🧑‍💻","generator"],
    ["band-name-generator","Band Name Generator","🎸","generator"],
    ["podcast-name-generator","Podcast Name Generator","🎙️","generator"],
    ["random-picker","Random Picker","🎲","generator"],
    ["slug-generator","Slug Generator","🐌","generator"],
    ["hashtag-generator","Hashtag Generator","#️⃣","generator"],
    ["font-generator","Fancy Font Generator","✏️","generator"],
    ["crypto-tracker","Live Crypto Prices","₿","more"],
    ["math-solver","Math Problem Solver","🧮","more"],
    ["timezone-converter","Time Zone Converter","🌍","more"]
  ];
  var CATS = [
    ["all","All tools"],["calc","Calculators"],["finance","Finance"],
    ["image","Image"],["pdf","PDF"],["text","Text & Writing"],
    ["dev","Developer"],["generator","Generators"],["more","Crypto & More"]
  ];
  function catLabel(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === id) return CATS[i][1]; return ""; }
  function slugOf(href) { var m = (href || "").match(/([a-z0-9-]+)\.html(?:[#?].*)?$/i); return m ? m[1] : ""; }
  function toolBySlug(s) { for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i][0] === s) return TOOLS[i]; return null; }

  // ---- Theme (persisted, with safe storage) ----
  var root = document.documentElement;
  function getStored(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function setStored(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  var saved = getStored("toolzy-theme");
  root.setAttribute("data-theme", saved === "dark" ? "dark" : "light");

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  window.toggleTheme = function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    setStored("toolzy-theme", next);
    updateThemeIcon();
  };
  function updateThemeIcon() {
    var btn = document.getElementById("themeBtn");
    if (btn) btn.textContent = currentTheme() === "dark" ? "☀️" : "🌙";
  }

  // ---- Mobile menu ----
  window.toggleMenu = function () {
    var links = document.getElementById("navLinks");
    if (links) links.classList.toggle("open");
  };

  // ---- Toast + clipboard ----
  window.showToast = function (msg) {
    var t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg || "Done";
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove("show"); }, 1800);
  };
  window.copyText = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { showToast("Copied to clipboard"); }, function () { fallbackCopy(text); });
    } else { fallbackCopy(text); }
  };
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand("copy"); showToast("Copied to clipboard"); }
    catch (e) { showToast("Press Ctrl+C to copy"); }
    document.body.removeChild(ta);
  }

  // ---- Homepage: category chips + search (combined filter) ----
  var activeCat = "all", searchQ = "";
  function applyFilter() {
    var cards = document.querySelectorAll(".tool-card[data-tool]");
    var shown = 0;
    Array.prototype.forEach.call(cards, function (c) {
      var hay = (c.getAttribute("data-tool") || "").toLowerCase();
      var cat = c.getAttribute("data-cat") || "";
      var okCat = activeCat === "all" || cat === activeCat;
      var okQ = !searchQ || hay.indexOf(searchQ) !== -1;
      var match = okCat && okQ;
      c.style.display = match ? "" : "none";
      if (match) shown++;
    });
    var empty = document.getElementById("noResults");
    if (empty) empty.style.display = shown === 0 ? "block" : "none";
  }
  function initHome() {
    var grid = document.querySelector(".grid");
    if (!grid) return;
    // tag each card with its category from the registry
    Array.prototype.forEach.call(document.querySelectorAll(".tool-card"), function (c) {
      var t = toolBySlug(slugOf(c.getAttribute("href")));
      if (t) c.setAttribute("data-cat", t[3]);
    });
    // render category chips
    var bar = document.getElementById("toolCats");
    if (bar) {
      CATS.forEach(function (cat) {
        var b = document.createElement("button");
        b.className = "cat-chip" + (cat[0] === "all" ? " active" : "");
        b.textContent = cat[1];
        b.setAttribute("data-cat", cat[0]);
        b.onclick = function () {
          activeCat = cat[0];
          Array.prototype.forEach.call(bar.children, function (x) { x.classList.remove("active"); });
          b.classList.add("active");
          applyFilter();
        };
        bar.appendChild(b);
      });
    }
    var input = document.getElementById("toolSearch");
    if (input) input.addEventListener("input", function () { searchQ = input.value.trim().toLowerCase(); activeCat = "all"; if (bar) { Array.prototype.forEach.call(bar.children, function (x) { x.classList.toggle("active", x.getAttribute("data-cat") === "all"); }); } applyFilter(); });
  }

  // ---- Tool pages: "Related tools" + "All tools" links ----
  function initRelated() {
    if (location.pathname.indexOf("/tools/") === -1) return;
    var main = document.querySelector("main.content > .container");
    if (!main) return;
    var cur = toolBySlug(slugOf(location.pathname));
    var cat = cur ? cur[3] : null;
    var pool = TOOLS.filter(function (t) { return t[0] !== (cur && cur[0]); });
    var related = pool.filter(function (t) { return t[3] === cat; });
    // fill up to 6 with others if the category is small
    if (related.length < 6) {
      var others = pool.filter(function (t) { return t[3] !== cat; });
      for (var i = others.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = others[i]; others[i] = others[j]; others[j] = tmp; }
      related = related.concat(others);
    }
    related = related.slice(0, 6);
    var sec = document.createElement("section");
    sec.className = "related";
    var heading = cat ? "More " + catLabel(cat).toLowerCase() + " tools" : "More tools";
    var html = "<h2>" + heading + "</h2><div class='related-grid'>";
    related.forEach(function (t) {
      html += "<a class='related-card' href='" + t[0] + ".html'><span class='ri'>" + t[2] + "</span><span>" + t[1] + "</span></a>";
    });
    html += "</div><div class='related-all'><a class='btn secondary' href='../index.html#tools'>⊞ Browse all tools</a></div>";
    sec.innerHTML = html;
    main.appendChild(sec);
  }

  // ---- Footer year ----
  function initYear() { var el = document.getElementById("year"); if (el) el.textContent = new Date().getFullYear(); }

  // ---- Date inputs: click anywhere to open the picker ----
  function initDatePickers() {
    var dates = document.querySelectorAll('input[type="date"]');
    Array.prototype.forEach.call(dates, function (d) {
      d.addEventListener("click", function () { if (typeof d.showPicker === "function") { try { d.showPicker(); } catch (e) {} } });
    });
  }

  // ---- Back button (returns to where the user came from) ----
  function initBack() {
    var bc = document.querySelector(".breadcrumb");
    if (!bc) return;
    var inTools = location.pathname.indexOf("/tools/") !== -1;
    var fallback = (inTools ? "../" : "") + "index.html#tools";
    var a = document.createElement("a");
    a.className = "back-btn";
    a.href = fallback;
    a.innerHTML = "← Back";
    a.addEventListener("click", function (e) {
      try {
        var ref = document.referrer;
        if (ref && new URL(ref).origin === location.origin && history.length > 1) { e.preventDefault(); history.back(); }
      } catch (err) {}
    });
    bc.parentNode.insertBefore(a, bc);
  }

  // ---- Enhance file inputs into friendly drag-and-drop zones ----
  function initFileZones() {
    var inputs = document.querySelectorAll('input[type="file"]');
    Array.prototype.forEach.call(inputs, function (inp) {
      if (inp.getAttribute("data-dz")) return;
      inp.setAttribute("data-dz", "1");
      var multiple = inp.multiple;
      var accept = (inp.getAttribute("accept") || "").toLowerCase();
      var kind = accept.indexOf("pdf") !== -1 ? (multiple ? "PDF files" : "a PDF")
               : accept.indexOf("image") !== -1 ? (multiple ? "images" : "an image")
               : (multiple ? "files" : "a file");
      var zone = document.createElement("div");
      zone.className = "dropzone";
      zone.innerHTML =
        "<div class='dz-ico'>⬆</div>" +
        "<div class='dz-main'>Drag &amp; drop " + kind + " here</div>" +
        "<div class='dz-sub'>or <span class='dz-link'>click to browse</span></div>" +
        "<div class='dz-note'>🔒 Processed in your browser — files never leave your device</div>";
      inp.parentNode.insertBefore(zone, inp);
      inp.style.display = "none";
      zone.addEventListener("click", function () { inp.click(); });
      ["dragenter", "dragover"].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add("drag"); });
      });
      ["dragleave", "dragend", "drop"].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove("drag"); });
      });
      zone.addEventListener("drop", function (e) {
        var files = e.dataTransfer && e.dataTransfer.files;
        if (!files || !files.length) return;
        try { var dt = new DataTransfer(); for (var i = 0; i < files.length; i++) dt.items.add(files[i]); inp.files = dt.files; } catch (err) {}
        inp.dispatchEvent(new Event("change", { bubbles: true }));
      });
      inp.addEventListener("change", function () {
        var n = inp.files ? inp.files.length : 0;
        var m = zone.querySelector(".dz-main");
        if (!m) return;
        if (n === 1) m.textContent = "✓ " + inp.files[0].name;
        else if (n > 1) m.textContent = "✓ " + n + " files selected";
      });
    });
  }

  // ---- Scroll to top button ----
  function initScrollTop() {
    var btn = document.createElement("button");
    btn.className = "to-top"; btn.innerHTML = "↑"; btn.setAttribute("aria-label", "Scroll to top");
    btn.onclick = function () { window.scrollTo({ top: 0, behavior: "smooth" }); };
    document.body.appendChild(btn);
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      window.requestAnimationFrame(function () { btn.classList.toggle("show", window.pageYOffset > 400); ticking = false; });
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateThemeIcon();
    initHome();
    applyFilter();
    initYear();
    initDatePickers();
    initBack();
    initRelated();
    initFileZones();
    initScrollTop();
  });
})();
