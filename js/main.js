/* Toolzy — shared site behaviour */
(function () {
  "use strict";

  // ---- Theme (persisted, with safe storage) ----
  var root = document.documentElement;
  function getStored(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function setStored(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }
  var saved = getStored("toolzy-theme");
  // Default to light theme unless the visitor has explicitly chosen a theme.
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
    if (!t) {
      t = document.createElement("div");
      t.id = "toast"; t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg || "Done";
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove("show"); }, 1800);
  };
  window.copyText = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { showToast("Copied to clipboard"); },
        function () { fallbackCopy(text); }
      );
    } else {
      fallbackCopy(text);
    }
  };
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand("copy"); showToast("Copied to clipboard"); }
    catch (e) { showToast("Press Ctrl+C to copy"); }
    document.body.removeChild(ta);
  }

  // ---- Homepage tool search filter ----
  function initSearch() {
    var input = document.getElementById("toolSearch");
    if (!input) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-tool]"));
    var empty = document.getElementById("noResults");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var hay = (c.getAttribute("data-tool") || "").toLowerCase();
        var match = hay.indexOf(q) !== -1;
        c.style.display = match ? "" : "none";
        if (match) shown++;
      });
      if (empty) empty.style.display = shown === 0 ? "block" : "none";
    });
  }

  // ---- Footer year ----
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  // ---- Date inputs: click anywhere to open the picker ----
  function initDatePickers() {
    var dates = document.querySelectorAll('input[type="date"]');
    Array.prototype.forEach.call(dates, function (d) {
      d.addEventListener("click", function () {
        if (typeof d.showPicker === "function") {
          try { d.showPicker(); } catch (e) {}
        }
      });
    });
  }

  // ---- Back button (returns to where the user came from) ----
  function initBack() {
    var bc = document.querySelector(".breadcrumb");
    if (!bc) return; // only on tool/content pages, not the homepage
    var inTools = location.pathname.indexOf("/tools/") !== -1;
    var fallback = (inTools ? "../" : "") + "index.html#tools";
    var a = document.createElement("a");
    a.className = "back-btn";
    a.href = fallback;
    a.innerHTML = "← Back";
    a.addEventListener("click", function (e) {
      // Prefer real browser-back so they land exactly where they chose the tool.
      try {
        var ref = document.referrer;
        if (ref && new URL(ref).origin === location.origin && history.length > 1) {
          e.preventDefault();
          history.back();
        }
      } catch (err) {}
    });
    bc.parentNode.insertBefore(a, bc);
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateThemeIcon();
    initSearch();
    initYear();
    initDatePickers();
    initBack();
  });
})();
