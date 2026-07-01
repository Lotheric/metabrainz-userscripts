// ==UserScript==
// @name         MusicBrainz: Chronological Associated Singles/EPs
// @namespace    https://github.com/Lotheric/metabrainz-userscripts
// @version      2026-07-01.1314
// @description  Sorts associated singles by release date for MusicBrainz Table layouts with custom date styling.
// @downloadURL  https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_Chronological_Associated_Singles_EPs.user.js
// @updateURL    https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_Chronological_Associated_Singles_EPs.user.js
// @author       Lotheric
// @tag          ai-created
// @match        *://musicbrainz.org/release-group/*
// @match        *://beta.musicbrainz.org/release-group/*
// @icon         https://community.metabrainz.org/user_avatar/community.metabrainz.org/lotheric/288/88429_2.png
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const mbid = window.location.href.match(/\/release-group\/([a-f0-9-]+)/)?.[1];
    if (!mbid) return;

    let hasRun = false;

    async function inject() {
        if (hasRun) return;

        // 1. Locate the table header (th) and its corresponding cell (td)
        const header = Array.from(document.querySelectorAll('th')).find(th => 
            th.textContent.toLowerCase().includes('associated')
        );

        if (!header) return;

        const cell = header.nextElementSibling;
        if (!cell || cell.tagName !== 'TD') return;

        hasRun = true;

        // 2. Fetch data
        const apiUrl = `${window.location.origin}/ws/2/release-group/${mbid}?inc=release-group-rels&fmt=json`;
        const data = await fetch(apiUrl).then(res => res.json()).catch(() => ({}));
        const dateMap = {};
        if (data.relations) {
            data.relations.forEach(rel => {
                const rg = rel['release-group'] || rel['release_group'];
                if (rg && rg.id) dateMap[rg.id] = rg['first-release-date'] || '9999-12-31';
            });
        }

        // 3. Process links inside the table cell (td)
        const contentNodes = Array.from(cell.childNodes);
        const linkGroups = [];
        let currentGroup = [];

        contentNodes.forEach(node => {
            if (node.tagName === 'BR') {
                if (currentGroup.length > 0) linkGroups.push(currentGroup);
                currentGroup = [];
            } else {
                currentGroup.push(node);
            }
        });
        if (currentGroup.length > 0) linkGroups.push(currentGroup);

        // 4. Sort based on the link found in each group
        const sortedGroups = linkGroups.map(nodes => {
            const linkNode = nodes.find(n => n.tagName === 'A' || (n.querySelector && n.querySelector('a')));
            const href = linkNode.tagName === 'A' ? linkNode.href : linkNode.querySelector('a').href;
            const id = href.match(/\/release-group\/([a-f0-9-]+)/)[1];
            return { nodes, date: dateMap[id] || '9999-12-31' };
        });

        sortedGroups.sort((a, b) => a.date.localeCompare(b.date));

        // 5. Rebuild the table cell
        cell.innerHTML = '';
        sortedGroups.forEach((group, index) => {
            group.nodes.forEach(node => cell.appendChild(node));
            
            // Add styled date (10px, italic)
            const dateSpan = document.createElement('span');
            dateSpan.style.fontSize = '10px';
            dateSpan.style.fontStyle = 'italic';
            dateSpan.style.color = '#777';
            dateSpan.style.marginLeft = '5px';
            dateSpan.textContent = `(${group.date === '9999-12-31' ? '?' : group.date})`;
            cell.appendChild(dateSpan);

            if (index < sortedGroups.length - 1) cell.appendChild(document.createElement('br'));
        });
    }

    // Observer ensures we catch the list when the table renders
    const observer = new MutationObserver(inject);
    observer.observe(document.body, { childList: true, subtree: true });
    inject();
})();
