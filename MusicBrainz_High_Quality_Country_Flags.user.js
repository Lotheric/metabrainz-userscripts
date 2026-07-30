// ==UserScript==
// @name         MusicBrainz: High Quality Country Flags
// @namespace    https://github.com/Lotheric/metabrainz-userscripts/
// @version      2026-07-30.1537
// @description  Replaces MusicBrainz country flags with Wikimedia SVGs.
// @downloadURL  https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_High_Quality_Country_Flags.user.js
// @updateURL    https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_High_Quality_Country_Flags.user.js
// @author       Lotheric
// @tag          ai-created
// @icon         https://community.metabrainz.org/user_avatar/community.metabrainz.org/lotheric/288/88429_2.png
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
    { name: 'Bhutan', uuid: '2cbd5484-647d-3752-8acd-933ced4f9a24', code: 'BT', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Flag_of_Bhutan.svg' },
    { name: 'Bolivia', uuid: 'a5aed4a3-8ce1-3ab3-bfee-b008cff6b857', code: 'BO', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Bolivia.svg' },
    { name: 'Bonaire', uuid: '48b6011b-bfe4-49c6-b215-a6a15b9af756', code: 'BQ', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Flag_of_Bonaire.svg' },
    { name: 'Bosnia and Herzegovina', uuid: 'f2b64f81-6d36-35b3-94b9-5ba53d693914', code: 'BA', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Bosnia_and_Herzegovina.svg' },
    { name: 'Bostwana', uuid: 'e5e11b08-d26d-341c-af28-69d3c26607f7', code: 'BW', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Botswana.svg' },
    { name: 'Bouvet Island', uuid: '3413ecd3-a1f0-3e21-a226-d9ff3ed480b7', code: 'BV', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Norway.svg' },
    { name: 'Brazil', uuid: 'b253ba64-d6e0-3165-afde-b03a7d420cc5', code: 'BR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Brazil.svg' },
    { name: 'British Indian Ocean Territory', uuid: '41c97db3-0719-363f-ad0b-79451e0f381b', code: 'IO', url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Flag_of_the_British_Indian_Ocean_Territory_2025.svg' },
    { name: 'Brunei', uuid: '5d1fe672-9c9a-3d58-a221-4b23e9274709', code: 'BN', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Brunei.svg' },
    { name: 'Bulgaria', uuid: '114c14ad-9776-34e9-81b0-6299507f3771', code: 'BG', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Bulgaria.svg' },
    { name: 'Burkina Faso', uuid: '5f886d01-5c12-3abb-b8be-d758b282ab05', code: 'BF', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Burkina_Faso.svg' },
    { name: 'Burundi', uuid: 'bd96f09c-c2a8-3996-b52f-291521b688c0', code: 'BI', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Flag_of_Burundi.svg' },
    { name: 'Cambodia', uuid: 'ee26e886-87f5-33a2-8e8e-f9591490426d', code: 'KH', url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg' },
    { name: 'Cameroon', uuid: 'bf132644-e3ee-3bfc-9323-7f82824e4945', code: 'CM', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Flag_of_Cameroon.svg' },
    { name: 'Cape Verde', uuid: '41d328a3-01da-35c2-b26e-69c56d7121d1', code: 'CV', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flag_of_Cape_Verde_%283-2%29.svg' },
    { name: 'Cayman Islands', uuid: '5dd25184-711c-3e6a-b089-572cd095f287', code: 'KY', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Flag_of_the_Cayman_Islands.svg' },
    { name: 'Canada', uuid: '71bbafaa-e825-3e15-8ca9-017dcad1748b', code: 'CA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canada.svg' },
    { name: 'Central African Republic', uuid: '863f49fc-16d0-3fa8-beae-242fc8ab114b', code: 'CF', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_the_Central_African_Republic.svg' },
    { name: 'Chad', uuid: '6ce82d72-8123-3365-ab34-7b20581a34cf', code: 'TD', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Flag_of_Chad.svg' },
    { name: 'Chile', uuid: '82d5f4d6-aed4-3ff5-81d1-5363ac6e97a7', code: 'CL', url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Flag_of_Chile.svg' },
    { name: 'China', uuid: '7c81bb69-a99b-3487-b6d4-0f76d7a29ca0', code: 'CN', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg' },
    { name: 'Christmas Island', uuid: '5bc803ff-c3f9-3c36-a7d6-80bc1ab4a34e', code: 'CX', url: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Flag_of_Christmas_Island.svg' },
    { name: 'Cocos (Keeling) Islands', uuid: '3df32a28-e4b2-3c27-a85e-328e3f978bc5', code: 'CC', url: 'https://upload.wikimedia.org/wikipedia/en/7/74/Flag_of_the_Cocos_%28Keeling%29_Islands.svg' },
    { name: 'Colombia', uuid: '02b60d8d-7164-339d-868d-22d147d9f74a', code: 'CO', url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg' },
    { name: 'Comoros', uuid: 'f8002d93-3b43-3bb7-84dd-4766ff7e5b3b', code: 'KM', url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Flag_of_the_Comoros.svg' },
    { name: 'Congo', uuid: '185bc3c4-4c5a-3f69-9384-7c280dfdf072', code: 'CG', url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_the_Republic_of_the_Congo.svg' },
    { name: 'Cook Islands', uuid: 'ef1ab25c-717b-30a8-8943-f9937aad8d1f', code: 'CK', url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_the_Cook_Islands.svg' },
    { name: 'Costa Rica', uuid: 'ba544658-8266-36cb-ac0e-3bdfbf52cb00', code: 'CR', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Costa_Rica.svg' },
    { name: 'Côte d\'Ivoire', uuid: 'e56e3d7a-4b90-3546-8450-49548050924a', code: 'CI', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Côte_d%27Ivoire.svg' },
    { name: 'Croatia', uuid: '7d30afff-e425-356a-873e-17ae9745b31d', code: 'HR', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Croatia.svg' },
    { name: 'Cuba', uuid: 'b06c4e86-97f7-3419-84a9-a23c60ea0b22', code: 'CU', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Flag_of_Cuba.svg' },
    { name: 'Curaçao', uuid: '71bbafaa-e825-3e15-8ca9-017dcad1748b', code: 'CW', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Flag_of_Curaçao.svg' },
    { name: 'Cyprus', uuid: 'a75b525f-8c01-31f6-975e-4a32a2b001d5', code: 'CY', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Cyprus.svg' },
    { name: 'Czechia', uuid: '51d34c28-61bf-3d21-849f-7492672a9d44', code: 'CZ', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg' },
    { name: 'Democratic Republic of the Congo', uuid: 'd1733e16-9064-3181-961d-d56f8599969b', code: 'CD', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg' },
    { name: 'Denmark', uuid: '01918349-f00e-3fa1-aa05-0951a84f3df9', code: 'DK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Denmark.svg' },
    { name: 'Djibouti', uuid: 'aa560de1-9e56-38ab-8d20-6133be7f3f2a', code: 'DJ', url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Flag_of_Djibouti.svg' },
    { name: 'Dominica', uuid: '9898ec17-2174-3a61-9e3b-3f51b3ee4de1', code: 'DM', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Dominica.svg' },
    { name: 'Dominican Republic', uuid: '696cb3e0-5084-30ab-9916-65ece70adbf6', code: 'DO', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_the_Dominican_Republic.svg' },
    { name: 'Ecuador', uuid: '967abc0e-f680-3cde-95d0-0b79b977d410', code: 'EC', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Flag_of_Ecuador.svg' },
    { name: 'Egypt', uuid: '8e0551f2-95c2-3cc0-a0a9-f2d344f10667', code: 'EG', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg' },
    { name: 'El Salvador', uuid: 'f2fa4bfb-97aa-3db4-8d49-cc64969ce1a7', code: 'SV', url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Flag_of_El_Salvador.svg' },
    { name: 'Equatorial Guinea', uuid: '218e28fc-7e19-3700-b4d5-5d9199a59418', code: 'GQ', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Equatorial_Guinea.svg' },
    { name: 'Eritrea', uuid: '2005d841-29df-3445-8b5c-c981de756bd3', code: 'ER', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Flag_of_Eritrea.svg' },
    { name: 'Estonia', uuid: 'e1c1215f-dcc0-35b4-b840-d2ca2151593b', code: 'EE', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Flag_of_Estonia.svg' },
    { name: 'Eswatini', uuid: '564741c6-943e-313b-86fa-9819d595281b', code: 'SZ', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_Eswatini.svg' },
    { name: 'Ethiopia', uuid: '96699ab4-4bbf-332e-b037-b0119821f792', code: 'ET', url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Ethiopia.svg' },
    { name: 'Falkland Islands', uuid: 'baa270d6-bb10-38d1-87bd-42a82b4efa9c', code: 'FK', url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_Falkland_Islands.svg' },
    { name: 'Faroe Islands', uuid: '9ed3be5f-d54c-3add-a6a6-76c0cca54fd8', code: 'FO', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Flag_of_the_Faroe_Islands.svg' },
    { name: 'Fiji', uuid: '031eba2b-79b5-3314-a14b-288407ad42ab', code: 'FJ', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Fiji.svg' },
    { name: 'Finland', uuid: '6a264f94-6ff1-30b1-9a81-41f7bfabd616', code: 'FI', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg' },
    { name: 'France', uuid: '08310658-51eb-3801-80de-5a0739207115', code: 'FR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_France.svg' },
    { name: 'French Guiana', uuid: 'bc6f4b9a-3b76-33ca-bde3-2ae452afe66a', code: 'GF', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Flag_of_French_Guiana.svg' },
    { name: 'French Polynesia', uuid: '8b681e01-6c95-3b24-ae60-5cdbcb1d7dce', code: 'PF', url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Flag_of_French_Polynesia.svg' },
    { name: 'French Southern Territories', uuid: '0be4bfaf-17e0-3c0f-9f46-ed9ccdbe86a6', code: 'TF', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Flag_of_the_French_Southern_and_Antarctic_Lands.svg' },
    { name: 'Gabon', uuid: 'd14441fe-3bce-34b5-aed5-dfbe987329c9', code: 'GA', url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Flag_of_Gabon.svg' },
    { name: 'Gambia', uuid: '52641fae-20e3-3698-9fa9-1849f2c79ab8', code: 'GM', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_The_Gambia.svg' },
    { name: 'Georgia', uuid: '7e081aa0-817b-3ae0-9fe2-4bb4e3b3cc95', code: 'GE', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Flag_of_Georgia.svg' },
    { name: 'Germany', uuid: '85752fda-13c4-31a3-bee5-0e5cb1f51dad', code: 'DE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Germany.svg' },
    { name: 'Ghana', uuid: 'cf48f4b4-28f0-39ab-9104-650324a1d1c8', code: 'GH', url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Ghana.svg' },
    { name: 'Gibraltar', uuid: 'dd59627f-9549-3408-9a4a-65f7ba546290', code: 'GI', url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Flag_of_Gibraltar.svg' },
    { name: 'Greece', uuid: '803db0ca-b6ed-3bbc-aeb8-f89efd0a2168', code: 'GR', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Greece.svg' },
    { name: 'Greenland', uuid: 'e9bf9b1c-5cb4-3487-88e1-19da70caa9c9', code: 'GL', url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_Greenland.svg' },
    { name: 'Grenada', uuid: '217e2eb3-0a3a-3b59-9eaa-a7465c1417ff', code: 'GD', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Grenada.svg' },
    { name: 'Guadeloupe', uuid: '338346f8-4dc2-38e8-a009-5a3e1585348f', code: 'GP', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Flag_of_Guadeloupe_%28UPLG%29.svg' },
    { name: 'Guam', uuid: '43dd540a-78cd-319f-bab9-214b5430f3f2', code: 'GU', url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Flag_of_Guam.svg' },
    { name: 'Guatemala', uuid: '01448ddc-6ee3-3fa4-b136-507d984e31ee', code: 'GT', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Flag_of_Guatemala.svg' },
    { name: 'Guernsey', uuid: '6a89d88d-cd53-3d32-b41e-f6c7ab14649b', code: 'GG', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Guernsey.svg' },
    { name: 'Guinea', uuid: 'a58af0f8-b238-3da2-a57b-4aa0ff4ab574', code: 'GN', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Flag_of_Guinea.svg' },
    { name: 'Guinea-Bissau', uuid: '4f01a1af-02ca-3b28-a64f-f38c36c08879', code: 'GW', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Guinea-Bissau.svg' },
    { name: 'Guyana', uuid: 'c4a33ce9-580e-3d57-9c32-f75daf2f75ef', code: 'GY', url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_Guyana.svg' },
    { name: 'Haiti', uuid: 'cf25d306-7da5-3878-a2b1-a0370f847308', code: 'HT', url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Flag_of_Haiti.svg' },
    { name: 'Heard Island and McDonald Islands', uuid: '457accb6-fe97-307e-89a9-bad912a60e4e', code: 'HM', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg' },
    { name: 'Honduras', uuid: '0c3ea915-4e49-34fc-b702-debb216fd7fa', code: 'HN', url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Honduras_%281949–2022%2C_2026–present%29.svg' },
    { name: 'Hong Kong', uuid: '0373cdff-eac8-3fbc-92dc-36a607da06d1', code: 'HK', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Flag_of_Hong_Kong.svg' },
    { name: 'Hungary', uuid: '312bc5bb-7e43-3e63-81c6-b4d712b37b2c', code: 'HU', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Hungary.svg' },
    { name: 'Iceland', uuid: '48802a32-075a-3805-a183-277c66047693', code: 'IS', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Iceland.svg' },
    { name: 'India', uuid: 'd31a9a15-537f-3669-ad53-25753ddd2772', code: 'IN', url: 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg' },
    { name: 'Indonesia', uuid: 'd3a68bd0-7419-3f99-a5bd-204d6e057089', code: 'ID', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg' },
    { name: 'Iran', uuid: 'a63fbc7f-af00-33c7-8616-3e86df9fc16b', code: 'IR', url: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_Iran_%28official%29.svg' },
    { name: 'Iraq', uuid: 'b0525ccb-15e9-3c56-81fa-471db3b31cfa', code: 'IQ', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Iraq.svg' },
    { name: 'Ireland', uuid: '390b05d4-11ec-3bce-a343-703a366b34a5', code: 'IE', url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Flag_of_Ireland.svg' },
    { name: 'Isle of Man', uuid: 'e9857f2e-5db7-36a0-b4a9-c7c32d1b3172', code: 'IM', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Flag_of_the_Isle_of_Mann.svg' },
    { name: 'Israel', uuid: '03691455-bb46-37e3-91d2-cb064a35ffcc', code: 'IL', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Israel.svg' },
    { name: 'Italy', uuid: '00457635-f0cd-321b-bfad-80eb922c2a01', code: 'IT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Italy.svg' },
    { name: 'Jamaica', uuid: '2dd47a64-91d5-3b13-bc94-80043ed063d7', code: 'JM', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_Jamaica.svg' },
    { name: 'Japan', uuid: '2db42837-c832-3c27-b4a3-08198f75693c', code: 'JP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Japan.svg' },
    { name: 'Jersey', uuid: '74c0ac9d-cda7-38be-a0c9-43611c5779dc', code: 'JE', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Flag_of_Jersey.svg' },
    { name: 'Jordan', uuid: '2e40127e-0b8a-3a01-bfbc-58c7fcdba532', code: 'JO', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Jordan.svg' },
    { name: 'Kazakhstan', uuid: '92d52542-3363-351c-a8b6-d991e0bccb8f', code: 'KZ', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg' },
    { name: 'Kenya', uuid: '023da4a0-acee-3fb1-b91e-5de74ccf787b', code: 'KE', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Kenya.svg' },
    { name: 'Kiribati', uuid: '2b425457-0a4f-3282-9d2f-0a0e0f7db2e5', code: 'KI', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kiribati.svg' },
    { name: 'Kuwait', uuid: 'f03f2625-dc7d-38b2-a058-4e9ca0e10424', code: 'KW', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Kuwait.svg' },
    { name: 'Kyrgyzstan', uuid: '188b4a6b-a4d8-3864-ba46-8446c7b658b4', code: 'KG', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Kyrgyzstan.svg' },
    { name: 'Laos', uuid: 'c81cb1f4-0858-3f28-9082-c06e2ce24bea', code: 'LA', url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Flag_of_Laos.svg' },
    { name: 'Latvia', uuid: '66eb3e73-d69e-3581-9a23-a73b4c64c8dd', code: 'LV', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Latvia.svg' },
    { name: 'Lebanon', uuid: '8138206e-5786-3f86-a53b-19a7303e7419', code: 'LB', url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Flag_of_Lebanon.svg' },
    { name: 'Lesotho', uuid: 'c5011696-e744-3946-a2c1-e3fe7e6dde37', code: 'LS', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Flag_of_Lesotho.svg' },
    { name: 'Liberia', uuid: 'd66e68e6-6410-3d34-a8aa-9242045ed593', code: 'LR', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_Liberia.svg' },
    { name: 'Libya', uuid: '1509aaae-8271-30cb-89c1-d8660cf73975', code: 'LY', url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Libya.svg' },
    { name: 'Liechtenstein', uuid: 'd2007481-eefe-37c0-be71-2256dfe148cb', code: 'LI', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Flag_of_Liechtenstein.svg' },
    { name: 'Lithuania', uuid: '0785dc14-96af-3dc4-bde4-dcdfc2e2d0d6', code: 'LT', url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_Lithuania.svg' },
    { name: 'Luxembourg', uuid: '563d21b7-4a8e-35e2-83a7-7804baefbfa7', code: 'LU', url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_Luxembourg.svg' },
    { name: 'Macao', uuid: 'ed4e8ad9-2b33-3133-b105-28bb719d6ce8', code: 'MO', url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Flag_of_Macau.svg' },
    { name: 'Madagascar', uuid: 'f3a30678-3d23-3f42-8056-d32ebe58c66d', code: 'MG', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Madagascar.svg' },
    { name: 'Malawi', uuid: 'b4d3ff41-ead2-300f-9c11-f73f8ad39678', code: 'MW', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Flag_of_Malawi.svg' },
    { name: 'Malaysia', uuid: '305d19c7-c040-349c-8d5f-6ac75d2d2a09', code: 'MY', url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg' },
    { name: 'Maldives', uuid: 'a195ee41-7f39-3a60-83ca-4a6f91cd4d2e', code: 'MV', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Flag_of_Maldives.svg' },
    { name: 'Mali', uuid: 'c35e6d5e-9011-32e5-a23f-9e7639b7350c', code: 'ML', url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_Mali.svg' },
    { name: 'Malta', uuid: '050c94f7-1413-3a34-bb90-4a94f3bb2084', code: 'MT', url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Malta.svg' },
    { name: 'Marshall Islands', uuid: 'bf8c2e6f-2401-3a52-aad2-7e8baa8b447e', code: 'MH', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flag_of_the_Marshall_Islands.svg' },
    { name: 'Mexico', uuid: '37bbd6c6-f7af-3444-8848-bc6b7ad692dc', code: 'MX', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Mexico.svg' },
    { name: 'Netherlands', uuid: 'ef1b7ece-0158-3da0-be3e-d91d84b54e3d', code: 'NL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Netherlands.svg' },
    { name: 'Norfolk Island', uuid: 'a2b3b8cb-79e8-3c26-8a2a-3ccc7dd80cda', code: 'NF', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Norfolk_Island.svg' },
    { name: 'North Korea', uuid: '445e806f-2e04-3f9a-89eb-ef5c4e97b365', code: 'KP', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Flag_of_North_Korea_%2820-33%29.svg' },
    { name: 'Norway', uuid: '1b64cb1a-2830-36ba-8868-b7fb3f8cd021', code: 'NO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Norway.svg' },
    { name: 'Poland', uuid: '1f681d4a-3882-3db3-8f0a-3cc40f59e0bc', code: 'PL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Poland.svg' },
    { name: 'Russia', uuid: 'f3dbbcf9-42b9-3870-ae6a-b68e0d47d483', code: 'RU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Russia.svg' },
    { name: 'Sint Maarten (Dutch Part)', uuid: 'c7d4543d-8f19-365c-a258-f1fe90ff7ac5', code: 'SX', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Sint_Maarten.svg' },
    { name: 'South Africa', uuid: '98e3b2e5-7977-3315-bbff-4b3f885df43f', code: 'ZA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Africa.svg' },
    { name: 'South Korea', uuid: 'b9f7d640-46e8-313e-b158-ded6d18593b3', code: 'KR', url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg' },
    { name: 'Spain', uuid: 'a81ec452-f47f-38a4-a9b8-3e449a5b3c37', code: 'ES', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Spain.svg' },
    { name: 'Svalbard and Jan Mayen', uuid: '32f9a3f3-046f-355f-b4dc-5158d71957c8', code: 'SJ', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Norway.svg' },
    { name: 'Sweden', uuid: '23d10872-f5ae-3f47-af3b-8311eb8ea338', code: 'SE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sweden.svg' },
    { name: 'Switzerland', uuid: '1333ff06-8e3d-3c8e-9f3a-13a2a38b41df', code: 'CH', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Switzerland_%28Pantone%29.svg' },
    { name: 'United Kingdom', uuid: '8a754a16-0027-3a29-b6d7-2b40ea0481ed', code: 'GB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_Kingdom.svg' },
    { name: 'United States', uuid: '489ce91b-6658-3307-9877-795b68554c98', code: 'US', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_States.svg' },
    { name: 'United States Minor Outlying Islands', uuid: '4e8596fe-cbee-34ce-8b35-1f3c9bc094d6', code: 'UM', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Flag_of_the_United_States_%28DDD-F-416E_specifications%29.svg' },
    { name: 'U.S. Virgin Islands', uuid: 'f33958ac-4198-3ce8-a751-1c44d9b4063a', code: 'VI', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Flag_of_the_United_States_Virgin_Islands.svg' },
    { name: 'Vatican City', uuid: '289ea252-a5ae-3dbe-8857-c771a499df18', code: 'VA', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_Vatican_City_%282023–present%29.svg' },
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
