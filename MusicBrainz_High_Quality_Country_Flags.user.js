// ==UserScript==
// @name         MusicBrainz: High Quality Country Flags
// @namespace    https://github.com/Lotheric/metabrainz-userscripts/
// @version      2026-07-30.1031
// @description  Replaces MusicBrainz country flags with Wikimedia SVGs.
// @downloadURL  https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_High_Quality_Country_Flags.user.js
// @updateURL    https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_High_Quality_Country_Flags.user.js
// @author       Lotheric
// @match        https://musicbrainz.org/*
// @match        https://beta.musicbrainz.org/*
// @grant        GM_xmlhttpRequest
// @connect      commons.wikimedia.org
// @connect      upload.wikimedia.org
// ==/UserScript==

(function() {
  'use strict';

  /**
   * @typedef {Object} Country
   * @property {string} name
   * @property {string} uuid
   * @property {string} code
   * @property {string} url
   */

  /** Full country list (shortened comment here for brevity in the header) */
  const COUNTRIES = [
    { name: 'Afghanistan', uuid: 'aa95182f-df0a-3ad6-8bfb-4b63482cd276', code: 'AF', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg' },
    { name: 'Åland Islands', uuid: '3519cc6e-ae19-3d2c-9b9e-575a860ef8e1', code: 'AX', url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Flag_of_%C3%85land.svg' },
    { name: 'Albania', uuid: '1c69b790-b46b-3e92-b6b4-93b4364badbc', code: 'AL', url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Flag_of_Albania.svg' },
    { name: 'Algeria', uuid: '28242750-534a-326b-8ed6-1b03dfb88cd0', code: 'DZ', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Algeria.svg' },
    { name: 'American Samoa', uuid: 'e228a3c1-53c0-3ec9-842b-ec1b2138e387', code: 'AS', url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Flag_of_American_Samoa.svg' },
    { name: 'Andorra', uuid: 'e01da61e-99a8-3c76-a27d-774c3f4982f0', code: 'AD', url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Andorra.svg' },
    { name: 'Angola', uuid: '2afd5d6a-5fee-3836-8783-44d0ec9ac115', code: 'AO', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Angola.svg' },
    { name: 'Anguilla', uuid: 'eed9e8bb-b48f-30af-95f5-f178762ee515', code: 'AI', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Anguilla.svg' },
    { name: 'Antarctica', uuid: 'aca6cbc7-4f3b-3020-8de3-c21718fe24f1', code: 'AQ', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/True_South_Antarctic_Flag.svg' },
    { name: 'Antigua and Barbuda', uuid: '2a8cc14f-8d47-389b-b54d-e94312b23d27', code: 'AG', url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Antigua_and_Barbuda.svg' },
    { name: 'Argentina', uuid: 'e71360c5-55ce-32d3-9bc7-cfa5f5fecf5c', code: 'AR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Argentina.svg' },
    { name: 'Armenia', uuid: '6474fa20-e0d6-3ef2-95ce-a6f73408cd5e', code: 'AM', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_Armenia.svg' },
    { name: 'Aruba', uuid: 'ae8222dd-0b5b-3962-9671-30375b625ce9', code: 'AW', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Aruba.svg' },
    { name: 'Australia', uuid: '106e0bec-b638-3b37-b731-f53d507dc00e', code: 'AU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Australia.svg' },
    { name: 'Austria', uuid: 'caac77d1-a5c8-3e6e-8e27-90b44dcc1446', code: 'AT', url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Austria.svg' },
    { name: 'Azerbaijan', uuid: 'b211ad01-2f7d-32e9-80ed-cfd6c9eb6845', code: 'AZ', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Azerbaijan.svg' },
    { name: 'Bahamas', uuid: 'f8b33963-7364-33be-8c6c-5ab2e1075ae1', code: 'BS', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Flag_of_the_Bahamas.svg' },
    { name: 'Bahrein', uuid: '65f4f7a6-d3c1-3a6b-a726-85e147d555b7', code: 'BH', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Bahrain.svg' },
    { name: 'Bangladesh', uuid: '20395c3e-610c-34fd-9995-6b6f299121f2', code: 'BD', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg' },
    { name: 'Barbados', uuid: 'e5d8d205-81d3-3cd3-8956-d5aaa0c0173f', code: 'BB', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Barbados.svg' },
    { name: 'Belarus', uuid: '660e3c48-b301-3c8c-9708-0f71d5d094d6', code: 'BY', url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Flag_of_Belarus.svg' },
    { name: 'Belgium', uuid: '5b8a5ee5-0bb3-34cf-9a75-c27c44e341fc', code: 'BE', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Belgium.svg' },
    { name: 'Belize', uuid: '6bf45af6-f1bf-357c-91b5-9593a9c32cb0', code: 'BZ', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Flag_of_Belize.svg' },
    { name: 'Benin', uuid: '1f72ee74-2d3f-3a40-846b-e3d780b73dd2', code: 'BJ', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_Benin.svg' },
    { name: 'Bermuda', uuid: 'df3bbd94-6a4c-3fc3-bb6e-cd701623db8a', code: 'BM', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Bermuda.svg' },

    { name: 'Brazil', uuid: 'b253ba64-d6e0-3165-afde-b03a7d420cc5', code: 'BR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Brazil.svg' },
    { name: 'Canada', uuid: '71bbafaa-e825-3e15-8ca9-017dcad1748b', code: 'CA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canada.svg' },
    { name: 'Denmark', uuid: '01918349-f00e-3fa1-aa05-0951a84f3df9', code: 'DK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Denmark.svg' },
    { name: 'Finland', uuid: '6a264f94-6ff1-30b1-9a81-41f7bfabd616', code: 'FI', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg' },
    { name: 'France', uuid: '08310658-51eb-3801-80de-5a0739207115', code: 'FR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_France.svg' },
    { name: 'Germany', uuid: '85752fda-13c4-31a3-bee5-0e5cb1f51dad', code: 'DE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Germany.svg' },
    { name: 'Guam', uuid: '43dd540a-78cd-319f-bab9-214b5430f3f2', code: 'GU', url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Flag_of_Guam.svg' },
    { name: 'Italy', uuid: '00457635-f0cd-321b-bfad-80eb922c2a01', code: 'IT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Italy.svg' },
    { name: 'Japan', uuid: '2db42837-c832-3c27-b4a3-08198f75693c', code: 'JP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Japan.svg' },
    { name: 'Mexico', uuid: '37bbd6c6-f7af-3444-8848-bc6b7ad692dc', code: 'MX', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Mexico.svg' },
    { name: 'Netherlands', uuid: 'ef1b7ece-0158-3da0-be3e-d91d84b54e3d', code: 'NL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Netherlands.svg' },
    { name: 'Norway', uuid: '1b64cb1a-2830-36ba-8868-b7fb3f8cd021', code: 'NO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Norway.svg' },
    { name: 'Poland', uuid: '1f681d4a-3882-3db3-8f0a-3cc40f59e0bc', code: 'PL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Poland.svg' },
    { name: 'Russia', uuid: 'f3dbbcf9-42b9-3870-ae6a-b68e0d47d483', code: 'RU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Russia.svg' },
    { name: 'South Africa', uuid: '98e3b2e5-7977-3315-bbff-4b3f885df43f', code: 'ZA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Africa.svg' },
    { name: 'Spain', uuid: 'a81ec452-f47f-38a4-a9b8-3e449a5b3c37', code: 'ES', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Spain.svg' },
    { name: 'Sweden', uuid: '23d10872-f5ae-3f47-af3b-8311eb8ea338', code: 'SE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sweden.svg' },
    { name: 'Switzerland', uuid: '1333ff06-8e3d-3c8e-9f3a-13a2a38b41df', code: 'CH', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Switzerland_%28Pantone%29.svg' },
    { name: 'United Kingdom', uuid: '8a754a16-0027-3a29-b6d7-2b40ea0481ed', code: 'GB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_Kingdom.svg' },
    { name: 'United States', uuid: '489ce91b-6658-3307-9877-795b68554c98', code: 'US', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_States.svg' },
    { name: 'United States Minor Outlying Islands', uuid: '4e8596fe-cbee-34ce-8b35-1f3c9bc094d6', code: 'UM', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Flag_of_the_United_States_%28DDD-F-416E_specifications%29.svg' },
    { name: 'U.S. Virgin Islands', uuid: 'f33958ac-4198-3ce8-a751-1c44d9b4063a', code: 'VI', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Flag_of_the_United_States_Virgin_Islands.svg' },
    { name: 'Worldwide', uuid: '525d4e18-3d00-31b9-a58b-a146a916de8f', code: 'XW', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_the_United_Nations.svg' }
  ];

  const flagDataMap = new Map();

  // Narrow skip: only tab-related containers that caused the extra icon previously
  function shouldSkipElement(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.dataset && (el.dataset.hqSkip === 'true' || el.dataset.hqProcessed === 'true')) return true;
    try {
      const skipSelectors = [
        '.tabs',
        'ul.tabs',
        '.subtabs',
        '.page_tabs',
        '[role="tablist"]',
        '.tabs-wrap'
      ];
      for (const sel of skipSelectors) {
        if (el.closest && el.closest(sel)) {
          try { el.dataset.hqSkip = 'true'; } catch (e) {}
          return true;
        }
      }
    } catch (e) {
      // swallow
    }
    return false;
  }

  // Create and style inline <img> for flags
  function createFlagImgElement(code, url) {
    const img = document.createElement('img');
    img.className = 'mb-hq-flag-img';
    img.setAttribute('data-hq-flag', code);
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.style.setProperty('width', '16px', 'important');
    img.style.setProperty('height', '11px', 'important');
    img.style.setProperty('display', 'inline-block', 'important');
    img.style.setProperty('vertical-align', 'baseline', 'important');
    img.style.setProperty('margin-left', '0.05em', 'important');
    img.style.setProperty('margin-right', '0.40em', 'important');
    img.style.setProperty('object-fit', 'cover', 'important');
    img.style.setProperty('box-shadow', '0 0 0 1px #ccc', 'important');
    img.style.setProperty('border', 'none', 'important');
    img.src = url;
    return img;
  }

  function styleExistingImg(img, code, url) {
    img.classList.add('mb-hq-flag-img');
    img.setAttribute('data-hq-flag', code);
    try { img.alt = ''; } catch (e) {}
    try { img.setAttribute('aria-hidden', 'true'); } catch (e) {}
    img.style.setProperty('width', '16px', 'important');
    img.style.setProperty('height', '11px', 'important');
    img.style.setProperty('display', 'inline-block', 'important');
    img.style.setProperty('vertical-align', 'baseline', 'important');
    img.style.setProperty('margin-right', '0.40em', 'important');
    img.style.setProperty('object-fit', 'cover', 'important');
    img.style.setProperty('box-shadow', '0 0 0 1px #ccc', 'important');
    img.style.setProperty('border', 'none', 'important');
    img.src = url;
  }

  // Remove leftover space reserved by background flags (only when it looks like flag-space)
  function removeLegacySpacingIfNeeded(el) {
    try {
      const cs = window.getComputedStyle(el);
      const padLeftRaw = cs.paddingInlineStart || cs.paddingLeft || '0px';
      const padLeft = parseFloat(padLeftRaw) || 0;
      if (padLeft >= 10) {
        el.style.setProperty('padding-left', '0px', 'important');
        try { el.style.setProperty('padding-inline-start', '0px', 'important'); } catch (e) {}
      }
      el.style.setProperty('background-image', 'none', 'important');
      el.style.setProperty('background-position', '0 50%', 'important');
      el.style.setProperty('background-size', 'auto', 'important');
      el.style.setProperty('background-repeat', 'no-repeat', 'important');
    } catch (e) { /* silent */ }
  }

  // Clear stale processed markers left by partial/old runs
  function clearStaleProcessedMarkers() {
    try {
      document.querySelectorAll('.flag[data-hq-processed]').forEach(el => {
        // if wrapper doesn't contain a recognized processed image, clear markers so we can reprocess
        const hasOurImg = !!el.querySelector('img.mb-hq-flag-img');
        const hasAnyFlagImg = !!Array.from(el.querySelectorAll('img')).find(i => (i.src||'').includes('/flags/'));
        if (!hasOurImg && !hasAnyFlagImg) {
          el.removeAttribute('data-hq-processed');
          el.removeAttribute('data-hq-code');
          el.removeAttribute('data-hq-skip');
        }
      });

      // Also clear any standalone img markers that were incorrectly set without our class
      document.querySelectorAll('img[data-hq-processed]:not(.mb-hq-flag-img)').forEach(img => {
        // if image doesn't have our class, remove the marker so it can be processed
        img.removeAttribute('data-hq-processed');
        img.removeAttribute('data-hq-code');
        img.removeAttribute('data-hq-skip');
      });
    } catch (e) {
      // swallow
    }
  }

  // Ensure map populated
  function ensureFlagMap() {
    if (flagDataMap.size === 0) {
      COUNTRIES.forEach(c => flagDataMap.set(c.code, c.url));
    }
  }

  // --- Core DOM processing ---
  function processFlags() {
    try {
      ensureFlagMap();
      // Process .flag wrappers
      document.querySelectorAll('.flag:not([data-hq-processed]):not([data-hq-skip])').forEach(el => {
        if (shouldSkipElement(el)) return;
        let code = null;
        el.classList.forEach(cls => {
          const m = cls.match(/^flag-([a-z]{2}(?:-[a-z0-9]+)?)$/i);
          if (m) code = m[1].toUpperCase();
        });
        if (!code || !flagDataMap.has(code)) return;

        // Attempt to apply; only mark processed after success
        applyHQToElement(el, code, /*markOnSuccess=*/true);
      });

      // Process standalone <img src="/flags/...">
      document.querySelectorAll('img[src*="/flags/"]:not([data-hq-processed]):not([data-hq-skip])').forEach(img => {
        if (shouldSkipElement(img)) return;
        const match = (img.src || '').match(/\/flags\/([a-z]{2}(?:-[a-z0-9]+)?)\./i);
        if (!match) return;
        const code = match[1].toUpperCase();
        if (!flagDataMap.has(code)) return;

        applyHQToElement(img, code, /*markOnSuccess=*/true);
      });
    } catch (e) {
      // swallow to avoid breaking page scripts
      try { console.error('MBHQ: processFlags failed', e); } catch (e2) {}
    }
  }

  // applyHQToElement(el, code, markOnSuccess)
  // If markOnSuccess is true, sets data-hq-processed only after an image was inserted/updated
  function applyHQToElement(el, code, markOnSuccess) {
    const url = flagDataMap.get(code);
    if (!url) return;
    if (shouldSkipElement(el)) return;

    // Helper to mark processed (on the wrapper or image)
    function markProcessed(node) {
      try {
        if (node && node.nodeType === 1) {
          node.dataset.hqProcessed = 'true';
          node.dataset.hqCode = code;
        }
      } catch (e) {}
    }

    // If element itself is an <img>, update in-place
    if (el.tagName === 'IMG') {
      try {
        styleExistingImg(el, code, url);
        markProcessed(el);
        if (el.parentElement) removeLegacySpacingIfNeeded(el.parentElement);
        return;
      } catch (e) {
        return;
      }
    }

    // Try to find an inner image we can reuse
    let existingFlagImg = null;
    try {
      existingFlagImg = Array.from(el.querySelectorAll('img')).find(img => {
        if (img.classList.contains('mb-hq-flag-img')) return true;
        try { if ((img.src || '').includes('/flags/')) return true; } catch (e) {}
        if (img.classList.contains('flag')) return true;
        return false;
      });
    } catch (e) { existingFlagImg = null; }

    if (existingFlagImg) {
      if (shouldSkipElement(existingFlagImg)) return;
      try {
        styleExistingImg(existingFlagImg, code, url);
        markProcessed(existingFlagImg);
        // mark wrapper too for quick lookup
        markProcessed(el);
        removeLegacySpacingIfNeeded(el);
      } catch (e) {}
      return;
    }

    // Check for background-image reserved area
    let computedBg = null;
    try { computedBg = window.getComputedStyle(el).backgroundImage; } catch (e) { computedBg = null; }
    const hasBg = computedBg && computedBg !== 'none' && computedBg !== 'initial';

    if (hasBg) {
      // remove legacy spacing/background before inserting to avoid gap
      removeLegacySpacingIfNeeded(el);
      const img = createFlagImgElement(code, url);
      try {
        if (el.firstChild) el.insertBefore(img, el.firstChild);
        else el.appendChild(img);
        // mark only after successful insertion
        markProcessed(img);
        markProcessed(el);
      } catch (e) {
        // fallback: insert adjacent
        try {
          el.parentNode && el.parentNode.insertBefore(img, el);
          markProcessed(img);
          markProcessed(el);
        } catch (e2) {
          // failed to insert - do not mark processed
        }
      }
      return;
    }

    // Default: insert inline <img> at start and mark after success
    removeLegacySpacingIfNeeded(el);
    const img = createFlagImgElement(code, url);
    try {
      if (el.firstChild) el.insertBefore(img, el.firstChild);
      else el.appendChild(img);
      markProcessed(img);
      markProcessed(el);
    } catch (e) {
      try { el.parentNode && el.parentNode.insertBefore(img, el); markProcessed(img); markProcessed(el); } catch (e2) { /* fail silently */ }
    }
  }

  // Update all processed flags when cached Base64 becomes available
  function updateAllProcessedFlags() {
    ensureFlagMap();
    document.querySelectorAll('[data-hq-processed="true"]').forEach(el => {
      const code = el.dataset.hqCode;
      if (!code) return;
      const url = flagDataMap.get(code);
      if (!url) return;
      if (shouldSkipElement(el)) return;

      if (el.tagName === 'IMG') {
        try { el.src = url; } catch (e) {}
        if (el.parentElement) removeLegacySpacingIfNeeded(el.parentElement);
        return;
      }

      let img = null;
      try { img = el.querySelector('img.mb-hq-flag-img[data-hq-flag="' + code + '"]') || el.querySelector('img.mb-hq-flag-img') || el.querySelector('img'); } catch (e) { img = null; }
      if (img) {
        if (shouldSkipElement(img)) return;
        try { styleExistingImg(img, code, url); img.dataset.hqProcessed = 'true'; } catch (e) {}
        removeLegacySpacingIfNeeded(el);
      } else {
        applyHQToElement(el, code, /*markOnSuccess=*/true);
      }
    });
  }

  // --- Caching logic (IndexedDB) ---
  let dbPromise = null;
  function getDB() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open('MusicBrainzCountryFlags', 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('flags')) db.createObjectStore('flags');
        };
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
      });
    }
    return dbPromise;
  }

  function getCachedFlagDB(code) {
    return getDB().then(db => {
      return new Promise((resolve) => {
        try {
          const transaction = db.transaction('flags', 'readonly');
          const store = transaction.objectStore('flags');
          const request = store.get(code);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => resolve(null);
        } catch (e) { resolve(null); }
      });
    }).catch(() => null);
  }

  function setCachedFlagDB(code, dataUrl) {
    return getDB().then(db => {
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction('flags', 'readwrite');
          const store = transaction.objectStore('flags');
          const request = store.put(dataUrl, code);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        } catch (e) { resolve(); }
      });
    }).catch(() => {});
  }

  function clearOldLocalStorageCache() {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mb_hq_flag_cache_')) localStorage.removeItem(key);
      }
    } catch (e) {}
  }

  function fetchAndCache(country, callback) {
    const fetchingKey = 'mb_hq_flag_fetching_' + country.code;
    try {
      if (sessionStorage.getItem(fetchingKey)) return;
      sessionStorage.setItem(fetchingKey, '1');
    } catch (e) {}

    GM_xmlhttpRequest({
      method: 'GET',
      url: country.url,
      responseType: 'blob',
      onload: function(response) {
        if (response.status >= 200 && response.status < 300) {
          const reader = new FileReader();
          reader.onloadend = () => {
            try {
              if (typeof reader.result === 'string') {
                setCachedFlagDB(country.code, reader.result);
                if (callback) callback(reader.result);
              }
            } catch (e) {} finally {
              try { sessionStorage.removeItem(fetchingKey); } catch (e) {}
            }
          };
          reader.readAsDataURL(response.response);
        } else {
          try { sessionStorage.removeItem(fetchingKey); } catch (e) {}
        }
      },
      onerror: function() { try { sessionStorage.removeItem(fetchingKey); } catch (e) {} }
    });
  }

  // --- Init + observer (throttle) ---
  function init() {
    clearOldLocalStorageCache();
    clearStaleProcessedMarkers();
    ensureFlagMap();

    // populate map and try to use cached Base64
    COUNTRIES.forEach(country => {
      flagDataMap.set(country.code, country.url);
      getCachedFlagDB(country.code).then(cached => {
        if (cached) {
          flagDataMap.set(country.code, cached);
          updateAllProcessedFlags();
        } else {
          fetchAndCache(country, (newData) => {
            flagDataMap.set(country.code, newData);
            updateAllProcessedFlags();
          });
        }
      });
    });

    // initial processing
    processFlags();

    // Observe DOM with small throttle
    const observer = new MutationObserver(() => {
      if (observer._scheduled) return;
      observer._scheduled = setTimeout(() => {
        try { processFlags(); } catch (e) {}
        clearTimeout(observer._scheduled);
        observer._scheduled = null;
      }, 120);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // expose manual trigger
    try { window.MBHQ_processFlags = processFlags; } catch (e) {}
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
