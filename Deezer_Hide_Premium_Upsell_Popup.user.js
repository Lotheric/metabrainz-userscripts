// ==UserScript==
// @name         Deezer: Hide Premium Upsell Popup
// @namespace    https://github.com/userscripts/deezer-no-upsell
// @version      2026-05-27.1224
// @description  Automatically dismisses the "Try Deezer Premium" nag popup on the free tier.
// @downloadURL  https://github.com/Lotheric/metabrainz-userscripts/blob/main/Deezer_Hide_Premium_Upsell_Popup.user.js
// @updateURL    https://github.com/Lotheric/metabrainz-userscripts/blob/main/Deezer_Hide_Premium_Upsell_Popup.user.js
// @author       Lotheric
// @tag          ai-created
// @match        https://www.deezer.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // ─── Selectors to try, in order of specificity ───────────────────────────
  //
  // Deezer renders its upsell as a modal/dialog overlay. The exact class names
  // can be obfuscated or change with deployments, so we use several strategies:
  //
  //  1. Known stable data-* attributes and aria roles on the modal container.
  //  2. Common class-name fragments Deezer has used historically.
  //  3. Text-content sniffing as a last-resort fallback.
  //
  const MODAL_SELECTORS = [
    // Deezer's own dialog/modal wrappers
    '[data-testid="modal-wrapper"]',
    '[data-testid="upsell-modal"]',
    '[data-testid="offer-modal"]',
    '[aria-modal="true"]',
    // Class-fragment matches (Deezer uses BEM-ish naming)
    '.modal-upsell',
    '.upsell-modal',
    '.offer-modal',
    '.premiumModal',
    // Generic overlay/dialog that is a direct child of body
    'body > [role="dialog"]',
    'body > .ReactModalPortal',
  ];

  // Selectors for the close / dismiss button inside the modal
  const CLOSE_SELECTORS = [
    '[data-testid="modal-close"]',
    '[aria-label="Close"]',
    '[aria-label="Fermer"]',   // French locale
    'button[class*="close"]',
    'button[class*="Close"]',
    'button[class*="dismiss"]',
    '.btn-close',
  ];

  // Keywords that confirm a node is the premium upsell (case-insensitive)
  const UPSELL_KEYWORDS = [
    'deezer premium',
    'try premium',
    'essayer premium',   // French
    'cancel anytime',
    'annuler à tout moment',
  ];

  // ─── Helpers ─────────────────────────────────────────────────────────────

  function containsUpsellText(el) {
    const text = (el.innerText || el.textContent || '').toLowerCase();
    return UPSELL_KEYWORDS.some(kw => text.includes(kw));
  }

  function tryDismiss(modal) {
    // 1. Click the close button if one exists inside the modal
    for (const sel of CLOSE_SELECTORS) {
      const btn = modal.querySelector(sel);
      if (btn) {
        btn.click();
        console.log('[Deezer No-Upsell] Closed via button:', sel);
        return;
      }
    }

    // 2. No close button found — just hide the modal and its backdrop
    modal.style.setProperty('display', 'none', 'important');

    // Also remove any semi-transparent backdrop siblings
    const backdrop =
      modal.previousElementSibling || modal.nextElementSibling;
    if (backdrop && (
      backdrop.classList.contains('ReactModal__Overlay') ||
      backdrop.getAttribute('aria-hidden') === 'true' ||
      /overlay|backdrop/i.test(backdrop.className)
    )) {
      backdrop.style.setProperty('display', 'none', 'important');
    }

    // Restore body scroll-lock that Deezer adds when a modal is open
    document.body.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow');

    console.log('[Deezer No-Upsell] Modal hidden via CSS override.');
  }

  function scanAndDismiss() {
    // Strategy A: well-known selectors
    for (const sel of MODAL_SELECTORS) {
      document.querySelectorAll(sel).forEach(el => {
        if (containsUpsellText(el)) {
          tryDismiss(el);
        }
      });
    }

    // Strategy B: walk every visible dialog/section and text-match
    document.querySelectorAll('[role="dialog"], [role="alertdialog"]').forEach(el => {
      if (containsUpsellText(el)) {
        tryDismiss(el);
      }
    });
  }

  // ─── MutationObserver – catches dynamically injected popups ──────────────

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        // Check the added node itself and its subtree
        if (containsUpsellText(node)) {
          tryDismiss(node);
        } else {
          // Maybe the upsell is nested deeper
          scanAndDismiss();
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // ─── Initial scan (handles popups that load before observer is ready) ────

  // Wait a beat for React to finish hydrating the page
  setTimeout(scanAndDismiss, 1500);
  setTimeout(scanAndDismiss, 4000); // second pass for slow connections

})();
