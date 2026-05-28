// ==UserScript==
// @name         MusicBrainz: Always Show and Sort All Releases by Year
// @namespace    https://musicbrainz.org/
// @version      2026-05-28.0803
// @description  Automatically forces ?all=1&va=0 on artist pages and sorts release group tables by year. Includes a small toggle switch.
// @downloadURL  https://github.com/Lotheric/metabrainz-userscripts/blob/main/MusicBrainz_Always_Show_and_Sort_All_Releases_by_Year.user.js
// @updateURL    https://github.com/Lotheric/metabrainz-userscripts/blob/main/MusicBrainz_Always_Show_and_Sort_All_Releases_by_Year.user.js
// @author       Lotheric
// @tag          ai-created
// @icon         https://community.metabrainz.org/user_avatar/community.metabrainz.org/lotheric/288/88429_2.png
// @match        https://musicbrainz.org/artist/*
// @match        https://beta.musicbrainz.org/artist/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  // --- Auto-Redirect Logic & State ---
  var AUTO_REDIRECT_KEY = "mb_auto_redirect_enabled";
  var isRedirectEnabled = localStorage.getItem(AUTO_REDIRECT_KEY) !== "false";

  var path = window.location.pathname;
  var isArtistMainPage = /^\/artist\/[a-f0-9-]{36}\/?$/i.test(path);

  // Execute redirect immediately if enabled
  if (isArtistMainPage && isRedirectEnabled) {
    var search = window.location.search;
    if (search.indexOf("all=1") === -1 || search.indexOf("va=0") === -1) {
      window.location.href = path + "?all=1&va=0";
      return;
    }
  }

  // --- Inject Micro Toggle CSS (Pure String Concatenation) ---
  var style = document.createElement("style");
  style.textContent =
    ".mb-toggle-container { display: inline-flex; align-items: center; margin-left: 15px; vertical-align: middle; font-size: 0.65em; font-weight: normal; letter-spacing: 0.02em; }\n" +
    ".mb-toggle-label { color: black; }\n" + /* Explicitly set the label text to solid black */
    ".mb-toggle-status-text { opacity: 0.75; }\n" + /* Keep the ON/OFF text slightly faded */
    ".mb-switch { position: relative; display: inline-block; width: 22px; height: 12px; margin: 0 6px; }\n" +
    ".mb-switch input { opacity: 0; width: 0; height: 0; }\n" +
    ".mb-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #f44336; transition: .3s; border-radius: 12px; }\n" +
    ".mb-slider:before { position: absolute; content: ''; height: 8px; width: 8px; left: 2px; bottom: 2px; background-color: white; transition: .3s; border-radius: 50%; }\n" +
    ".mb-switch input:checked + .mb-slider { background-color: #4CAF50; }\n" +
    ".mb-switch input:checked + .mb-slider:before { transform: translateX(10px); }\n";
  document.head.appendChild(style);

  // --- Config ---
  var SORT_DIRECTION = "asc";
  var UNKNOWN_YEAR_POSITION = "bottom";

  // --- Sorting Functions ---
  function parseYear(text) {
    var match = (text || "").match(/\b(1[0-9]{3}|20[0-9]{2})\b/);
    return match ? parseInt(match[1], 10) : null;
  }

  function findYearColumnIndex(table) {
    var thead = table.querySelector("thead");
    if (!thead) return 0;

    var headers = thead.querySelectorAll("th, td");
    for (var i = 0; i < headers.length; i++) {
      var text = headers[i].textContent.trim().toLowerCase();
      if (text === "year" || text === "année" || text === "año" || text === "jahr") return i;
    }
    return 0;
  }

  function getCellText(tr, colIndex) {
    var cells = tr.querySelectorAll("td, th");
    if (!cells.length) return null;

    var logicalCol = 0;
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var span = parseInt(cell.getAttribute("colspan") || "1", 10);
      if (colIndex >= logicalCol && colIndex < logicalCol + span) {
        return cell.textContent;
      }
      logicalCol += span;
    }
    return cells[0].textContent;
  }

  function sortTbody(tbody, yearColIndex) {
    var allRows = tbody.querySelectorAll(":scope > tr");
    if (allRows.length < 2) return;

    var dataRows = [];
    var headerRows = [];

    for (var i = 0; i < allRows.length; i++) {
      if (allRows[i].querySelector("th")) {
        headerRows.push(allRows[i]);
      } else {
        dataRows.push(allRows[i]);
      }
    }

    if (dataRows.length < 2) return;

    var nullSentinel = SORT_DIRECTION === "asc" ? Infinity : -Infinity;
    if (UNKNOWN_YEAR_POSITION === "top") {
        nullSentinel = SORT_DIRECTION === "asc" ? -Infinity : Infinity;
    }

    dataRows.sort(function(a, b) {
      var ya = parseYear(getCellText(a, yearColIndex));
      if (ya === null) ya = nullSentinel;

      var yb = parseYear(getCellText(b, yearColIndex));
      if (yb === null) yb = nullSentinel;

      return SORT_DIRECTION === "asc" ? ya - yb : yb - ya;
    });

    for (var j = 0; j < headerRows.length; j++) {
      tbody.appendChild(headerRows[j]);
    }
    for (var k = 0; k < dataRows.length; k++) {
      tbody.appendChild(dataRows[k]);
    }
  }

  function getTableHeading(table) {
    var node = table;
    while (node && node !== document.body) {
      var prev = node.previousElementSibling;
      while (prev) {
        if (/^H[234]$/i.test(prev.tagName)) return prev;
        prev = prev.previousElementSibling;
      }
      node = node.parentElement;
    }
    return null;
  }

  function markHeading(heading) {
    if (!heading || heading.dataset.mbSorted) return;
    heading.dataset.mbSorted = "1";
    var badge = document.createElement("span");
    badge.textContent = SORT_DIRECTION === "asc" ? " ↑ sorted by year" : " ↓ sorted by year";
    badge.style.cssText = "font-size:0.65em; font-weight:normal; opacity:0.5; margin-left:0.5em; letter-spacing:0.02em;";
    heading.appendChild(badge);
  }

  function sortAllSections() {
    var tables = document.querySelectorAll("table.tbl");
    if (tables.length === 0) return;

    for (var i = 0; i < tables.length; i++) {
      var table = tables[i];
      var yearColIndex = findYearColumnIndex(table);
      var heading = getTableHeading(table);

      var tbodies = table.querySelectorAll("tbody");
      for (var j = 0; j < tbodies.length; j++) {
        sortTbody(tbodies[j], yearColIndex);
      }
      markHeading(heading);
    }
  }

  // --- UI Injection ---
  function buildToggleUI() {
    if (document.getElementById("mb-redirect-toggle-container")) return;

    var targetEl = null;
    var headings = document.querySelectorAll("h1, h2, h3");

    for (var i = 0; i < headings.length; i++) {
      if (headings[i].textContent.toLowerCase().indexOf("discography") !== -1) {
        targetEl = headings[i];
        break;
      }
    }

    if (!targetEl) targetEl = document.querySelector("h1");
    if (!targetEl) return;

    var container = document.createElement("div");
    container.className = "mb-toggle-container";
    container.id = "mb-redirect-toggle-container";

    var isCheckedStr = isRedirectEnabled ? "checked" : "";
    var statusStr = isRedirectEnabled ? "ON" : "OFF";

    container.innerHTML =
      "<span class='mb-toggle-label'>Always show all releases:</span>" +
      "<label class='mb-switch'>" +
        "<input type='checkbox' id='mb-auto-redirect-cb' " + isCheckedStr + ">" +
        "<span class='mb-slider'></span>" +
      "</label>" +
      "<span id='mb-toggle-status' class='mb-toggle-status-text' style='min-width: 20px;'>" + statusStr + "</span>";

    targetEl.appendChild(container);

    document.getElementById("mb-auto-redirect-cb").addEventListener("change", function(e) {
      var isChecked = e.target.checked;
      localStorage.setItem(AUTO_REDIRECT_KEY, isChecked ? "true" : "false");
      document.getElementById("mb-toggle-status").textContent = isChecked ? "ON" : "OFF";

      if (isChecked && isArtistMainPage) {
        window.location.href = path + "?all=1&va=0";
      }
      else if (!isChecked && isArtistMainPage) {
        window.location.href = path;
      }
    });
  }

  // --- Execution ---
  var debounceTimer;
  sortAllSections();
  buildToggleUI();

  var observer = new MutationObserver(function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      observer.disconnect();
      sortAllSections();
      buildToggleUI();
      observer.observe(document.body, { childList: true, subtree: true });
    }, 150);
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();
