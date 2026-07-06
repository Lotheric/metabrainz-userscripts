// ==UserScript==
// @name         MusicBrainz: Canadian Province Flags Everywhere
// @namespace    https://musicbrainz.org/
// @version      2026-07-06.1351
// @description  Shows flags of Canadian provinces and territories on MusicBrainz.
// @downloadURL  https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_Canadian_Province_Flags_Everywhere.user.js
// @updateURL    https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_Canadian_Province_Flags_Everywhere.user.js
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
   * @property {RegExp} regex - The exact-match regex to identify the province name.
   * @property {string} code - The short code (e.g., QC, BC).
   * @property {string} url - The URL to the official Wikimedia flag SVG.
   * @property {string} [uuid] - Optional MusicBrainz Area UUID to strictly prevent false positives on cities.
   */

  /** @type {Province[]} */
  const PROVINCES = [
    { name: 'Alberta', regex: /^Alberta$/i, code: 'AB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Alberta.svg' },
    { name: 'British Columbia', regex: /^(British Columbia|Colombie-Britannique)$/i, code: 'BC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_British_Columbia.svg' },
    { name: 'Manitoba', regex: /^Manitoba$/i, code: 'MB', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Manitoba.svg' },
    { name: 'New Brunswick', regex: /^(New Brunswick|Nouveau-Brunswick)$/i, code: 'NB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_New_Brunswick.svg' },
    // Strictly limited to official provincial name to avoid triggering on 'Labrador'
    { name: 'Newfoundland and Labrador', regex: /^(Newfoundland and Labrador|Terre-Neuve-et-Labrador)$/i, code: 'NL', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Newfoundland_and_Labrador.svg' },
    { name: 'Nova Scotia', regex: /^(Nova Scotia|Nouvelle-Écosse)$/i, code: 'NS', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Nova_Scotia.svg' },
    { name: 'Ontario', regex: /^Ontario$/i, code: 'ON', uuid: '2747553f-b44d-44c4-a7c3-b67412b6f10b', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Ontario.svg' },
    { name: 'Prince Edward Island', regex: /^(Prince Edward Island|Île-du-Prince-Édouard|PEI)$/i, code: 'PE', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Flag_of_Prince_Edward_Island.svg' },
    { name: 'Quebec', regex: /^Qu[eé]bec$/i, code: 'QC', uuid: 'a510b9b1-404d-4e23-8db8-0f6585909ed8', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg' },
    { name: 'Saskatchewan', regex: /^Saskatchewan$/i, code: 'SK', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_Saskatchewan.svg' },
    { name: 'Northwest Territories', regex: /^(Northwest Territories|Territoires du Nord-Ouest)$/i, code: 'NT', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_the_Northwest_Territories.svg' },
    { name: 'Nunavut', regex: /^Nunavut$/i, code: 'NU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Flag_of_Nunavut.svg' },
    { name: 'Yukon', regex: /^Yukon$/i, code: 'YT', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Yukon.svg' }
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

  function getCleanText(el) {
    let text = el.textContent || '';
    text = text.replace(/[^\p{L}\p{N}\s\-()',.]/gu, ''); 
    text = text.replace(/\s*\((province|territory|territoire)\)/i, '');
    return text.trim();
  }

  function nukeIconsAndSpaces(el) {
    el.querySelectorAll('.area-icon, .type-icon, .arealink').forEach(n => n.remove());

    let prev = el.previousSibling;
    while (prev) {
      let toKill = prev;
      prev = prev.previousSibling;
      
      if (toKill.nodeType === Node.TEXT_NODE && /^[\s\u00A0]*$/.test(toKill.nodeValue || '')) {
        toKill.remove();
      } else if (toKill.nodeType === Node.ELEMENT_NODE && 
                (/** @type {Element} */ (toKill).classList.contains('area-icon') || 
                 /** @type {Element} */ (toKill).classList.contains('type-icon') || 
                 /** @type {Element} */ (toKill).classList.contains('arealink') ||
                 (/** @type {Element} */ (toKill).tagName === 'SPAN' && !toKill.textContent.trim()))) {
        toKill.remove();
      } else {
        break; 
      }
    }
  }

  function createFlagIcon(match) {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'area-icon';
    
    const img = document.createElement('img');
    img.className = 'flag flag-CA-prov';
    img.src = match.url;
    img.alt = match.name;
    img.title = match.name;
    
    iconSpan.appendChild(img);
    return iconSpan;
  }

  function insertFlags() {
    if (window.location.pathname.includes('/area/')) {
      document.querySelectorAll('h1, h2').forEach(/** @param {HTMLElement} heading */ heading => {
        if (heading.dataset.flagProcessed || heading.querySelector(`a[href*="/area/"]`)) return; 
        
        const match = PROVINCES.find(p => {
            if (!p.regex.test(getCleanText(heading))) return false;
            if (p.uuid) return window.location.pathname.includes(p.uuid);
            return true;
        });
        
        if (match) {
          heading.dataset.flagProcessed = '1';
          
          let bdi = heading.querySelector('bdi');
          let target = bdi || Array.from(heading.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim() !== '') || heading;
          
          // Nuke before prepending
          if (target.parentElement) nukeIconsAndSpaces(target.parentElement);
          
          const iconSpan = createFlagIcon(match);
          
          if (target === heading) {
             heading.prepend(document.createTextNode(' '));
             heading.prepend(iconSpan);
          } else if (target.parentNode) {
             target.parentNode.insertBefore(iconSpan, target);
             target.parentNode.insertBefore(document.createTextNode(' '), target); 
          }
        }
      });
    }

    document.querySelectorAll('a[href*="/area/"]').forEach(/** @param {HTMLAnchorElement} link */ link => {
      if (link.dataset.flagProcessed) return;
      
      const match = PROVINCES.find(p => {
          if (!p.regex.test(getCleanText(link))) return false;
          if (p.uuid) return link.href.includes(p.uuid);
          return true;
      });
      
      if (match) {
        link.dataset.flagProcessed = '1';
        
        /** @type {Node} */
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
