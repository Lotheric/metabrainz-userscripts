// ==UserScript==
// @name         MusicBrainz: Instrument Icons Everywhere
// @namespace    https://github.com/Lotheric/metabrainz-userscripts/
// @version      2026-10-07.1444
// @description  Shows instrument icons before instrument links on MusicBrainz pages, matched by UUID.
// @downloadURL  https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_Instrument_Icons_Everywhere.user.js
// @updateURL    https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_Instrument_Icons_Everywhere.user.js
// @author       Lotheric
// @tag          ai-created
// @icon         https://community.metabrainz.org/user_avatar/community.metabrainz.org/lotheric/288/88429_2.png
// @match        https://musicbrainz.org/*
// @match        https://beta.musicbrainz.org/*
// @grant        GM_xmlhttpRequest
// @connect      musicbrainz.org
// @connect      beta.musicbrainz.org
// @connect      raw.githubusercontent.com
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  // ─── Constants ────────────────────────────────────────────────────────────

  const DB_NAME = 'MusicBrainzInstrumentIcons';
  const DB_VERSION = 1;
  const STORE_MAP = 'instrumentMap';   // uuid → { folderName, cachedAt }
  const STORE_ICON = 'icons';           // folderName → { dataUrl, cachedAt }

  // Cache lifetime: 30 days for instrument name lookups, 90 days for images
  const MAP_TTL = 30 * 24 * 60 * 60 * 1000;
  const ICON_TTL = 90 * 24 * 60 * 60 * 1000;

  const RAW_BASE = 'https://raw.githubusercontent.com/metabrainz/irombook-instrument-images/master';
  const MB_API = 'https://musicbrainz.org/ws/2/instrument';

  // ─── In-memory caches ─────────────────────────────────────────────────────

  /** @type {Map<string, string>}  uuid → folderName  */
  const uuidToFolder = new Map();

  /** @type {Map<string, string>}  folderName → dataUrl (or 'NONE' sentinel) */
  const iconDataCache = new Map();

  /** @type {Set<string>}  uuids currently being fetched from MB API */
  const pendingUuidFetches = new Set();

  /** @type {Set<string>}  folderNames currently being fetched from GitHub */
  const pendingIconFetches = new Set();

  // ─── IndexedDB helpers ────────────────────────────────────────────────────

  let _dbPromise = null;

  function getDB() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_MAP)) db.createObjectStore(STORE_MAP);
        if (!db.objectStoreNames.contains(STORE_ICON)) db.createObjectStore(STORE_ICON);
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
    return _dbPromise;
  }

  function dbGet(storeName, key) {
    return getDB().then(db => new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const req = tx.objectStore(storeName).get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    })).catch(() => null);
  }

  function dbPut(storeName, key, value) {
    return getDB().then(db => new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const req = tx.objectStore(storeName).put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch (e) { resolve(); }
    })).catch(() => { });
  }

  // ─── Folder-name normalisation ────────────────────────────────────────────

  /**
   * Convert a MusicBrainz instrument name to the irombook folder name.
   * Strategy: lowercase, replace spaces/hyphens with underscores, strip
   * accents where possible, strip non-word chars.
   *
   * @param {string} name  Instrument name from the MB API
   * @param {string} [disambiguation]
   * @returns {string}
   */
  function nameToFolder(name, disambiguation) {
    const normalize = (s) => s
      .toLowerCase()
      .replace(/[-\s]+/g, '_')
      .replace(/[^\w\u00C0-\u024F]/g, '')   // keep basic Latin Extended
      .replace(/__+/g, '_')
      .replace(/^_|_$/g, '');

    // Known divergences between MB names and irombook folder names
    const OVERRIDES = {
      'contrabass': 'contrabass',
      'double bass': 'contrabass',
      'bass drum': 'bass_drum',
      'drum kit': 'drumset',
      'drum set': 'drumset',
      'english horn': 'cor_anglais',
      'cor anglais': 'cor_anglais',
      'harpsichord': 'cembalo',
      'clavecin': 'cembalo',
      'appalachian dulcimer': 'dulcimer_Appalachian',
      'mountain dulcimer': 'dulcimer_Appalachian',
      'hammered dulcimer': 'dulcimer_hammered',
      'stroh violin': 'Stroh_violin',
    };

    const lowerName = name.toLowerCase().trim();
    if (OVERRIDES[lowerName]) return OVERRIDES[lowerName];

    return normalize(name);
  }

  // ─── Fetch instrument name from MB API ────────────────────────────────────

  /**
   * Fetch instrument data from the MB API, store UUID→folderName in IDB,
   * then call `onReady(folderName)`.
   *
   * @param {string} uuid
   * @param {function} onReady
   */
  function fetchInstrumentAndStore(uuid, onReady) {
    if (pendingUuidFetches.has(uuid)) return;
    pendingUuidFetches.add(uuid);

    // Use the correct host for API calls (beta mirrors the same API)
    const host = location.hostname === 'beta.musicbrainz.org'
      ? 'https://beta.musicbrainz.org/ws/2/instrument'
      : MB_API;

    GM_xmlhttpRequest({
      method: 'GET',
      url: `${host}/${uuid}?fmt=json`,
      headers: { 'Accept': 'application/json' },
      onload: (resp) => {
        pendingUuidFetches.delete(uuid);
        if (resp.status < 200 || resp.status >= 300) return;
        try {
          const data = JSON.parse(resp.responseText);
          const folder = nameToFolder(data.name || '', data.disambiguation || '');
          if (!folder) return;
          uuidToFolder.set(uuid, folder);
          dbPut(STORE_MAP, uuid, { folderName: folder, cachedAt: Date.now() });
          onReady(folder);
        } catch (e) { /* ignore parse errors */ }
      },
      onerror: () => { pendingUuidFetches.delete(uuid); }
    });
  }

  // ─── Fetch icon from GitHub ────────────────────────────────────────────────

  /**
   * Fetch the icon.gif for `folderName` from GitHub, cache it in IDB as a
   * data URL, then call `onReady(dataUrl)`.
   *
   * @param {string} folderName
   * @param {function} onReady
   */
  function fetchIconAndStore(folderName, onReady) {
    if (pendingIconFetches.has(folderName)) return;
    pendingIconFetches.add(folderName);

    const iconUrl = `${RAW_BASE}/${encodeURIComponent(folderName)}/icon.gif`;

    GM_xmlhttpRequest({
      method: 'GET',
      url: iconUrl,
      responseType: 'blob',
      onload: (resp) => {
        pendingIconFetches.delete(folderName);
        if (resp.status === 404) {
          // No icon in this folder — cache a sentinel so we don't retry
          iconDataCache.set(folderName, 'NONE');
          dbPut(STORE_ICON, folderName, { dataUrl: 'NONE', cachedAt: Date.now() });
          return;
        }
        if (resp.status < 200 || resp.status >= 300) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const dataUrl = reader.result;
            if (typeof dataUrl === 'string') {
              iconDataCache.set(folderName, dataUrl);
              dbPut(STORE_ICON, folderName, { dataUrl, cachedAt: Date.now() });
              onReady(dataUrl);
            }
          } catch (e) { /* ignore */ }
        };
        reader.readAsDataURL(resp.response);
      },
      onerror: () => { pendingIconFetches.delete(folderName); }
    });
  }

  // ─── DOM helpers ─────────────────────────────────────────────────────────

  /**
   * Create a small icon <img> for the given instrument icon data URL.
   * @param {string} dataUrl
   * @param {string} folderName  Used as title text
   * @returns {HTMLImageElement}
   */
  function createIconImg(dataUrl, folderName) {
    const img = document.createElement('img');
    img.className = 'mb-ii-icon';
    img.src = dataUrl;
    img.alt = '';
    img.title = folderName.replace(/_/g, ' ');
    img.setAttribute('aria-hidden', 'true');
    img.style.setProperty('width', '16px', 'important');
    img.style.setProperty('height', '16px', 'important');
    img.style.setProperty('display', 'inline-block', 'important');
    img.style.setProperty('vertical-align', 'middle', 'important');
    img.style.setProperty('margin-right', '0.30em', 'important');
    img.style.setProperty('margin-left', '0.05em', 'important');
    img.style.setProperty('object-fit', 'contain', 'important');
    img.style.setProperty('border', 'none', 'important');
    return img;
  }

  /**
   * Insert an icon <img> immediately before the given link element.
   * @param {HTMLAnchorElement} link
   * @param {string} dataUrl
   * @param {string} folderName
   */
  function insertIconBeforeLink(link, dataUrl, folderName) {
    if (!link || !link.parentNode) return;
    // Guard: don't insert twice
    const prev = link.previousSibling;
    if (prev && prev.nodeType === 1 && prev.classList && prev.classList.contains('mb-ii-icon')) return;
    const img = createIconImg(dataUrl, folderName);
    try {
      link.parentNode.insertBefore(img, link);
    } catch (e) { /* swallow */ }
  }

  // ─── Core processing ─────────────────────────────────────────────────────

  const INSTRUMENT_LINK_RE = /\/instrument\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?(?:\?[^#]*)?(?:#.*)?$/i;

  /** Should we skip processing this element? */
  function shouldSkip(el) {
    if (!el || el.nodeType !== 1) return true;
    if (el.dataset && el.dataset.iiProcessed === 'true') return true;
    try {
      if (el.closest('.tabs, ul.tabs, .subtabs, .page_tabs, [role="tablist"], .tabs-wrap, nav')) return true;
    } catch (e) { /* ignore */ }
    return false;
  }

  /**
   * Process a single instrument link.  May be called immediately when the
   * data is already cached, or deferred when a fetch is needed.
   *
   * @param {HTMLAnchorElement} link
   * @param {string}            uuid
   */
  function processLink(link, uuid) {
    if (shouldSkip(link)) return;
    link.dataset.iiProcessed = 'true';

    // Step 1: resolve folder name
    function withFolder(folderName) {
      if (!folderName) return;

      // Step 2: resolve icon data URL
      function withIcon(dataUrl) {
        if (!dataUrl || dataUrl === 'NONE') return;
        insertIconBeforeLink(link, dataUrl, folderName);
      }

      const cachedIcon = iconDataCache.get(folderName);
      if (cachedIcon !== undefined) {
        withIcon(cachedIcon);
        return;
      }

      // Try IDB first
      dbGet(STORE_ICON, folderName).then(record => {
        if (record && record.dataUrl && (Date.now() - record.cachedAt < ICON_TTL)) {
          iconDataCache.set(folderName, record.dataUrl);
          withIcon(record.dataUrl);
        } else {
          fetchIconAndStore(folderName, withIcon);
        }
      });
    }

    const cachedFolder = uuidToFolder.get(uuid);
    if (cachedFolder !== undefined) {
      withFolder(cachedFolder);
      return;
    }

    // Try IDB first
    dbGet(STORE_MAP, uuid).then(record => {
      if (record && record.folderName && (Date.now() - record.cachedAt < MAP_TTL)) {
        uuidToFolder.set(uuid, record.folderName);
        withFolder(record.folderName);
      } else {
        fetchInstrumentAndStore(uuid, withFolder);
      }
    });
  }

  /** Scan document for unprocessed instrument links */
  function processPage() {
    try {
      const links = document.querySelectorAll('a[href*="/instrument/"]:not([data-ii-processed])');
      links.forEach(link => {
        if (shouldSkip(link)) return;

        // Skip links with no visible text (pure-icon wrappers, etc.)
        if (!link.textContent.trim()) return;

        const m = (link.href || '').match(INSTRUMENT_LINK_RE);
        if (!m) return;

        const uuid = m[1].toLowerCase();
        processLink(link, uuid);
      });
    } catch (e) {
      try { console.error('MB-II: processPage error', e); } catch (_) { }
    }
  }

  // ─── Init ────────────────────────────────────────────────────────────────

  function init() {
    // Inject base CSS
    const style = document.createElement('style');
    style.textContent = `
      .mb-ii-icon {
        display: inline-block !important;
        vertical-align: middle !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);

    // Initial scan
    processPage();

    // Watch for DOM changes (SPA navigation, React updates, infinite scroll, etc.)
    const observer = new MutationObserver(() => {
      if (observer._t) return;
      observer._t = setTimeout(() => {
        try { processPage(); } catch (e) { }
        clearTimeout(observer._t);
        observer._t = null;
      }, 120);
    });
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });

    // Expose manual trigger for debugging
    try { window.MBII_processPage = processPage; } catch (e) { }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
