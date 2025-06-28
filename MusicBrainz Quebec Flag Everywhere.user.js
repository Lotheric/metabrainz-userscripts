// ==UserScript==
// @name         MusicBrainz: Quebec Flag Everywhere
// @namespace    https://musicbrainz.org/
// @version      1.12
// @description  Prepend a flag span before Québec links, with one alignment for normal text and another for <h1> headers.
// @match        https://*.musicbrainz.org/*
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
    }
    /* Header context: any flag immediately within an <h1> */
    h1 .flag.flag-QC {
      vertical-align: text-center !important;
      /* nudge down 2px to match Canada header flags */
      top: 5px !important;
      right: -4px !important;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // 2) Insert flag spans before each Québec area link
  function insertFlags(root = document.body) {
    root.querySelectorAll(`a[href="/area/${QC_ID}"]`).forEach(link => {
      if (link.dataset.qcDone) return;
      const bdi = link.querySelector('bdi');
      if (!bdi || bdi.textContent.trim() !== 'Québec') return;
      link.dataset.qcDone = '1';

      // remove the built‑in planet icon
      link.classList.remove('area-icon');
      // remove the empty span.arealink before it
      const prev = link.previousElementSibling;
      if (prev?.tagName === 'SPAN' &&
          prev.classList.contains('arealink') &&
          !prev.textContent.trim()
      ) prev.remove();

      // prepend our standalone flag span
      const span = document.createElement('span');
      span.className = 'flag flag-QC';
      link.parentNode.insertBefore(span, link);
    });
  }

  // 3) Run on load + dynamic updates
  function init() {
    insertFlags();
    new MutationObserver(muts => muts.forEach(m => insertFlags(m.target)))
      .observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
