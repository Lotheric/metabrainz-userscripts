// ==UserScript==
// @name         MusicBrainz: Canadian Province Flags Everywhere
// @namespace    https://musicbrainz.org/
// @version      2026-07-06.1226
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

  // UUIDs are used as an explicit secondary filter for provinces that share names with cities.
  const PROVINCES = [
    { name: 'Alberta', regex: /^Alberta$/i, code: 'AB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Alberta.svg' },
    { name: 'British Columbia', regex: /^(British Columbia|Colombie-Britannique)$/i, code: 'BC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_British_Columbia.svg' },
    { name: 'Manitoba', regex: /^Manitoba$/i, code: 'MB', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Manitoba.svg' },
    { name: 'New Brunswick', regex: /^(New Brunswick|Nouveau-Brunswick)$/i, code: 'NB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_New_Brunswick.svg' },
    { name: 'Newfoundland and Labrador', regex: /^(Newfoundland and Labrador|Terre-Neuve-et-Labrador|Newfoundland|Labrador)$/i, code: 'NL', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Newfoundland_and_Labrador.svg' },
    { name: 'Nova Scotia', regex: /^(Nova Scotia|Nouvelle-Écosse)$/i, code: 'NS', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Nova_Scotia.svg' },
    { name: 'Ontario', regex: /^Ontario$/i, code: 'ON', uuid: '2747553f-b44d-44c4-a7c3-b67412b6f10b', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Ontario.svg' },
    { name: 'Prince Edward Island', regex: /^(Prince Edward Island|Île-du-Prince-Édouard|PEI)$/i, code: 'PE', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Flag_of_Prince_Edward_Island.svg' },
    { name: 'Quebec', regex: /^Qu[eé]bec$/i, code: 'QC', uuid: 'a510b9b1-404d-4e23-8db8-0f6585909ed8', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg' },
    { name: 'Saskatchewan', regex: /^Saskatchewan$/i, code: 'SK', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_Saskatchewan.svg' },
    { name: 'Northwest Territories', regex: /^(Northwest Territories|Territoires du Nord-Ouest)$/i, code: 'NT', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_the_Northwest_Territories.svg' },
    { name: 'Nunavut', regex: /^Nunavut$/i, code: 'NU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Flag_of_Nunavut.svg' },
    { name: 'Yukon', regex: /^Yukon$/i, code: 'YT', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Yukon.svg' }
  ];

  // 1) Minimal CSS
  const css = `
    img.flag-CA-prov {
      width: 16px !important;
      height: 11px !important;
      object-fit: cover !important;
      display: inline-block !important;
      vertical-align: middle !important;
      border: 1px solid #ccc !important; 
      margin: 0 !important;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Helper 1: Safely extract pure text
  function getCleanText(el) {
    let text = el.textContent || '';
    text = text.replace(/[^\p{L}\p{N}\s\-()',.]/gu, ''); 
    text = text.replace(/\s*\((province|territory|territoire)\)/i, '');
    return text.trim();
  }

  // Helper 2: Aggressively seek and destroy all native MB icons and ghost spaces
  function nukeIconsAndSpaces(el) {
    el.querySelectorAll('.area-icon, .type-icon, .arealink').forEach(n => n.remove());

    let prev = el.previousSibling;
    while (prev) {
      if (prev.nodeType === Node.TEXT_NODE && /^[\s\u00A0]*$/.test(prev.nodeValue)) {
        let toKill = prev;
        prev = prev.previousSibling;
        toKill.remove();
      } else if (prev.nodeType === Node.ELEMENT_NODE && 
                (prev.classList.contains('area-icon') || 
                 prev.classList.contains('type-icon') || 
                 prev.classList.contains('arealink') ||
                 (prev.tagName === 'SPAN' && !prev.textContent.trim()))) {
        let toKill = prev;
        prev = prev.previousSibling;
        toKill.remove();
      } else {
        break; 
      }
    }
  }

  // 2) Main Logic
  function insertFlags() {
    
    // --- PART A: Headers ---
    if (window.location.pathname.includes('/area/')) {
      document.querySelectorAll('h1, h2').forEach(heading => {
        if (heading.dataset.flagProcessed || heading.querySelector(`a[href*="/area/"]`)) return; 
        
        const cleanText = getCleanText(heading);
        
        const match = PROVINCES.find(p => {
            // Rule 1: Text MUST match the province name exactly
            if (!p.regex.test(cleanText)) return false;
            // Rule 2: If a UUID is specified in our dictionary, the current URL MUST contain it
            if (p.uuid) return window.location.pathname.includes(p.uuid);
            return true;
        });
        
        if (match) {
          heading.dataset.flagProcessed = '1';
          nukeIconsAndSpaces(heading);
          
          let target = heading.querySelector('bdi') || heading;
          
          if (target.firstChild && target.firstChild.nodeType === Node.TEXT_NODE) {
              target.firstChild.nodeValue = target.firstChild.nodeValue.replace(/^[\s\u00A0]+/, '');
          }

          const img = document.createElement('img');
          img.className = 'flag flag-CA-prov';
          img.src = match.url;
          img.alt = match.name;
          img.title = match.name;

          if (target.firstChild && target.firstChild.nodeType === Node.TEXT_NODE) {
              const txtNode = target.firstChild;
              txtNode.parentNode.insertBefore(document.createTextNode('\u00A0'), txtNode);
              txtNode.parentNode.insertBefore(img, txtNode.previousSibling);
          } else {
              target.prepend(document.createTextNode('\u00A0'));
              target.prepend(img);
          }
        }
      });
    }

    // --- PART B: Links ---
    document.querySelectorAll(`a[href*="/area/"]`).forEach(link => {
      if (link.dataset.flagProcessed) return;
      
      const cleanText = getCleanText(link);
      
      const match = PROVINCES.find(p => {
          // Rule 1: Text MUST match the province name exactly (ignores tabs like "Overview")
          if (!p.regex.test(cleanText)) return false;
          // Rule 2: If a UUID is specified, the link's URL MUST contain it (ignores cities like Québec City)
          if (p.uuid) return link.href.includes(p.uuid);
          return true;
      });
      
      if (match) {
        link.dataset.flagProcessed = '1';
        nukeIconsAndSpaces(link);
        if (link.parentElement && link.parentElement.tagName === 'BDI') {
            nukeIconsAndSpaces(link.parentElement);
        }

        const target = link.querySelector('bdi') || link;
        
        if (target.firstChild && target.firstChild.nodeType === Node.TEXT_NODE) {
             target.firstChild.nodeValue = target.firstChild.nodeValue.replace(/^[\s\u00A0]+/, '');
        }

        const img = document.createElement('img');
        img.className = 'flag flag-CA-prov';
        img.src = match.url;
        img.alt = match.name;
        img.title = match.name;

        target.prepend(document.createTextNode('\u00A0'));
        target.prepend(img);
      }
    });
  }

  // 3) Run + Observer
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
