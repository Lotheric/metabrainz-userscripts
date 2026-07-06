// ==UserScript==
// @name         MusicBrainz: Canadian Province Flags Everywhere
// @namespace    https://musicbrainz.org/
// @version      2026-07-06.1143
// @description  Uses CSS pseudo-elements to paint flags inside Canadian province/territory links, completely eliminating flex gaps and DOM crashes.
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

  const PROVINCES = [
    { name: 'Alberta', regex: /^Alberta$/i, code: 'AB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Alberta.svg' },
    { name: 'British Columbia', regex: /^(British Columbia|Colombie-Britannique)$/i, code: 'BC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_British_Columbia.svg' },
    { name: 'Manitoba', regex: /^Manitoba$/i, code: 'MB', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Manitoba.svg' },
    { name: 'New Brunswick', regex: /^(New Brunswick|Nouveau-Brunswick)$/i, code: 'NB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_New_Brunswick.svg' },
    { name: 'Newfoundland and Labrador', regex: /^(Newfoundland and Labrador|Terre-Neuve-et-Labrador|Newfoundland|Labrador)$/i, code: 'NL', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Newfoundland_and_Labrador.svg' },
    { name: 'Nova Scotia', regex: /^(Nova Scotia|Nouvelle-Écosse)$/i, code: 'NS', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Nova_Scotia.svg' },
    { name: 'Ontario', regex: /^Ontario$/i, code: 'ON', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Ontario.svg' },
    { name: 'Prince Edward Island', regex: /^(Prince Edward Island|Île-du-Prince-Édouard|PEI)$/i, code: 'PE', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Flag_of_Prince_Edward_Island.svg' },
    { name: 'Quebec', regex: /^Qu[eé]bec$/i, code: 'QC', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg' },
    { name: 'Saskatchewan', regex: /^Saskatchewan$/i, code: 'SK', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_Saskatchewan.svg' },
    { name: 'Northwest Territories', regex: /^(Northwest Territories|Territoires du Nord-Ouest)$/i, code: 'NT', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_the_Northwest_Territories.svg' },
    { name: 'Nunavut', regex: /^Nunavut$/i, code: 'NU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Flag_of_Nunavut.svg' },
    { name: 'Yukon', regex: /^Yukon$/i, code: 'YT', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Yukon.svg' }
  ];

  // 1) Inject ::before Pseudo-Element CSS
  let css = `
    /* The ::before element paints the flag directly inside the target node, avoiding HTML Flexbox layout gaps entirely */
    [data-mb-flag]::before {
      content: "";
      display: inline-block !important;
      width: 16px !important;
      height: 11px !important;
      margin-right: 0.35em !important;
      background-size: 16px 11px !important;
      background-repeat: no-repeat !important;
      vertical-align: middle !important;
      position: relative !important;
      top: -1px !important;
    }
    h1 [data-mb-flag]::before, h2 [data-mb-flag]::before {
      top: -2px !important;
      margin-right: 0.4em !important;
    }
  `;

  // Attach individual flag URLs to their respective data codes
  PROVINCES.forEach(prov => {
    css += `\n    [data-mb-flag="${prov.code}"]::before { background-image: url("${prov.url}") !important; }`;
  });
  
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Helper: Wipe external planet icons safely
  function cleanIcons(el) {
    el.querySelectorAll('.area-icon, .type-icon, .arealink').forEach(n => n.remove());
    
    // Erase preceding sibling icon spans (and any empty spacing spans MB generates)
    let prev = el.previousElementSibling;
    while (prev && prev.tagName === 'SPAN' && 
          (prev.classList.contains('area-icon') || prev.classList.contains('type-icon') || prev.classList.contains('arealink') || prev.textContent.trim() === '')) {
      let toRemove = prev;
      prev = prev.previousElementSibling;
      toRemove.remove();
    }

    // If wrapped in <bdi>, clean siblings outside the wrapper too
    if (el.parentElement && (el.parentElement.tagName === 'BDI' || el.parentElement.tagName === 'SPAN')) {
      let pPrev = el.parentElement.previousElementSibling;
      while (pPrev && pPrev.tagName === 'SPAN' && 
            (pPrev.classList.contains('area-icon') || pPrev.classList.contains('type-icon') || pPrev.classList.contains('arealink') || pPrev.textContent.trim() === '')) {
        let toRemove = pPrev;
        pPrev = pPrev.previousElementSibling;
        toRemove.remove();
      }
    }
  }

  // 2) Main Logic
  function insertFlags() {
    // --- PART A: Headers ---
    if (window.location.pathname.includes('/area/')) {
      document.querySelectorAll('h1, h2').forEach(heading => {
        if (heading.dataset.flagProcessed || heading.querySelector(`a[href*="/area/"]`)) return; 
        heading.dataset.flagProcessed = '1';
        
        // Safely extract text string to prevent undefined node replace errors
        const textStr = heading.textContent || '';
        const baseText = textStr.replace(/\s*\(.*?\)/g, '').trim();
        const match = PROVINCES.find(p => p.regex.test(baseText));

        if (match) {
          cleanIcons(heading);
          const target = heading.querySelector('bdi') || heading;
          
          // Clean leading spaces inside the text node so ::before sits flush
          if (target.firstChild && target.firstChild.nodeType === Node.TEXT_NODE) {
            target.firstChild.textContent = (target.firstChild.textContent || '').trimStart();
          }
          
          // Apply the trigger for CSS to paint the flag
          target.dataset.mbFlag = match.code;
          target.title = match.name;
        }
      });
    }

    // --- PART B: Links ---
    document.querySelectorAll(`a[href*="/area/"]`).forEach(link => {
      if (link.dataset.flagProcessed) return;
      link.dataset.flagProcessed = '1';
      
      const textStr = link.textContent || '';
      const text = textStr.replace(/\s*\(.*?\)/g, '').trim();
      const match = PROVINCES.find(p => p.regex.test(text));
      
      if (match) {
        cleanIcons(link);
        
        const target = link.querySelector('bdi') || link;
        
        if (target.firstChild && target.firstChild.nodeType === Node.TEXT_NODE) {
            target.firstChild.textContent = (target.firstChild.textContent || '').trimStart();
        }
        
        target.dataset.mbFlag = match.code;
        target.title = match.name;
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
