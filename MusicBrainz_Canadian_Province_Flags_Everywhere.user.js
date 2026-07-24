// ==UserScript==
// @name         MusicBrainz: Canadian Province Flags Everywhere
// @namespace    https://musicbrainz.org/
// @version      2026-07-23.2201
// @description  Shows flags of Canadian provinces and territories on MusicBrainz.
// @downloadURL  https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_More_Flags_Everywhere.user.js
// @updateURL    https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_More_Flags_Everywhere.user.js
// @author       Lotheric
// @tag          ai-created
// @icon         https://community.metabrainz.org/user_avatar/community.metabrainz.org/lotheric/288/88429_2.png
// @match        https://musicbrainz.org/*
// @match        https://beta.musicbrainz.org/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  /**
   * @typedef {Object} Province
   * @property {string} name - The human-readable name of the province.
   * @property {string} uuid - The MusicBrainz Area UUID for precise matching.
   * @property {string} code - The short code (e.g., QC, BC).
   * @property {string} url - The URL to the official Wikimedia flag SVG.
   */

  /** @type {Province[]} */
  const PROVINCES = [
    { name: 'Alberta', uuid: '11e1b699-4e38-49b0-bb24-5092e0f8f4ad', code: 'AB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Alberta.svg' },
    { name: 'British Columbia', uuid: 'e10dada7-934d-4a38-a20f-44cc6fa4672d', code: 'BC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_British_Columbia.svg' },
    { name: 'Manitoba', uuid: '8af30521-c317-48f2-b18d-536e248521e1', code: 'MB', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Manitoba.svg' },
    { name: 'New Brunswick', uuid: '0f05e521-4a8a-40ce-b6a1-80e0f3d5ea6d', code: 'NB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_New_Brunswick.svg' },
    { name: 'Newfoundland and Labrador', uuid: '645a2090-c498-48ce-a58e-11379aaac827', code: 'NL', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Newfoundland_and_Labrador.svg' },
    { name: 'Nova Scotia', uuid: '4a91ccc7-ea89-4dc6-98f4-c8044123a032', code: 'NS', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Nova_Scotia.svg' },
    { name: 'Ontario', uuid: '2747553f-b44d-44c4-a7c3-b67412b6f10b', code: 'ON', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Ontario.svg' },
    { name: 'Prince Edward Island', uuid: 'cffdb245-ee87-4b2f-8375-fce5d9596455', code: 'PE', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Flag_of_Prince_Edward_Island.svg' },
    { name: 'Québec', uuid: 'a510b9b1-404d-4e23-8db8-0f6585909ed8', code: 'QC', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg' },
    { name: 'Saskatchewan', uuid: '1451d358-6dff-413d-884e-1db2d4fd03aa', code: 'SK', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_Saskatchewan.svg' },
    { name: 'Northwest Territories', uuid: '77acc8b0-2a12-4831-b142-d5ea39702424', code: 'NT', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_the_Northwest_Territories.svg' },
    { name: 'Nunavut', uuid: '79c3204c-1cd8-4906-a2d7-43aeb997927c', code: 'NU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Flag_of_Nunavut.svg' },
    { name: 'Yukon', uuid: '97aef002-a327-4237-a2d3-25244d425d17', code: 'YT', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Yukon.svg' }
  ];

  const css = `
    img.flag-CA-prov {
      width: 16px !important;
      height: 11px !important;
      object-fit: cover !important;
      display: inline-block !important;
      border: 1px solid #ccc !important;
      margin: 0 !important;
    }

    img.flag, .area-icon img {
      vertical-align: middle !important;
      position: relative !important;
      top: -0.1em !important;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // --- Caching Logic ---

  /**
   * @param {string} code
   * @returns {string | null}
   */
  function getCachedFlag(code) {
    try {
      return localStorage.getItem('mb_flag_cache_' + code);
    } catch (e) {
      return null;
    }
  }

  /**
   * @param {Province} match
   */
  function fetchAndCache(match) {
    const fetchingKey = 'mb_flag_fetching_' + match.code;
    const cacheKey = 'mb_flag_cache_' + match.code;

    try {
      if (sessionStorage.getItem(fetchingKey)) return;
      sessionStorage.setItem(fetchingKey, '1');
    } catch (e) {}

    fetch(match.url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
      })
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            // TypeScript check: Ensure reader.result is a string before storing
            if (typeof reader.result === 'string') {
              localStorage.setItem(cacheKey, reader.result);
            }
          } catch (e) {
            console.warn('Could not save flag to localStorage', e);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => console.error(`Error fetching flag for ${match.name}:`, err));
  }

  // --- DOM Manipulation ---

  /**
   * @param {Element} el
   */
  function nukeIconsAndSpaces(el) {
    el.querySelectorAll('.area-icon, .type-icon, .arealink').forEach(n => n.remove());

    let prev = el.previousSibling;
    while (prev) {
      let toKill = prev;
      prev = prev.previousSibling;

      if (toKill.nodeType === Node.TEXT_NODE && /^[\s\u00A0]*$/.test(toKill.nodeValue || '')) {
        // Safe removal for generic nodes to satisfy strict TS DOM rules
        if (toKill.parentNode) toKill.parentNode.removeChild(toKill);
      } else if (toKill.nodeType === Node.ELEMENT_NODE) {
        const elNode = /** @type {Element} */ (toKill);
        if (elNode.classList.contains('area-icon') ||
            elNode.classList.contains('type-icon') ||
            elNode.classList.contains('arealink') ||
            (elNode.tagName === 'SPAN' && (!elNode.textContent || !elNode.textContent.trim()))) {
          elNode.remove();
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }

  /**
   * @param {Province} match
   * @returns {HTMLSpanElement}
   */
  function createFlagIcon(match) {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'area-icon';

    const img = document.createElement('img');
    img.className = 'flag flag-CA-prov';

    const cachedSrc = getCachedFlag(match.code);
    if (cachedSrc) {
      img.src = cachedSrc;
    } else {
      img.src = match.url;
      fetchAndCache(match);
    }

    img.alt = match.name;
    img.title = match.name;

    iconSpan.appendChild(img);
    return iconSpan;
  }

  function insertFlags() {
    if (window.location.pathname.includes('/area/')) {
      const pageMatch = PROVINCES.find(p => window.location.pathname.includes(p.uuid));

      if (pageMatch) {
        document.querySelectorAll('h1').forEach(/** @param {Element} headingEl */ (headingEl) => {
          const heading = /** @type {HTMLElement} */ (headingEl);
          if (heading.dataset.flagProcessed || heading.querySelector(`a[href*="/area/"]`)) return;

          heading.dataset.flagProcessed = '1';

          let bdi = heading.querySelector('bdi');
          let textNode = Array.from(heading.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim() !== '');

          /** @type {Element | Node} */
          let target = bdi || textNode || heading;

          if (target.parentElement) nukeIconsAndSpaces(target.parentElement);

          const iconSpan = createFlagIcon(pageMatch);

          if (target === heading) {
             heading.prepend(document.createTextNode(' '));
             heading.prepend(iconSpan);
          } else if (target.parentNode) {
             target.parentNode.insertBefore(iconSpan, target);
             target.parentNode.insertBefore(document.createTextNode(' '), target);
          }
        });
      }
    }

    document.querySelectorAll('a[href*="/area/"]').forEach(/** @param {Element} linkEl */ (linkEl) => {
      const link = /** @type {HTMLAnchorElement} */ (linkEl);
      if (link.dataset.flagProcessed) return;

      if (link.closest('.tabs')) {
        link.dataset.flagProcessed = '1';
        return;
      }

      const match = PROVINCES.find(p => {
        const regex = new RegExp(`/area/${p.uuid}(/?|\\?.*|#.*)$`, 'i');
        return regex.test(link.href);
      });

      if (match) {
        link.dataset.flagProcessed = '1';

        /** @type {Element} */
        let wrapper = (link.parentElement && link.parentElement.tagName === 'BDI') ? link.parentElement : link;

        nukeIconsAndSpaces(wrapper);
        const iconSpan = createFlagIcon(match);

        if (wrapper.parentNode) {
            wrapper.parentNode.insertBefore(iconSpan, wrapper);
            wrapper.parentNode.insertBefore(document.createTextNode(' '), wrapper);
        }
      }
    });
  }

  function init() {
    insertFlags();
    new MutationObserver(() => insertFlags()).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
