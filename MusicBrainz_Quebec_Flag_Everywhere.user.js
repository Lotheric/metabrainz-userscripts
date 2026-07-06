// ==UserScript==
// @name         MusicBrainz: Quebec Flag Everywhere
// @namespace    https://musicbrainz.org/
// @version      2026-07-06.1124
// @description  Prepend a flag span before Québec links, with one alignment for normal text and another for <h1> headers.
// @downloadURL  https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_Quebec_Flag_Everywhere.user.js
// @updateURL    https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_Quebec_Flag_Everywhere.user.js
// @author       Lotheric
// @tag          ai-created
// @icon         https://community.metabrainz.org/user_avatar/community.metabrainz.org/lotheric/288/88429_2.png
// @match        https://musicbrainz.org/*
// @match        https://beta.musicbrainz.org/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const QC_ID    = 'a510b9b1-404d-4e23-8db8-0f6585909ed8';
  const FLAG_URL = 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg';

  // 1) Inject CSS for dual alignments
  const css = `
    /* Default (small/text contexts): tuck under text-top */
    .flag.flag-QC {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 16px !important;
      height: 11px !important;
      margin-right: 0.4em !important;
      background-image: url(${FLAG_URL}) !important;
      background-size: 16px 11px !important;
      background-repeat: no-repeat !important;
      vertical-align: text-top !important;
      position: relative !important;
      top: 0 !important;
      right: -2px !important;
    }
    /* Header context: any flag immediately within an <h1> or <h2> */
    h1 .flag.flag-QC, h2 .flag.flag-QC {
      vertical-align: middle !important;
      top: 5px !important;
      right: -4px !important;
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // 2) Main function to insert flags
  function insertFlags() {
    // --- PART A: Handle the main headings on the actual Québec area page ---
    if (window.location.pathname.includes(QC_ID)) {
      // Loop over all h1/h2 to avoid failing if the first <h1> is a hidden site logo
      document.querySelectorAll('h1, h2').forEach(heading => {
        if (heading.dataset.qcDone) return;
        
        // If the heading contains a link to QC, let Part B handle it to prevent double flags
        if (heading.querySelector(`a[href*="${QC_ID}"]`)) return;
        
        // Relaxed match to catch Québec or Quebec
        if (/Qu[eé]bec/i.test(heading.textContent)) {
          heading.dataset.qcDone = '1';
          
          // Remove MB's default header icons safely by querying specific classes
          heading.querySelectorAll('.area-icon, .type-icon, .arealink').forEach(sp => sp.remove());

          const span = document.createElement('span');
          span.className = 'flag flag-QC';
          
          const bdi = heading.querySelector('bdi');
          if (bdi) {
            heading.insertBefore(span, bdi);
          } else {
            heading.prepend(span);
          }
        }
      });
    }

    // --- PART B: Handle all links TO Québec (tables, sidebars, breadcrumbs) ---
    document.querySelectorAll(`a[href*="${QC_ID}"]`).forEach(link => {
      if (link.dataset.qcDone) return;
      if (!/Qu[eé]bec/i.test(link.textContent)) return;
      
      link.dataset.qcDone = '1';

      link.classList.remove('area-icon', 'type-icon');
      
      // Safely remove MB's preceding icon span
      let iconSpan = link.previousElementSibling;
      if (iconSpan && iconSpan.tagName === 'SPAN' && 
         (iconSpan.classList.contains('area-icon') || 
          iconSpan.classList.contains('type-icon') || 
          iconSpan.classList.contains('arealink'))) {
          iconSpan.remove();
      } 
      else if (link.parentElement?.tagName === 'BDI') {
          iconSpan = link.parentElement.previousElementSibling;
          if (iconSpan && iconSpan.tagName === 'SPAN' && 
             (iconSpan.classList.contains('area-icon') || 
              iconSpan.classList.contains('type-icon') || 
              iconSpan.classList.contains('arealink'))) {
              iconSpan.remove();
          }
      }

      // Prepend our standalone flag span directly beside the link text
      const span = document.createElement('span');
      span.className = 'flag flag-QC';
      link.parentNode.insertBefore(span, link);
    });
  }

  // 3) Run on load + dynamic updates
  function init() {
    insertFlags();
    
    new MutationObserver(() => {
        insertFlags();
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
