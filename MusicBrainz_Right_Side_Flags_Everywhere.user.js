// ==UserScript==
// @name         MusicBrainz: Right Side Flags Everywhere
// @namespace    https://github.com/Lotheric/metabrainz-userscripts/
// @version      2026-10-09.0749
// @description  Replaces MusicBrainz country/region flags with Wikimedia SVGs on the right side keeping aspect ratio.
// @downloadURL  https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_Right_Side_Flags_Everywhere.user.js
// @updateURL    https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_Right_Side_Flags_Everywhere.user.js
// @author       Lotheric
// @tag          ai-created
// @icon         https://community.metabrainz.org/user_avatar/community.metabrainz.org/lotheric/288/88429_2.png
// @match        https://musicbrainz.org/*
// @match        https://beta.musicbrainz.org/*
// @grant        GM_xmlhttpRequest
// @connect      commons.wikimedia.org
// @connect      upload.wikimedia.org
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const ALL_FLAGS_RAW = [
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
    { name: 'Argentina', uuid: '0df04709-c7d8-3b55-a6ea-f3e5069a947b', code: 'AR', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg' },
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
    { name: 'Bonaire, Sint Eustatius and Saba', uuid: 'fa3bd744-11d5-3ce1-ad1a-0254f178f9b1', code: 'BQ', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Flag_of_Bonaire.svg' },
    { name: 'Bosnia and Herzegovina', uuid: 'f2b64f81-6d36-35b3-94b9-5ba53d693914', code: 'BA', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Bosnia_and_Herzegovina.svg' },
    { name: 'Botswana', uuid: 'e5e11b08-d26d-341c-af28-69d3c26607f7', code: 'BW', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Botswana.svg' },
    { name: 'Bouvet Island', uuid: '3413ecd3-a1f0-3e21-a226-d9ff3ed480b7', code: 'BV', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Norway.svg' },
    { name: 'Brazil', uuid: 'f45b47f8-5796-386e-b172-6c31b009a5d8', code: 'BR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Brazil.svg' },
    { name: 'British Indian Ocean Territory', uuid: '41c97db3-0719-363f-ad0b-79451e0f381b', code: 'IO', url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Flag_of_the_British_Indian_Ocean_Territory_2025.svg' },
    { name: 'British Virgin Islands', uuid: '8562c2e5-eabb-3fad-96f2-f536a93a2957', code: 'VG', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_the_British_Virgin_Islands.svg' },
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
    { name: 'Curaçao', uuid: '53ccc8be-1551-3e28-965b-7f95465f2093', code: 'CW', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Flag_of_Curaçao.svg' },
    { name: 'Cyprus', uuid: 'a75b525f-8c01-31f6-975e-4a32a2b001d5', code: 'CY', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Cyprus.svg' },
    { name: 'Czechia', uuid: '51d34c28-61bf-3d21-849f-7492672a9d44', code: 'CZ', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg' },
    { name: 'Czechoslovakia', uuid: '88f49821-05a3-3bbc-a24b-bbd6b918c07b', code: 'XC', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg' },
    { name: 'Democratic Republic of the Congo', uuid: 'd1733e16-9064-3181-961d-d56f8599969b', code: 'CD', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg' },
    { name: 'Denmark', uuid: '4757b525-2a60-324a-b060-578765d2c993', code: 'DK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Denmark.svg' },
    { name: 'Djibouti', uuid: 'aa560de1-9e56-38ab-8d20-6133be7f3f2a', code: 'DJ', url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Flag_of_Djibouti.svg' },
    { name: 'Dominica', uuid: '9898ec17-2174-3a61-9e3b-3f51b3ee4de1', code: 'DM', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Dominica.svg' },
    { name: 'Dominican Republic', uuid: '696cb3e0-5084-30ab-9916-65ece70adbf6', code: 'DO', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_the_Dominican_Republic.svg' },
    { name: 'East Germany', uuid: 'd907b0ac-2956-386f-a246-62d55779aae1', code: 'XG', url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Flag_of_the_German_Democratic_Republic.svg' },
    { name: 'Ecuador', uuid: '967abc0e-f680-3cde-95d0-0b79b977d410', code: 'EC', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Flag_of_Ecuador.svg' },
    { name: 'Egypt', uuid: '8e0551f2-95c2-3cc0-a0a9-f2d344f10667', code: 'EG', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg' },
    { name: 'El Salvador', uuid: 'f2fa4bfb-97aa-3db4-8d49-cc64969ce1a7', code: 'SV', url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Flag_of_El_Salvador.svg' },
    { name: 'Equatorial Guinea', uuid: '218e28fc-7e19-3700-b4d5-5d9199a59418', code: 'GQ', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Equatorial_Guinea.svg' },
    { name: 'Eritrea', uuid: '2005d841-29df-3445-8b5c-c981de756bd3', code: 'ER', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Flag_of_Eritrea.svg' },
    { name: 'Estonia', uuid: 'e1c1215f-dcc0-35b4-b840-d2ca2151593b', code: 'EE', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Flag_of_Estonia.svg' },
    { name: 'Eswatini', uuid: '564741c6-943e-313b-86fa-9819d595281b', code: 'SZ', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_Eswatini.svg' },
    { name: 'Ethiopia', uuid: '96699ab4-4bbf-332e-b037-b0119821f792', code: 'ET', url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Ethiopia.svg' },
    { name: 'Europe', uuid: '89a675c2-3e37-3518-b83c-418bad59a85a', code: 'XE', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg' },
    { name: 'Falkland Islands', uuid: 'baa270d6-bb10-38d1-87bd-42a82b4efa9c', code: 'FK', url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_Falkland_Islands.svg' },
    { name: 'Faroe Islands', uuid: '9ed3be5f-d54c-3add-a6a6-76c0cca54fd8', code: 'FO', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Flag_of_the_Faroe_Islands.svg' },
    { name: 'Federated States of Micronesia', uuid: 'aabae773-4997-37ba-950a-394c06847631', code: 'FM', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Flag_of_the_Federated_States_of_Micronesia.svg' },
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
    { name: 'Italy', uuid: 'c6500277-9a3d-349b-bf30-41afdbf42add', code: 'IT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Italy.svg' },
    { name: 'Jamaica', uuid: '2dd47a64-91d5-3b13-bc94-80043ed063d7', code: 'JM', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_Jamaica.svg' },
    { name: 'Japan', uuid: '2db42837-c832-3c27-b4a3-08198f75693c', code: 'JP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Japan.svg' },
    { name: 'Jersey', uuid: '74c0ac9d-cda7-38be-a0c9-43611c5779dc', code: 'JE', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Flag_of_Jersey.svg' },
    { name: 'Jordan', uuid: '2e40127e-0b8a-3a01-bfbc-58c7fcdba532', code: 'JO', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Jordan.svg' },
    { name: 'Kazakhstan', uuid: '92d52542-3363-351c-a8b6-d991e0bccb8f', code: 'KZ', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg' },
    { name: 'Kenya', uuid: '023da4a0-acee-3fb1-b91e-5de74ccf787b', code: 'KE', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Kenya.svg' },
    { name: 'Kiribati', uuid: '2b425457-0a4f-3282-9d2f-0a0e0f7db2e5', code: 'KI', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kiribati.svg' },
    { name: 'Kosovo', uuid: '7b6ae6b7-6f4f-43df-aab8-0c72531ea8ae', code: 'XK', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Flag_of_Kosovo.svg' },
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
    { name: 'Martinique', uuid: 'b939dcaa-4729-34e0-a398-d22fba4407cd', code: 'MQ', url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Flag-of-Martinique.svg' },
    { name: 'Mauritania', uuid: '657e69c5-cda0-3592-9d39-85b55610bc40', code: 'MR', url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Flag_of_Mauritania.svg' },
    { name: 'Mauritius', uuid: 'bb019165-42ef-3470-bcb8-36d1b45e4bc1', code: 'MU', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Mauritius.svg' },
    { name: 'Mayotte', uuid: '00ff2645-3ec9-36d6-9ea9-757363641c83', code: 'YT', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Flag_of_Mayotte_%28local%29.svg' },
    { name: 'Mexico', uuid: '3e08b2cd-69f3-317c-b1e4-e71be581839e', code: 'MX', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Mexico.svg' },
    { name: 'Moldova', uuid: '560ddb6d-4304-3938-8407-c96605226fad', code: 'MD', url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_Moldova.svg' },
    { name: 'Monaco', uuid: '6f26d528-4467-3ecb-b105-10daf3466b40', code: 'MC', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Monaco.svg' },
    { name: 'Mongolia', uuid: '84360c54-1763-3146-ae38-a439c72fd4ea', code: 'MN', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Mongolia.svg' },
    { name: 'Montenegro', uuid: '6f8faf25-44cb-313b-9162-77145cdc192d', code: 'ME', url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Flag_of_Montenegro.svg' },
    { name: 'Montserrat', uuid: '290ea438-1cb6-35e1-9755-6ab123214293', code: 'MS', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Montserrat.svg' },
    { name: 'Morocco', uuid: 'b84d8617-249a-3a06-849d-fc5c25e2249b', code: 'MA', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg' },
    { name: 'Mozambique', uuid: '325ce9a0-d58f-3564-b24e-647b33098767', code: 'MZ', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Mozambique.svg' },
    { name: 'Myanmar', uuid: 'fb1fb575-39ee-34d8-a744-6a880700fd73', code: 'MM', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Flag_of_Myanmar.svg' },
    { name: 'Namibia', uuid: 'cd4fadac-d701-3401-8516-420de2cb4e5c', code: 'NA', url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_Namibia.svg' },
    { name: 'Nauru', uuid: '7784f515-5886-3831-9b33-a7f665795d7f', code: 'NR', url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Flag_of_Nauru.svg' },
    { name: 'Nepal', uuid: '8815c87e-cf3f-362c-a5c6-05ce853a4c79', code: 'NP', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Flag_of_Nepal_%28with_spacing%2C_aspect_ratio_4-3%29.svg' },
    { name: 'Netherlands', uuid: 'ef1b7cc0-cd26-36f4-8ea0-04d9623786c7', code: 'NL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Netherlands.svg' },
    { name: 'Netherlands Antilles', uuid: 'c741c28e-cbec-3977-88c8-583a8af62522', code: 'AN', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_the_Netherlands_Antilles_%281986–2010%29.svg' },
    { name: 'New Caledonia', uuid: '404fc992-ba17-39ac-a283-20f0b7cbbb60', code: 'NC', url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_FLNKS.svg' },
    { name: 'New Zealand', uuid: '8524c7d9-f472-3890-a458-f28d5081d9c4', code: 'NZ', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg' },
    { name: 'Nicaragua', uuid: 'd2b87acd-06ce-3c71-b3ff-a35d914bbabe', code: 'NI', url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Nicaragua.svg' },
    { name: 'Niger', uuid: 'f27e792b-ddd2-3a70-bdd4-41fb11534b57', code: 'NE', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Flag_of_Niger.svg' },
    { name: 'Nigeria', uuid: '1e23d84b-202e-3fc8-8c49-debc71e9eb16', code: 'NG', url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg' },
    { name: 'Niue', uuid: '7fc2feb2-0d33-31ef-b496-b812a4dd2965', code: 'NU', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Niue.svg' },
    { name: 'Norfolk Island', uuid: 'a2b3b8cb-79e8-3c26-8a2a-3ccc7dd80cda', code: 'NF', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Norfolk_Island.svg' },
    { name: 'Northern Mariana Islands', uuid: '9a84fea2-1c1f-3908-a44a-6fa2b6fa7b26', code: 'MP', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Flag_of_the_Northern_Mariana_Islands.svg' },
    { name: 'North Korea', uuid: '445e806f-2e04-3f9a-89eb-ef5c4e97b365', code: 'KP', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Flag_of_North_Korea_%2820-33%29.svg' },
    { name: 'North Macedonia', uuid: 'fa75cdb9-cbc4-35de-8bf4-a21e7b811484', code: 'MK', url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_North_Macedonia.svg' },
    { name: 'Norway', uuid: '6743d351-6f37-3049-9724-5041161fff4d', code: 'NO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Norway.svg' },
    { name: 'Oman', uuid: '7ccdff29-2e00-3e50-9520-b9ea1e918bc2', code: 'OM', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Oman.svg' },
    { name: 'Pakistan', uuid: '7c87112d-504d-31f1-8147-11ff45fc3bfd', code: 'PK', url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg' },
    { name: 'Palau', uuid: '9d800529-1ef8-39bb-9e42-1fa74f2eac97', code: 'PW', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Palau.svg' },
    { name: 'Palestine', uuid: '7d24dd34-a00f-37a1-8307-f2ef1dd3dbcd', code: 'PS', url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_Palestine.svg' },
    { name: 'Panama', uuid: '6f85633b-dff4-3fb4-babd-fb89b3628041', code: 'PA', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Flag_of_Panama.svg' },
    { name: 'Papua New Guinea', uuid: '2366f623-b236-3073-bbfe-c26d6d6f195f', code: 'PG', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Flag_of_Papua_New_Guinea.svg' },
    { name: 'Paraguay', uuid: '0a750c98-a7a5-3d55-bd52-f6e9011b1537', code: 'PY', url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_Paraguay.svg' },
    { name: 'Peru', uuid: '719f6082-95c7-3dd5-9503-e143010a6cc1', code: 'PE', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg' },
    { name: 'Philippines', uuid: '786532a5-2e36-315a-bdf2-221dc1b64b72', code: 'PH', url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_the_Philippines.svg' },
    { name: 'Pitcairn', uuid: '27b5df20-d817-3126-b3a0-1be6a75f7496', code: 'PN', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_the_Pitcairn_Islands.svg' },
    { name: 'Poland', uuid: 'dd7f80c8-f017-3d01-8608-2a8c9c32b954', code: 'PL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Poland.svg' },
    { name: 'Portugal', uuid: '781b0c54-3d54-362d-a941-8a617def4992', code: 'PT', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Flag_of_Portugal_%28official%29.svg' },
    { name: 'Puerto Rico', uuid: '3906cf32-00a7-32df-93cc-4710c5f5a542', code: 'PR', url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Flag_of_Puerto_Rico.svg' },
    { name: 'Qatar', uuid: '348dcc25-7bb6-3f75-8739-97eabc84a330', code: 'QA', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Qatar.svg' },
    { name: 'Réunion', uuid: '6de750e8-8280-37cf-bd98-0dd800419a18', code: 'RE', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Proposed_flag_of_Réunion_%28VAR%29.svg' },
    { name: 'Romania', uuid: '61ed84b8-5a10-30a7-8376-ccd51801d6d1', code: 'RO', url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Romania.svg' },
    { name: 'Russia', uuid: '1f1fc3a4-9500-39b8-9f10-f0a465557eef', code: 'RU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Russia.svg' },
    { name: 'Rwanda', uuid: '5921efcf-344c-3e55-829d-34fca714fcde', code: 'RW', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_Rwanda.svg' },
    { name: 'Saint Barthélemy', uuid: '47a4fef9-c697-3b37-8978-a3bcef251eb4', code: 'BL', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Saint_Barthélemy_%28local%29.svg' },
    { name: 'Saint Helena, Ascension and Tristan da Cunha', uuid: '6a0bbdbb-dc50-36f0-98a9-49beadb9d0b2', code: 'SH', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg' },
    { name: 'Saint Kitts and Nevis', uuid: 'b1439904-121a-38fb-8708-0573cb42e2ef', code: 'KN', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Saint_Kitts_and_Nevis.svg' },
    { name: 'Saint Lucia', uuid: '178709ab-9e22-39ae-a93c-55e66a8183c2', code: 'LC', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Saint_Lucia.svg' },
    { name: 'Saint Martin (French Part)', uuid: 'cf9b9b79-1ebc-3b62-9e86-7cf03fb7d548', code: 'MF', url: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg' },
    { name: 'Saint Pierre and Miquelon', uuid: '47e97aee-071c-397c-a5d4-323d2b643303', code: 'PM', url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Flag_of_Saint-Pierre_and_Miquelon.svg' },
    { name: 'Saint Vincent and The Grenadines', uuid: '7f9f87ec-3c1e-300d-9bb8-fa93f0754e6b', code: 'VC', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Flag_of_Saint_Vincent_and_the_Grenadines.svg' },
    { name: 'Samoa', uuid: '2cc3ea35-b05a-3ec0-a5a2-88e8a482854a', code: 'WS', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Samoa.svg' },
    { name: 'San Marino', uuid: 'd4dd44b6-fa46-30f5-b331-ce9e88d06242', code: 'SM', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Flag_of_San_Marino.svg' },
    { name: 'Sao Tome and Principe', uuid: 'dcb0e217-84cb-3772-b98f-a7a7a1dbe185', code: 'ST', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_São_Tomé_and_Príncipe.svg' },
    { name: 'Saudi Arabia', uuid: '9705be0d-51fb-3990-8726-ec9f56c66ba0', code: 'SA', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg' },
    { name: 'Senegal', uuid: '122bb81f-191e-3798-8be2-4b54ffd7ffa4', code: 'SN', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Senegal.svg' },
    { name: 'Serbia', uuid: '424c1b50-57f8-34af-ab97-313e2ad40058', code: 'RS', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Serbia.svg' },
    { name: 'Serbia and Montenegro', uuid: '5ebb5384-b92a-3ada-8c8a-363d5075fd44', code: 'CS', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_Serbia_and_Montenegro_%281992–2006%29.svg' },
    { name: 'Seychelles', uuid: 'be43ea01-053a-3b23-b03d-2df8317a57ff', code: 'SC', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Seychelles.svg' },
    { name: 'Sierra Leone', uuid: '2b547f54-a97c-3481-9625-7ad9a670b1e6', code: 'SL', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_Sierra_Leone.svg' },
    { name: 'Singapore', uuid: 'aa344640-fd57-3960-afb4-84d0d3b69d3d', code: 'SG', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Singapore.svg' },
    { name: 'Sint Maarten (Dutch Part)', uuid: 'c7d4543d-8f19-365c-a258-f1fe90ff7ac5', code: 'SX', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Sint_Maarten.svg' },
    { name: 'Slovakia', uuid: 'eb52ca74-dd11-37a1-a3fa-154430bf2df2', code: 'SK', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Slovakia.svg' },
    { name: 'Slovenia', uuid: '5b0b6225-584c-3942-b69d-5efceb9989af', code: 'SI', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Slovenia.svg' },
    { name: 'Solomon Islands', uuid: '7fe4001e-eda5-3b5b-bbd8-0f773e76d09c', code: 'SB', url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Flag_of_the_Solomon_Islands.svg' },
    { name: 'Somalia', uuid: 'd58b9eb1-c88d-3529-bb4c-b66c96b18c45', code: 'SO', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Somalia.svg' },
    { name: 'South Africa', uuid: '50cc7852-862e-30ae-aa82-385fe7135b7f', code: 'ZA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Africa.svg' },
    { name: 'South Georgia and the South Sandwich Islands', uuid: '38ce2215-162b-3f3c-af41-34800017e1d8', code: 'GS', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Flag_of_South_Georgia_and_the_South_Sandwich_Islands.svg' },
    { name: 'South Korea', uuid: 'b9f7d640-46e8-313e-b158-ded6d18593b3', code: 'KR', url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg' },
    { name: 'South Sudan', uuid: 'd500d5dc-e4b0-30cb-92bc-1bc79ac2f5b4', code: 'SS', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flag_of_South_Sudan.svg' },
    { name: 'Soviet Union', uuid: '32f90933-b4b4-3248-b98c-e573d5329f57', code: 'SU', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_the_Soviet_Union.svg' },
    { name: 'Spain', uuid: '471c46a7-afc5-31c4-923c-d0444f5053a4', code: 'ES', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Spain.svg' },
    { name: 'Sri Lanka', uuid: '6e2d562d-a754-3036-8484-7ac576606e27', code: 'LK', url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_Sri_Lanka.svg' },
    { name: 'Sudan', uuid: '038ad5ba-df6d-35ad-ba12-efe6edd7d0a4', code: 'SD', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Sudan.svg' },
    { name: 'Suriname', uuid: '9d1049fb-7b2d-3862-a26d-3cc58c8c7b5b', code: 'SR', url: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Flag_of_Suriname.svg' },
    { name: 'Svalbard and Jan Mayen', uuid: '32f9a3f3-046f-355f-b4dc-5158d71957c8', code: 'SJ', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Norway.svg' },
    { name: 'Sweden', uuid: '23d10872-f5ae-3f0c-bf55-332788a16ecb', code: 'SE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sweden.svg' },
    { name: 'Switzerland', uuid: '1333ff06-8e3d-3c8e-9f3a-13a2a38b41df', code: 'CH', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Switzerland_%28Pantone%29.svg' },
    { name: 'Syria', uuid: '18086faa-7f75-3ca3-a5bb-a77a83d4b200', code: 'SY', url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Syria_%282025-%29.svg' },
    { name: 'Taiwan', uuid: '41637cec-9a4f-389c-86d2-fc6abf3357b5', code: 'TW', url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Flag_of_the_Republic_of_China.svg' },
    { name: 'Tajikistan', uuid: '8259e91f-10fa-3c38-92fb-8e6822c279d5', code: 'TJ', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Tajikistan.svg' },
    { name: 'Tanzania', uuid: 'c2676abd-2ac7-351a-94a9-a802b3434737', code: 'TZ', url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_Tanzania.svg' },
    { name: 'Thailand', uuid: 'ce209e56-cda5-358e-96db-830e3405b675', code: 'TH', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg' },
    { name: 'Timor-Leste', uuid: '738aed7d-cc30-3a90-af20-21477ba1e8cc', code: 'TL', url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_East_Timor.svg' },
    { name: 'Togo', uuid: '9a4a20b1-eff0-364a-a157-dc709b07eadc', code: 'TG', url: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Flag_of_Togo.svg' },
    { name: 'Tokelau', uuid: '756f26ff-2bc5-3d25-b429-6873ccbe160d', code: 'TK', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Flag_of_Tokelau.svg' },
    { name: 'Tonga', uuid: 'a2b8e506-3570-3a56-826e-939049c59428', code: 'TO', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Tonga.svg' },
    { name: 'Trinidad and Tobago', uuid: '6c290168-f3b9-3adb-9889-b856feb2c26c', code: 'TT', url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Flag_of_Trinidad_and_Tobago.svg' },
    { name: 'Tunisia', uuid: '58955071-67c1-3491-8dec-48d28f824bda', code: 'TN', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg' },
    { name: 'Türkiye', uuid: 'd3be28b4-41f7-3752-8a05-ed45e1d1e492', code: 'TR', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg' },
    { name: 'Turkmenistan', uuid: '98e38a45-b90e-3575-943e-23e26ce3a69f', code: 'TM', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Turkmenistan.svg' },
    { name: 'Turks and Caicos Islands', uuid: 'a2d01b31-5184-382e-aab5-63b5944195b7', code: 'TC', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_the_Turks_and_Caicos_Islands.svg' },
    { name: 'Tuvalu', uuid: '529117db-25de-3d09-9722-b54937a17590', code: 'TV', url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_Tuvalu.svg' },
    { name: 'Uganda', uuid: '1ac655f1-12d1-351a-a2b2-8404167e0e0b', code: 'UG', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Uganda.svg' },
    { name: 'Ukraine', uuid: '904768d0-61ca-3c40-93ac-93adc36fef4b', code: 'UA', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg' },
    { name: 'United Arab Emirates', uuid: 'fe40c648-ba74-3e17-b768-58181d5ee563', code: 'AE', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg' },
    { name: 'United Kingdom', uuid: '8a754a16-0027-3a29-b6d7-2b40ea0481ed', code: 'GB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_Kingdom.svg' },
    { name: 'United States', uuid: '489ce91b-6658-3307-9877-795b68554c98', code: 'US', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_States.svg' },
    { name: 'United States Minor Outlying Islands', uuid: '4e8596fe-cbee-34ce-8b35-1f3c9bc094d6', code: 'UM', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Flag_of_the_United_States_%28DDD-F-416E_specifications%29.svg' },
    { name: 'Uruguay', uuid: 'ea88d395-87c9-3c47-b49a-114cad41fd39', code: 'UY', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Uruguay.svg' },
    { name: 'U.S. Virgin Islands', uuid: 'f33958ac-4198-3ce8-a751-1c44d9b4063a', code: 'VI', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Flag_of_the_United_States_Virgin_Islands.svg' },
    { name: 'Uzbekistan', uuid: '95c0c3ee-ed52-31c4-83e6-19ced497e6d0', code: 'UZ', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Uzbekistan.svg' },
    { name: 'Vanuatu', uuid: 'c2021af8-7645-3f38-aa1b-ada0a13d4faf', code: 'VU', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Flag_of_Vanuatu_%28official%29.svg' },
    { name: 'Vatican City', uuid: '289ea252-a5ae-3dbe-8857-c771a499df18', code: 'VA', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_Vatican_City_%282023–present%29.svg' },
    { name: 'Venezuela', uuid: '2ac90d6b-04fa-3006-8a91-89da01032365', code: 'VE', url: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Venezuela.svg' },
    { name: 'Vietnam', uuid: '0158e991-c3c6-374a-9b9d-024bbaff6980', code: 'VN', url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg' },
    { name: 'Wallis and Futuna', uuid: 'd5970cc5-1a1f-3a47-83c5-8890f5a61ec3', code: 'WF', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Flag_of_Wallis_and_Futuna.svg' },
    { name: 'Western Sahara', uuid: 'c14bc23d-d5fe-3146-9ddf-2cd78ec62d8f', code: 'EH', url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_the_Sahrawi_Arab_Democratic_Republic.svg' },
    { name: 'Worldwide', uuid: '525d4e18-3d00-31b9-a58b-a146a916de8f', code: 'XW', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/OWF_One_World_Flag_by_Thomas_Mandl.svg' },
    { name: 'Yemen', uuid: 'e8e9ecdc-19d3-360b-8f1a-9c80e6c12830', code: 'YE', url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Yemen.svg' },
    { name: 'Yugoslavia', uuid: '885dce63-c211-3033-8cf7-46cb82d440c7', code: 'YU', url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Flag_of_Yugoslavia_%281946-1992%29.svg' },
    { name: 'Zambia', uuid: 'd662dd74-1fc1-3e36-b427-bbbe29684618', code: 'ZM', url: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Zambia.svg' },
    { name: 'Zimbabwe', uuid: '691e8ad6-2cc8-3678-8495-1ac96bbede55', code: 'ZW', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Flag_of_Zimbabwe.svg' },

    // --- Albania (Counties) ---
    { name: 'Berat', uuid: 'ce027832-b77f-454a-bdda-f23d1413be4d', code: 'AL-01', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Berat.svg' },
    { name: 'Dibër', uuid: 'a2c10437-9577-4380-b0bc-982d39d3eeff', code: 'AL-09', url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/ALB_Qarku_i_Dibrës_flag.svg' },
    { name: 'Durrës', uuid: '57a05f6c-a06f-4aab-b15b-b3af43e81f6d', code: 'AL-02', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Flag_of_Durrës.svg' },
    { name: 'Elbasan', uuid: '7875bedf-e279-4081-a694-997723b26a7c', code: 'AL-03', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_Elbasan.svg' },
    { name: 'Fier', uuid: '5dd2324d-c7e1-4fd3-b273-4a1538177385', code: 'AL-04', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Fier.svg' },
    { name: 'Gjirokastër', uuid: '4e509c3c-3a6a-44cb-a1bd-4734a9964cc8', code: 'AL-05', url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Flag_of_Gjirokastër.svg' },
    { name: 'Korçë', uuid: '522a57eb-7833-440c-af9c-e7ae7fa7bc7d', code: 'AL-06', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_Korçë.svg' },
    { name: 'Kukës', uuid: 'e8bde374-c52b-4e23-be38-6015dcadb9eb', code: 'AL-07', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Flag_of_Kukës.svg' },
    { name: 'Lezhë', uuid: '46cb7215-9e42-4f8d-aa37-950217341b34', code: 'AL-08', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Lezhë.svg' },
    { name: 'Shkodër', uuid: '46daf055-87a7-4702-99a0-741eb203ead7', code: 'AL-10', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Shkodër.svg' },
    { name: 'Tiranë', uuid: '877aea20-0d89-4209-94c2-2850f421d566', code: 'AL-11', url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Flag_of_Tiranë.svg' },
    { name: 'Vlorë County', uuid: '74f8b2a3-00e5-45d8-af24-fac7fbb17cc0', code: 'AL-12', url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Flag_of_Vlorë.svg' },

    // --- Antigua and Barbuda (Dependencies) ---
    { name: 'Barbuda', uuid: '251b0c31-0b8e-491a-9c28-a44f39f97065', code: 'AG-10', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_Barbuda.svg' },
    { name: 'Redonda', uuid: '40fd601e-345d-485d-be30-76481f83fa56', code: 'AG-11', url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_the_Kingdom_of_Redonda.svg' },

    // --- Argentina (Provinces) ---
    { name: 'Buenos Aires Province', uuid: 'a6e0a033-8f5d-438b-a99c-2d956f7a9661', code: 'AR-B', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Buenos_Aires.svg' },
    { name: 'Catamarca', uuid: '213be5eb-0b5c-4989-a3f0-b86da46b435c', code: 'AR-K', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Catamarca.svg' },
    { name: 'Chaco', uuid: 'fb6648cb-ea68-43e7-9f1f-a3b561f6d076', code: 'AR-H', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_del_Chaco.svg' },
    { name: 'Chubut', uuid: '488f5013-a8a5-4503-bdbe-bbf0c3f02b53', code: 'AR-U', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_del_Chubut.svg' },
    { name: 'Córdoba', uuid: '02d22ccc-7cd3-4432-994e-95342d8b5112', code: 'AR-X', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_C%C3%B3rdoba.svg' },
    { name: 'Corrientes', uuid: 'e3e68517-4f4e-4dbe-8772-f0132fdaec46', code: 'AR-W', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Corrientes.svg' },
    { name: 'Entre Ríos', uuid: 'b6f81cac-ce4a-420e-a26e-668c121bd377', code: 'AR-E', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Entre_R%C3%ADos.svg' },
    { name: 'Formosa', uuid: 'ca91a014-c2ea-4933-afbb-2693af18c6ee', code: 'AR-P', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Formosa.svg' },
    { name: 'Jujuy', uuid: 'c0ee2b9f-66c3-4d04-9a5e-74ac1fa475b6', code: 'AR-Y', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Jujuy.svg' },
    { name: 'La Pampa', uuid: '1d48454d-7ad9-456d-8170-7a6dae2bd04d', code: 'AR-L', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_La_Pampa.svg' },
    { name: 'La Rioja', uuid: '7d71113b-34ab-4c5f-8634-0a7c645ac6a7', code: 'AR-F', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_La_Rioja.svg' },
    { name: 'Mendoza', uuid: '078142c9-cdfb-4e99-b3e8-651af6173572', code: 'AR-M', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Mendoza.svg' },
    { name: 'Misiones', uuid: 'fa83d743-10e1-40c4-8679-4746dfb81e91', code: 'AR-N', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Misiones.svg' },
    { name: 'Neuquén', uuid: '5e1ad53b-b03e-4eed-8ce3-4bc8a80192e1', code: 'AR-Q', url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Bandera_de_la_Provincia_del_Neuquen.svg' },
    { name: 'Río Negro', uuid: 'd1807821-3007-4fb4-ba90-e4da179b3f4e', code: 'AR-R', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Bandera_de_la_Provincia_del_Río_Negro.svg' },
    { name: 'Salta', uuid: '7af9d1ab-5c47-4497-afd3-80260a69d225', code: 'AR-A', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Salta.svg' },
    { name: 'San Juan', uuid: '440070a9-70c4-4aa4-b2de-dbdb80c76d39', code: 'AR-J', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_San_Juan.svg' },
    { name: 'San Luis', uuid: 'b1d26b74-30b4-4b57-9a6d-298570e097d6', code: 'AR-D', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_San_Luis.svg' },
    { name: 'Santa Cruz', uuid: 'a069aabc-e52a-4589-9dd9-42a4eb5c12a0', code: 'AR-Z', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Santa_Cruz.svg' },
    { name: 'Santa Fe', uuid: '54cad475-f076-4617-a6ac-290776bc811b', code: 'AR-S', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Santa_Fe.svg' },
    { name: 'Santiago del Estero', uuid: 'f2102dc1-43fc-4b14-8f44-f2bf8ef3d121', code: 'AR-G', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Santiago_del_Estero.svg' },
    { name: 'Tierra del Fuego', uuid: '71f74901-50a6-4240-a73b-be3f8c51d2f4', code: 'AR-V', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Tierra_del_Fuego.svg' },
    { name: 'Tucumán', uuid: '952e7230-5088-41eb-a48a-fb9608ae67b4', code: 'AR-T', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Provincia_de_Tucum%C3%A1n.svg' },
    // --- Argentina (Autonomous City) ---
    { name: 'Buenos Aires', uuid: '2bd8607d-56fe-4fa1-96e3-3badd6a98588', code: 'AR-C', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandera_de_la_Ciudad_de_Buenos_Aires.svg' },

    // --- Australia (States) ---
    { name: 'New South Wales', uuid: 'ee8fe1ca-7455-485d-afbc-064844f5ee43', code: 'AU-NSW', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_New_South_Wales.svg' },
    { name: 'Queensland', uuid: 'c1e9cc93-f223-470d-b9e1-653709de68c3', code: 'AU-QLD', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Queensland.svg' },
    { name: 'South Australia', uuid: '2b15d4df-ae71-4465-ad19-05f442a5913b', code: 'AU-SA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Australia.svg' },
    { name: 'Tasmania', uuid: '103d2eb0-d702-4235-ac02-350a9c8470bb', code: 'AU-TAS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tasmania.svg' },
    { name: 'Victoria', uuid: '09936ede-4dcc-4794-a1e7-83d3af37bf4e', code: 'AU-VIC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Victoria_%28Australia%29.svg' },
    { name: 'Western Australia', uuid: '1b1a6c07-d9bd-47d8-b1ee-772f53ec6e79', code: 'AU-WA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Western_Australia.svg' },
    // --- Australia (Territories) ---
    { name: 'Australian Capital Territory', uuid: 'f37a9e19-2e4b-4573-b65b-2ab6fcf6ea51', code: 'AU-ACT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Australian_Capital_Territory.svg' },
    { name: 'Northern Territory', uuid: 'f82f6486-960d-4bdf-b95b-e24b6c77a5ec', code: 'AU-NT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Northern_Territory.svg' },

    // --- Austria (States) ---
    { name: 'Burgenland', uuid: '8df1819e-ba9b-44a4-9550-3a099c691a4c', code: 'AT-1', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Burgenland.svg' },
    { name: 'Kärnten', uuid: '837417a1-e3fe-412a-a525-2622fd5aafa6', code: 'AT-2', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Carinthia.svg' },
    { name: 'Niederösterreich', uuid: '3daad85f-1712-476d-8c44-7a76969231ca', code: 'AT-3', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Lower_Austria.svg' },
    { name: 'Oberösterreich', uuid: '667229dd-a326-49c0-a282-bb7eb3fea5bc', code: 'AT-4', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Upper_Austria.svg' },
    { name: 'Salzburg', uuid: 'e684b527-18ff-4f84-85db-4a66f3b10dd0', code: 'AT-5', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Salzburg.svg' },
    { name: 'Steiermark', uuid: '7500e764-604e-4576-b51c-5504f0db66a8', code: 'AT-6', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Styria.svg' },
    { name: 'Tirol', uuid: '94c82f6a-70ed-485e-aaa2-5dcf11f80e98', code: 'AT-7', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tirol.svg' },
    { name: 'Vorarlberg', uuid: 'eacec681-6fb0-4e14-96a1-e181320c5c07', code: 'AT-8', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Vorarlberg.svg' },
    { name: 'Wien', uuid: 'afff1a94-a98b-4322-8874-3148139ab6da', code: 'AT-9', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Vienna.svg' },

    // --- Belgium (Regions) ---
    { name: 'Brussels', uuid: '7bda5d46-4809-41dc-a0b8-e889ff818f2e', code: 'BE-BRU', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_the_Brussels-Capital_Region.svg' },
    { name: 'Flanders', uuid: '2ea52ae1-00ee-406e-a8f1-50fb88554d24', code: 'BE-VLG', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_Flanders.svg' },
    { name: 'Wallonie', uuid: '19fcdd55-36e3-44ce-b9ed-c6c8737df44d', code: 'BE-WAL', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Wallonia.svg' },
    // --- Belgium (Provinces) ---
    { name: 'Antwerpen', uuid: 'ae8abafa-65cf-432c-86f7-70cb4c3a49b6', code: 'BE-VAN', url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Flag_of_Antwerp.svg' },
    { name: 'Brabant wallon', uuid: 'ad676ae6-5c47-4577-813a-f1c60f4a5cb8', code: 'BE-WBR', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Drapeau_Province_BE_Brabant_Wallon.svg' },
    { name: 'Hainaut', uuid: 'a7372b0c-17c9-4272-990a-b93ce702da1c', code: 'BE-WHT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Hainaut.svg' },
    { name: 'Liège', uuid: '8ddd31f9-214c-4853-a955-57687a13e643', code: 'BE-WLG', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_the_Province_of_Liège.svg' },
    { name: 'Limburg', uuid: '0a9f19dd-9453-4b94-bc6a-6116404fa8bb', code: 'BE-VLI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Limburg_%28Belgium%29.svg' },
    { name: 'Luxembourg', uuid: '563d21b7-4a8e-35e2-83a7-7804baefbfa7', code: 'BE-WLX', url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Official_flag_of_the_Arelerland.svg' },
    { name: 'Namur', uuid: '6653694e-c69c-44ad-9c40-f7913f556f55', code: 'BE-WNA', url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_Namur_Province.svg' },
    { name: 'Oost-Vlaanderen', uuid: '8db16337-f875-47dd-a9b8-cd539712ed64', code: 'BE-VOV', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Vlag_van_Oost-Vlaanderen.svg' },
    { name: 'Vlaams-Brabant', uuid: '31a26a2c-f032-46a5-a55d-7c878f3ddb05', code: 'BE-VBR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Flemish_Brabant.svg' },
    { name: 'West-Vlaanderen', uuid: '69b9ee64-44ca-4fc1-9f53-d52b9cf55dd8', code: 'BE-VWV', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_West_Flanders.svg' },

    // --- Bolivia (Departments) ---
    { name: 'Chuquisaca', uuid: '43a9410a-0dc5-47aa-9ab6-0806725f2846', code: 'BO-H', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Flag_of_Sucre_and_Chuquisaca.svg' },
    { name: 'Cochabamba', uuid: '5bba7ec1-fc21-4aa5-ba3a-ae8e7c367258', code: 'BO-C', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Cochabamba.svg' },
    { name: 'El Beni', uuid: 'bab3c66a-e15a-4d99-aab6-c79a353376ed', code: 'BO-B', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Flag_of_Beni_Department%2C_Bolivia.svg' },
    { name: 'La Paz', uuid: 'aae79a6c-cddb-45a6-b3c7-6a0cd040836c', code: 'BO-L', url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Bandera_de_La_Paz.svg' },
    { name: 'Oruro', uuid: '7f5ec938-97a3-47f2-8e85-3d4ec2aba984', code: 'BO-O', url: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Oruro.svg' },
    { name: 'Pando', uuid: 'e04294c0-8506-4505-827f-df191394dc27', code: 'BO-N', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Pando.svg' },
    { name: 'Potosí', uuid: 'f2d995c5-00b8-4752-9c58-18a96c613927', code: 'BO-P', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Potosí.svg' },
    { name: 'Santa Cruz', uuid: '183bf327-c332-4e60-941a-e251f75592fb', code: 'BO-S', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Flag_of_Santa_Cruz.svg' },
    { name: 'Tarija', uuid: '477bfd17-de30-422e-b1da-c4b41eb6a07e', code: 'BO-T', url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Flag_of_Tarija.svg' },

    // --- Bosnia and Herzegovina (Entities) ---
    { name: 'Federacija Bosna i Hercegovina', uuid: '8474c97f-3d52-4359-aecf-a9e59a177611', code: 'BA-BIH', url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Flag_of_the_Federation_of_Bosnia_and_Herzegovina_%281996–2007%29.svg' },
    { name: 'Republika Srpska', uuid: 'bdf81fc6-7f94-493d-b55a-a6a95a7873e3', code: 'BA-SRP', url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Flag_of_the_Republika_Srpska.svg' },
    // --- Bosnia and Herzegovina (Cantons) ---
    { name: 'Bosansko-podrinjski kanton', uuid: '8b1ce74f-2cd3-492a-ba95-49bb7d9f4bef', code: 'BA-05', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_Bosnian_Podrinje.svg' },
    { name: 'Hercegovačko-neretvanski kanton', uuid: 'f68eb3db-0053-49de-9895-6080fd8a5ad1', code: 'BA-07', url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Flag_of_Herzegovina-Neretva.svg' },
    { name: 'Kanton br. 10 (Livanjski kanton)', uuid: '96332e60-74ac-4be1-8794-cf271c2cef8b', code: 'BA-10', url: 'https://www.crwflags.com/fotw/images/b/ba-10.gif' },
    { name: 'Kanton Sarajevo', uuid: 'daa1d864-bbfe-4d57-a8cc-c42a099e8121', code: 'BA-09', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Sarajevo_Canton.svg' },
    { name: 'Posavski kanton', uuid: '0a744967-771e-4be9-83fe-aaa7ff8852ac', code: 'BA-02', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Flag_of_Posavina.svg' },
    { name: 'Srednjobosanski kanton', uuid: '366b3fde-d7f5-4559-9106-ff22ec7014c7', code: 'BA-06', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Central_Bosnia.svg' },
    { name: 'Tuzlanski kanton', uuid: '55e8a857-2c84-4fb9-9edd-5b4b59114a60', code: 'BA-03', url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Flag_of_Tuzla_Canton.svg' },
    { name: 'Unsko-sanski kanton', uuid: '095a5583-40f3-4ee7-9fc8-404195823369', code: 'BA-01', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Flag_of_Una-Sana.svg' },
    { name: 'Zapadnohercegovački kanton', uuid: '04fca156-7051-4824-8fde-582ca4ce083f', code: 'BA-08', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_the_Croatian_Republic_of_Herzeg-Bosnia.svg' },
    { name: 'Zeničko-dobojski kanton', uuid: '69ed1437-5c1d-46b6-ba2c-ddb27be7fa8c', code: 'BA-04', url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Flag_of_Zenica-Doboj.svg' },

    // --- Brazil (States) ---
    { name: 'Acre', uuid: '93ca9825-7ed3-49e9-9292-52c1c9473ca0', code: 'BR-AC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Acre.svg' },
    { name: 'Alagoas', uuid: 'b9591e39-f170-4bf9-9bbb-aa6f2a83a425', code: 'BR-AL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Alagoas.svg' },
    { name: 'Amapá', uuid: '1d3e8e50-6e00-4ae1-9f6e-f88afd78dd73', code: 'BR-AP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Amap%C3%A1.svg' },
    { name: 'Amazonas', uuid: '76ae6091-874d-41c7-835e-af474f59aded', code: 'BR-AM', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Amazonas.svg' },
    { name: 'Bahia', uuid: '943fc54c-e643-4a16-926d-08e0dedf5667', code: 'BR-BA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_da_Bahia.svg' },
    { name: 'Ceará', uuid: 'd8b56a71-babe-4df4-a1b6-e35d797545ac', code: 'BR-CE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Cear%C3%A1.svg' },
    { name: 'Espírito Santo', uuid: '4c754e1f-701d-41a3-87d6-6611b5f93a58', code: 'BR-ES', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Esp%C3%ADrito_Santo.svg' },
    { name: 'Goiás', uuid: 'b0d88ac8-5a62-4b60-bcb0-f0fff28f5852', code: 'BR-GO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Goi%C3%A1s.svg' },
    { name: 'Maranhão', uuid: '38791b5a-1780-453b-986d-a6049918052c', code: 'BR-MA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Maranh%C3%A3o.svg' },
    { name: 'Mato Grosso', uuid: '6d26cbd7-ae74-45b9-b0ec-fcb92f9d4a5b', code: 'BR-MT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Mato_Grosso.svg' },
    { name: 'Mato Grosso do Sul', uuid: 'c6a3af9e-618b-461e-8f87-380656be4fb9', code: 'BR-MS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Mato_Grosso_do_Sul.svg' },
    { name: 'Minas Gerais', uuid: '9a660fa5-fba2-4172-86bc-62ce5de96250', code: 'BR-MG', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Minas_Gerais.svg' },
    { name: 'Pará', uuid: 'f77a7f18-a016-4d7b-9fd3-445bec361e77', code: 'BR-PA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Par%C3%A1.svg' },
    { name: 'Paraíba', uuid: '5da34452-6bae-45e5-9496-f9bf24029f06', code: 'BR-PB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_da_Para%C3%ADba.svg' },
    { name: 'Paraná', uuid: 'bb7aee72-73c5-43df-b5f2-02f87382b1bf', code: 'BR-PR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Paran%C3%A1.svg' },
    { name: 'Pernambuco', uuid: '15060f0d-3bfc-4772-8299-bd45db706a40', code: 'BR-PE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Pernambuco.svg' },
    { name: 'Piauí', uuid: 'ae67512d-8256-4b13-bb2a-98e2859dc7cd', code: 'BR-PI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Piau%C3%AD.svg' },
    { name: 'Rio de Janeiro', uuid: '7a317b09-3948-46f2-99da-a14355d6fff7', code: 'BR-RJ', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_estado_do_Rio_de_Janeiro.svg' },
    { name: 'Rio Grande do Norte', uuid: '0c07f518-0ef5-4844-a920-a8daf76c09e3', code: 'BR-RN', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Rio_Grande_do_Norte.svg' },
    { name: 'Rio Grande do Sul', uuid: '090f1b02-a616-4c9a-846a-e451e90ffed8', code: 'BR-RS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Rio_Grande_do_Sul.svg' },
    { name: 'Rondônia', uuid: '562909d8-4ee2-4147-bab5-28137a7c8674', code: 'BR-RO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Rond%C3%B4nia.svg' },
    { name: 'Roraima', uuid: '4d494362-7ba2-4390-8399-752943e4cd6e', code: 'BR-RR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Roraima.svg' },
    { name: 'Santa Catarina', uuid: '04c6bb81-fafb-4278-b0a2-f42d200b8ad5', code: 'BR-SC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Santa_Catarina.svg' },
    { name: 'São Paulo', uuid: '204dd468-f79e-475d-94a7-64e417246439', code: 'BR-SP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_estado_de_S%C3%A3o_Paulo.svg' },
    { name: 'Sergipe', uuid: '280a422f-abed-422c-99af-27ecd256de70', code: 'BR-SE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Sergipe.svg' },
    { name: 'Tocantins', uuid: 'e6deeab9-5999-4028-b353-968a39b8b707', code: 'BR-TO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Tocantins.svg' },
    // --- Brazil (Federal District) ---
    { name: 'Distrito Federal', uuid: '0fae69cb-db5a-438c-9cbd-af63f5534e89', code: 'BR-DF', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Distrito_Federal_%28Brasil%29.svg' },

    // --- Canada (Provinces) ---
    { name: 'Alberta', uuid: '11e1b699-4e38-49b0-bb24-5092e0f8f4ad', code: 'CA-AB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Alberta.svg' },
    { name: 'British Columbia', uuid: 'e10dada7-934d-4a38-a20f-44cc6fa4672d', code: 'CA-BC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_British_Columbia.svg' },
    { name: 'Manitoba', uuid: '8af30521-c317-48f2-b18d-536e248521e1', code: 'CA-MB', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Manitoba.svg' },
    { name: 'New Brunswick', uuid: '0f05e521-4a8a-40ce-b6a1-80e0f3d5ea6d', code: 'CA-NB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_New_Brunswick.svg' },
    { name: 'Newfoundland and Labrador', uuid: '645a2090-c498-48ce-a58e-11379aaac827', code: 'CA-NL', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Newfoundland_and_Labrador.svg' },
    { name: 'Nova Scotia', uuid: '4a91ccc7-ea89-4dc6-98f4-c8044123a032', code: 'CA-NS', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Nova_Scotia.svg' },
    { name: 'Ontario', uuid: '2747553f-b44d-44c4-a7c3-b67412b6f10b', code: 'CA-ON', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Ontario.svg' },
    { name: 'Prince Edward Island', uuid: 'cffdb245-ee87-4b2f-8375-fce5d9596455', code: 'CA-PE', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Flag_of_Prince_Edward_Island.svg' },
    { name: 'Québec', uuid: 'a510b9b1-404d-4e23-8db8-0f6585909ed8', code: 'CA-QC', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg' },
    { name: 'Saskatchewan', uuid: '1451d358-6dff-413d-884e-1db2d4fd03aa', code: 'CA-SK', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_Saskatchewan.svg' },
    // --- Canada (Territories) ---
    { name: 'Northwest Territories', uuid: '77acc8b0-2a12-4831-b142-d5ea39702424', code: 'CA-NT', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_the_Northwest_Territories.svg' },
    { name: 'Nunavut', uuid: '79c3204c-1cd8-4906-a2d7-43aeb997927c', code: 'CA-NU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Flag_of_Nunavut.svg' },
    { name: 'Yukon', uuid: '97aef002-a327-4237-a2d3-25244d425d17', code: 'CA-YT', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Yukon.svg' },
    // --- Canada (Regions) ---
    { name: 'Cape Breton', uuid: '40713e43-6184-4248-99b9-5f15103b47de', code: 'CA-NS-CB', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Cape_Breton_Island_Flag_%28Eagle%29.svg' },
    { name: 'Labrador', uuid: '275bdbd4-3bcd-4b27-8316-cd2f0da765c3', code: 'CA-NL-LB', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Labrador.svg' },
    { name: 'Nunavik', uuid: '48691d34-cdf3-4f07-a84f-7cbab5dba7c8', code: 'CA-QC-NU', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Nunavik_%28Thomassie_Mangiok%29.svg' },
    { name: 'Saguenay–Lac-Saint-Jean', uuid: 'a9595f2a-0211-4e1f-a446-0c61dc0aeacb', code: 'CA-QC-02', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Saguenay-Lac-Saint-Jean.svg' },
    // --- Canada (Municipalities) ---
    { name: 'Abbotsford', uuid: '0683f430-dd77-4b5a-a55b-0a0339c812d5', code: 'CA-BC-ABB', url: 'https://upload.wikimedia.org/wikipedia/en/a/ab/Flag_of_Abbotsford%2C_BC.svg' },
    { name: 'Banff', uuid: '2ba91894-77db-4c5d-a732-e27016b00ddf', code: 'CA-AB-BAN', url: 'https://upload.wikimedia.org/wikipedia/en/9/98/Flag_of_Banff_AB.svg' },
    { name: 'Barrie', uuid: '16e3bb88-5eca-4eef-9314-9598295bce02', code: 'CA-ON-BAR', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Flag_of_Barrie.svg' },
    { name: 'Brampton', uuid: '438757bf-3e86-4be6-9e3f-0145b382a81b', code: 'CA-ON-BRA', url: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Brampton.svg' },
    { name: 'Brantford', uuid: '5d5d5ab7-802a-4cde-817b-ffa75c0a840d', code: 'CA-ON-BRN', url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Brantford.png' },
    { name: 'Brockville', uuid: 'b534a62d-480b-4659-9c4e-20ddbff6a1a2', code: 'CA-ON-BRO', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Flag_of_Brockville.gif' },
    { name: 'Burnaby', uuid: '702e46f0-6ffb-4890-987e-e9533523bb72', code: 'CA-BC-BUR', url: 'https://upload.wikimedia.org/wikipedia/en/7/72/Flag_of_Burnaby%2C_BC.svg' },
    { name: 'Calgary', uuid: 'f88bfae6-8a35-4bed-bd37-8ea16ba2b9c6', code: 'CA-AB-CAL', url: 'https://upload.wikimedia.org/wikipedia/en/a/a8/Flag_of_Calgary_%281983%29.svg' },
    { name: 'Cambridge', uuid: '8d03a861-c04f-4b66-94ac-302c50b5db8a', code: 'CA-ON-CAM', url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Flag_of_Cambridge.png' },
    { name: 'Charlottetown', uuid: '17b6837b-bd65-4ad9-8440-c28794348704', code: 'CA-PE-CHA', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Charlottetown.svg' },
    { name: 'Coquitlam', uuid: '3858b634-1e70-48dc-bf66-2c3ddef28429', code: 'CA-BC-COQ', url: 'https://upload.wikimedia.org/wikipedia/en/a/ac/Flag_of_Coquitlam_BC.svg' },
    { name: 'Edmonton', uuid: '0197a505-d351-475f-9e6d-eda15a83a235', code: 'CA-AB-EDM', url: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Flag_of_Edmonton.svg' },
    { name: 'Edmundston', uuid: 'fa436e01-7fa6-420d-a129-f367ee5c8c5f', code: 'CA-NB-EDM', url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Flag_of_Edmundston.svg' },
    { name: 'Etobicoke', uuid: '48ead7d5-4c6d-4619-988f-e048cfd0db8a', code: 'CA-ON-ETO', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Etobicoke%2C_Ontario_%281995–1997%29.svg' },
    { name: 'Fort St. John', uuid: 'e53525bd-e69a-40a3-a521-42a4f6514246', code: 'CA-BC-FSJ', url: 'https://upload.wikimedia.org/wikipedia/en/7/76/FSJ_Flag.svg' },
    { name: 'Fredericton', uuid: '9287d453-0fae-4ce1-88e9-95dd482edaca', code: 'CA-NB-FRE', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag_of_Fredericton.png' },
    { name: 'Greater Sudbury', uuid: '23ca4c0a-441a-45c1-b446-73cb40ee3d82', code: 'CA-ON-GSU', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Flag_of_Sudbury_Ontario.svg' },
    { name: 'Guelph', uuid: '3013a6c3-6235-4e21-8ee6-9fc840e5e4fb', code: 'CA-ON-GUE', url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Flag_of_Guelph.svg' },
    { name: 'Halifax', uuid: 'd5210692-e55c-4111-9517-5d798cf172cd', code: 'CA-NS-HFX', url: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Halifax_Flag.svg' },
    { name: 'Hamilton', uuid: 'c45dab1e-8cb1-4ca3-af6c-0762c590f333', code: 'CA-ON-HAM', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Hamilton.svg' },
    { name: 'Kamloops', uuid: '54a73516-94bc-4004-b6f5-619f63c7327c', code: 'CA-BC-KAM', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Kamloops%2C_Canada.gif' },
    { name: 'Kelowna', uuid: '2d5f82db-c560-44cd-b03b-eba177afe7e6', code: 'CA-BC-KEL', url: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Flag_of_Kelowna%2C_British_Columbia.svg' },
    { name: 'Kingston', uuid: '856cef35-bde5-403d-88ed-ef179c158d5f', code: 'CA-ON-KIN', url: 'https://upload.wikimedia.org/wikipedia/en/6/61/Flag_of_Kingston%2C_Ontario.svg' },
    { name: 'Kitchener', uuid: '3e4e751b-0838-428f-a44c-ba54b69508f4', code: 'CA-ON-KIT', url: 'https://upload.wikimedia.org/wikipedia/en/1/18/Flag_of_Kitchener%2C_Ontario.svg' },
    { name: 'Langley', uuid: '6fe4a4ad-2386-4808-b844-11e64143a67e', code: 'CA-BC-LAN', url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Langley_%28British_Columbia%29_flag.svg' },
    { name: 'Laval', uuid: '3e415fe3-5c32-4fdb-af8b-558452bfd26d', code: 'CA-QC-LAV', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Flag_of_Laval%2C_Quebec.svg' },
    { name: 'Lethbridge', uuid: '8f5a7450-e3df-4345-9d58-67173741b0b7', code: 'CA-AB-LET', url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_Lethbridge.svg' },
    { name: 'Lévis', uuid: '16665592-b1d2-47d0-84df-12144a4c3ad2', code: 'CA-QC-LEV', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Levis.svg' },
    { name: 'London', uuid: 'db3634e7-5414-41dd-be0b-68ae71798dcd', code: 'CA-ON-LDN', url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_London%2C_Ontario%2C_Canada.svg' },
    { name: 'Longueuil', uuid: 'c0e97660-cb34-4ca8-b7c5-c5dc95d608e3', code: 'CA-QC-LON', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Drapeau_ville_ca_Longueuil_%28Québec%29.svg' },
    { name: 'Medicine Hat', uuid: 'd8cfc4d7-f39f-410a-a60e-9f8d24cb2d81', code: 'CA-AB-MED', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Flag_of_Medicine_Hat.gif' },
    { name: 'Mistissini', uuid: 'fc371e96-9bef-44ac-acab-ae5e6ada3450', code: 'CA-QC-MIS', url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_Mistissini.svg' },
    { name: 'Moncton', uuid: '3a5c990e-fd94-496a-b32d-665cfffa6690', code: 'CA-NB-MON', url: 'https://upload.wikimedia.org/wikipedia/en/9/94/Flag_of_Moncton%2C_New_Brunswick%2C_Canada.gif' },
    { name: 'Montréal', uuid: 'c3cc624e-b963-49cf-ad0b-e318cb341963', code: 'CA-QC-MTL', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Flag_of_Montreal.svg' },
    { name: 'Nanaimo', uuid: '01e6ddde-11f9-4f80-b751-452170b1c52b', code: 'CA-BC-NAN', url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Flag_of_Nanaimo%2C_Canada.svg' },
    { name: 'Oshawa', uuid: '39783294-2224-427c-b0dc-65c6e8f03a67', code: 'CA-ON-OSH', url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Flag_of_Oshawa%2C_Ontario.gif' },
    { name: 'Ottawa', uuid: 'bbc88d72-1f32-4936-8dc6-b62b3318e1c4', code: 'CA-ON-OTT', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Ottawa%2C_Ontario.svg' },
    { name: 'Peterborough', uuid: '676e3736-c376-4705-af73-5dd9ce48acda', code: 'CA-ON-PET', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Peterborough_Ontario_Flag.svg' },
    { name: 'Pickering', uuid: '2f0ef58d-bed8-4661-bb9a-a509c7ac3bcc', code: 'CA-ON-PIC', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Flag_of_Pickering%2C_Ontario.svg' },
    { name: 'Prince George', uuid: '99aff3fe-fa1c-4c36-8180-6b6bc68ccfe3', code: 'CA-BC-PRG', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Prince_George%2C_British_Columbia.svg' },
    { name: 'Québec', uuid: 'e1804252-7413-4a4d-a34d-d21a8e8e752b', code: 'CA-QC-QUE', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Flag_of_Quebec_City.svg' },
    { name: 'Red Deer', uuid: '9d01feda-18b1-4216-a172-8cd46878b519', code: 'CA-AB-RED', url: 'https://upload.wikimedia.org/wikipedia/en/c/c0/Flag_of_Red_Deer%2C_AB.png' },
    { name: 'Regina', uuid: 'f2855648-5890-4942-b248-f8ca0d5e2a89', code: 'CA-SK-REG', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Flag_of_Regina.svg' },
    { name: 'Richmond', uuid: '8a46c554-f1f6-4eaa-951b-d999a640926b', code: 'CA-BC-RIC', url: 'https://upload.wikimedia.org/wikipedia/en/6/68/Richmondbcflag.svg' },
    { name: 'Saint John', uuid: '5e5b97d9-bdfd-492f-a488-da7806383861', code: 'CA-NB-SJO', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Saint_John%2C_NB_Flag.svg' },
    { name: 'Surrey', uuid: '975824cd-5bbe-4826-9756-dc534488367c', code: 'CA-BC-SUR', url: 'https://upload.wikimedia.org/wikipedia/en/5/57/Flag_of_Surrey%2C_British_Columbia.svg' },
    { name: 'Toronto', uuid: '74b24e62-d2fe-42d2-9d96-31f2da756c77', code: 'CA-ON-TOR', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Toronto%2C_Canada.svg' },
    { name: 'Trois-Rivières', uuid: 'fd4d966b-6c58-4e52-82f8-bb1142979cfc', code: 'CA-QC-TRV', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Drapeau_de_Trois-Rivières.jpg' },
    { name: 'Vancouver', uuid: '6ccc62d1-bdd8-4f08-8fae-bfaa5310e5ef', code: 'CA-BC-VAN', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag_of_Vancouver.svg' },
    { name: 'Vaughan', uuid: '14381a3e-9add-411e-b1aa-19ce8a735d53', code: 'CA-ON-VAU', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Flag_of_City_of_Vaughan.svg' },
    { name: 'Vernon', uuid: '39273882-3b64-4fbc-8366-eb767d789103', code: 'CA-BC-VER', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_Vernon%2C_British_Columbia.svg' },
    { name: 'Victoria', uuid: 'c5446ccc-24aa-4110-8130-38c97b5d83da', code: 'CA-BC-VIC', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Victoria%2C_Canada.png' },
    { name: 'Waterloo', uuid: '573f35c7-34e8-40bd-94f8-87f99b9aee1e', code: 'CA-ON-WAT', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag_of_Waterloo.png' },
    { name: 'Winnipeg', uuid: '35307acf-aba0-4ca7-9df6-b9398d873a8f', code: 'CA-MB-WPG', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Flag_of_Winnipeg.svg' },
    { name: 'Windsor', uuid: 'e4f1e288-92a0-4f36-8f0e-23397e261a99', code: 'CA-ON-WIN', url: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Flag-Ca-On-Windsor.svg' },

    // --- Chile (Regions and Provinces) ---
    { name: 'Aisén del General Carlos Ibáñez del Campo', uuid: 'f8efcc5a-b64e-4be6-9a38-78f5e7b47174', code: 'CL-AI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Aysen,_Chile.svg' },
    { name: 'Antofagasta', uuid: 'e449eed6-c518-46c9-9caa-714328c7b062', code: 'CL-AN', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Antofagasta_Region,_Chile.svg' },
    { name: 'Araucanía', uuid: '09badaa3-940a-45b1-857d-6102e4cee7f5', code: 'CL-AR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_La_Araucania,_Chile.svg' },
    { name: 'Arica y Parinacota', uuid: '9b74be71-764d-4114-b6d3-9632f3dca6e8', code: 'CL-AP', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Arica_y_Parinacota%2C_Chile.svg' },
    { name: 'Atacama', uuid: 'a05aded6-a868-431c-a430-f75ed958f8a7', code: 'CL-AT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Atacama,_Chile.svg' },
    { name: 'Bío-Bío', uuid: '0dfb54b3-dd37-4a6e-8188-58cc3b579bf8', code: 'CL-BI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Biob%C3%ADo_Region,_Chile.svg' },
    { name: 'Coquimbo', uuid: '756c8b08-34d5-4694-afde-60475ee76276', code: 'CL-CO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Coquimbo_Region,_Chile.svg' },
    { name: 'Curicó', uuid: 'cfdbf190-bc0a-4826-8923-cb959b7bc20b', code: 'CL-CU', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Logo_de_la_DPP_Curicó.svg' },
    { name: "Libertador General Bernardo O'Higgins", uuid: '6a743600-5468-4dba-aa84-cf096cf697da', code: 'CL-LI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_O%27Higgins_Region,_Chile.svg' },
    { name: 'Los Lagos', uuid: '6bace072-b9bd-4526-8a47-29cd977fdaf9', code: 'CL-LL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Los_Lagos_Region,_Chile.svg' },
    { name: 'Los Ríos', uuid: '6d443452-f596-40c4-8143-67efb6a432f4', code: 'CL-LR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Los_R%C3%ADos,_Chile.svg' },
    { name: 'Magallanes', uuid: '57b2d71b-0c3e-4ccb-a2ed-7da367134517', code: 'CL-MA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Magallanes_y_la_Ant%C3%A1rtica_Chilena,_Chile.svg' },
    { name: 'Maule', uuid: 'daac8aeb-d4b2-468b-aefd-d77a6b53a127', code: 'CL-ML', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Maule_Region.svg' },
    { name: 'Región Metropolitana de Santiago', uuid: '8270a6f3-3e8d-482d-8cb6-649912ac5a63', code: 'CL-RM', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Flag_of_the_Metropolitan_Region%2C_Chile.svg' },
    { name: 'Tarapacá', uuid: '2b7c03e7-24b2-4966-92a5-d3fcc4d9177d', code: 'CL-TA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tarapaca,_Chile.svg' },
    { name: 'Valparaíso', uuid: '448375eb-82d9-43ba-b114-6bfc2db011c8', code: 'CL-VS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Valparaiso,_Chile.svg' },

    // --- China (Region) ---
    { name: 'Tibet', uuid: 'dd70d245-d0b4-4169-8538-cdb45807adaf', code: 'CN-XZ', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Flag_of_Tibet.svg' },

    // --- Colombia (Departments) ---
    { name: 'Amazonas', uuid: '1642cac2-0960-484b-9316-8832b31d4c0e', code: 'CO-AMA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Amazonas_(Colombia).svg' },
    { name: 'Antioquia', uuid: '704b5889-896e-4f3a-b941-d2e3a8b50462', code: 'CO-ANT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Antioquia_Department.svg' },
    { name: 'Arauca', uuid: 'c6337711-12a7-4c32-9a58-3043f7729901', code: 'CO-ARA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Arauca.svg' },
    { name: 'Atlántico', uuid: 'c4ea2500-202a-43a3-bb02-6efd61752fa6', code: 'CO-ATL', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Flag_of_Atlántico.svg' },
    { name: 'Bolívar', uuid: '9f3cd9d4-5517-49a4-9404-b35777bbba3e', code: 'CO-BOL', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Bolívar_%28Colombia%29.svg' },
    { name: 'Boyacá', uuid: '2f2deded-349a-4d3a-8582-8f6c36421574', code: 'CO-BOY', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Boyac%C3%A1_Department.svg' },
    { name: 'Caldas', uuid: '4ad560ae-e487-4cd1-a495-4afe9ca749be', code: 'CO-CAL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Caldas.svg' },
    { name: 'Caquetá', uuid: '3ff7f940-12e0-4370-97b1-5696f30478d0', code: 'CO-CAQ', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Flag_of_Caquetá.svg' },
    { name: 'Casanare', uuid: '42bba264-eebd-49bb-9219-23d4e4b8ca9d', code: 'CO-CAS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Casanare.svg' },
    { name: 'Cauca', uuid: '3d135a13-a53d-439f-b919-b8a14dc3ff0c', code: 'CO-CAU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Cauca.svg' },
    { name: 'Cesar', uuid: 'f22e07bd-e548-4dcc-97df-3760e856fb38', code: 'CO-CES', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Cesar.svg' },
    { name: 'Chocó', uuid: 'fa659f3f-ee18-40d3-b4b9-e93469d78183', code: 'CO-CHO', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_Chocó.svg' },
    { name: 'Córdoba', uuid: '1261dfab-d2cb-4cc4-96ac-e1388dc14f87', code: 'CO-COR', url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Flag_of_Córdoba_Department.svg' },
    { name: 'Cundinamarca', uuid: '41e03f4c-cecb-418a-b451-fca56c4a047b', code: 'CO-CUN', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Cundinamarca.svg' },
    { name: 'Guainía', uuid: 'a834af57-da32-4d13-9b6f-1ae1aef7a8a5', code: 'CO-GUA', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Guainía.svg' },
    { name: 'Guaviare', uuid: 'e50c44a6-571d-400c-a259-9fe280717ff9', code: 'CO-GUV', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Guaviare.svg' },
    { name: 'Huila', uuid: '57bbc8ff-7b37-45e9-ba61-8ccc453c4387', code: 'CO-HUI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Huila.svg' },
    { name: 'La Guajira', uuid: 'b682fba9-45f2-4c35-bc5f-69d3ce6a456c', code: 'CO-LAG', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_La_Guajira.svg' },
    { name: 'Magdalena', uuid: 'd6a6abe3-e25f-4c90-b45a-3749b0dcb134', code: 'CO-MAG', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Magdalena.svg' },
    { name: 'Meta', uuid: '1b452518-0c96-4f1f-a9d8-ce6093e40bba', code: 'CO-MET', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Meta.svg' },
    { name: 'Nariño', uuid: 'c83fcdc9-e996-4864-97ad-855de5c04c16', code: 'CO-NAR', url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_Nariño.svg' },
    { name: 'Norte de Santander', uuid: 'ad531c8b-2969-4f91-919a-17f4e2f646aa', code: 'CO-NSA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Norte_de_Santander.svg' },
    { name: 'Putumayo', uuid: '90333bf3-2d8f-44cd-8845-8d912d43977f', code: 'CO-PUT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Putumayo.svg' },
    { name: 'Quindío', uuid: '3c2401a7-af29-44b1-be67-97cd8da7e086', code: 'CO-QUI', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Flag_of_Quindío_Department.svg' },
    { name: 'Risaralda', uuid: 'c9bc27c3-311f-4bb6-a91c-5826eb41e67b', code: 'CO-RIS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Risaralda.svg' },
    { name: 'San Andrés, Providencia y Santa Catalina', uuid: 'c4cf7ea1-9dad-4406-a0ac-b19fd67d5a13', code: 'CO-SAP', url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Flag_of_San_Andrés_y_Providencia.svg' },
    { name: 'Santander', uuid: '4bb35881-5913-4709-9674-c1b44aa74188', code: 'CO-SAN', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Santander_Department.svg' },
    { name: 'Sucre', uuid: '8f165540-7917-4b8e-a259-dcfb97ed09f0', code: 'CO-SUC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sucre.svg' },
    { name: 'Tolima', uuid: '9b309ca9-26c0-4b9b-8c17-99bbf87ef8b0', code: 'CO-TOL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tolima.svg' },
    { name: 'Valle del Cauca', uuid: '4367702c-1865-4c28-8420-ccda38424bf5', code: 'CO-VAC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Valle_del_Cauca.svg' },
    { name: 'Vaupés', uuid: 'f01a5305-1c78-4627-8537-087648a3d7d5', code: 'CO-VAU', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Vaupés.svg' },
    { name: 'Vichada', uuid: '48f3b824-f6cd-494e-aa0f-4ea2f7687a93', code: 'CO-VID', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Vichada.svg' },
    // --- Colombia (Capital District) ---
    { name: 'Bogotá', uuid: '6f85c2b6-4250-468b-9bd8-300fd8b451ad', code: 'CO-DC', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Bogotá.svg' },

    // --- Comoros (Islands) ---
    { name: 'Andjazîdja (Anjazījah)', uuid: 'c50166c5-4422-4490-a1c0-e465b4b26335', code: 'KM-G', url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Flag_of_Grande_Comore.svg' },
    { name: 'Andjouân (Anjwān)', uuid: '064512b6-d31f-4875-957b-0ab7b428d31f', code: 'KM-A', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Flag_of_Anjouan_%28official%29.svg' },
    { name: 'Moûhîlî (Mūhīlī)', uuid: '3ebe38a6-03ef-43a8-af4d-e1a6d9a2e76c', code: 'KM-M', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Flag_of_Mohéli_%28official%29.svg' },

    // --- Costa Rica (Provinces) ---
    { name: 'Alajuela', uuid: '0298aba2-c05b-4b1e-ae25-180173a15366', code: 'CR-A', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Bandera_de_la_Provincia_de_Alajuela.svg' },
    { name: 'Cartago', uuid: '67ca58e0-268b-468f-b2b9-10512c387909', code: 'CR-C', url: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Bandera_de_la_Provincia_de_Cartago.svg' },
    { name: 'Guanacaste', uuid: '5f32768d-9dac-430b-a4d9-24e325cc5216', code: 'CR-G', url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Bandera_de_la_Provincia_de_Guanacaste.svg' },
    { name: 'Heredia', uuid: '81457fdd-0dcc-41d4-a84a-9b002b93e078', code: 'CR-H', url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Bandera_de_la_Provincia_de_Heredia.svg' },
    { name: 'Limón', uuid: 'ef1f864c-1827-4716-942e-ec654c532fe8', code: 'CR-L', url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Bandera_de_la_Provincia_de_Limón.svg' },
    { name: 'Puntarenas', uuid: '6ccb54c3-bc1c-4d1d-945f-e40b0d77040e', code: 'CR-P', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Bandera_de_la_Provincia_de_Puntarenas.svg' },
    { name: 'San José', uuid: 'b63533c7-0c4f-443f-881f-b5ee6211208e', code: 'CR-SJ', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Bandera_de_la_Provincia_de_San_José.svg' },

    // --- Croatia (Counties) ---
    { name: 'Bjelovarsko-bilogorska županija', uuid: 'b328a7db-f4ee-4be5-9c00-6ebf786b363f', code: 'HR-07', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Bjelovar-Bilogora_County_flag.svg' },
    { name: 'Brodsko-posavska županija', uuid: '1504483f-6e5d-471f-a8e5-3292bd2bc179', code: 'HR-12', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Flag_of_Brod-Posavina_County.svg' },
    { name: 'Dubrovačko-neretvanska županija', uuid: '616dc59f-8837-417d-8724-5929de1d036f', code: 'HR-19', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Flag_of_Dubrovnik-Neretva_County.svg' },
    { name: 'Istarska županija', uuid: 'a83aecf5-e5e8-48ff-97b0-7af602605c3a', code: 'HR-18', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Zastava_Istarske_županije.svg' },
    { name: 'Karlovačka županija', uuid: '524f2140-0b0a-450e-9e88-48340e2d0b5e', code: 'HR-04', url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Flag_of_Karlovac_County.svg' },
    { name: 'Koprivničko-križevačka županija', uuid: 'f8eb2baf-3e16-4e23-a804-c97eadcbce2b', code: 'HR-06', url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Flag_of_Koprivnica-Križevci_County.svg' },
    { name: 'Krapinsko-zagorska županija', uuid: '1202fb1c-35e8-4d5e-b23a-56487d6fcfd5', code: 'HR-02', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Flag_of_Krapina-Zagorje_County.svg' },
    { name: 'Ličko-senjska županija', uuid: '61c68e9f-13fc-4ed4-97a1-790af83c8f2d', code: 'HR-09', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Flag_of_Lika-Senj_County.svg' },
    { name: 'Međimurska županija', uuid: '61de7c47-cafc-4956-b377-256d26def333', code: 'HR-20', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Flag_of_Međimurje_County.svg' },
    { name: 'Osječko-baranjska županija', uuid: '8fab51ba-3556-408f-a543-e38a389099e0', code: 'HR-14', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Flag_of_Osijek-Baranja_County.svg' },
    { name: 'Požeško-slavonska županija', uuid: '08ff8936-8821-4c48-9ac4-87f0ccfda9de', code: 'HR-11', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Požega-Slavonia_County.svg' },
    { name: 'Primorsko-goranska županija', uuid: '62223575-5a29-4807-9616-8db66397d403', code: 'HR-08', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Primorje-Gorski_Kotar_County.svg' },
    { name: 'Šibensko-kninska županija', uuid: '446b1247-33e8-4cb7-999c-0e187ffee01e', code: 'HR-15', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Flag_of_Šibenik-Knin_County.svg' },
    { name: 'Sisačko-moslavačka županija', uuid: '87f30df5-1ba4-4a4e-a7a3-88d08864afa6', code: 'HR-03', url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Flag_of_Sisak-Moslavina_County.svg' },
    { name: 'Splitsko-dalmatinska županija', uuid: '93e86506-9d55-4078-9282-459bbc945603', code: 'HR-17', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag_of_Split-Dalmatia_County.svg' },
    { name: 'Varaždinska županija', uuid: 'bd4ee1d5-0a13-441e-9b1f-2aeaf8d47aa5', code: 'HR-05', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Flag_of_Varaždin_County.svg' },
    { name: 'Virovitičko-podravska županija', uuid: 'd2ab84e6-9b12-4262-8d0e-7dcff1ac9739', code: 'HR-10', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Virovitica-Podravina_County.svg' },
    { name: 'Vukovarsko-srijemska županija', uuid: 'b9225d78-3773-44b2-b455-2eab1d6679a7', code: 'HR-16', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Vukovar-Syrmia_County.svg' },
    { name: 'Zadarska županija', uuid: 'ea709922-0809-43d3-8dba-688384f9fea9', code: 'HR-13', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Flag_of_Zadar_County.svg' },
    { name: 'Zagrebačka županija', uuid: '8beba0b5-0bc6-4720-8d9e-ca8d351c058e', code: 'HR-01', url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Zagreb_County.svg' },
    // --- Croatia (City) ---
    { name: 'Zagreb', uuid: '55f3682e-ff80-4f11-9ec9-8923608a6ee1', code: 'HR-21', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Flag_of_Zagreb.svg' },

    // --- Czechia (Regions) ---
    { name: 'Jihočeský kraj', uuid: '91eb4aae-2c2b-4dc1-b972-1b44eaf6fbc1', code: 'CZ-31', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Bohemian_Region.svg' },
    { name: 'Jihomoravský kraj', uuid: 'e64ebd04-03cc-49c6-b64e-767bbc65e7b2', code: 'CZ-64', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Moravian_Region.svg' },
    { name: 'Karlovarský kraj', uuid: 'b3ca5dc3-1962-4a5f-98bf-a5ceebd07737', code: 'CZ-41', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Karlovy_Vary_Region.svg' },
    { name: 'Královéhradecký kraj', uuid: '83a7fb49-611b-49ce-8e93-d00d5a6b70dd', code: 'CZ-52', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Hradec_Kralove_Region.svg' },
    { name: 'Liberecký kraj', uuid: '79d826c8-f58e-4cc7-bc04-3c8101d58f1a', code: 'CZ-51', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Liberec_Region.svg' },
    { name: 'Moravskoslezský kraj', uuid: '641a8756-03b3-4e5d-8a71-3f6e3bad5093', code: 'CZ-80', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Moravian-Silesian_Region.svg' },
    { name: 'Olomoucký kraj', uuid: 'a6f04558-d9e8-4374-b61a-4343f693e006', code: 'CZ-71', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Olomouc_Region.svg' },
    { name: 'Pardubický kraj', uuid: '5fd44578-02d3-4e0c-b3d9-19a8615d00e1', code: 'CZ-53', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Pardubice_Region.svg' },
    { name: 'Plzeňský kraj', uuid: '414378b2-1b85-427b-9e66-f26d558c1dde', code: 'CZ-32', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Plzen_Region.svg' },
    { name: 'Praha', uuid: '0a65a727-7465-4e6c-8b15-ed4d09e021ee', code: 'CZ-10', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Prague.svg' },
    { name: 'Středočeský kraj', uuid: '2ae6d252-57dc-45d5-8298-5252f1693c01', code: 'CZ-20', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Central_Bohemian_Region.svg' },
    { name: 'Ústecký kraj', uuid: 'bfc270ee-4058-411b-a9a3-b02f33049c69', code: 'CZ-42', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Usti_nad_Labem_Region.svg' },
    { name: 'Vysočina', uuid: 'df1aae4b-a7ab-473e-bce7-eb5de94a002b', code: 'CZ-63', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Vysocina_Region.svg' },
    { name: 'Zlínský kraj', uuid: '56e47717-ebb6-4ad0-8354-779290c76e51', code: 'CZ-72', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Zlin_Region.svg' },

    // --- Denmark (Regions) ---
    { name: 'Capital Region of Denmark', uuid: '3dddb678-c1db-45f8-9007-3013502b2bc7', code: 'DK-84', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Capital_Region_of_Denmark.svg' },
    { name: 'Central Denmark Region', uuid: '2e725477-4471-4569-8e12-8d8ba5ba2d53', code: 'DK-82', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Region_Midtjylland.svg' },
    { name: 'North Denmark Region', uuid: 'e1d068a6-d2c5-4dbb-8c37-1d1407097934', code: 'DK-81', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Region_Nordjylland.svg' },
    { name: 'Region of Southern Denmark', uuid: 'c99aceb6-1023-4316-8483-fac31dcd1d7c', code: 'DK-83', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Region_Syddanmark.svg' },
    { name: 'Region Zealand', uuid: '7d490078-4542-411d-aece-709afee04256', code: 'DK-85', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Region_Sj%C3%A6lland.svg' },

    // --- Ecuador (Provinces) ---
    { name: 'Azuay', uuid: 'a0512ef6-aeb1-4859-9e4b-183058758c7b', code: 'EC-A', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Bandera_Provincia_Azuay.svg' },
    { name: 'Bolívar ', uuid: 'c6c0732d-142a-4532-9676-6586e2aa49cc', code: 'EC-B', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Bandera_Provincia_Bolívar.svg' },
    { name: 'Cañar', uuid: 'bd53476f-ffd4-4348-8983-54c8ff853a10', code: 'EC-F', url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Bandera_Provincia_Cañar.svg' },
    { name: 'Carchi', uuid: '620f7378-7d81-48f3-9dfa-57fab6e4d4e6', code: 'EC-C', url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Bandera_Provincia_Carchi.svg' },
    { name: 'Chimborazo', uuid: '08fbd664-5765-49cd-be55-80d014962ab2', code: 'EC-H', url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Bandera_Provincia_Chimborazo.svg' },
    { name: 'Cotopaxi', uuid: '0503a1a0-d5c8-40bf-9470-70753093bd32', code: 'EC-X', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Bandera_Provincia_Cotopaxi.svg' },
    { name: 'El Oro', uuid: 'b283dfe4-b5ef-43f3-a8bd-d8761f3c40be', code: 'EC-O', url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Bandera_Provincia_El_Oro.svg' },
    { name: 'Esmeraldas', uuid: '2e307147-cbe7-443d-bb16-606e33cf5e3a', code: 'EC-E', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Bandera_Provincia_Esmeraldas.svg' },
    { name: 'Galápagos', uuid: '5ddbb59c-68e9-4970-811c-36ac06722e51', code: 'EC-W', url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Bandera_Provincia_Galápagos.svg' },
    { name: 'Guayas', uuid: 'd062f2a4-8b27-4341-94f0-3c6cacefc632', code: 'EC-G', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Bandera_de_Guayaquil.svg' },
    { name: 'Imbabura', uuid: 'd675b39d-dfff-4aac-9f4b-2ed2c73a9ec3', code: 'EC-I', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Bandera_Provincia_Imbabura.svg' },
    { name: 'Loja', uuid: 'abd80933-9c23-480e-b98c-b6441b1b02e1', code: 'EC-L', url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Bandera_Provincia_Loja.svg' },
    { name: 'Los Ríos', uuid: '2efb1ead-ea9c-4311-8dd8-a23b833b2441', code: 'EC-R', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Bandera_de_Los_Ríos.svg' },
    { name: 'Manabí', uuid: 'aa4dd74d-e64c-42dc-8fcc-799b19ad83db', code: 'EC-M', url: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Bandera_Provincia_Manabí.svg' },
    { name: 'Morona-Santiago', uuid: '7e800c8f-8e2f-47bb-9f86-01a0bfca4363', code: 'EC-S', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Bandera_Provincia_Morona_Santiago.svg' },
    { name: 'Napo', uuid: '71bf64ab-7b26-481b-84fc-33ee230b451b', code: 'EC-N', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Bandera_Provincia_Napo.svg' },
    { name: 'Orellana', uuid: 'fc113fb5-66e8-4993-a4b9-0739226d6b4b', code: 'EC-D', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Bandera_Provincia_Orellana.svg' },
    { name: 'Pastaza', uuid: '87d9a5af-9fea-4bb3-84fc-00917296f796', code: 'EC-Y', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Bandera_Provincia_Pastaza.svg' },
    { name: 'Pichincha', uuid: 'da0d389e-577e-473f-820c-2525608bcba5', code: 'EC-P', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Bandera_Provincia_Pichincha.svg' },
    { name: 'Santa Elena', uuid: 'add84c52-6107-4c51-b465-e90c2a04a746', code: 'EC-SE', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Bandera_Provincia_Santa_Elena.svg' },
    { name: 'Santo Domingo de los Tsáchilas', uuid: '9069065e-d0c2-4e2e-a915-17f84b4760ac', code: 'EC-SD', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Bandera_Provincia_Santo_Domingo_de_los_Tsáchilas.svg' },
    { name: 'Sucumbíos', uuid: '2871bff5-a963-4ec0-969a-b7c0442a4da6', code: 'EC-U', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Bandera_Provincia_Sucumbíos.svg' },
    { name: 'Tungurahua', uuid: 'ac5d8788-1345-44c1-a661-776f9f1a5d12', code: 'EC-T', url: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Bandera_Provincia_Tungurahua.svg' },
    { name: 'Zamora-Chinchipe', uuid: '3df83c3d-8027-4031-8f0d-27d6d17569f2', code: 'EC-Z', url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Bandera_Provincia_Zamora_Chinchipe.svg' },

    // --- El Salvador (Departments) ---
    { name: 'Ahuachapán', uuid: 'f8840e75-f279-41ba-a1c6-cb29e4d50023', code: 'SV-AH', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Bandera_del_Departamento_de_Ahuachapán.PNG' },
    { name: 'Cabañas', uuid: 'f345355f-2c66-44a5-a189-d493f964282f', code: 'SV-CA', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Flag_of_the_Cabañas_Department.svg' },
    { name: 'Chalatenango', uuid: 'fb7f694f-627b-4ddf-8a35-bead1cdca543', code: 'SV-CH', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag_of_Chalatenango.svg' },
    { name: 'Cuscatlán', uuid: 'f7223001-8483-42cf-8cdb-a275396760f9', code: 'SV-CU', url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Bandera_de_Cuscatlán.svg' },
    { name: 'La Libertad', uuid: 'ceef1bba-70e9-4fd2-a796-9d7c4ca5cb30', code: 'SV-LI', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_La_Libertad_Department_%28El_Salvador%29.svg' },
    { name: 'La Paz', uuid: 'f23aa4bd-6355-4831-835d-da39be62796e', code: 'SV-PA', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Bandera_del_Departamento_de_La_Paz.jpg' },
    { name: 'La Unión', uuid: '49ec5170-5cd5-4d6e-bc16-3d102e12234d', code: 'SV-UN', url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Departamento_de_La_Unión.svg' },
    { name: 'Morazán', uuid: 'ae6a9481-3238-48e9-bcca-c0880fcdeb0d', code: 'SV-MO', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Morazán_Department.svg' },
    { name: 'San Miguel', uuid: 'd4b844af-00e1-47d7-b568-6b7020a0e160', code: 'SV-SM', url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/SM_Bandera.png' },
    { name: 'San Salvador', uuid: '011e3f92-ace3-4ebf-9081-4d7280842acc', code: 'SV-SS', url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/San_Salvador_Flag.png' },
    { name: 'San Vicente', uuid: 'eb9624b1-4506-4d7e-9dd4-269400dbcbb2', code: 'SV-SV', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Flag_of_San_Vicente_Department.svg' },
    { name: 'Santa Ana', uuid: '7616cc48-be46-430b-b30c-a755fb9198bb', code: 'SV-SA', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Bandera_de_Santa_Ana%2C_El_Salvador.svg' },
    { name: 'Sonsonate', uuid: '1cba7206-2cad-41c2-bc10-8a2edad543b5', code: 'SV-SO', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Bandera_Sonsonate_SV.png' },
    { name: 'Usulután', uuid: '81969fa0-ca9f-43fe-9802-8a4328f60ad7', code: 'SV-US', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Usulutan_flag.png' },

    // --- Estonia (Counties) ---
    { name: 'Harjumaa', uuid: 'ae44158c-c0b6-44c5-b41e-90e4da8497df', code: 'EE-37', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_et-Harju_maakond.svg' },
    { name: 'Hiiumaa', uuid: 'c4bce950-b02e-4239-8429-83665e2d5ac1', code: 'EE-39', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hiiumaa_lipp.svg' },
    { name: 'Ida-Virumaa', uuid: 'f59b5ce2-b97a-429f-99e6-a973104312d1', code: 'EE-45', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ida-Virumaa_lipp.svg' },
    { name: 'Järvamaa', uuid: 'c326ac86-ff31-4b1d-bd3b-fa69d2be8080', code: 'EE-52', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Flag_of_et-Järva_maakond.svg' },
    { name: 'Jõgevamaa', uuid: '07762d66-ec09-4875-849b-7734e4b445fa', code: 'EE-50', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/J%C3%B5gevamaa_lipp.svg' },
    { name: 'Lääne-Virumaa', uuid: '3d31f97c-6519-433f-9c99-387aa3987705', code: 'EE-60', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/L%C3%A4%C3%A4ne-Virumaa_lipp.svg' },
    { name: 'Läänemaa', uuid: 'b5f7351a-2621-4662-a803-f6cb50a8f953', code: 'EE-56', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/L%C3%A4%C3%A4nemaa_lipp.svg' },
    { name: 'Pärnumaa', uuid: '843701a2-5205-4afd-95a2-f9e96367f61d', code: 'EE-68', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/P%C3%A4rnumaa_lipp.svg' },
    { name: 'Põlvamaa', uuid: '816e9e02-4f43-413e-9ae8-f2925a5ee424', code: 'EE-64', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/P%C3%B5lvamaa_lipp.svg' },
    { name: 'Raplamaa', uuid: '7ad3dc98-09d0-4ef2-8a3b-97521f7cffbd', code: 'EE-71', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Raplamaa_lipp.svg' },
    { name: 'Saaremaa', uuid: '94405512-8bfd-4a96-8476-0505327bb146', code: 'EE-74', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Saaremaa_lipp.svg' },
    { name: 'Tartumaa', uuid: 'ad9aa625-4b82-47f2-b4a7-c467429fb31c', code: 'EE-79', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tartumaa_lipp.svg' },
    { name: 'Valgamaa', uuid: '2b652d19-18e0-48d0-9a5a-03c23ce81244', code: 'EE-81', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Valgamaa_lipp.svg' },
    { name: 'Viljandimaa', uuid: 'e54b4028-d809-4fb8-adf1-73aa8791071f', code: 'EE-84', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Viljandimaa_lipp.svg' },
    { name: 'Võrumaa', uuid: '6cfe8fd8-20c7-4ca7-817e-fa6c41267f24', code: 'EE-87', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/V%C3%B5rumaa_lipp.svg' },

    // --- Ethiopia (Regional States) ---
    { name: 'Āfar', uuid: '341fe439-8b5f-4602-9d75-59c61cbb8ced', code: 'ET-AF', url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Flag_of_the_Afar_Region.svg' },
    { name: 'Āmara', uuid: 'd575ba3a-157b-42e8-9f98-8caa7630ae59', code: 'ET-AM', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Flag_of_the_Amhara_Region.svg' },
    { name: 'Bīnshangul Gumuz', uuid: 'd2f4fa1f-2005-4633-97b7-39ed6a63e774', code: 'ET-BE', url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Flag_of_the_Benishangul-Gumuz_Region.svg' },
    { name: 'Gambēla Hizboch', uuid: 'b941dd75-b0d1-47c3-a769-5b7cc4571069', code: 'ET-GA', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag_of_the_Gambella_Region.svg' },
    { name: 'Hārerī Hizb', uuid: 'bda949af-d9e9-46c3-9fee-d26a2fc565cb', code: 'ET-HA', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Harari_Flag.svg' },
    { name: 'Oromīya', uuid: '75a0d079-4d6b-44bb-9386-82718fabeec3', code: 'ET-OR', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Flag_of_the_Oromia_Region.svg' },
    { name: 'Sumalē', uuid: '64ca25d2-d3bb-4645-9b00-c1716b5ae855', code: 'ET-SO', url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_the_Somali_Region_%281994-2008%2C_2018-%29.svg' },
    { name: 'Tigray', uuid: '1ddf91bd-113c-4a9e-8a3f-d2e42631e8ca', code: 'ET-TI', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Flag_of_the_Tigray_Region.svg' },
    { name: 'YeDebub Bihēroch Bihēreseboch na Hizboch', uuid: '90d4540e-7c0a-4bc4-a7c1-bf2c0a99b6e3', code: 'ET-SN', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Flag_of_the_Southern_Nations%2C_Nationalities%2C_and_Peoples%27_Region.svg' },
    // --- Ethiopia (Administrations) ---
    { name: 'Ādīs Ābeba', uuid: '8474f16d-03a0-4a09-adf3-df2d1e65ba2f', code: 'ET-AA', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_Addis_Ababa.svg' },
    { name: 'Dirē Dawa', uuid: 'c37f15fb-78f1-4117-8310-43aad0f3369f', code: 'ET-DD', url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Flag_of_Dire_Dawa%2C_Ethiopia.svg' },

    // --- Federated States of Micronesia (States) ---
    { name: 'Chuuk', uuid: 'e43df1a7-65b5-446f-9b4e-733848780328', code: 'FM-TRK', url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Flag_of_Chuuk.svg' },
    { name: 'Kosrae', uuid: '30a6dc03-b3a1-4faf-a780-46b5b571329e', code: 'FM-KSA', url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Flag_of_Kosrae.svg' },
    { name: 'Pohnpei', uuid: '01c58349-a06b-4fbb-8911-00ad3170c470', code: 'FM-PNI', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Pohnpei.svg' },
    { name: 'Yap', uuid: 'f1163f6b-a48e-4cd7-8ee8-274830a2b203', code: 'FM-YAP', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Yap.svg' },

    // --- Finland (Regions) ---
    { name: 'Etelä-Karjala', uuid: '8a39f710-9e3a-424c-99c6-f7bdab06d1db', code: 'FI-02', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Etel%C3%A4-Karjala.vaakuna.svg' },
    { name: 'Etelä-Pohjanmaa', uuid: '4763ad43-aa77-426e-a8a1-16e4aa6e0f64', code: 'FI-03', url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Flag_of_Southern_Ostrobothnia.svg' },
    { name: 'Etelä-Savo', uuid: '4806ecfb-4aaf-4673-8004-25e7e91b3c0f', code: 'FI-04', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Etel%C3%A4-Savo.vaakuna.svg' },
    { name: 'Kainuu', uuid: 'd979d66e-262e-40a6-885d-ddfee5960b9e', code: 'FI-05', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kainuu.vaakuna.svg' },
    { name: 'Kanta-Häme', uuid: 'dedc20c2-22f9-4c20-9426-470424613679', code: 'FI-06', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kanta-H%C3%A4me.vaakuna.svg' },
    { name: 'Keski-Pohjanmaa', uuid: 'ac15a0c3-3f81-40a0-bbb8-6400b192b387', code: 'FI-07', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Keski-Pohjanmaa.vaakuna.svg' },
    { name: 'Keski-Suomi', uuid: '9d5cbce0-6637-4564-abfd-6e1a6e7c7331', code: 'FI-08', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Keski-suomi_lippu.svg' },
    { name: 'Lappi', uuid: '3c529caf-88b1-4454-9bfb-c003061a4bd3', code: 'FI-10', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lappi.vaakuna.svg' },
    { name: 'Päijät-Häme', uuid: 'e3697577-963e-4a73-ad80-5ff065c6722a', code: 'FI-16', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/P%C3%A4ij%C3%A4t-H%C3%A4me.vaakuna.svg' },
    { name: 'Pirkanmaa', uuid: '14068873-0259-4bbd-8882-d06b59f82975', code: 'FI-11', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pirkanmaa.vaakuna.svg' },
    { name: 'Pohjois-Karjala', uuid: 'df500336-89a0-4dcc-9a33-1ca21e642867', code: 'FI-13', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pohjois-Karjala.vaakuna.svg' },
    { name: 'Pohjois-Savo', uuid: '918c7656-6ea4-4bd6-beb8-71cf7138ff0d', code: 'FI-15', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pohjois-Savo.vaakuna.svg' },
    { name: 'Satakunta', uuid: 'd6acfa6d-7162-45ea-8173-60f13c565686', code: 'FI-17', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Satakunta.vaakuna.svg' },
    { name: 'Uusimaa', uuid: '942bd6e5-e590-4202-b16f-de6335211dd5', code: 'FI-18', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Uusimaa.vaakuna.svg' },

    // --- France (Regions) ---
    { name: 'Auvergne-Rhône-Alpes', uuid: '0c8eaaf0-731a-4963-b643-061ff74486f8', code: 'FR-ARA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_region_Auvergne-Rh%C3%B4ne-Alpes.svg' },
    { name: 'Bourgogne-Franche-Comté', uuid: '0522dc27-bc97-4cf1-af64-47993bce7bad', code: 'FR-BFC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_region_Bourgogne-Franche-Comt%C3%A9.svg' },
    { name: 'Bretagne', uuid: '4dc2ed69-75dc-4f4c-9d71-889643f24791', code: 'FR-BRE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Brittany_%28Gwenn_ha_du%29.svg' },
    { name: 'Centre-Val de Loire', uuid: '8021a7c2-8037-4999-9203-e555e7bb20ab', code: 'FR-CVL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Centre-Val_de_Loire.svg' },
    { name: 'Corse', uuid: '8216eb6e-3b17-4aef-9285-ff2901ef9b4f', code: 'FR-COR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Corsica.svg' },
    { name: 'Grand Est', uuid: '7ced1904-076d-4627-b6cf-a4a48b361a7d', code: 'FR-GES', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Proposed_Flag_of_Grand_Est_-_juxtaposed_version.svg' },
    { name: 'Hauts-de-France', uuid: '710d5c37-c6b2-4bfb-bfa7-a72c6be2367b', code: 'FR-HDF', url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Proposed_flag_of_Hauts-de-France.svg' },
    { name: 'Île-de-France', uuid: 'd79e4501-8cba-431b-96e7-bb9976f0ae76', code: 'FR-IDF', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_%C3%8Ele-de-France.svg' },
    { name: 'Normandie', uuid: '99911e4c-a60c-47d5-b2a1-1db67d577a94', code: 'FR-NOR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Normandy.svg' },
    { name: 'Nouvelle-Aquitaine', uuid: '08850fc4-a609-46fb-8857-5a457bf798cc', code: 'FR-NAQ', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Flag_of_Nouvelle-Aquitaine.svg' },
    { name: 'Occitanie', uuid: 'ea63a285-1851-4e13-9fb8-0186f1a9fbae', code: 'FR-OCC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Occitania_%28with_star%29.svg' },
    { name: 'Pays-de-la-Loire', uuid: '52bd3595-9ee0-42a2-8f67-d0917506c242', code: 'FR-PDL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Pays-de-la-Loire.svg' },
    { name: 'Provence-Alpes-Côte-d\'Azur', uuid: 'd0db0e5b-de99-40c5-8c39-b7ed17b36d0d', code: 'FR-PAC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Provence-Alpes-C%C3%B4te_d%27Azur.svg' },
    // --- France (State Private Property) ---
    { name: 'Clipperton', uuid: '36beca2c-be41-4151-b774-6a4d549f99c6', code: 'FR-CP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_France.svg' },
    // --- France (Former Regions) ---
    { name: 'Alsace', uuid: 'becf5db4-f6d0-4d12-ae34-d8d2ce4a2c53', code: 'FR-A', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Alsace.svg' },
    { name: 'Aquitaine', uuid: 'cd5b5aa5-d185-46e9-ad9d-e7c0eb8bc4c3', code: 'FR-B', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Aquitaine.svg' },
    { name: 'Auvergne', uuid: '8a56b197-23e4-44b5-9bb2-13b39ee2d6ea', code: 'FR-C', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Auvergne.svg' },
    { name: 'Basse-Normandie', uuid: '824ae642-1d1c-4212-8f4a-775d060d2245', code: 'FR-P', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Normandy.svg' },
    { name: 'Bourgogne', uuid: '62882784-379c-48a2-b2fd-5d58d46f3de7', code: 'FR-D', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Burgundy.svg' },
    { name: 'Champagne-Ardenne', uuid: 'ae7ba3fc-bfee-4d0b-ba8e-9784298d434f', code: 'FR-G', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Champagne-Ardenne.svg' },
    { name: 'Franche-Comté', uuid: '3e233b8d-30e6-42a5-9ea2-57a197f0477c', code: 'FR-I', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Franche-Comt%C3%A9.svg' },
    { name: 'Haute-Normandie', uuid: '35c1cd11-ca36-4aab-b984-3a180cb1801b', code: 'FR-Q', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Normandy.svg' },
    { name: 'Languedoc-Roussillon', uuid: '3d3cd460-c1bd-46f1-aa30-d8f19604e2ef', code: 'FR-K', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Languedoc-Roussillon.svg' },
    { name: 'Limousin', uuid: 'c3b3391b-4049-49b4-a147-dcd6963e3ccf', code: 'FR-L', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Limousin.svg' },
    { name: 'Lorraine', uuid: '9a747db2-1993-44d8-85a4-57331df29645', code: 'FR-M', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Lorraine.svg' },
    { name: 'Midi-Pyrénées', uuid: 'd49e3b1b-3b36-40e1-ae4b-0b2fd2e6d6a0', code: 'FR-N', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Midi-Pyr%C3%A9n%C3%A9es.svg' },
    { name: 'Nord-Pas-de-Calais', uuid: '58e07dd8-21c9-46fe-b5a7-4f916eaae30a', code: 'FR-O', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Nord-Pas-de-Calais.svg' },
    { name: 'Picardie', uuid: '25fd67e9-3788-4cea-b26b-e6a4d36b43b5', code: 'FR-S', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_Picardie.svg' },
    { name: 'Poitou-Charentes', uuid: '76b1cb18-c458-419c-985f-5558870e48b1', code: 'FR-T', url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Poitou-Charentes_flag.svg' },
    { name: 'Rhône-Alpes', uuid: '7f996abe-449b-4209-a0f8-c6ba9105e5e7', code: 'FR-V', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Rh%C3%B4ne-Alpes.svg' },

    // --- French Polynesia (Administrative Divisions) ---
    { name: 'Austral Islands', uuid: '94f27de2-b6ad-4c5a-b05b-047e384f0089', code: 'FP-987-4', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flag_of_the_Austral_Islands.svg' },
    { name: 'Leeward Islands', uuid: '1bd4bb5d-0824-4ec7-8207-57d7a4f9b18d', code: 'FP-987-5', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Flag_of_the_Leeward_Islands.svg' },
    { name: 'Marquesas Islands', uuid: 'd47ff002-fd52-4b72-bd8f-b0754a813833', code: 'FP-987-1', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Flag_of_Marquesas_Islands.svg' },
    // --- French Polynesia (Island) ---
    { name: 'Tahiti', uuid: '3ed4901a-0051-4e06-a9dd-d454ac6e6ee4', code: 'FP-987-2-THT', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Tahiti.svg' },

    // --- Georgia (Autonomous Republics) ---
    { name: 'Abkhazia', uuid: '2b9e5ac3-1583-44d9-9864-94919a58df51', code: 'GE-AB', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flag_of_the_Republic_of_Abkhazia.svg' },
    { name: 'Ajaria', uuid: 'cbbe7923-a5e9-416a-994e-35fc4101c6ff', code: 'GE-AJ', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Adjara.svg' },
    // --- Georgia (Cities) ---
    { name: 'Batumi', uuid: 'e95abe3d-0f73-42b8-a023-5307cd71ca23', code: 'GE-BUS', url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_Batumi.svg' },
    { name: 'Kutaisi', uuid: 'cdc23cff-c4ec-4d47-9755-cc157c250bec', code: 'GE-KUT', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Flag_of_Kutaisi%2C_Georgia.svg' },
    { name: 'Poti', uuid: '3d2c5c56-6a08-4b71-aa4d-1ec47ac22dbb', code: 'GE-PTI', url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Poti.svg' },
    { name: 'Rustavi', uuid: '91ee99c6-6dbf-433e-b855-43c8e95bd71b', code: 'GE-RUS', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Flag_of_Rustavi.svg' },
    { name: 'Tbilisi', uuid: '76c77b6c-f1e1-4a58-8fe1-01a7efadd1f7', code: 'GE-TB', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Tbilisi.svg' },

    // --- Germany (States) ---
    { name: 'Baden-Württemberg', uuid: '4b8c47dd-0fe2-450e-8a21-d4d739ee0e0c', code: 'DE-BW', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Baden-W%C3%BCrttemberg.svg' },
    { name: 'Bayern', uuid: '946dee46-7eeb-490d-8b94-1ca5286769e9', code: 'DE-BY', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Bavaria_%28lozengy%29.svg' },
    { name: 'Berlin', uuid: 'c9ac1239-e832-41bc-9930-e252a1fd1105', code: 'DE-BE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Berlin.svg' },
    { name: 'Brandenburg', uuid: '6adffea3-b78f-4670-ab6e-cff834a41bde', code: 'DE-BB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Brandenburg.svg' },
    { name: 'Bremen', uuid: 'ca6a9d1a-f005-4a7f-9691-17a6f5ecbdd7', code: 'DE-HB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Bremen.svg' },
    { name: 'Hamburg', uuid: '11a44e18-a2e5-43a9-bee9-aa4f7c83f967', code: 'DE-HH', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Hamburg.svg' },
    { name: 'Hessen', uuid: '1b761636-6166-4dec-af7f-48c506f4e24d', code: 'DE-HE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Hesse.svg' },
    { name: 'Mecklenburg-Vorpommern', uuid: 'f4a62edf-12dc-441c-9032-c7ce46df8050', code: 'DE-MV', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Mecklenburg-Western_Pomerania.svg' },
    { name: 'Niedersachsen', uuid: '2978b457-3c4a-4a34-8b3c-d35e4804c42b', code: 'DE-NI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Lower_Saxony.svg' },
    { name: 'Nordrhein-Westfalen', uuid: '1de7fa77-cb52-40a2-b82a-251c7818249d', code: 'DE-NW', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_North_Rhine-Westphalia.svg' },
    { name: 'Rheinland-Pfalz', uuid: 'aa47eb3a-80b5-4837-a167-6d05a5f60714', code: 'DE-RP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Rhineland-Palatinate.svg' },
    { name: 'Saarland', uuid: 'f7160358-2b0c-4869-9a66-65a7fe3e4588', code: 'DE-SL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Saarland.svg' },
    { name: 'Sachsen', uuid: '2b568f1a-0bbc-4416-86ad-ced6ef6d56f4', code: 'DE-SN', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Saxony.svg' },
    { name: 'Sachsen-Anhalt', uuid: 'f58905b4-f974-4292-a259-befaf8a4e957', code: 'DE-ST', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Saxony-Anhalt.svg' },
    { name: 'Schleswig-Holstein', uuid: '26486d74-1d5b-40db-857f-a8f49c64175b', code: 'DE-SH', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Schleswig-Holstein.svg' },
    { name: 'Thüringen', uuid: 'ff2ee1ad-febe-4b48-8999-e77870b62744', code: 'DE-TH', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Thuringia.svg' },

    // --- Guatemala (Departments) ---
    { name: 'Alta Verapaz', uuid: 'dfd54386-c36d-4375-a713-450524ccc06e', code: 'GT-AV', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Alta_Verapaz_Department.svg' },
    { name: 'Baja Verapaz', uuid: '97e27cf3-e4d6-4362-ba94-baff53240cc6', code: 'GT-BV', url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Flag_of_Baja_Verapaz_Department.svg' },
    { name: 'Chimaltenango', uuid: '185cef1f-bc8b-4df0-abbb-194d09055d1c', code: 'GT-CM', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Chimaltenango_Department.svg' },
    { name: 'Chiquimula', uuid: 'c38d91af-af8e-423c-b86b-2a53a6e087df', code: 'GT-CQ', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Chiquimula%2C_Guatemala.svg' },
    { name: 'El Progreso', uuid: '33b68221-f50c-4540-a6c4-47886a7de426', code: 'GT-PR', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Flag_of_El_Progreso_Department.svg' },
    { name: 'Escuintla', uuid: 'b8694cca-365b-4475-aa71-32df36354348', code: 'GT-ES', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Flag_of_Escuintla_Department.svg' },
    { name: 'Guatemala', uuid: 'b5ab731d-acb9-4fda-9e89-f5e556251eee', code: 'GT-GU', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Flag_of_the_Guatemala_Department.svg' },
    { name: 'Huehuetenango', uuid: '6f361152-6bb7-442b-80bf-7943a1951345', code: 'GT-HU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Huehuetenango_Department.svg' },
    { name: 'Izabal', uuid: 'ee52eef8-776d-4289-9af4-5cdfe7ba8fff', code: 'GT-IZ', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Izabal_Department.svg' },
    { name: 'Jalapa', uuid: 'c42c483b-1d31-4cd4-821a-79b50e93ff1f', code: 'GT-JA', url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Flag_of_Jalapa_Department%2C_Guatemala.svg' },
    { name: 'Jutiapa', uuid: 'a9e2dbc5-fa6e-46f4-9e72-7140129bcede', code: 'GT-JU', url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Jutiapa_Department.svg' },
    { name: 'Petén', uuid: '3ee853b5-46a7-48fc-a759-6e9326a8c469', code: 'GT-PE', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Flag_of_El_Petén_Department.svg' },
    { name: 'Quetzaltenango', uuid: '615e16b7-822c-4ac3-9f73-64a170e80623', code: 'GT-QZ', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Quetzaltenango_Department.svg' },
    { name: 'Quiché', uuid: '949b1122-bc52-4256-a9bc-fd30285529b6', code: 'GT-QC', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Quiché_Department.svg' },
    { name: 'Retalhuleu', uuid: '1fcccc51-15b4-454b-a159-602c24b72cea', code: 'GT-RE', url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Flag_of_Retahuleu_Department.svg' },
    { name: 'Sacatepéquez', uuid: 'fd8358cd-cdc8-4386-af10-f68ddd9c9467', code: 'GT-SA', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Sacatepéquez_Department.svg' },
    { name: 'San Marcos', uuid: '4a2f7db6-b2cd-4e24-a47a-cd599a90ec20', code: 'GT-SM', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Flag_of_San_Marcos_Department.svg' },
    { name: 'Santa Rosa', uuid: 'bf8ea43e-fb1c-47f1-87f3-226d94d73d3a', code: 'GT-SR', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Flag_of_Santa_Rosa_Department.svg' },
    { name: 'Sololá', uuid: '999fa95b-a1b9-4de1-96e3-c81e0213a096', code: 'GT-SO', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Sololá_Department.svg' },
    { name: 'Suchitepéquez', uuid: '7f7e7f3e-c705-4bac-9ab1-474522f8d3d7', code: 'GT-SU', url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Flag_of_Suchitepéquez_Department.svg' },
    { name: 'Totonicapán', uuid: '8d769f15-8b85-482d-b6ef-b6cf3ec5a8c0', code: 'GT-TO', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Flag_of_Totonicapán_Department.svg' },
    { name: 'Zacapa', uuid: 'cfdc2ff6-ea0c-4a3f-894c-b6d43cea9b8e', code: 'GT-ZA', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Flag_of_Zacapa_Department.svg' },

    // --- Guyana (Regions) ---
    { name: 'Barima-Waini', uuid: '9818a652-2ac1-4ab4-a0e3-8f2a9592bd08', code: 'GY-BA', url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Flag_of_Barima-Waini%2C_Guyana.svg' },
    { name: 'Cuyuni-Mazaruni', uuid: '1ae545d8-db73-431c-b99c-b955156f90fe', code: 'GY-CU', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Yellow%2C_white%2C_green_flag.svg' },
    { name: 'Demerara-Mahaica', uuid: '7d988377-b1c4-4df7-aa12-4a8b1c336f4e', code: 'GY-DE', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Red_and_black_flag.svg' },
    { name: 'East Berbice-Corentyne', uuid: '4c2fa825-7154-454f-ab3c-c9d0fb8302fa', code: 'GY-EB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Green_and_red_flag.svg' },
    { name: 'Essequibo Islands-West Demerara', uuid: 'c94c172c-5f3b-4f74-87e5-3c5f0e30fb87', code: 'GY-ES', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flagge_Preußen_-_Provinz_Westfalen_%281882%29.svg' },
    { name: 'Mahaica-Berbice', uuid: '1eff1841-1ed8-46d0-affe-49678636f8f3', code: 'GY-MA', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_black_green_5x3.svg' },
    { name: 'Pomeroon-Supenaam', uuid: '2d62cb59-02f7-4e6d-8cfa-22bb4542e266', code: 'GY-PM', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Flag_white_green_5x3.svg' },
    { name: 'Potaro-Siparuni', uuid: '6c066aaf-7128-4308-9e12-c00c5642bc58', code: 'GY-PT', url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Green%2C_black%2C_yellow_flag.svg' },
    { name: 'Upper Demerara-Berbice', uuid: '7d60616f-2bf0-475e-ab10-b2308bcf6452', code: 'GY-UD', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Flag_yellow_black_5x3.svg' },
    { name: 'Upper Takutu-Upper Essequibo', uuid: '336125c7-1a78-4b8d-a0d4-5d54c5a1aa13', code: 'GY-UT', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Flag_green_white_red_5x3.svg' },

    // --- Honduras (Departments) ---
    { name: 'Atlántida', uuid: '9f3686fa-b022-4329-849c-bb772bb81713', code: 'HN-AT', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_Of_Atlantida_Department.png' },
    { name: 'Colón', uuid: '678650df-e006-487a-8ec8-4c07512f0cad', code: 'HN-CL', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Flag_of_Colon_Department.svg' },
    { name: 'Comayagua', uuid: '16b06058-acd1-4b11-be5c-6504a4a88d2d', code: 'HN-CM', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Bandera_del_departamento_de_Comayagua.png' },
    { name: 'Copán', uuid: '1e1630b2-558a-4d6f-987a-c89b626ff7fb', code: 'HN-CP', url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Bandera_de_Copán.svg' },
    { name: 'Cortés', uuid: '693f589c-86aa-4d7b-b30a-33d76dc8c7c5', code: 'HN-CR', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Bandera_Cortés.png' },
    { name: 'El Paraíso', uuid: '03b41cf7-3527-4f55-8cb0-a38e7b81378c', code: 'HN-EP', url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Bandera_del_Paraíso.png' },
    { name: 'Francisco Morazán', uuid: '40a56626-6726-4a5d-8b4c-9ac9a19aa896', code: 'HN-FM', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Tegucigalpa.svg' },
    { name: 'Gracias a Dios', uuid: '1b24c330-d503-4406-8cc8-c1e8dbe7d5a6', code: 'HN-GD', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Bandera_de_Gracias_a_Dios.png' },
    { name: 'Intibucá', uuid: '44e794af-a746-43c9-b9f0-5e8ba5a1e62f', code: 'HN-IN', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Bandera_de_Intibucá.svg' },
    { name: 'Islas de la Bahía', uuid: '023ef0f6-7380-4e1c-bd45-bc3148da2e9b', code: 'HN-IB', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Flag_of_the_Governor_of_British_Honduras_%281884–1981%29.svg' },
    { name: 'La Paz', uuid: '365d7773-1614-4f88-8046-673de60c80ba', code: 'HN-LP', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/La_Paz_bandera.png' },
    { name: 'Lempira', uuid: 'b4261204-ff32-4ebc-b020-1afdc6a3ac67', code: 'HN-LE', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Lempira_Bandera.png' },
    { name: 'Ocotepeque', uuid: '9920954c-aaa6-40d9-a593-44f100d0e0cc', code: 'HN-OC', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Bandera_de_Ocotepeque.svg' },
    { name: 'Olancho', uuid: '12a03011-1e06-45d5-b46d-406acfa39c22', code: 'HN-OL', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Flag_of_Olancho_Department%2C_Honduras.svg' },
    { name: 'Santa Bárbara', uuid: 'bc55a120-dcb1-41c1-93a0-b5f9121ed524', code: 'HN-SB', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Bandera_de_Santa_Barbara_Honduras.svg' },
    { name: 'Valle', uuid: '16dcfbd0-0d59-43be-8eff-b92d17bac8bb', code: 'HN-VA', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Valle_de_angeles_Flag.jpg' },

    // --- Hungary (Counties) ---
    { name: 'Bács-Kiskun', uuid: '87f750a3-698a-461a-9d4d-ffdf1c8ea32d', code: 'HU-BK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_B%C3%A1cs-Kiskun_County.svg' },
    { name: 'Baranya', uuid: '321a81c0-c248-4194-8a3b-07795e9d4403', code: 'HU-BA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Baranya_County.svg' },
    { name: 'Békés', uuid: '70b1bdc5-eaf5-4881-8bd8-fdc2bf1335dc', code: 'HU-BE', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/FLAG-Békés-megye.svg' },
    { name: 'Borsod-Abaúj-Zemplén', uuid: '38faff13-04a6-4b99-b942-59794e9f05c9', code: 'HU-BZ', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/FLAG-Borsod-Abaúj-Zemplén-megye.svg' },
    { name: 'Csongrád', uuid: 'b764933f-6ac1-4084-8fe2-4bcc5cab9eca', code: 'HU-CS', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Flag_of_Csongrad-Csanad_megye.svg' },
    { name: 'Fejér', uuid: 'bd61cca1-ac7c-4159-a5d1-4c4ec5f85825', code: 'HU-FE', url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/FLAG-Fejér-megye.svg' },
    { name: 'Győr-Moson-Sopron', uuid: '3500d466-d94c-43ad-bfed-c6449d8b7ce7', code: 'HU-GS', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/FLAG-Gyor-Moson-Sopron-megye.svg' },
    { name: 'Hajdú-Bihar', uuid: 'b8ceefc4-8cd2-47a2-b2f5-0e98d4f9628c', code: 'HU-HB', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/FLAG-Hajdú-Bihar-megye.svg' },
    { name: 'Heves', uuid: '74c42553-f3ba-4dcf-85c6-5b118bb2eff6', code: 'HU-HE', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/FLAG-Heves-megye.svg' },
    { name: 'Jász-Nagykun-Szolnok', uuid: 'bf5a9e53-1f62-4f0d-a410-228a6766100a', code: 'HU-JN', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/FLAG-Jasz-Nagykun-Szolnok.svg' },
    { name: 'Komárom-Esztergom', uuid: '0c71a6e8-b96f-4f51-9521-26e9d8015fbd', code: 'HU-KE', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/FLAG-Komárom-Esztergom-megye.svg' },
    { name: 'Nógrád', uuid: 'f327094d-c57e-4550-a768-e6a122137f2b', code: 'HU-NO', url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/FLAG-Nograd.svg' },
    { name: 'Pest', uuid: 'b96293b9-ebde-4b1c-afad-f8e613d4e598', code: 'HU-PE', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/FLAG-Pest-megye.svg' },
    { name: 'Somogy', uuid: '0e336969-e4f8-4576-9210-228e02917da1', code: 'HU-SO', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/FLAG-Somogy-megye.svg' },
    { name: 'Szabolcs-Szatmár-Bereg', uuid: 'd9b98083-be42-49b5-81f0-ec1698dcfe2c', code: 'HU-SZ', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag-Szabolcs-Szatmar-Bereg-megye.svg' },
    { name: 'Tolna', uuid: '5a6ad14a-a8ed-4ca1-901a-b470d0304d4f', code: 'HU-TO', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/FLAG-Tolna-megye.svg' },
    { name: 'Vas', uuid: 'f2a68f3b-0db3-4122-ae86-8564d025e298', code: 'HU-VA', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/FLAG-Vas-megye.svg' },
    { name: 'Veszprém', uuid: '4471c682-968c-451c-a36b-00ff448e4185', code: 'HU-VE', url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/FLAG-Veszprém-megye.svg' },
    { name: 'Zala', uuid: '5f10ff36-dd74-42ee-8aa0-7fe7779956e4', code: 'HU-ZA', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/FLAG-Zala-megye.svg' },
    // --- Hungary (Autonomous City) ---
    { name: 'Budapest', uuid: 'f1ac379f-8cd3-45c3-8da0-80c429b36c5e', code: 'HU-BU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Budapest.svg' },

    // --- India (Region) ---
    { name: 'Andaman and Nicobar Islands', uuid: 'efacd46e-bcd2-4d29-9dcd-e36d8ff9348d', code: 'IN-AN', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Andaman_and_Nicobar_Administration_Banner.png' },
    { name: 'Andhra Pradesh', uuid: '87e57205-0790-47c0-90ad-63a6888c99d9', code: 'IN-AP', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Government_Banner_of_Andhra_Pradesh.svg' },
    { name: 'Bihar', uuid: '8b7a43fc-0719-4cf5-b570-00a903a40ec5', code: 'IN-BR', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Bihar_Government_Banner.png' },
    { name: 'Chandigarh', uuid: 'f883deef-5c07-4aa1-853b-96f5900f81b9', code: 'IN-CH', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Flag_of_Chandigarh.svg' },
    { name: 'Delhi', uuid: 'ae724c3f-35ab-41f6-aa97-07c63f778fca', code: 'IN-DL', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Flag_of_Delhi_Capital_Territory.svg' },
    { name: 'Goa', uuid: '50332d7b-4cf9-4947-a791-b8ff95b07767', code: 'IN-GA', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Flag_of_Goa%2C_India.svg' },
    { name: 'Haryana', uuid: 'ca888285-6e73-4823-8843-267b01dc0480', code: 'IN-HR', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Haryana.svg' },
    { name: 'Himachal Pradesh', uuid: 'bff0c577-eed0-4496-a0d3-9f34d12fd174', code: 'IN-HP', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Government_Banner_of_Himachal_Pradesh.svg' },
    { name: 'Jammu and Kashmir', uuid: '6c9c57c7-b882-4bd1-936b-f2bb4ac466b2', code: 'IN-JK', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Jammu_and_Kashmir_%281952-2019%29.svg' },
    { name: 'Jharkhand', uuid: '31c0eb71-18a4-4946-97a7-d732a35cb08f', code: 'IN-JH', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Jharkhand.svg' },
    { name: 'Karnataka', uuid: '0ca39eb5-3e8a-4447-8ac9-f3f1e83f97c9', code: 'IN-KA', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Karnataka_Flag_Proposal.png' },
    { name: 'Kerala', uuid: 'b93b3304-38fb-4615-8d7b-fda24616d825', code: 'IN-KL', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Kerala.png' },
    { name: 'Lakshadweep', uuid: '4dbeee93-758b-4cf9-8130-b98fa6ce3795', code: 'IN-LD', url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Flag_of_Lakshadweep.png' },
    { name: 'Madhya Pradesh', uuid: '48adc76b-4299-4b06-bbd5-d1d0e3b98469', code: 'IN-MP', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Flag_of_Madhya_Pradesh.svg' },
    { name: 'Maharashtra', uuid: '02d26ad7-9445-42ee-8434-229698918c70', code: 'IN-MH', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Maharashtra.svg' },
    { name: 'Manipur', uuid: 'd655bb1e-a215-4419-bd17-3272d9ea3ea7', code: 'IN-MN', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_the_Government_of_Manipur.svg' },
    { name: 'Meghalaya', uuid: '6db6caf3-97aa-4fde-b795-5b7aa4dc1034', code: 'IN-ML', url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Banner_of_Meghalaya.png' },
    { name: 'Mizoram', uuid: '0775a6c9-b261-4c7e-9cdb-3f5f66da0b2e', code: 'IN-MZ', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Mizoram_Flag%28INDIA%29.png' },
    { name: 'Odisha', uuid: '6525c3dc-8fae-4c85-9fbc-5f13f5cda3fe', code: 'IN-OD', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_Odisha.svg' },
    { name: 'Puducherry (Pondicherry)', uuid: 'c8ede064-85bd-4d63-a2a2-d8414d845817', code: 'IN-PY', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Puducherry_Flag%28INDIA%29.png' },
    { name: 'Punjab', uuid: '8df37637-2eb2-424b-9e1d-c90586509826', code: 'IN-PB', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Emblem_of_Punjab_%28India%29_on_a_white_background_%281%29.png' },
    { name: 'Sikkim', uuid: '769e13af-3580-4cf6-9a84-94105bdb0910', code: 'IN-SK', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_the_Government_of_Sikkim.svg' },
    { name: 'Tamil Nadu', uuid: '150d0e1b-2416-4f23-ba79-e9c677324ad6', code: 'IN-TN', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Proposed_flag_of_Tamil_Nadu.svg' },
    { name: 'Uttarakhand', uuid: 'b9b5b779-2343-4e72-a1d2-e050391fac28', code: 'IN-UK', url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Flag_of_Uttarakhand.svg' },
    { name: 'Uttar Pradesh', uuid: '842ce4dd-4e61-420d-aabf-f3005487ce60', code: 'IN-UP', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Uttar_Pradesh.svg' },

    // --- Ireland (Provinces) ---
    { name: 'Connaught', uuid: '99c3f001-64d3-4174-a302-fb14204117af', code: 'IE-C', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Connacht.svg' },
    { name: 'Leinster', uuid: 'e673d48d-9eec-4941-a5fe-9e6c330f9b26', code: 'IE-L', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Leinster.svg' },
    { name: 'Munster', uuid: 'f5ecb4b1-b287-4b01-9d7a-7c366ede50f9', code: 'IE-M', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Munster.svg' },
    { name: 'Ulster', uuid: '7340c1ff-5c2b-4871-b557-efbaa557ee17', code: 'IE-U', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ulster.svg' },

    // --- Italy (Regions) ---
    { name: 'Abruzzo', uuid: '3b8ff9c2-2e0c-460c-8ac8-e1625db6a0ad', code: 'IT-65', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Abruzzo.svg' },
    { name: 'Basilicata', uuid: '7fa7a14b-23ef-4028-bb54-0b8b544c07bd', code: 'IT-77', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Basilicata.svg' },
    { name: 'Calabria', uuid: 'b051b208-5a5b-41b4-94e0-183ce1fbefef', code: 'IT-78', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Calabria.svg' },
    { name: 'Campania', uuid: 'f05bf3f9-6678-499a-85c0-4edcd24e3c27', code: 'IT-72', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Campania.svg' },
    { name: 'Emilia-Romagna', uuid: '08bd9a29-34cb-4a72-b9ed-ff848aef6539', code: 'IT-45', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Emilia-Romagna.svg' },
    { name: 'Friuli-Venezia Giulia', uuid: '3fdd79f3-689d-46d0-941c-bd9e39476176', code: 'IT-36', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Friuli-Venezia_Giulia.svg' },
    { name: 'Lazio', uuid: 'eb9db460-9767-4cf5-a506-ba783e9ea8db', code: 'IT-62', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Lazio.svg' },
    { name: 'Liguria', uuid: '7ebb7fd2-397e-4d2b-9d24-1bf09a931640', code: 'IT-42', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Liguria.svg' },
    { name: 'Lombardia', uuid: 'e9534cdf-f4d6-4346-bfbe-6a34619e518a', code: 'IT-25', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Lombardy.svg' },
    { name: 'Marche', uuid: '68128c9e-8532-487a-9f68-2d19d2137f02', code: 'IT-57', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Marche.svg' },
    { name: 'Molise', uuid: 'e6f96a92-0f37-4dde-87ac-2b8953616790', code: 'IT-67', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Molise.svg' },
    { name: 'Piemonte', uuid: '19dd435b-38bf-444f-b010-610cbbd3806f', code: 'IT-21', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Piedmont.svg' },
    { name: 'Puglia', uuid: '0a01b41f-a8dd-4223-907e-aa9b45a0f958', code: 'IT-75', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Apulia.svg' },
    { name: 'Sardegna', uuid: '166da62d-c492-481f-b98e-cc2069e0e0d7', code: 'IT-88', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sardinia.svg' },
    { name: 'Sicilia', uuid: 'd4c33fca-8194-4c8f-824c-9df8717138cc', code: 'IT-82', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sicily.svg' },
    { name: 'Toscana', uuid: '759d90ac-bc28-4f4a-97d5-f26cd751cc5f', code: 'IT-52', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tuscany.svg' },
    { name: 'Trentino-Alto Adige', uuid: '19a7a4c5-d897-4ab0-9657-632b1878c91c', code: 'IT-32', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Trentino-South_Tyrol.svg' },
    { name: 'Umbria', uuid: '76c96288-1551-4570-a7e2-2a778119c73f', code: 'IT-55', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Umbria.svg' },
    { name: 'Valle d\'Aosta', uuid: 'fc7bbbe5-5fa7-4695-b32e-f919f0017843', code: 'IT-23', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Aosta_Valley.svg' },
    { name: 'Veneto', uuid: 'a98ab30d-fb0f-491a-933a-154e3d77a8e0', code: 'IT-34', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Veneto.svg' },

    // --- Japan (Prefectures) ---
    { name: 'Aichi', uuid: '4b190b90-aafd-4d87-8a51-95a710516176', code: 'JP-23', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Aichi_Prefecture.svg' },
    { name: 'Akita', uuid: '503b016a-1878-452f-adf5-945d78a2d4be', code: 'JP-05', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Akita_Prefecture.svg' },
    { name: 'Aomori', uuid: 'a00b9b0a-4a5e-4e1a-8783-4b49f92ef38c', code: 'JP-02', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Aomori_Prefecture.svg' },
    { name: 'Chiba', uuid: '19378e7c-fbdb-4fa4-afde-cb6b3e8273a7', code: 'JP-12', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Chiba_Prefecture.svg' },
    { name: 'Ehime', uuid: '6bc97773-0ce2-40b8-b6de-4aaeef48ad4c', code: 'JP-38', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ehime_Prefecture.svg' },
    { name: 'Fukui', uuid: 'e8c2fe30-d877-47cf-9d61-9b6f1070264f', code: 'JP-18', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Fukui_Prefecture.svg' },
    { name: 'Fukuoka', uuid: '13927ab7-c09b-4661-91ab-1692baf7ea1d', code: 'JP-40', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Fukuoka_Prefecture.svg' },
    { name: 'Fukushima', uuid: 'dcb36c4a-6620-48b9-98b8-fbe11261c214', code: 'JP-07', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Fukushima_Prefecture.svg' },
    { name: 'Gifu', uuid: '78221e03-dd54-4999-9ef0-c7435da86373', code: 'JP-21', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Gifu_Prefecture.svg' },
    { name: 'Gunma', uuid: '2ee4929f-2567-44b8-9636-0c21c3b1cd54', code: 'JP-10', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Gunma_Prefecture.svg' },
    { name: 'Hiroshima', uuid: 'b897dfb0-80a0-4600-a211-5e60054e231e', code: 'JP-34', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Hiroshima_Prefecture.svg' },
    { name: 'Hokkaido', uuid: 'bc6f57a5-4c6d-4d72-bc32-acf61f26eb91', code: 'JP-01', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Hokkaido.svg' },
    { name: 'Hyogo', uuid: '6bc4277c-a86e-48f0-9541-57dca26f9762', code: 'JP-28', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Hyogo_Prefecture.svg' },
    { name: 'Ibaraki', uuid: 'f6b1fe55-743e-4cd5-87de-06cb58e91e01', code: 'JP-08', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ibaraki_Prefecture.svg' },
    { name: 'Ishikawa', uuid: '464ef97e-15cb-485e-b467-f889ff0a9d5b', code: 'JP-17', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ishikawa_Prefecture.svg' },
    { name: 'Iwate', uuid: '8f87edc6-85f0-4855-96b7-4cd11ba62ad5', code: 'JP-03', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Iwate_Prefecture.svg' },
    { name: 'Kagawa', uuid: 'df6bafde-24e7-4724-a242-c56dd7fbef4e', code: 'JP-37', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kagawa_Prefecture.svg' },
    { name: 'Kagoshima', uuid: '09ebc145-5447-43d5-8cfd-5b4a5576061d', code: 'JP-46', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kagoshima_Prefecture.svg' },
    { name: 'Kanagawa', uuid: '1f43adbe-9020-40bd-9fb9-82b2905acfb5', code: 'JP-14', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kanagawa_Prefecture.svg' },
    { name: 'Kochi', uuid: '3eba4b17-66b7-4683-80b2-950b39b34b4d', code: 'JP-39', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kochi_Prefecture.svg' },
    { name: 'Kumamoto', uuid: 'c0ddb140-326b-4922-96e3-bcc0a0981b8c', code: 'JP-43', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kumamoto_Prefecture.svg' },
    { name: 'Kyoto', uuid: '8ff1831b-3350-489f-ac91-1975ab38331e', code: 'JP-26', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kyoto_Prefecture.svg' },
    { name: 'Mie', uuid: '790ef8a3-4aec-4bc8-99bc-849371ee8bce', code: 'JP-24', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Mie_Prefecture.svg' },
    { name: 'Miyagi', uuid: '15a06d88-b016-4750-b4ae-4beeae88b168', code: 'JP-04', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Miyagi_Prefecture.svg' },
    { name: 'Miyazaki', uuid: 'c3d3372f-03d2-422d-8afa-3f2254d89e8f', code: 'JP-45', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Miyazaki_Prefecture.svg' },
    { name: 'Nagano', uuid: 'a8f328ca-13b1-4cc2-be40-af90fe725921', code: 'JP-20', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Nagano_Prefecture.svg' },
    { name: 'Nagasaki', uuid: '27d70482-81c7-4b78-813a-86ad2799b7b5', code: 'JP-42', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Nagasaki_Prefecture.svg' },
    { name: 'Nara', uuid: 'f0345340-2049-47bb-85e3-043d3e4f11b2', code: 'JP-29', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Nara_Prefecture.svg' },
    { name: 'Niigata', uuid: 'd14e3665-978f-4c0b-b330-fca6fe7382ea', code: 'JP-15', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Niigata_Prefecture.svg' },
    { name: 'Oita', uuid: 'adb87e7d-8296-43fd-996e-336517acb4e5', code: 'JP-44', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Oita_Prefecture.svg' },
    { name: 'Okayama', uuid: '6cbbf21b-5ef8-45a4-a4e0-bc7b652f2811', code: 'JP-33', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Okayama_Prefecture.svg' },
    { name: 'Okinawa', uuid: 'ff6ef0b9-0b41-4697-bd55-8619ad4a196c', code: 'JP-47', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Okinawa_Prefecture.svg' },
    { name: 'Osaka', uuid: '884d4a48-c134-4311-830e-38e7ee4100a5', code: 'JP-27', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Osaka_Prefecture.svg' },
    { name: 'Saga', uuid: '6ef6b0e0-7aca-4700-8d01-c14c2f36dbcc', code: 'JP-41', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Saga_Prefecture.svg' },
    { name: 'Saitama', uuid: '2b42a551-6766-4b7a-b07f-e947be599926', code: 'JP-11', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Saitama_Prefecture.svg' },
    { name: 'Shiga', uuid: 'da34d737-7547-4e91-a0a5-7920dcde3c24', code: 'JP-25', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Shiga_Prefecture.svg' },
    { name: 'Shimane', uuid: '755433f5-85fc-4d41-8975-d25bd8b5589b', code: 'JP-32', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Shimane_Prefecture.svg' },
    { name: 'Shizuoka', uuid: 'a5775651-56fb-49cb-a540-c470ed12b37b', code: 'JP-22', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Shizuoka_Prefecture.svg' },
    { name: 'Tochigi', uuid: '6f0b20a9-8e35-4fd5-92bc-57017570a9ce', code: 'JP-09', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tochigi_Prefecture.svg' },
    { name: 'Tokushima', uuid: 'da3ba6e6-6602-43f1-868a-412a0269dd87', code: 'JP-36', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tokushima_Prefecture.svg' },
    { name: 'Tokyo', uuid: '8dc97297-ac95-4d33-82bc-e07fab26fb5f', code: 'JP-13', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tokyo_Metropolis.svg' },
    { name: 'Tottori', uuid: '22d033ff-2b07-41d5-9394-e167ebf13557', code: 'JP-31', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tottori_Prefecture.svg' },
    { name: 'Toyama', uuid: '5f376466-8ee0-4803-b781-c59479ed5cec', code: 'JP-16', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Toyama_Prefecture.svg' },
    { name: 'Wakayama', uuid: '0f227faf-02a2-41dc-9880-8157626d55aa', code: 'JP-30', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Wakayama_Prefecture.svg' },
    { name: 'Yamagata', uuid: 'e8b89635-8f58-4d90-9db0-e0e5706de4b3', code: 'JP-06', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Yamagata_Prefecture.svg' },
    { name: 'Yamaguchi', uuid: 'e3e7bb57-f90c-4572-a628-e25d8d5397d6', code: 'JP-35', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Yamaguchi_Prefecture.svg' },
    { name: 'Yamanashi', uuid: '3a2b1ec7-c003-4f38-bf13-f4aefc994b5b', code: 'JP-19', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Yamanashi_Prefecture.svg' },

    // --- Kenya (Counties) ---
    { name: 'Kakamega County', uuid: 'a4d61696-08f0-4ba3-9ce0-dd330cdeb72f', code: 'KE-11', url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Kakamega_County.gif' },
    { name: 'Kisii County', uuid: 'adcd623b-bcbb-47ec-9669-3f44f903390e', code: 'KE-16', url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Flag_of_Kisii_County.gif' },
    { name: 'Kisumu County', uuid: '0c72afd8-7b22-45e3-883c-2a86a1b9708a', code: 'KE-17', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Kisumu_County.png' },
    { name: 'Laikipia County', uuid: '69ee8bca-a163-49f4-8ef4-fb546d2879b0', code: 'KE-20', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Laikipia_County.png' },
    { name: 'Mombasa County', uuid: '822b5821-eac1-4c1a-bdf2-c0f995ffcf0b', code: 'KE-28', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_Mombasa_County.png' },
    { name: 'Nairobi County', uuid: '1daf3c54-771e-4d33-9fc3-445d6419f8a0', code: 'KE-30', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Flag_of_Nairobi_County.svg' },
    { name: 'Taita–Taveta County', uuid: '39cd63ac-afc3-4c25-a4d5-8a33e8ba4fc5', code: 'KE-39', url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Taita_Taveta_County.png' },
    { name: 'Uasin Gishu County', uuid: 'e3120b6f-ee12-40df-be12-5f2fa4a2520f', code: 'KE-44', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Uasin_Gishu_County.gif' },
    // --- Kenya (Cities) ---
    { name: 'Mombasa', uuid: '0782e67a-4326-41e3-a49c-7db270efd87a', code: 'KE-MBS', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Mombasa_flag.png' },
    { name: 'Nairobi', uuid: '4cc373f3-8b60-400b-8aa3-6df3fe4ab8fb', code: 'KE-NRB', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Nairobi.svg' },

    // --- Kyrgyzstan (Regions) ---
    { name: 'Batken', uuid: '8193d2e8-7cf8-4dbe-9e76-c343061a6d78', code: 'KG-B', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Batken_obl_flag.svg' },
    { name: 'Chü', uuid: 'f52fe40a-c66b-4223-929b-b9de86e65e1d', code: 'KG-C', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Flag_of_Chuy_Province.svg' },
    { name: 'Jalal-Abad', uuid: 'c5c55fae-692f-4c0f-9a52-c6d5172a841d', code: 'KG-J', url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Flag_of_Jalal-Abad_Region.svg' },
    { name: 'Naryn', uuid: '4340d4ce-7e4a-436b-a358-a1e236f48ae5', code: 'KG-N', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Naryn_obl_flag.svg' },
    { name: 'Osh', uuid: 'f23f3a0d-ec0c-4534-89ab-24947c1a0404', code: 'KG-O', url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Flag_of_Osh.svg' },
    { name: 'Talas', uuid: 'c82a593e-6d45-4364-a160-13794c6cd6fa', code: 'KG-T', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Talas_Province_Kyrgyzstan.svg' },
    { name: 'Ysyk-Köl', uuid: '35aa7428-2d82-4521-89d7-504219d9d54a', code: 'KG-Y', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Issyk-Kul_Region.svg' },
    // --- Kyrgyzstan (Cities) ---
    { name: 'Bishkek', uuid: '8e148744-f4d0-49fc-875b-b01f43adcc75', code: 'KG-GB', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Bishkek.svg' },
    { name: 'Osh', uuid: 'd07c1bbc-94ab-492f-8320-29e4e55218db', code: 'KG-GO', url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Flag_of_Osh.svg' },

    // --- Liberia (Counties) ---
    { name: 'Bomi', uuid: 'c2d218fd-916b-46e8-b675-1cbb13f04118', code: 'LR-BM', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Flag_of_Bomi_County.svg' },
    { name: 'Bong', uuid: 'babc18a8-cecc-40bf-b466-d389ff27acf4', code: 'LR-BG', url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Flag_of_Bong_County.svg' },
    { name: 'Gbarpolu', uuid: '7736c174-0649-4a0a-9b44-c872d1ed96dd', code: 'LR-GP', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Flag_of_Gbarpolu_County.svg' },
    { name: 'Grand Bassa', uuid: '2fc21911-7579-4a94-80a3-aa44a0fa0020', code: 'LR-GB', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Grand_Bassa_County.svg' },
    { name: 'Grand Cape Mount', uuid: '5c97139a-e426-4535-9c4b-967bb0ffaa27', code: 'LR-CM', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Grand_Cape_Mount_County.svg' },
    { name: 'Grand Gedeh', uuid: 'b655a7f5-e143-4cdf-ac43-da7ab055f801', code: 'LR-GG', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Grand_Gedeh_County.svg' },
    { name: 'Grand Kru', uuid: '7388db1d-1039-4861-af3e-2c4a0381b1c2', code: 'LR-GK', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Grand_Kru_County.svg' },
    { name: 'Lofa', uuid: 'c5f2471a-3da7-47a2-be41-026fc9d3f174', code: 'LR-LO', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_Lofa_County.svg' },
    { name: 'Margibi', uuid: '52aca24c-161c-4e18-a777-b5b625dad52e', code: 'LR-MG', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Margibi_County.svg' },
    { name: 'Maryland', uuid: '422ad54b-0d5f-4fc4-9142-920868320649', code: 'LR-MY', url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Flag_of_Maryland_County.svg' },
    { name: 'Montserrado', uuid: 'd777437d-cafe-4c80-84a2-8d68b64a9a74', code: 'LR-MO', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Montserrado_County.svg' },
    { name: 'Nimba', uuid: '9bb5d1ef-e346-4114-8bea-b18117ead23a', code: 'LR-NI', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Flag_of_Nimba_County.svg' },
    { name: 'Rivercess', uuid: '2b470769-eb21-440a-ba1b-0b178fe5809e', code: 'LR-RI', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Flag_of_Rivercess_County.svg' },
    { name: 'River Gee', uuid: '7d195291-4565-4031-b748-ec51c14d760d', code: 'LR-RG', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_River_Gee_County.svg' },
    { name: 'Sinoe', uuid: '60d19394-fc82-478e-986e-a0cdd1125463', code: 'LR-SI', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_Sinoe_County.svg' },

    // --- Lithuania (Counties) ---
    { name: 'Alytaus Apskritis', uuid: '20825a37-55e4-495f-ab6a-327494fbcf5e', code: 'LT-AL', url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Alytus_County_flag.svg' },
    { name: 'Kauno Apskritis', uuid: 'baf172aa-1aac-40e6-9949-fe180351fe5e', code: 'LT-KU', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/LTU_Kauno_apskritis_flag.svg' },
    { name: 'Klaipėdos Apskritis', uuid: 'f856fca3-7de4-4f13-835f-e7f237f25a6b', code: 'LT-KL', url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/LTU_Klaipėdos_apskritis_flag.svg' },
    { name: 'Marijampolės Apskritis', uuid: '6c4082aa-548d-4649-b8b8-0f62ddc3fdd5', code: 'LT-MR', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Marijampole_County_flag.svg' },
    { name: 'Panevėžio Apskritis', uuid: '566d632a-664a-4bb9-8ef3-cb04f774d444', code: 'LT-PN', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Panevezys_County_flag.svg' },
    { name: 'Šiaulių Apskritis', uuid: 'bf011bec-23e1-44ea-b84a-ef9e57760fcf', code: 'LT-SA', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Siauliai_County_flag.svg' },
    { name: 'Tauragės Apskritis', uuid: 'd3472619-cc55-4577-857f-c3e99370acd8', code: 'LT-TA', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Taurage_County_flag.svg' },
    { name: 'Telšių Apskritis', uuid: '814355cf-e60d-495b-96ca-ff94325da291', code: 'LT-TE', url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Telšiai_County_flag.svg' },
    { name: 'Utenos Apskritis', uuid: 'fbdb4d9c-d65a-49cf-896f-6df8141aa8e6', code: 'LT-UT', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Utena_County_flag.svg' },
    { name: 'Vilniaus Apskritis', uuid: '7c4c9ad2-aed7-4b60-b694-281936d7133f', code: 'LT-VL', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Vilnius_County_flag.svg' },

    // --- Malaysia (States) ---
    { name: 'Johor', uuid: '7074ad56-379d-4298-bb88-80fdf249cf86', code: 'MY-01', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Johor.svg' },
    { name: 'Kedah', uuid: '4aba1d2e-5b87-49b4-a0e4-128897d999c1', code: 'MY-02', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Flag_of_Kedah.svg' },
    { name: 'Kelantan', uuid: '25fd48af-150e-45fb-bf1e-2c268eb668a2', code: 'MY-03', url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Flag_of_Kelantan.svg' },
    { name: 'Melaka', uuid: '41e3bd81-5107-4c6d-9e34-740b1f40fc77', code: 'MY-04', url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_Malacca.svg' },
    { name: 'Negeri Sembilan', uuid: '82a31662-e192-4b17-a650-79b5b23adc5b', code: 'MY-05', url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Flag_of_Negeri_Sembilan.svg' },
    { name: 'Pahang', uuid: '866822a9-5230-4293-9b43-257fc1e07eeb', code: 'MY-06', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Pahang.svg' },
    { name: 'Perak', uuid: 'cf701d61-32b2-4306-b9cc-5659ef2db694', code: 'MY-08', url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Flag_of_Perak.svg' },
    { name: 'Perlis', uuid: 'c753bdc6-9204-4417-af15-93a4994a0f22', code: 'MY-09', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Perlis.svg' },
    { name: 'Pulau Pinang', uuid: '92f6eade-9f6d-4370-87ad-b9f3ffa573b0', code: 'MY-07', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Penang_%28Malaysia%29.svg' },
    { name: 'Sabah', uuid: '4f73b407-722a-430b-af40-e477029ae6f8', code: 'MY-12', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Flag_of_Sabah.svg' },
    { name: 'Sarawak', uuid: '05fa380d-3ced-4ff7-a005-ff2e7f4d05b0', code: 'MY-13', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Flag_of_Sarawak.svg' },
    { name: 'Selangor', uuid: 'e5119ed0-a74d-46fe-ba24-efe5c39d8797', code: 'MY-10', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Flag_of_Selangor.svg' },
    { name: 'Terengganu', uuid: '915dd65b-5f2e-4f96-a02d-32deb7989de7', code: 'MY-11', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Flag_of_Terengganu.svg' },
    // --- Malaysia (Federal Territories) ---
    { name: 'Kuala Lumpur', uuid: 'b9516e0b-4223-47a6-a64a-8750450c8c05', code: 'MY-14', url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Flag_of_Kuala_Lumpur%2C_Malaysia.svg' },
    { name: 'Putrajaya', uuid: '0814fbc0-db72-487b-ba05-9c83b6cf9af2', code: 'MY-16', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Putrajaya.svg' },
    { name: 'Wilayah Persekutuan Labuan', uuid: 'a79d303b-1873-4357-a59d-5c060dbc2f92', code: 'MY-15', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Labuan.svg' },

    // --- Malta (Local Councils) ---
    { name: 'Attard', uuid: 'd4b55bba-1cab-47e5-afef-7470cb9535c3', code: 'MT-01', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Attard.svg' },
    { name: 'Balzan', uuid: '0c61d6b9-9b63-423c-8d5a-f3d0cbf71c7c', code: 'MT-02', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Balzan.svg' },
    { name: 'Birgu', uuid: 'b24a4962-58f5-4f59-b6e8-71ac3052fbfe', code: 'MT-03', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_Birgu.svg' },
    { name: 'Birkirkara', uuid: '0eaafc54-5bbe-4d56-aebc-1ecb0820bb38', code: 'MT-04', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Birkirkara.svg' },
    { name: 'Birżebbuġa', uuid: 'a746aaaa-c977-4e7a-ad44-1d5f974afbb9', code: 'MT-05', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Flag_of_Birżebbuġa.svg' },
    { name: 'Bormla', uuid: '199b4c80-09b1-4299-a0c6-1020db1589f3', code: 'MT-06', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Bormla.svg' },
    { name: 'Dingli', uuid: '3b368c1e-1882-4e67-a986-e1d3e19c718e', code: 'MT-07', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Dingli.svg' },
    { name: 'Fgura', uuid: '0a269dae-fb3b-4989-abac-c3540ec93870', code: 'MT-08', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Il-Fgura.svg' },
    { name: 'Floriana', uuid: 'ec58bbd3-38bf-48b3-885e-440ec48488fa', code: 'MT-09', url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Flag_of_Floriana.svg' },
    { name: 'Fontana', uuid: 'ec40e7bf-c609-4b2a-a88e-f5d69c4161ce', code: 'MT-10', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Flag_of_Fontana.svg' },
    { name: 'Għajnsielem', uuid: '32a65245-b3b9-4041-9b38-dabe43d9bc3f', code: 'MT-13', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Flag_of_Għajnsielem.svg' },
    { name: 'Għarb', uuid: '255de207-857c-4d2c-9891-d88d70115563', code: 'MT-14', url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Flag_of_Gharb.svg' },
    { name: 'Għargħur', uuid: '2ca322af-ff3e-4da2-9886-6900e64e29b6', code: 'MT-15', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Flag_of_Għargħur.svg' },
    { name: 'Għasri', uuid: '4d4ece48-cb17-43cc-be2f-aa45c1a7c376', code: 'MT-16', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Flag_of_Għasri.svg' },
    { name: 'Għaxaq', uuid: '8246e4cc-7a96-4136-8003-d1e8f6bd8813', code: 'MT-17', url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_Għaxaq.svg' },
    { name: 'Gudja', uuid: '7357b2dd-5a1a-4ff9-a0bf-1624da9a95f4', code: 'MT-11', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Flag_of_Gudja.svg' },
    { name: 'Gżira', uuid: '4cf4b2f5-632b-479f-aa0b-0b2089fafba0', code: 'MT-12', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Flag_of_il-Gżira%2C_Malta.svg' },
    { name: 'Ħamrun', uuid: '3c33438f-3707-4a07-9e47-83af58330853', code: 'MT-18', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Hamrun.svg' },
    { name: 'Iklin', uuid: '6707eae0-db32-41c9-ba59-370b610fc4d1', code: 'MT-19', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Flag_of_Iklin.svg' },
    { name: 'Isla', uuid: '689be2c6-c736-4408-9305-647099a931fe', code: 'MT-20', url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_Isla.svg' },
    { name: 'Kalkara', uuid: 'c6bfe436-de55-42e4-9926-5378546780b6', code: 'MT-21', url: 'https://upload.wikimedia.org/wikipedia/en/0/07/Flag_of_Kalkara%2C_Malta.gif' },
    { name: 'Kerċem', uuid: '142cbf5b-b5d9-4830-a61c-72d1b56099f8', code: 'MT-22', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Flag_of_Kercem.svg' },
    { name: 'Kirkop', uuid: '2c8ab28d-4711-4729-a041-cc0ef57b7ae3', code: 'MT-23', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_Kirkop.svg' },
    { name: 'Lija', uuid: 'a00e5ac7-7ead-43b8-bf2f-a8566f68067d', code: 'MT-24', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Lija.svg' },
    { name: 'Luqa', uuid: '5325595f-eaa5-49e2-9a7b-8d6545e1ea33', code: 'MT-25', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Luqa.svg' },
    { name: 'Marsa', uuid: '106edf2a-16b9-4be1-9fc7-156283464e35', code: 'MT-26', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Flag_of_Marsa.svg' },
    { name: 'Marsaskala', uuid: '4dd3472b-0725-4951-9bcf-9836710ef87b', code: 'MT-27', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Marsaskala.svg' },
    { name: 'Marsaxlokk', uuid: '10990d9a-a144-482d-afb7-37882f58bbd3', code: 'MT-28', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Marsaxlokk.svg' },
    { name: 'Mdina', uuid: 'c56b97bf-408d-478f-aea2-2b8e104e347e', code: 'MT-29', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Mdina%2C_Malta.svg' },
    { name: 'Mellieħa', uuid: '9d7b624e-1e45-4be5-9ba0-ead92bb051f9', code: 'MT-30', url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Flag_of_Mellieħa.svg' },
    { name: 'Mġarr', uuid: 'cdb6c8db-62e1-4d3f-81e2-15e7d7d05b95', code: 'MT-31', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Flag_of_Mġarr.svg' },
    { name: 'Mosta', uuid: '5e61d48c-5130-4cfe-918e-3c84c725c833', code: 'MT-32', url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Mosta.svg' },
    { name: 'Mqabba', uuid: 'bd799e13-3cea-4dda-b18a-9e9801cf0591', code: 'MT-33', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Mqabba.svg' },
    { name: 'Msida', uuid: '8fc59020-6515-4044-b722-e2a8d14b3581', code: 'MT-34', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Msida.svg' },
    { name: 'Mtarfa', uuid: 'fb3dff77-07ae-4ecf-9c2a-d8515378451d', code: 'MT-35', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Flag_of_Mtarfa.svg' },
    { name: 'Munxar', uuid: '802f4678-d78a-43bd-9141-b6a7b67daf16', code: 'MT-36', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Flag_of_Munxar.svg' },
    { name: 'Nadur', uuid: 'be69515e-6e3b-47c2-881e-4def3f177001', code: 'MT-37', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Flag_of_Nadur.svg' },
    { name: 'Naxxar', uuid: '95f5f73a-4b27-4911-82e1-503b0fc3e4ca', code: 'MT-38', url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_Naxxar.svg' },
    { name: 'Paola', uuid: '19236f97-afb7-4db8-abef-c5dbcf4d6848', code: 'MT-39', url: 'https://upload.wikimedia.org/wikipedia/en/5/54/Flag_of_Paola%2C_Malta.gif' },
    { name: 'Pembroke', uuid: 'a57d13e0-867f-410b-8ca2-aaf62a472205', code: 'MT-40', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Flag_of_Pembroke.svg' },
    { name: 'Pietà', uuid: '5b7eb35b-96c6-4c4e-a44b-e854bf93e79e', code: 'MT-41', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Flag_of_Pietà.svg' },
    { name: 'Qala', uuid: '24181220-1438-4ebb-a1b4-31deed12ce3f', code: 'MT-42', url: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Flag_of_Qala.svg' },
    { name: 'Qormi', uuid: '5b652b17-2a35-4dae-9b33-1281822e3049', code: 'MT-43', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Flag_of_Qormi.svg' },
    { name: 'Qrendi', uuid: '192af6d9-7034-46e6-8cfc-9d3d1d5db072', code: 'MT-44', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Flag_of_Qrendi.svg' },
    { name: 'Rabat Għawdex', uuid: 'edb8b0db-b763-4513-b192-3b50cf8c1a25', code: 'MT-45', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Victoria%2C_Gozo.svg' },
    { name: 'Rabat Malta', uuid: '4cdda563-0bbe-4c02-bf38-ee3c0062761e', code: 'MT-46', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Rabat.svg' },
    { name: 'Safi', uuid: '36cd6199-44c6-44c3-ac45-03c1a47578d6', code: 'MT-47', url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Flag_of_Safi.svg' },
    { name: 'San Ġiljan', uuid: 'db49a4b4-f235-4d91-bee6-ff468c7e03f8', code: 'MT-48', url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Flag_of_San_Ġiljan.svg' },
    { name: 'San Ġwann', uuid: '17def498-75f9-4b3b-9dbf-9ac42585c0df', code: 'MT-49', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_San_Ġwann.svg' },
    { name: 'San Lawrenz', uuid: '240ee250-8cc3-4202-b469-5ae941412259', code: 'MT-50', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Flag_of_San_Lawrenz.svg' },
    { name: 'San Pawl il-Baħar', uuid: '838b3056-4fb0-45ca-8dc4-9d05236f1369', code: 'MT-51', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Flag_of_Saint_Paul%27s_Bay.svg' },
    { name: 'Sannat', uuid: '5687fff1-f8d3-49dc-bbba-7d12fd400b9c', code: 'MT-52', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Flag_of_Sannat.svg' },
    { name: 'Santa Luċija', uuid: '6dcce466-a253-4287-bb69-a76274c1ea60', code: 'MT-53', url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_Santa_Lucija.svg' },
    { name: 'Santa Venera', uuid: '0bf6525e-b12f-458e-820d-e3a33e24fff6', code: 'MT-54', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_Santa_Venera.svg' },
    { name: 'Siġġiewi', uuid: '8f5b1376-c6f7-4c3d-8230-2753bb7f8c72', code: 'MT-55', url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Flag_of_Siġġiewi.svg' },
    { name: 'Sliema', uuid: '5f3877fe-ffdd-4cf5-9080-1ef09b1b51d6', code: 'MT-56', url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Flag_of_Sliema.svg' },
    { name: 'Swieqi', uuid: '628c949e-35a9-4610-b697-573938569d07', code: 'MT-57', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Flag_of_Swieqi.svg' },
    { name: 'Ta’ Xbiex', uuid: '21063ac3-d2e9-4273-beee-8c4ce05e546a', code: 'MT-58', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Flag_of_Ta%27_Xbiex.svg' },
    { name: 'Tarxien', uuid: 'ae4f5cb0-b027-4495-80d6-3ec8460ed5ac', code: 'MT-59', url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Flag_of_Tarxien.svg' },
    { name: 'Valletta', uuid: '2aa35979-215b-4398-af7e-f4d8c1abefcb', code: 'MT-60', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Flag_of_Valletta%2C_Malta.svg' },
    { name: 'Xagħra', uuid: '3b812499-b386-4bf9-956a-189e3edba083', code: 'MT-61', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Flag_of_Xagħra.svg' },
    { name: 'Xewkija', uuid: '1a3d147a-edbe-4685-8281-9ee35b276973', code: 'MT-62', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flag_of_Xewkija%2C_Malta.svg' },
    { name: 'Xgħajra', uuid: '6a996bb9-fa7d-4c4e-9988-bcdcdf62f45e', code: 'MT-63', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Xgħajra.svg' },
    { name: 'Żabbar', uuid: 'b6577966-6831-402b-82ea-9bacc7207e34', code: 'MT-64', url: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Flag_of_Żabbar.svg' },
    { name: 'Żebbuġ Għawdex', uuid: '6195b7a7-4ac1-41be-9def-55a0e2f45264', code: 'MT-65', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Żebbuġ%2C_Gozo.svg' },
    { name: 'Żebbuġ Malta', uuid: 'd8c8ad0a-89fd-4b80-996b-8f51037e58b0', code: 'MT-66', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_Żebbuġ.svg' },
    { name: 'Żejtun', uuid: '6a91389c-e3a8-4dbb-a4d7-827763c421ee', code: 'MT-67', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Żejtun.svg' },
    { name: 'Żurrieq', uuid: '973bb75d-9ca6-4790-bdd1-7afc88e7070a', code: 'MT-68', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/New_Flag_of_Żurrieq.svg' },

    // --- Moldova (Districts) ---
    { name: 'Anenii Noi', uuid: 'b2608d40-076f-4a1d-9259-1e9095245835', code: 'MD-AN', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Anenii_Noi_District%2C_Moldova.svg' },
    { name: 'Basarabeasca', uuid: 'fb4b1c1f-b36f-4e40-896d-4028bbfb3609', code: 'MD-BS', url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Basarabeasca_District.svg' },
    { name: 'Briceni', uuid: '172832c4-1ffc-434b-80f0-02b6e2829170', code: 'MD-BR', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Briceni.svg' },
    { name: 'Cahul', uuid: 'eeb60457-b912-416f-a020-841061b707e7', code: 'MD-CA', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_District_Cahul.svg' },
    { name: 'Călăraşi', uuid: '9682fbfc-1d9c-423f-be53-b1a08e1501da', code: 'MD-CL', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Rajon_Calarasi_flag.gif' },
    { name: 'Cantemir', uuid: 'abe712a8-9c84-4a94-b5a8-3bea42d2b78f', code: 'MD-CT', url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Cantemir_District.svg' },
    { name: 'Căuşeni', uuid: 'fe52d424-41c0-42a9-8056-630b66284140', code: 'MD-CS', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Flag_of_Căușeni_District.jpg' },
    { name: 'Cimişlia', uuid: 'c0323b07-92c1-4427-b18a-b3ff356ea8df', code: 'MD-CM', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Cimislia_flag.png' },
    { name: 'Criuleni', uuid: '6b9422f9-9d7c-4ce8-a9ac-198c114b336d', code: 'MD-CR', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Drapel_Raionul_Criuleni.svg' },
    { name: 'Donduşeni', uuid: '33d917cb-22d7-4351-8604-25e85357b7d8', code: 'MD-DO', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Flag_of_Dondușeni_District.svg' },
    { name: 'Drochia', uuid: '5509886c-113c-426a-9dec-75de23d6f69f', code: 'MD-DR', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Drochia_rajon_flag.png' },
    { name: 'Dubăsari', uuid: 'fb848315-1cd7-4c24-969f-1eafa1dbb6c4', code: 'MD-DU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Dubăsari_District_flag.svg' },
    { name: 'Edineţ', uuid: '51a1f33b-c5fa-47c3-9be6-2d11c5f99197', code: 'MD-ED', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Steag_raionul_edinet.svg' },
    { name: 'Făleşti', uuid: '6b79d6bd-77ce-4703-91bf-598c40f6e721', code: 'MD-FA', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Rajon_Fălești_Flag.gif' },
    { name: 'Floreşti', uuid: '83de18b2-e0f7-4d76-9feb-fcb6673f5cf5', code: 'MD-FL', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Florești_District%2C_Moldova.svg' },
    { name: 'Glodeni', uuid: 'fa8a7c35-e232-4094-8c52-37ba47c5a346', code: 'MD-GL', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Flag_of_Glodeni_District.svg' },
    { name: 'Hînceşti', uuid: '81e8ff6f-00d2-4cb3-ace8-f1038537a5ce', code: 'MD-HI', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Hincesti_rajon_flag.svg' },
    { name: 'Ialoveni', uuid: '8c0b4e5b-3f7a-4647-bba0-95680d3b05db', code: 'MD-IA', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Flag_of_Ialoveni_District.gif' },
    { name: 'Leova', uuid: '9216fe0d-4697-4e90-b07c-8b4c584d5b86', code: 'MD-LE', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Drapel_Raionul_Leova.png' },
    { name: 'Nisporeni', uuid: 'd7f67456-4cd3-404d-8d14-e42719b360ce', code: 'MD-NI', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Nisporeni_rajon_flag.gif' },
    { name: 'Ocniţa', uuid: 'c3881809-b508-428c-9355-032a7b93c29f', code: 'MD-OC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Ocnitar.gif' },
    { name: 'Orhei', uuid: '1ce9c958-6e33-4251-8791-e63022887b65', code: 'MD-OR', url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Orhei2.gif' },
    { name: 'Rezina', uuid: 'be831bda-84b0-460c-970e-e40cc19d9fb3', code: 'MD-RE', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Flag_of_District_Rezina.svg' },
    { name: 'Rîşcani', uuid: '4b0ac47c-87f2-4f76-918e-61ce08280293', code: 'MD-RI', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Riscani_rajon_flag.gif' },
    { name: 'Sîngerei', uuid: 'bb4721d4-eff2-487a-aba4-ce2c0721b665', code: 'MD-SI', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Flag_of_Sîngerei_District.svg' },
    { name: 'Şoldăneşti', uuid: '7c0287ce-1e55-4c76-be5e-e146aa118738', code: 'MD-SD', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Soldanesti_rajon_flag.gif' },
    { name: 'Soroca', uuid: '79955053-af72-40fb-9cc0-753d8f36784e', code: 'MD-SO', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_District_Soroca.svg' },
    { name: 'Ştefan Vodă', uuid: 'ba1aee33-13c6-410c-9308-13075327ac67', code: 'MD-SV', url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Stefan_voda_rajon_flag.gif' },
    { name: 'Străşeni', uuid: '91ab404f-d274-4263-9eb1-90297e661e15', code: 'MD-ST', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Straseni_rajon_flag.gif' },
    { name: 'Taraclia', uuid: 'e89c66b4-8ff2-4871-a5f8-24cdfa574ea9', code: 'MD-TA', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Drapel_Raionul_Taraclia.png' },
    { name: 'Teleneşti', uuid: 'ec32ab4a-a6c5-4c64-9490-2a258be17f5c', code: 'MD-TE', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Drapel_Raionul_Telenești.png' },
    { name: 'Ungheni', uuid: '76a59ea6-b65a-4cac-b248-4f254be48596', code: 'MD-UN', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_District_Ungheni.svg' },
    // --- Moldova (Territorial Units) ---
    { name: 'Găgăuzia', uuid: '60c554ba-59e4-4371-9de3-65f8aca040bd', code: 'MD-GA', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Gagauzia.svg' },
    { name: 'Transnistria', uuid: 'cc696318-7de1-4267-89d7-75975326269a', code: 'MD-SN', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Transnistria_%28state%29.svg' },
    // --- Moldova (Cities) ---
    { name: 'Bălţi', uuid: '82fc96f7-22d8-4f39-9288-cf30e1f70c63', code: 'MD-BA', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flag_of_Bălți.png' },
    { name: 'Bender', uuid: '9fe28938-2be6-435b-b682-d3d1249182ed', code: 'MD-BD', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Bendery-Flag.jpg' },
    { name: 'Chişinău', uuid: 'b4c55385-d2ef-45bb-ba47-86adbecaeb01', code: 'MD-CU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Flag_of_Chișinău.svg' },

    // --- Mongolia (Provinces) ---
    { name: 'Arhangay', uuid: 'd97a5302-c0f3-4469-9e95-5bea5f98c065', code: 'MN-073', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Mn_flag_arkhangai_aimag_2014.svg' },
    { name: 'Bayan-Ölgiy', uuid: 'c5128567-32ef-4d25-896d-d7174c916f82', code: 'MN-071', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Mn_flag_bayan_olgiy_aymag.svg' },
    { name: 'Bayanhongor', uuid: '8f2b0832-41f5-4ec2-9c3f-6966da8fac3d', code: 'MN-069', url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Mn_flag_bayankhongor_aymag.png' },
    { name: 'Bulgan', uuid: '2dbf68f8-1fa4-427c-b10b-022ec137d0d1', code: 'MN-067', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Mn_flag_bulgan_aimag_2022.svg' },
    { name: 'Darhan uul', uuid: '49e2023d-b37d-4db6-b360-b8a4a29f8a58', code: 'MN-037', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Mn_flag_darkhan_uul_aymag.svg' },
    { name: 'Dornod', uuid: '0210b86a-2f3d-485b-85dc-725280665d4f', code: 'MN-061', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Mn_flag_dornod_aimag_2001.svg' },
    { name: 'Dornogovĭ', uuid: 'dd402eb2-c19f-46d3-8d47-ff7aa9167e8e', code: 'MN-063', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Mn_flag_dornogovi_aimag_2011.svg' },
    { name: 'Dundgovĭ', uuid: '0f0f8fb8-b0e7-4cea-97af-2ee2f3d1de4b', code: 'MN-059', url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Mn_flag_dundgovi_aimag.svg' },
    { name: 'Dzavhan', uuid: '7318d447-7dc4-499f-ab9b-d1285f8db41c', code: 'MN-057', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Mn_flag_zavkhan_aimag.svg' },
    { name: 'Govĭ-Altay', uuid: 'be962535-fe2c-4ba4-b620-c7e343d7b66b', code: 'MN-065', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Mn_flag_govi-altai_aimag_2011.svg' },
    { name: 'Govĭ-Sümber', uuid: '2e0bb980-f8d7-4e9d-a2f5-648944f5f1f4', code: 'MN-064', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Mn_flag_govisümber_aimag.svg' },
    { name: 'Hentiy', uuid: 'be992814-91a6-492b-9b27-cc2c6abc27a4', code: 'MN-039', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Khentii_aimag_Flag.svg' },
    { name: 'Hovd', uuid: '8b430f9a-b2ab-4baa-a5e7-fcc1c64c8e17', code: 'MN-043', url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Flag_of_Khovd_Aimag_%28since_2014%29.svg' },
    { name: 'Hövsgöl', uuid: 'a2f627e0-9479-4ab0-998a-89b2abb6c1f5', code: 'MN-041', url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Mn_flag_khövsgöl_aimag_2014.svg' },
    { name: 'Ömnögovĭ', uuid: '29b897c6-a9d9-4dd7-911c-fee5ad5ba133', code: 'MN-053', url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Mn_flag_ömnögovi_aimag_2011.svg' },
    { name: 'Orhon', uuid: 'fd78b920-96b7-4709-8cd4-5b7ed6aa7bd3', code: 'MN-035', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Mn_flag_orkhon_aimag_2024.svg' },
    { name: 'Övörhangay', uuid: '946cef05-0893-4536-9c13-2c9a903b0710', code: 'MN-055', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Mn_flag_Ovurhangai_aymag.svg' },
    { name: 'Selenge', uuid: '4a07046c-a379-49b4-bced-115f14453b76', code: 'MN-049', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Mn_flag_selenge_aimag_1999.svg' },
    { name: 'Sühbaatar', uuid: 'b1a71691-f98c-424d-8549-b7ea89163c89', code: 'MN-051', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Mn_flag_sükhbaatar_aimag.svg' },
    { name: 'Töv', uuid: 'd9535b36-7db9-48c4-a376-8737b1dbaef7', code: 'MN-047', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Tov_aymag_flag.svg' },
    { name: 'Uvs', uuid: '115ad3c2-c453-4170-9b32-cbeab42d91e7', code: 'MN-046', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Uvs_Aimag_Flag.svg' },
    // --- Mongolia (Capital City) ---
    { name: 'Ulaanbaatar', uuid: '0c220b8d-4eda-43be-96e9-5d1a180cadc5', code: 'MN-1', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Flag_of_Ulaanbaatar%2C_Mongolia.svg' },

    // --- Myanmar (Regions) ---
    { name: 'Ayeyarwady', uuid: 'be526dbc-6c23-4ca7-b5fe-cbf16a357e26', code: 'MM-07', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Ayeyarwady_Region.svg' },
    { name: 'Bago', uuid: 'b45a1abe-6743-4b51-8807-7c46bc547f88', code: 'MM-02', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Flag_of_Bago_Region.svg' },
    { name: 'Magway', uuid: 'fcb9411c-d9dd-4193-bb7e-9a4b2e102df4', code: 'MM-03', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_Magway_Region.svg' },
    { name: 'Mandalay', uuid: '514390bd-bdc1-4424-b26e-9d4e2a9563f0', code: 'MM-04', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_Mandalay_Region.svg' },
    { name: 'Sagaing', uuid: 'ef1a48fe-6104-4c00-b90a-5dbb9820c25f', code: 'MM-01', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Sagaing_Region_%282019%29.svg' },
    { name: 'Tanintharyi', uuid: '806f4b98-a380-4d4c-8fcd-28c6f17f72ab', code: 'MM-05', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Tanintharyi_Region.svg' },
    { name: 'Yangon', uuid: '1c395ff2-4b25-487b-a2c9-e62d9242d0cb', code: 'MM-06', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_Yangon_Region.svg' },
    // --- Myanmar (States) ---
    { name: 'Chin', uuid: '48de89f1-8987-422a-9dc8-5df112bce689', code: 'MM-14', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Flag_of_Chin_State.svg' },
    { name: 'Kachin', uuid: '10842a78-6871-4904-849a-decb5c0112d2', code: 'MM-11', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_Kachin_State.svg' },
    { name: 'Kayah', uuid: '3bc373de-3882-4897-b598-5de764bcfef3', code: 'MM-12', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Kayah_State.svg' },
    { name: 'Kayin', uuid: '99d4413b-7fb4-4883-8fca-5c5ae44464b1', code: 'MM-13', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Kayin_State.svg' },
    { name: 'Mon', uuid: '27fd4e93-dd37-42a5-bad3-ebc8b00e19a0', code: 'MM-15', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Mon_State_%282018%29.svg' },
    { name: 'Rakhine', uuid: 'ab3e48ec-e4d2-4396-b6e0-5dcf893db5b8', code: 'MM-16', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Rakhine.svg' },
    { name: 'Shan', uuid: '6c77b284-a0fe-4190-9d97-f4f0eeb842c8', code: 'MM-17', url: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Flag_of_Shan_State.svg' },

    // --- Netherlands (Kingdom) ---
    { name: 'Kingdom of the Netherlands', uuid: 'aee96acc-29ab-4f1b-b23d-52012b29c25b', code: 'NL-KD', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Netherlands.svg' },
    // --- Netherlands (Provinces) ---
    { name: 'Drenthe', uuid: '7d016c46-5a71-4af0-bcf1-73e45e46cee4', code: 'NL-DR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Drenthe.svg' },
    { name: 'Flevoland', uuid: '2d5e8f18-1188-4c8f-8354-211ea4380358', code: 'NL-FL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Flevoland.svg' },
    { name: 'Fryslân', uuid: '8b571a8e-da65-451a-8748-020135594c70', code: 'NL-FR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Friesland.svg' },
    { name: 'Gelderland', uuid: '8a3749e4-4be2-4bc1-88cf-7a44d65f795e', code: 'NL-GE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Gelderland.svg' },
    { name: 'Groningen', uuid: 'de709c26-7ea1-4d71-988e-8d796596f136', code: 'NL-GR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Groningen.svg' },
    { name: 'Limburg', uuid: '10a879a3-fe49-4051-9d14-58509e5833aa', code: 'NL-LI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Limburg_%28Netherlands%29.svg' },
    { name: 'Noord-Brabant', uuid: '1c0d61ab-8e5e-4c75-8636-d4e1a2c01e6a', code: 'NL-NB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_North_Brabant.svg' },
    { name: 'Noord-Holland', uuid: '61d4a9f2-68f1-4cec-a25f-e8f953954459', code: 'NL-NH', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_North_Holland.svg' },
    { name: 'Overijssel', uuid: '1240a736-eef8-4607-9a34-10a39d0a26bb', code: 'NL-OV', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Overijssel.svg' },
    { name: 'Utrecht', uuid: '2e9922f6-e902-4a80-ba8e-a0e76de43ced', code: 'NL-UT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Utrecht_%28province%29.svg' },
    { name: 'Zeeland', uuid: '1e96315a-c4b6-4182-8c71-dd132b7037d8', code: 'NL-ZE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Zeeland.svg' },
    { name: 'Zuid-Holland', uuid: '33c20196-8212-4975-b914-5d52855d94ff', code: 'NL-ZH', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Holland.svg' },
    // --- Netherlands (Special Municipalities) ---
    { name: 'Bonaire', uuid: '48b6011b-bfe4-49c6-b215-a6a15b9af756', code: 'BQ-BO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Bonaire.svg' },
    { name: 'Sint Eustatius', uuid: '4e1fa760-00ea-4dc8-8456-96104f683c2b', code: 'BQ-SE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sint_Eustatius.svg' },
    { name: 'Saba', uuid: '79bbadb0-3942-429f-b943-ee749d00cb91', code: 'BQ-SA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Saba.svg' },

    // --- Nicaragua (Departments) ---
    { name: 'Boaco', uuid: '9321810c-0f6e-4be6-937a-f9095a137b69', code: 'NI-BO', url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Boaco.svg' },
    { name: 'Carazo', uuid: 'a9d9daac-acee-4105-8000-700fb4247021', code: 'NI-CA', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Jinotepe.svg' },
    { name: 'Chinandega', uuid: 'c6b2f7db-f41c-48e9-b00a-092524618fa4', code: 'NI-CI', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_Chinandega.svg' },
    { name: 'Chontales', uuid: '2f4584c5-1cf4-4fbd-9d24-297e58c5dec2', code: 'NI-CO', url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Flag_of_Juigalpa.svg' },
    { name: 'Estelí', uuid: 'd0a96c55-fd61-4921-ae92-253cbe88cf51', code: 'NI-ES', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flag_of_Esteli.svg' },
    { name: 'Granada', uuid: '74c5f89c-c25b-48b3-a1b2-9f622d0219fc', code: 'NI-GR', url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Flag_of_Granada%2C_Nicaragua.svg' },
    { name: 'Jinotega', uuid: '296465f5-bf2c-4199-bcaf-a1562881ed5a', code: 'NI-JI', url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Jinotega.svg' },
    { name: 'León', uuid: 'eda834d6-742b-4473-b158-e13f9c9ad700', code: 'NI-LE', url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Flag_of_Leon%2C_Nicaragua.svg' },
    { name: 'Madriz', uuid: '363ab71d-4295-424c-9d28-bde5e995013b', code: 'NI-MD', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Flag_of_Somoto.svg' },
    { name: 'Managua', uuid: '9015e73a-ccb4-4198-a9ec-d1f9b02b92fd', code: 'NI-MN', url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Managua.svg' },
    { name: 'Masaya', uuid: '63b18f04-eee9-4092-b48c-a45e65b33a83', code: 'NI-MS', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Flag_of_Masaya.svg' },
    { name: 'Matagalpa', uuid: 'b4a97037-03fc-40c8-ae29-9c90d124fc51', code: 'NI-MT', url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Matagalpa.svg' },
    { name: 'Nueva Segovia', uuid: '152df48f-808d-4d15-9535-aa23916c6486', code: 'NI-NS', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Nueva_Segovia.svg' },
    { name: 'Río San Juan', uuid: 'f479deb8-7679-4769-9714-a60e1555fa52', code: 'NI-SJ', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Flag_of_San_Carlos%2C_Nicaragua.svg' },
    { name: 'Rivas', uuid: '1b86fc33-41f4-4c06-8990-303c0ea7f9bd', code: 'NI-RI', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Rivas.svg' },
    // --- Nicaragua (Autonomous Regions) ---
    { name: 'Atlántico Norte', uuid: '777eab91-df56-4b0d-92c8-d4fe1cd67469', code: 'NI-AN', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Flag_of_Region_Autonoma_del_Atlantico_Norte.svg' },
    { name: 'Atlántico Sur', uuid: '83ddb8d9-393f-478e-8d3b-c9d2439f153c', code: 'NI-AS', url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Flag_of_Region_Autonoma_Atlantico_Sur.svg' },

    // --- Nigeria (States) ---
    { name: 'Abia', uuid: 'bafbae84-4dd1-4b73-af90-b94cf03f8cad', code: 'NG-AB', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Flag_of_Abia_%28new%29.png' },
    { name: 'Adamawa', uuid: '5e71004b-0df7-489a-a40f-cd3ea5646cd0', code: 'NG-AD', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Adamawa_State_Flag.svg' },
    { name: 'Akwa Ibom', uuid: '9367616a-d4db-4498-9150-373dc517aef3', code: 'NG-AK', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Akwa_Ibom_State.svg' },
    { name: 'Anambra', uuid: 'b4af8fc1-c57d-4e95-910e-42eecea63311', code: 'NG-AN', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Flag_of_Anambra_State.png' },
    { name: 'Bayelsa', uuid: '6c4ed057-a06b-4bde-bb50-229dc1bba59c', code: 'NG-BY', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Bayelsa_State.svg' },
    { name: 'Bauchi', uuid: 'b99953fd-2374-4e15-8959-b979f6558a63', code: 'NG-BA', url: 'https://static.wikia.nocookie.net/vexillology/images/d/d5/Bauchi_flag.png/revision/latest' },
    { name: 'Benue', uuid: '55ca770c-5760-41c8-9011-54ebfdc2986b', code: 'NG-BE', url: 'https://upload.wikimedia.org/wikipedia/en/8/89/Flag_of_Benue_State.png' },
    { name: 'Borno', uuid: '9d57ffa4-023e-454b-8da7-d599d905994c', code: 'NG-BO', url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Flag_of_Borno_State.svg' },
    { name: 'Cross River', uuid: '18afb07d-6f51-40d4-a3b6-89f9df57ecc3', code: 'NG-CR', url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Cross_River_State_Flag.svg' },
    { name: 'Delta', uuid: '58bc04e7-f7b6-4929-bfa4-6cef80f6c2a2', code: 'NG-DE', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Delta_State.gif' },
    { name: 'Ebonyi', uuid: 'fdd3df7b-e5b3-4261-bb13-f3613ed47d8b', code: 'NG-EB', url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Seal_of_Ebonyi_State.png' },
    { name: 'Edo', uuid: '6d2ae907-d149-41ec-b4c0-c7fc7cb09f1c', code: 'NG-ED', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Edo_State.svg' },
    { name: 'Ekiti', uuid: 'af3bc0bf-5c5b-4cb8-8fe4-1eb535fff1e4', code: 'NG-EK', url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Ekiti_State_Flag.gif' },
    { name: 'Enugu', uuid: 'fef2d6b0-713c-4e49-8ea4-4c07cf98bc5b', code: 'NG-EN', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Enugu_State.png' },
    { name: 'Gombe', uuid: '4470c012-c68b-4daf-9676-a7451a2ee206', code: 'NG-GO', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Flag_of_Gombe_State.svg' },
    { name: 'Imo', uuid: 'e24417f7-a245-46c2-9970-564b9488c83b', code: 'NG-IM', url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Imo_State_Flag.svg' },
    { name: 'Jigawa', uuid: 'dde90094-42ca-4693-9231-1cd6a325be09', code: 'NG-JI', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Flag_of_Jigawa_State.svg' },
    { name: 'Kaduna', uuid: '0a77f0b2-60ff-4349-bf55-8e3ed0f378f1', code: 'NG-KD', url: 'https://static.wikia.nocookie.net/nigeriainformation/images/e/e5/Kaduna%E2%80%99s_Flag.png' },
    { name: 'Kano', uuid: '7e2f532d-8327-487e-a9e0-2e0c398c2da7', code: 'NG-KN', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Kano_State_flag_official.png' },
    { name: 'Katsina', uuid: '53bafd1d-4dbe-4bfe-9430-feab26768922', code: 'NG-KT', url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Flag_of_Katsina_State.svg' },
    { name: 'Kebbi', uuid: '3e739908-f6b0-4f38-9b09-5346cd81c177', code: 'NG-KE', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Kebbi_flag.png' },
    { name: 'Kogi', uuid: '82e2a7eb-ee63-41c5-b827-d317746ae161', code: 'NG-KO', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Kogi_State_Flag.svg' },
    { name: 'Kwara', uuid: '304ae6c7-35b4-4a05-be8e-45e857af6232', code: 'NG-KW', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Kwara_State_Flag.jpg' },
    { name: 'Lagos', uuid: '2e1382b1-3949-4f85-8c87-6ac554f44d8f', code: 'NG-LA', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Lagos_State_Flag.svg' },
    { name: 'Nassarawa', uuid: '9db2f27f-2dc8-436a-b5b4-5bc99100e35b', code: 'NG-NA', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Flag_of_Nasarawa_State.png' },
    { name: 'Niger', uuid: 'fb3c51b0-3919-4fbb-be31-8cda5fcdfdb4', code: 'NG-NI', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Niger_state_flag.png' },
    { name: 'Ogun', uuid: '791de9fe-d225-46ce-9965-7d13ad3a45f1', code: 'NG-OG', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Ogun_State_Flag.jpg' },
    { name: 'Ondo', uuid: 'f7c0865a-927d-45b8-b3a6-d7b2501a0bab', code: 'NG-ON', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_Ondo_State.png' },
    { name: 'Osun', uuid: '0c339022-4786-408d-871c-f0f2aa7d833b', code: 'NG-OS', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Flag_of_Osun_State%2C_Nigeria.svg' },
    { name: 'Oyo', uuid: '2a13608b-e49f-46a6-bd4d-af469d59fc20', code: 'NG-OY', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Oyo_State_Flag.svg' },
    { name: 'Plateau', uuid: 'bf5d62f7-11c1-4d87-99fc-984f8219657c', code: 'NG-PL', url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Plateau_State_Flag.jpg' },
    { name: 'Rivers', uuid: '053658bc-9ef4-458e-8ba8-26120a35650c', code: 'NG-RI', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Rivers_State_Flag.svg' },
    { name: 'Sokoto', uuid: '27299bc5-6f74-4c98-86b9-029a2a4a827c', code: 'NG-SO', url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Sokoto_State_Flag.svg' },
    { name: 'Taraba', uuid: '1db90d3a-1a43-4598-ab7b-5d148d6a00cd', code: 'NG-TA', url: 'https://static.wikia.nocookie.net/vexillology/images/3/35/Taraba.png/revision/latest/scale-to-width-down/1000' },
    { name: 'Yobe', uuid: '56925af3-2e33-4ecf-a088-99e17fca7529', code: 'NG-YO', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_Yobe_State.svg' },
    { name: 'Zamfara', uuid: '805f3cf5-9074-4299-93a9-8a2a132f8cda', code: 'NG-ZA', url: 'https://static.wikia.nocookie.net/nigeriainformation/images/7/77/Flag_of_Zamfara.png/revision/latest/scale-to-width-down/1000' },
    // --- Nigeria (Capital Territory) ---
    { name: 'Abuja Federal Capital Territory', uuid: '50ed0c0d-fdce-4b38-882d-f67b003ebdbc', code: 'NG-FC', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Abuja.svg' },

    // --- North Macedonia (Municipalities) ---
    { name: 'Aerodrom', uuid: 'c0313322-5fb0-4ac3-9b52-24263ffb8723', code: 'MK-801', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Flag_of_Aerodrom_Municipality%2C_North_Macedonia.svg' },
    { name: 'Aračinovo', uuid: 'b700d49d-7642-4ac1-9639-d0962a5c6ec6', code: 'MK-802', url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Flag_of_Aracinovo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Berovo', uuid: '470b1f78-3ddf-48ee-8090-41231e9d3bbf', code: 'MK-201', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_Berovo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Bitola', uuid: '771696b0-de31-4a0e-812c-3fbc6b52ccac', code: 'MK-501', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Flag_of_Bitola_Municipality%2C_North_Macedonia.svg' },
    { name: 'Bogdanci', uuid: '23fc0abd-f4ef-4cc0-b8fe-95c7ae612ef6', code: 'MK-401', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_Bogdanci_Municipality%2C_North_Macedonia.svg' },
    { name: 'Bogovinje', uuid: '00cc7671-8e29-4b22-a8b5-e9d8316edb2f', code: 'MK-601', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Flag_of_Bogovinje_Municipality%2C_North_Macedonia.svg' },
    { name: 'Bosilovo', uuid: '2e90b5ba-bd4f-446a-981a-4342d9ee937c', code: 'MK-402', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Flag_of_the_Bosilovo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Butel', uuid: '706d1921-baf9-4188-9d2f-5183ee93bf24', code: 'MK-09', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Flag_of_Butel_Municipality%2C_North_Macedonia.svg' },
    { name: 'Brvenica', uuid: '82597814-2c46-4677-aac3-c59e8d213128', code: 'MK-602', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Flag_of_Brvenica_Municipality%2C_North_Macedonia.svg' },
    { name: 'Čair', uuid: 'e3576af4-903c-435b-bae7-44ad94d39b3f', code: 'MK-815', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Flag_of_Čair_Municipality%2C_North_Macedonia.svg' },
    { name: 'Čaška', uuid: '30cecca5-4ff5-4a73-84c4-092f4063c02a', code: 'MK-109', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Čaška_Municipality%2C_North_Macedonia.svg' },
    { name: 'Centar', uuid: '9d8aa5d2-8c81-46c0-bbfa-84d86e3fbc48', code: 'MK-814', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Flag_of_Centar_Municipality%2C_North_Macedonia.svg' },
    { name: 'Centar Župa', uuid: '8ee637cf-1934-410d-9e0a-cf0c6e899f65', code: 'MK-313', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_Centar_Župa_Municipality%2C_North_Macedonia.svg' },
    { name: 'Češinovo-Obleševo', uuid: '387dd430-0e7f-48d2-bfc8-eca8682321f7', code: 'MK-210', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_Cheshinovo-Obleshevo.jpg' },
    { name: 'Čučer Sandevo', uuid: '3d2bc94e-e8e1-44c6-aa1a-8c297ec2fa0c', code: 'MK-816', url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Знаме_на_Општина_Чучер-Сандево.png' },
    { name: 'Debar', uuid: '0b0f7f19-d1e8-4feb-8aef-33fb6c9599bc', code: 'MK-303', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Flag_of_Dibër_Municipality.svg' },
    { name: 'Debarca', uuid: 'cf340df1-8a7e-419d-a76d-89029c7e6e82', code: 'MK-304', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_Debarca_Municipality%2C_North_Macedonia.svg' },
    { name: 'Delčevo', uuid: 'ca81a111-ddae-47a6-a3bb-491b74f9ef23', code: 'MK-203', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Delčevo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Demir Hisar', uuid: '8c447a9f-a452-46bb-a4b2-dc71278a3c87', code: 'MK-502', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Zname-opstina-Demir-Hisar.jpg' },
    { name: 'Demir Kapija', uuid: 'f650dee2-609f-4dac-8bc4-fe50bc078b5f', code: 'MK-103', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Flag_of_Demir_Kapija_Municipality%2C_North_Macedonia.svg' },
    { name: 'Dojran', uuid: 'a588a665-8883-4e2f-8b92-015dd80c15fd', code: 'MK-406', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Dojran_Municipality%2C_North_Macedonia.svg' },
    { name: 'Dolneni', uuid: '754beac6-1cc5-4858-80a8-d495d708c39f', code: 'MK-503', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Dolneni_Municipality%2C_North_Macedonia.svg' },
    { name: 'Gazi Baba', uuid: 'b4da0d62-6245-4af7-8f37-c57ae4eff00c', code: 'MK-804', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_Gazi_Baba_Municipality%2C_North_Macedonia.svg' },
    { name: 'Gevgelija', uuid: '0605fd0c-659d-4e17-afae-065ae89722d1', code: 'MK-405', url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Flag_of_Gevgelija_Municipality%2C_North_Macedonia.svg' },
    { name: 'Gjorče Petrov', uuid: 'd82ac23f-44c1-400a-b52f-a187ab90c57b', code: 'MK-805', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Flag_of_Ǵorče_Petrov_Municipality%2C_North_Macedonia.svg' },
    { name: 'Gostivar', uuid: '96b2d6b3-f41c-4075-b666-4a25635914ea', code: 'MK-604', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Flag_of_Gostivar_Municipality%2C_North_Macedonia.svg' },
    { name: 'Gradsko', uuid: 'fd0eeea0-ddf2-45c0-acb3-3cf74684b312', code: 'MK-102', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Mk-grad.gif' },
    { name: 'Ilinden', uuid: '28e84d11-b7bc-421f-b632-a9e9dbe78e6a', code: 'MK-807', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Ilinden_Municipality%2C_North_Macedonia.svg' },
    { name: 'Jegunovce', uuid: '95a3ff9a-b686-4a3b-ae41-235fe2cd63f0', code: 'MK-606', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Flag_of_Jegunovce_Municipality%2C_North_Macedonia.svg' },
    { name: 'Karbinci', uuid: 'ef7e4592-649a-425c-aa49-27b8f055c31c', code: 'MK-205', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Karbinci_Municipality%2C_North_Macedonia.svg' },
    { name: 'Karpoš', uuid: '57d021de-6a62-4ee1-a14f-73ec2a8fb35e', code: 'MK-808', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Karpoš_Municipality%2C_North_Macedonia.svg' },
    { name: 'Kavadarci', uuid: 'f58248e6-a38d-4ffb-8530-6cbb0b5792ee', code: 'MK-104', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Flag_of_Kavadarci_Municipality%2C_North_Macedonia.svg' },
    { name: 'Kičevo', uuid: 'fb1d5b0a-3178-4957-a3fa-d062d54c68bf', code: 'MK-307', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Kičevo_Municipality.svg' },
    { name: 'Kisela Voda', uuid: '4a7f33db-1b9e-44f5-aaed-ff63b0dee597', code: 'MK-809', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Flag_of_Kisela_Voda_Municipality%2C_North_Macedonia.svg' },
    { name: 'Kočani', uuid: '24391132-fcef-400b-90f8-ef834d0aa7c3', code: 'MK-206', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Flag_of_Kocani_Municipality%2C_North_Macedonia.svg' },
    { name: 'Konče', uuid: '01865408-9524-4c5d-899a-e2603f0443e1', code: 'MK-407', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Konče_Municipality%2C_North_Macedonia.svg' },
    { name: 'Kratovo', uuid: '4730bce3-0c68-419a-be14-8bf9ff94a977', code: 'MK-701', url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Flag_of_Kratovo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Kriva Palanka', uuid: '0e1c018d-bfb4-4be1-9f9d-7eabfaff4e1b', code: 'MK-702', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_Kriva_Palanka_Municipality%2C_North_Macedonia.svg' },
    { name: 'Krivogaštani', uuid: '86a5452d-633e-4a83-834a-54b4f9815de4', code: 'MK-504', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Flag_of_Krivogaštani_Municipality%2C_North_Macedonia.svg' },
    { name: 'Kruševo', uuid: 'c447ef83-3fcb-4fc1-94e2-e9d8f7bd05b9', code: 'MK-505', url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Flag_of_Kruševo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Kumanovo', uuid: 'e895719c-d8a5-42d1-968c-b35718b75f93', code: 'MK-703', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_Kumanovo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Lipkovo', uuid: '4c108469-71e1-4317-b956-e10fd92f0169', code: 'MK-704', url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_Lipkovo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Lozovo', uuid: '02b7f70f-a4df-43d9-a3af-d46be4c23fc4', code: 'MK-105', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_Lozovo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Makedonska Kamenica', uuid: '7e6212c1-6ee9-4587-822c-f60b5672a4e1', code: 'MK-207', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Makedonska_Kamenica_Municipality%2C_North_Macedonia.svg' },
    { name: 'Makedonski Brod', uuid: '80da9a54-22f3-47e8-9c91-76338141db25', code: 'MK-308', url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Makedonski_Brod_Municipality%2C_North_Macedonia.svg' },
    { name: 'Mavrovo i Rostuša', uuid: '5a9183ae-4b34-46c2-b783-8c905cf8bed8', code: 'MK-607', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Mavrovo_and_Rostuša_Municipality%2C_North_Macedonia.svg' },
    { name: 'Mogila', uuid: '0516cc35-56fe-48a8-86cc-ced81b9837a8', code: 'MK-506', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Flag_of_Mogila_Municipality%2C_North_Macedonia.svg' },
    { name: 'Negotino', uuid: 'fc0e24b1-71de-4072-9e86-c7b9c44fd4e4', code: 'MK-106', url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Flag_of_Negotino_Municipality%2C_North_Macedonia.svg' },
    { name: 'ovaci', uuid: 'bb186838-9534-4f57-bd00-7d97a209313b', code: 'MK-507', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Novaci_Municipality%2C_North_Macedonia.svg' },
    { name: 'Novo Selo', uuid: '389e6c79-d126-4221-9c5f-ded0be540e7f', code: 'MK-408', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Flag_of_Novo_Selo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Ohrid', uuid: '5a9cda0e-942a-41d4-876d-cf74d18559e1', code: 'MK-310', url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Mk-ohri.png' },
    { name: 'Pehčevo', uuid: '9e56a01c-db9a-4679-b78f-b1508fd1a3b0', code: 'MK-208', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Flag_of_Pehčevo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Petrovec', uuid: '4dfd0175-ff71-4eb8-b226-e8a84b4978b1', code: 'MK-810', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Petrovec_Municipality%2C_North_Macedonia.svg' },
    { name: 'Plasnica', uuid: '55964197-0262-4356-a175-df0ddc975ec3', code: 'MK-311', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Flag_of_Plasnica_Municipality%2C_North_Macedonia.svg' },
    { name: 'Prilep', uuid: '25c866b9-b878-4909-bf5b-bbec71506fa4', code: 'MK-508', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Flag_of_Prilep_Municipality%2C_North_Macedonia.svg' },
    { name: 'Probištip', uuid: '8de7dd71-5f0d-42ba-b557-41063b488643', code: 'MK-209', url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Probistip-zname.png' },
    { name: 'Radoviš', uuid: '0c5689ba-23ec-444d-a6bd-5a268009e523', code: 'MK-409', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Flag_of_Radoviš_Municipality.svg' },
    { name: 'Rankovce', uuid: '852bbc68-c5fa-4e0e-855d-f9f9e0860a84', code: 'MK-705', url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Rankovce_Municipality.svg' },
    { name: 'Resen', uuid: 'f18d13a0-31bb-474d-b9a5-87bb368f40b7', code: 'MK-509', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_Resen_Municipality.svg' },
    { name: 'Rosoman', uuid: '9d8f8e5c-0696-4367-8d2b-91acc405cea1', code: 'MK-107', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Rosoman_Municipality.svg' },
    { name: 'Saraj', uuid: '4dd293d9-8175-44d7-b5eb-279941bd28a3', code: 'MK-811', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Flag_of_Saraj_Municipality.svg' },
    { name: 'Skopje', uuid: 'a24c1b18-6aad-41e3-9c6d-e9853c97e2c8', code: 'MK-85', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_Skopje%2C_North_Macedonia.svg' },
    { name: 'Sopište', uuid: '108bf52a-b9dc-429c-a36b-d83045219763', code: 'MK-812', url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Sopište_Municipality%2C_North_Macedonia.svg' },
    { name: 'Staro Nagoričane', uuid: 'c4d606c2-2dfc-4838-9860-0543a48ca1fd', code: 'MK-706', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flag_of_Staro_Nagoričane%2C_North_Macedonia.svg' },
    { name: 'Štip', uuid: '9d4bce1e-ee68-4509-a2a3-e38264053b99', code: 'MK-211', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Štip_Municipality%2C_North_Macedonia.svg' },
    { name: 'Struga', uuid: '9ae5d594-af67-4c7e-b24c-435a253dd94a', code: 'MK-312', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Flag_of_Struga_Municipality.svg' },
    { name: 'Strumica', uuid: '1a0f5a6d-e57a-4e1c-8dc9-3200811863f0', code: 'MK-410', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Flag_of_Strumica_Municipality.svg' },
    { name: 'Studeničani', uuid: 'ca622026-7373-42c8-b6d3-7e50a8d15e7f', code: 'MK-813', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Flag_of_Studeničani_municipality.png' },
    { name: 'Šuto Orizari', uuid: '1dac87f7-5583-40d3-b083-9172c32fe367', code: 'MK-817', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Flag_of_Šuto_Orizari_Municipality%2C_North_Macedonia.svg' },
    { name: 'Sveti Nikole', uuid: 'da8e56ec-02f7-49b7-bc5c-9ada5d9b85a7', code: 'MK-108', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Flag_of_Sveti_Nikole.svg' },
    { name: 'Tearce', uuid: 'ed91f2e1-8f86-4a6a-ae5b-0a0f84402e9d', code: 'MK-608', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Tearce_Municipality%2C_North_Macedonia.svg' },
    { name: 'Tetovo', uuid: '8c8e18b0-fb3c-421e-86cb-c24105cd8f84', code: 'MK-609', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Tetovo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Valandovo', uuid: 'a65f0cfc-9c59-4401-b70d-d374c1e8fd2b', code: 'MK-403', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Flag_of_Valandovo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Vasilevo', uuid: 'bc506066-f618-4f91-8d65-4ad31fc20913', code: 'MK-404', url: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Vasilevo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Veles', uuid: '200b68fd-ab16-4759-9b84-2c1c1346a025', code: 'MK-101', url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Flag_of_Veles_Municipality%2C_North_Macedonia.svg' },
    { name: 'Vevčani', uuid: '077dc5e9-453c-4c3d-8f4b-90a8d0bfa9ed', code: 'MK-301', url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Flag_of_Vevčani_Municipality%2C_North_Macedonia.svg' },
    { name: 'Vinica', uuid: '19d263e8-7d3c-4068-bc0e-e91ae40d39e2', code: 'MK-202', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Flag_of_Vinica_Municipality%2C_North_Macedonia.svg' },
    { name: 'Vrapčište', uuid: '3571a605-4a42-47ea-ad92-97477f954017', code: 'MK-603', url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Flag_of_Vrapčište_Municipality%2C_North_Macedonia.svg' },
    { name: 'Zelenikovo', uuid: 'ad903198-9801-4d84-b79f-893180af079e', code: 'MK-806', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Zelenikovo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Želino', uuid: '9399085b-cd47-40b9-a923-05c03ddf734e', code: 'MK-605', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Flag_of_Želino_Municipality%2C_North_Macedonia.svg' },
    { name: 'Zrnovci', uuid: '63393dda-9689-4fc7-ba00-71d66b5b23b9', code: 'MK-204', url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Flag_of_Zrnovci_Municipality%2C_North_Macedonia.svg' },
    // --- North Macedonia (Former Municipalities) ---
    { name: 'Drugovo', uuid: 'eea39907-e876-4fdb-b5fa-cb7a9f626074', code: 'MK-28', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_Drugovo_Municipality%2C_North_Macedonia.svg' },
    { name: 'Oslomej', uuid: 'a72995e0-1199-42b7-80c0-6c786187bd56', code: 'MK-57', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Zname_na_Oslomej.jpg' },
    { name: 'Vraneštica', uuid: '39078e3c-5e52-401c-841a-22f6717fe7fe', code: 'MK-15', url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Flag_of_Vraneštica_Municipality.png' },
    { name: 'Zajas', uuid: 'c60be42d-6ba2-4605-b084-e6c2f3b50c32', code: 'MK-31', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Flag_of_Zajas_Municipality%2C_North_Macedonia.svg' },

    // --- Norway (Counties) ---
    { name: 'Agder', uuid: '50e3bfe3-422d-4137-bec7-bf4f6b0c882c', code: 'NO-42', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Agder.svg' },
    { name: 'Akershus', uuid: 'ae593ad5-3f84-4ad5-89c7-7575cefd339c', code: 'NO-32', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Akershus.svg' },
    { name: 'Buskerud', uuid: '8708899d-4622-4e66-8579-b0a43ae503f4', code: 'NO-33', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Buskerud.svg' },
    { name: 'Finnmark', uuid: 'e29f64f6-0d89-44cd-ab16-91c2a05e8d03', code: 'NO-56', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Finnmark.svg' },
    { name: 'Hedmark', uuid: 'c0bdf8d0-831a-4f5f-88cb-2061edbb8cd5', code: 'NO-04', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Hedmark.svg' },
    { name: 'Hordaland', uuid: '951fc8dc-3fa9-4c64-96a2-e239f0666609', code: 'NO-12', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Hordaland.svg' },
    { name: 'Møre og Romsdal', uuid: '298570dc-c876-4691-b913-5b3f4ba5a66a', code: 'NO-15', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_M%C3%B8re_og_Romsdal.svg' },
    { name: 'Nord-Trøndelag', uuid: '2f56a4b2-8e4e-48e8-9fbc-253f05facde3', code: 'NO-17', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Nord-Tr%C3%B8ndelag.svg' },
    { name: 'Nordland', uuid: 'fd7a5b26-56d9-4fa2-9805-b9f467fa4879', code: 'NO-18', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Nordland.svg' },
    { name: 'Oppland', uuid: '3b12f7e5-802b-4d58-b600-aef20b7cad78', code: 'NO-05', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Oppland.svg' },
    { name: 'Oslo', uuid: 'f80d529e-f242-46ef-a090-d193ed23075f', code: 'NO-03', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Oslo.svg' },
    { name: 'Rogaland', uuid: 'fb98464f-3c9c-4c91-94bc-89f30d0a42f9', code: 'NO-11', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Rogaland.svg' },
    { name: 'Sogn og Fjordane', uuid: '548f69bb-b842-4ff6-9945-6ea9d6a8de13', code: 'NO-14', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sogn_og_Fjordane.svg' },
    { name: 'Sør-Trøndelag', uuid: 'ca597d1d-eddc-4c92-a9d9-7d860bdaa5d0', code: 'NO-16', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_S%C3%B8r-Tr%C3%B8ndelag.svg' },
    { name: 'Telemark', uuid: 'e7125d46-63c1-4b14-95c1-e0e6e4b312ec', code: 'NO-40', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Telemark.svg' },
    { name: 'Troms', uuid: '17735446-0490-4b1a-bcd2-856d8c4d20c6', code: 'NO-55', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Troms.svg' },
    { name: 'Vestfold', uuid: 'c3bb81dc-642e-4f9d-9d9c-3bc7b671b07c', code: 'NO-39', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Vestfold.svg' },
    { name: 'Østfold', uuid: 'c65cf3eb-e577-4c5e-820c-222ac18ce621', code: 'NO-31', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_%C3%98stfold.svg' },
    // --- Norway (Former Counties) ---
    { name: 'Aust-Agder', uuid: '0bd0e394-e3aa-4e33-b06c-80a4aede075f', code: 'NO-09', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Aust-Agder.svg' },
    { name: 'Vest-Agder', uuid: 'dd3304af-d4a7-44e2-838d-aa539bbac0be', code: 'NO-10', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Vest-Agder.svg' },

    // --- Palau (States) ---
    { name: 'Aimeliik', uuid: '6417659f-769b-4b45-b5a8-50684392be86', code: 'PW-002', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Aimeliik.svg' },
    { name: 'Airai', uuid: '236f15c4-a6dc-400c-b9d1-3fad1e0c1228', code: 'PW-004', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag_of_Airai_State.png' },
    { name: 'Angaur', uuid: '4b56ffdb-8455-449e-a2a3-d690ba6325a9', code: 'PW-010', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Flag_of_Angaur_State.svg' },
    { name: 'Hatobohei', uuid: 'e1a69873-648d-46ac-8259-4f2c7d5bc2f1', code: 'PW-050', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Flag_of_Hatohobei.svg' },
    { name: 'Kayangel', uuid: 'a6cd5dda-8057-4897-9b86-d31db364cc7b', code: 'PW-100', url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Kayangel.svg' },
    { name: 'Koror', uuid: 'e1611f99-912f-4997-96f7-536993bbbe80', code: 'PW-150', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Koror_State.png' },
    { name: 'Melekeok', uuid: '392d7558-ad30-408b-a44e-000bd3a57029', code: 'PW-212', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Flag_of_Melekeok.svg' },
    { name: 'Ngaraard', uuid: 'ddf0f499-2ab2-40f5-bb55-85d62a530efb', code: 'PW-214', url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Flag_of_Ngaraard_State.svg' },
    { name: 'Ngarchelong', uuid: 'ec45fc11-7850-489a-a492-971db632254c', code: 'PW-218', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Ngarchelong.svg' },
    { name: 'Ngardmau', uuid: 'c50d7bf3-003d-4590-b52d-2b7078394a57', code: 'PW-222', url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Ngardmau_State.svg' },
    { name: 'Ngatpang', uuid: '84424467-a595-4a14-bf2c-5d96bef82be5', code: 'PW-224', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Ngatpang.svg' },
    { name: 'Ngchesar', uuid: '7e1192d9-a74c-4310-8a27-dddcff5b9cdf', code: 'PW-226', url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Flag_of_Ngchesar_State%2C_Palau.svg' },
    { name: 'Ngeremlengui', uuid: '85cff638-1e22-4509-8dfc-fd023b9fdfe1', code: 'PW-227', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Flag_of_Ngeremlengui_State%2C_Palau.svg' },
    { name: 'Ngiwal', uuid: '9cacbcd2-c46b-40b6-9a50-f9d08f106770', code: 'PW-228', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Flag_of_Ngiwal.png' },
    { name: 'Peleliu', uuid: '8be8b255-fbe3-4bdd-b2b5-649a04e84623', code: 'PW-350', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Peleliu.svg' },
    { name: 'Sonsorol', uuid: 'ce251d60-06f2-463f-ba4b-cf8f6d536bb5', code: 'PW-370', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Sonsorol.svg' },

    // --- Panama (Provinces) ---
    { name: 'Bocas del Toro', uuid: '88837e0d-bdf0-415c-ae1d-5684683950ea', code: 'PA-1', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Bandera_de_la_Provincia_de_Bocas_del_Toro.svg' },
    { name: 'Chiriquí', uuid: '6ef01921-fb0e-4182-b0b8-4956363a573a', code: 'PA-4', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Bandera_de_la_Provincia_de_Chiriquí.svg' },
    { name: 'Coclé', uuid: 'f4d9c28c-5db1-4cea-ad5d-459b3ab15190', code: 'PA-2', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bandera_de_la_Provincia_de_Coclé.svg' },
    { name: 'Colón', uuid: '3463449e-5e10-4278-8648-34a4fd2582f0', code: 'PA-3', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Bandera_de_la_Provincia_de_Colón.svg' },
    { name: 'Darién', uuid: '4d936bf7-31a8-4d74-b8a9-c8d4e03bacab', code: 'PA-5', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Bandera_de_la_Provincia_de_Darién.svg' },
    { name: 'Herrera', uuid: '24b16bd8-80d5-4491-96d9-7707b1348564', code: 'PA-6', url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Bandera_de_la_Provincia_de_Herrera.svg' },
    { name: 'Los Santos', uuid: '464ad00f-cf65-4b3b-90ac-8d2825614c36', code: 'PA-7', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Bandera_de_la_Provincia_de_Los_Santos.svg' },
    { name: 'Panamá', uuid: 'e4038ab2-0e15-4987-855a-adf4f0878645', code: 'PA-8', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Flag_of_Panama.svg' },
    { name: 'Veraguas', uuid: '1dfc8b6b-a3ad-48eb-a07a-af335f2416fe', code: 'PA-9', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Bandera_de_la_Provincia_de_Veraguas.svg' },
    // --- Panama (Indigenous Regions) ---
    { name: 'Emberá', uuid: '7708f82f-3418-4241-b925-44aabb7443e0', code: 'PA-EM', url: 'https://www.crwflags.com/fotw/images/p/pa-da-ew.gif' },
    { name: 'Kuna Yala', uuid: '3dec1571-fe89-4005-9432-6915c45d4af6', code: 'PA-KY', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Bandera_de_la_Comarca_Guna_Yala.svg' },
    { name: 'Ngöbe-Buglé', uuid: '129f0580-ea15-4901-897d-5fedf96d8946', code: 'PA-NB', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Bandera_de_la_Comarca_Ngäbe-Buglé.svg' },

    // --- Papua New Guinea (Provinces) ---
    { name: 'Central', uuid: 'c1717b74-4ccd-4106-9585-20d882453693', code: 'PG-CPM', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Central_Province%2C_Papua_New_Guinea.svg' },
    { name: 'Chimbu', uuid: '3aef81c1-e4bf-47b3-9306-3ff7ba2543c3', code: 'PG-CPK', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Chimbu.svg' },
    { name: 'East New Britain', uuid: 'f4de8d81-ba0d-4343-a81d-304136556938', code: 'PG-EBR', url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Flag_of_East_New_Britain.svg' },
    { name: 'East Sepik', uuid: '0dd190d3-86a0-428b-8a75-bc69d1ad577f', code: 'PG-ESW', url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_East_Sepik.png' },
    { name: 'Eastern Highlands', uuid: '292723d7-933b-4460-adf2-aef93d6ba45c', code: 'PG-EHG', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Eastern_Highlands.svg' },
    { name: 'Enga', uuid: '45c82077-b754-44ff-be6f-892d044c7598', code: 'PG-EPW', url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Flag_of_Enga.png' },
    { name: 'Gulf', uuid: 'fe1c1685-b48a-468b-bf4e-d5e3ed2a2f50', code: 'PG-GPK', url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Flag_of_Gulf_Province.png' },
    { name: 'Hela', uuid: '8bd79b95-60c3-43b1-9bd5-781a29c165ec', code: 'PG-HLA', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Hela.svg' },
    { name: 'Jiwaka', uuid: 'f63d0f62-11aa-4dfe-8840-50f73b7e263b', code: 'PG-JWK', url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_Jiwaka.svg' },
    { name: 'Madang', uuid: '10f62287-f821-4c66-9bd5-5a8610a8ae7a', code: 'PG-MPM', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Madang.svg' },
    { name: 'Manus', uuid: '93aa90e3-83e9-4ac4-9015-826b7e5cb377', code: 'PG-MRL', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Flag_of_Manus.svg' },
    { name: 'Milne Bay', uuid: '53a08dd8-172e-4b02-93c6-2a546e3046af', code: 'PG-MBA', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Milne_Bay.svg' },
    { name: 'Morobe', uuid: 'ad370927-2a0f-40d3-8107-7c854cd8bef4', code: 'PG-MPL', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Morobe.png' },
    { name: 'New Ireland', uuid: '2c10d5ea-d02a-4986-8134-a98d238d6317', code: 'PG-NIK', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_New_Ireland.svg' },
    { name: 'Northern', uuid: 'f6993dca-4353-4afd-82fe-634627963e69', code: 'PG-NPP', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Flag_of_Flag_Oro_new.png' },
    { name: 'Sandaun [West Sepik]', uuid: 'b98e6879-7c91-429b-ab1d-7ab99225cd4d', code: 'PG-SAN', url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Flag_of_Sandaun.svg' },
    { name: 'Southern Highlands', uuid: 'c8abad13-8f9b-4f39-b405-24772ea115f2', code: 'PG-SHM', url: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Flag_of_Southern_Highlands_Province_%28Papua_New_Guinea%29.svg' },
    { name: 'West New Britain', uuid: 'c236d775-a819-4e7e-a03a-35cff5943042', code: 'PG-WBK', url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_West_New_Britain.svg' },
    { name: 'Western', uuid: 'a381d95a-52a7-415b-b6f3-8516cd53de4f', code: 'PG-WPD', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Western_Province.svg' },
    { name: 'Western Highlands', uuid: 'd2b31c6f-c4cd-47e6-acce-8ee415171f0c', code: 'PG-WHM', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_Western_Highlands.svg' },
    // --- Papua New Guinea (Autonomous Region) ---
    { name: 'Bougainville', uuid: 'c45165ec-5bdf-4681-bebb-e83623506ea3', code: 'PG-NSB', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Flag_of_Bougainville.svg' },
    // --- Papua New Guinea (District) ---
    { name: 'National Capital District', uuid: '53986fd3-d20b-4ea0-834c-9981e11c620a', code: 'PG-NCD', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Flag_of_NCD.svg' },

    // --- Paraguay (Departments) ---
    { name: 'Alto Paraguay', uuid: 'b60d6245-4660-4ed5-8f01-0f6f4fc69b50', code: 'PY-16', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Bandera_de_Alto_Paraguay.png' },
    { name: 'Alto Paraná', uuid: 'd0e10d1a-b641-4d1b-b580-35c0be68a1ee', code: 'PY-10', url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Bandera_del_Departamento_de_Alto_Paraná.png' },
    { name: 'Amambay', uuid: 'c65da01c-eff0-407d-b18a-422206f6c5b3', code: 'PY-13', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Flag_of_Amambay.svg' },
    { name: 'Boquerón', uuid: '19f88b1b-63d8-4f66-9021-b7405493cac2', code: 'PY-19', url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_Boquerón_Department.svg' },
    { name: 'Caaguazú', uuid: 'f270bc18-bc32-44a9-8c89-326d4815625e', code: 'PY-5', url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Flag_of_Caaguazú_Department.svg' },
    { name: 'Caazapá', uuid: 'b6a96c16-11b7-4c30-9c6e-1425994c952e', code: 'PY-6', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Caazapá_Department.svg' },
    { name: 'Canindeyú', uuid: '636e5889-3e0f-4279-b97f-f8240f4eb935', code: 'PY-14', url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_Canindeyú_Department.svg' },
    { name: 'Central', uuid: 'ad85013a-417c-4e4b-a8ce-dc0fe4339d60', code: 'PY-11', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Flag_of_Central_Department%2C_Paraguay.svg' },
    { name: 'Concepción', uuid: 'efa66668-604f-4746-adf5-749b5adaede3', code: 'PY-1', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Concepción_Department.svg' },
    { name: 'Cordillera', uuid: 'e9d40666-4548-45d6-b706-bafe834ffc90', code: 'PY-3', url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Flag_of_Cordillera%2C_Paraguay.svg' },
    { name: 'Guairá', uuid: '1572bc83-70fc-4a46-b06c-8ed214b2baa7', code: 'PY-4', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Flag_of_Guairá_Department.svg' },
    { name: 'Itapúa', uuid: '93b8fe88-3a58-4edd-8be1-f1f81fa4e3a5', code: 'PY-7', url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Flag_of_Itapúa_Department.svg' },
    { name: 'Misiones', uuid: '5a78fefe-c633-4ccf-9ea6-2ab98c0aeee8', code: 'PY-8', url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Misiones%2C_Paraguay.svg' },
    { name: 'Paraguarí', uuid: '4c7d5095-4a2b-420a-97f8-f3b4388c2096', code: 'PY-9', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Flag_of_Paraguarí_Department.svg' },
    { name: 'Presidente Hayes', uuid: '8142ac52-20e2-4229-9252-c68f539f3078', code: 'PY-15', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Bandera_del_Departamento_de_Presidente_Hayes%282025%29.png' },
    { name: 'San Pedro', uuid: 'cc12d50b-e1a9-49c8-95bf-6919eeb1d5e8', code: 'PY-2', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_San_Pedro_Department_%28Paraguay%29.svg' },
    { name: 'Ñeembucú', uuid: 'bfc82496-8d99-48d8-94f2-cedefde32f9b', code: 'PY-12', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Bandera_del_Departamento_de_Ñeembucú.jpg' },
    // --- Paraguay (Capital District) ---
    { name: 'Asunción', uuid: 'f1d8d4e7-e72a-4782-a350-f60a3e5b69b6', code: 'PY-ASU', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Flag_of_Asunción.svg' },

    // --- Peru (Regions) ---
    { name: 'Amazonas', uuid: '13f1c00a-b2df-4ade-9ee4-fa909e7f4041', code: 'PE-AMA', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Amazonas_bandera.svg' },
    { name: 'Ancash', uuid: '0654442d-ad1e-4449-911d-8f2ae0efc091', code: 'PE-ANC', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Bandera_Ancash.svg' },
    { name: 'Apurímac', uuid: '8e25e53a-7477-4631-a7c3-44b4a72fb654', code: 'PE-APU', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bandera_Región_Apurimac.svg' },
    { name: 'Arequipa', uuid: '5734aa45-6305-4210-ba9c-04bf7a98fc1c', code: 'PE-ARE', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Bandera_de_Arequipa.svg' },
    { name: 'Ayacucho', uuid: '6f444248-ee78-4477-b14e-a083ecfe33a7', code: 'PE-AYA', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Flag_of_Ayacucho.svg' },
    { name: 'Cajamarca', uuid: '32060e94-bea6-4bbd-b597-08f4c98fab92', code: 'PE-CAJ', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Bandera_de_Cajamarca.svg' },
    { name: 'Cusco', uuid: '50d3a86e-b842-442f-a3d9-0e43e893eef9', code: 'PE-CUS', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Cusco_%282021%29.svg' },
    { name: 'El Callao', uuid: '25babcb1-caaa-4081-a5ba-a05e0f96afc0', code: 'PE-CAL', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Callao.png' },
    { name: 'Huancavelica', uuid: '1810cbc0-554a-4463-bd42-1fceca928d2d', code: 'PE-HUV', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Flag_of_Huancavelica.svg' },
    { name: 'Huánuco', uuid: '4109d063-69bc-4de0-890b-1c7f242a7ab5', code: 'PE-HUC', url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Flag_of_Huánuco.svg' },
    { name: 'Ica', uuid: 'dd4d28b9-93b0-4990-8a16-3e11aefef96d', code: 'PE-ICA', url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Bandera_Región_Ica.svg' },
    { name: 'Junín', uuid: '8d227410-052d-4065-b76c-91aa04716864', code: 'PE-JUN', url: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Flag_of_Junin.svg' },
    { name: 'La Libertad', uuid: '9fcb5dec-28f2-47ed-93fe-a4868d5e3f2a', code: 'PE-LAL', url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Bandera_de_La_Libertad_Peru.svg' },
    { name: 'Lambayeque', uuid: '7a815815-0603-4529-9afd-5f616a4717d2', code: 'PE-LAM', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Lambayeque_Department.svg' },
    { name: 'Lima Region', uuid: 'c70fe2c6-a19d-4663-8095-cdfba4730cd5', code: 'PE-LIM', url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Lima_region_flag.svg' },
    { name: 'Loreto', uuid: '935f6e83-067e-4074-854d-9a142c434cd4', code: 'PE-LOR', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Bandera_Región_Loreto.svg' },
    { name: 'Madre de Dios', uuid: '6b920a01-a7e8-4740-b432-9622e0fa5cea', code: 'PE-MDD', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Madre_de_Dios_Department.svg' },
    { name: 'Moquegua', uuid: 'ae8fc844-b692-46d8-a550-8f60baf15cdd', code: 'PE-MOQ', url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_Moquegua.svg' },
    { name: 'Pasco', uuid: '01ce7389-854f-4380-95c4-0ed22e720147', code: 'PE-PAS', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Flag_of_Pasco_Department.svg' },
    { name: 'Piura', uuid: '7f8edcaf-c4a7-401f-9362-517938aa41de', code: 'PE-PIU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Bandera_de_la_región_de_Piura.svg' },
    { name: 'Puno', uuid: 'db023494-03da-4ebe-a5d5-ffb37986b9a4', code: 'PE-PUN', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Bandera_Región_Puno.svg' },
    { name: 'San Martín', uuid: 'e6c77da7-5835-4f0c-ba40-2cd4a9f22468', code: 'PE-SAM', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Bandera_Región_San_Martín.svg' },
    { name: 'Tacna', uuid: '4ded19a6-1d9c-4af2-adf3-1994ee00ade6', code: 'PE-TAC', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Flag_of_Tacna.svg' },
    { name: 'Tumbes', uuid: '3d544acb-e0a3-486f-af25-2ae12ce5e011', code: 'PE-TUM', url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Bandera_de_Tumbes.svg' },
    { name: 'Ucayali', uuid: '94d6b4d3-19fa-44e1-afd6-7c45ca7a9168', code: 'PE-UCA', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Bandera_de_Ucayali.svg' },
    // --- Peru (Municipality) ---
    { name: 'Municipalidad Metropolitana de Lima', uuid: 'fd36bfd6-37a5-474e-9b28-db98fc7151ae', code: 'PE-LMA', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Flag_of_Lima.svg' },

    // --- Philippines (Autonomous Region) ---
    { name: 'Bangsamoro', uuid: 'fa9a4db5-56d1-4c07-9136-6a6bcb5a7e11', code: 'PH-14', url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Flag_of_Bangsamoro.svg' },
    // --- Philippines (Provinces) ---
    { name: 'Abra', uuid: '78b6e568-e3cc-4d6f-834d-4cc4f06ed692', code: 'PH-ABR', url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_Abra.svg' },
    { name: 'Agusan del Norte', uuid: '7e21f866-7d6b-480f-884b-d1d29a28a84c', code: 'PH-AGN', url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Agusan_Del_Norte_Flag.jpg' },
    { name: 'Agusan del Sur', uuid: '2ba21456-47db-49f4-a7cb-cb61d35c0970', code: 'PH-AGS', url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Flag_of_Agusan_del_Sur.svg' },
    { name: 'Aklan', uuid: '9de971cd-698a-432f-aaa8-cb045f207a5d', code: 'PH-AKL', url: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Flag_of_Aklan.svg' },
    { name: 'Albay', uuid: '4662a2b3-46f6-4f03-b64b-61d466364556', code: 'PH-ALB', url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Flag_of_Albay.svg' },
    { name: 'Antique', uuid: '2df3e74c-6d8d-47f2-ad77-18b63923a8a1', code: 'PH-ANT', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Antique.svg' },
    { name: 'Apayao', uuid: 'c9007233-5c86-404f-9fd0-4d5a99ac2894', code: 'PH-APA', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/PH-APA_Flag.png' },
    { name: 'Aurora', uuid: '7f8d23e1-5e7e-46c0-88a3-19dbe9c4d202', code: 'PH-AUR', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Aurora%2C_Philippines.svg' },
    { name: 'Basilan', uuid: 'bcd00119-2d38-4e66-be9b-d72e8895e282', code: 'PH-BAS', url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Flag_of_Basilan.svg' },
    { name: 'Bataan', uuid: 'b7b6b93c-03ca-47fb-a74f-6dec119af598', code: 'PH-BAN', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Bataan_Flag.png' },
    { name: 'Batanes', uuid: '4031ba94-19f3-4955-9569-8047a6a880a1', code: 'PH-BTN', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Flag_of_Batanes.svg' },
    { name: 'Batangas', uuid: '61578128-49bb-4a20-9bff-d533657a5438', code: 'PH-BTG', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Flag_of_Batangas_%282023%29.jpg' },
    { name: 'Benguet', uuid: '7eb932e2-e519-41d2-8b89-da0430c7eef7', code: 'PH-BEN', url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Flag_of_Benguet.svg' },
    { name: 'Biliran', uuid: '8f988868-88f3-43a2-a19a-e73ae3a21a0d', code: 'PH-BIL', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Flag_of_Biliran.svg' },
    { name: 'Bohol', uuid: 'd1f8f125-a679-497f-a6c4-130b2145a427', code: 'PH-BOH', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Bohol_Province%2C_Philippines.svg' },
    { name: 'Bukidnon', uuid: 'ef6cf6eb-c8d9-4e88-8b45-035b64e627d6', code: 'PH-BUK', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_the_Province_of_Bukidnon.svg' },
    { name: 'Bulacan', uuid: 'd529f18e-72f1-489b-810c-185ee2a12298', code: 'PH-BUL', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/PH-BUL_Flag.png' },
    { name: 'Cagayan', uuid: 'eae83d3c-01f8-4624-9a72-02f1a68ea011', code: 'PH-CAG', url: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Flag_of_Cagayan.svg' },
    { name: 'Camarines Norte', uuid: '60acbe76-dc49-4068-8357-0ff393b52705', code: 'PH-CAN', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Flag_of_Camarines_Norte.svg' },
    { name: 'Camarines Sur', uuid: 'c5745583-fd30-4159-ad7f-6b952dc1a022', code: 'PH-CAS', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Camarines_Sur.flag.webp' },
    { name: 'Camiguin', uuid: 'a98727e2-faba-431c-b3ce-b5807fc2e550', code: 'PH-CAM', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/PH-CAM_Flag.png' },
    { name: 'Capiz', uuid: '2c39eb61-5019-49e2-b232-462d93f3f60f', code: 'PH-CAP', url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Capiz_Flag.webp' },
    { name: 'Catanduanes', uuid: '3af3a987-65c2-4277-a5ef-d24cee201407', code: 'PH-CAT', url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/PH-CAT_Flag.png' },
    { name: 'Cavite', uuid: 'fe018389-b9a2-40a3-ad57-352c457dfd0c', code: 'PH-CAV', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/PH-CAV_Flag.png' },
    { name: 'Cebu', uuid: 'd19b90e3-3a0a-49c7-aba6-1dbdb6c514da', code: 'PH-CEB', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Cebu_Province.svg' },
    { name: 'Cotabato', uuid: '4b2c247d-6a20-4e68-9734-900b5602a1c6', code: 'PH-NCO', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/PH-NCO_Flag.png' },
    { name: 'Compostela Valley', uuid: '66cb0455-dcd9-4d78-8935-af5ca89a2d20', code: 'PH-COM', url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Davao_de_Oro_Flag.jpg' },
    { name: 'Davao del Norte', uuid: '933cd6a4-4391-4c61-9190-412431106ce6', code: 'PH-DAV', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/PH-DAV_Flag.png' },
    { name: 'Davao del Sur', uuid: 'd8121992-d9d8-410c-a40b-f3d3fce53081', code: 'PH-DAS', url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Flag_Province_of_Davao_del_Sur.jpg' },
    { name: 'Davao Oriental', uuid: '8b0e8da8-e10b-4764-bdec-02f5563b594b', code: 'PH-DAO', url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Davao_Oriental_Flag.jpg' },
    { name: 'Dinagat Islands', uuid: '34a3d824-d808-4609-836e-e29974558aac', code: 'PH-DIN', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/PH-DIN_Flag.png' },
    { name: 'Eastern Samar', uuid: '3185967c-db76-4f1b-8d49-67dedaf42e1b', code: 'PH-EAS', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Eastern_Samar_Flag.png' },
    { name: 'Guimaras', uuid: 'cac5d82e-38ba-48ec-b676-687d2ce4ee4c', code: 'PH-GUI', url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/PH-GUI_Flag.png' },
    { name: 'Ifugao', uuid: 'f79110a8-bee7-45f0-8a96-6baecd93b81a', code: 'PH-IFU', url: 'https://upload.wikimedia.org/wikipedia/commons/0/06/PH-IFU_Flag.png' },
    { name: 'Ilocos Norte', uuid: '3bbbc06d-d094-4cf0-8dd8-d547295b3a88', code: 'PH-ILN', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ilocos_Norte_Flag_HQ.png' },
    { name: 'Ilocos Sur', uuid: '68e75650-9cd8-47e9-8a70-e07fbd90b229', code: 'PH-ILS', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/PH-ILS_Flag.png' },
    { name: 'Iloilo', uuid: 'fe40e8c8-4fb5-483f-9636-68451c959989', code: 'PH-ILI', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Flag_of_the_Province_of_Iloilo.svg' },
    { name: 'Isabela', uuid: 'd79335a1-28e9-4093-9521-e96b60b9cdc5', code: 'PH-ISA', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Flag_of_Isabela_%28province%29.svg' },
    { name: 'Kalinga', uuid: '970055f6-97b4-4cad-abf1-9db58f9530d8', code: 'PH-KAL', url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/PH-KAL_Flag.png' },
    { name: 'La Union', uuid: 'c50f1836-8658-4e01-8489-eaaeb7fa6f14', code: 'PH-LUN', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/PH-LUN_Flag.png' },
    { name: 'Laguna', uuid: '66152e38-5b59-4f5e-9bd3-986f9d18f19d', code: 'PH-LAG', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/PH-LAG_Flag.svg' },
    { name: 'Lanao del Norte', uuid: 'd1758db2-50d0-4831-83ff-4222a6fdbb7a', code: 'PH-LAN', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/PH-LAN_Flag.png' },
    { name: 'Lanao del Sur', uuid: 'be0017e6-ad9a-4684-adf1-6526ebc89999', code: 'PH-LAS', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Flag_of_Lanao_del_Sur.svg' },
    { name: 'Leyte', uuid: 'ef437f17-84d1-433c-ba51-7dae37ac6690', code: 'PH-LEY', url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Leyte_Flag.png' },
    { name: 'Maguindanao', uuid: '1b2b71de-94b9-4b37-904c-506fb2af2b88', code: 'PH-MAG', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Flag_of_Maguindanao_%28province%29.svg' },
    { name: 'Marinduque', uuid: 'f2679bdb-0885-48e0-ba76-d9b59191b733', code: 'PH-MAD', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/PH-MAD_Flag.png' },
    { name: 'Masbate', uuid: 'cf2c6d77-159f-4091-86f0-0ec0bd28c994', code: 'PH-MAS', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/PH-MAS_Flag.png' },
    { name: 'Mindoro Occidental', uuid: '3f5e3f62-30bf-4be1-afa9-10ceb9d2103e', code: 'PH-MDC', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Occ._Mindoro_Flag.png' },
    { name: 'Mindoro Oriental', uuid: '864e477d-79eb-4e2b-b18d-8c419ac1e944', code: 'PH-MDR', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Orien._Mindoro_Flag.png' },
    { name: 'Misamis Occidental', uuid: 'eab3055b-8692-4877-bd29-2d0e87de1c13', code: 'PH-MSC', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Flag_of_Misamis_Occidental.svg' },
    { name: 'Misamis Oriental', uuid: '1a646a10-cb24-4605-b9aa-360a4d408f37', code: 'PH-MSR', url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/PH-MSR_Flag.png' },
    { name: 'Mountain Province', uuid: 'efcfe482-f8f7-4ab8-9817-177e74188961', code: 'PH-MOU', url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Flag_of_Mountain_Province.png' },
    { name: 'Negros Occidental', uuid: '918f4d9a-12f9-4a37-9dfe-adea39d416cc', code: 'PH-NEC', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/PH-NEC_Flag.png' },
    { name: 'Negros Oriental', uuid: '1a470883-3230-4335-b55e-fab95f2102a9', code: 'PH-NER', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/PH-NER_Flag.png' },
    { name: 'Northern Samar', uuid: 'a6741f4a-8a21-4589-9e18-a103641c6521', code: 'PH-NSA', url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/PH-NSA_Flag.png' },
    { name: 'Nueva Ecija', uuid: 'b5ca4e42-0388-46d7-aa2a-88976b06b385', code: 'PH-NUE', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Vlag_Fil_NuevaEcija.gif' },
    { name: 'Nueva Vizcaya', uuid: '17163f0c-72df-4f7c-bbc2-3d6175a729dc', code: 'PH-NUV', url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/PH-NUV_Flag.png' },
    { name: 'Palawan', uuid: '4d3a70a2-3b59-46e4-b722-593bf0caa9be', code: 'PH-PLW', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Flag_of_Palawan%2C_Philippines.svg' },
    { name: 'Pampanga', uuid: '084a9f3b-e6b7-4b9a-a5e5-50ac4a0a24e2', code: 'PH-PAM', url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Pampanga_Flag.png' },
    { name: 'Pangasinan', uuid: 'f9b920e4-66f7-4974-9c2f-5de136e4bef4', code: 'PH-PAN', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Flag_of_Pangasinan.svg' },
    { name: 'Quezon', uuid: '3740119a-3a9a-4e16-8b2a-fabd3aa49256', code: 'PH-QUE', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Provincial_Flag_of_Quezon.svg' },
    { name: 'Quirino', uuid: 'c49899ef-b9fc-463f-bb97-c8c787e517ea', code: 'PH-QUI', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Quirino_flag.png' },
    { name: 'Rizal', uuid: '97f37c9c-05c5-4fe9-b5d8-a02349eef909', code: 'PH-RIZ', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Rizal_Flag.png' },
    { name: 'Romblon', uuid: '1652b23f-def4-4e87-8a6b-7e48c7fdad2f', code: 'PH-ROM', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/PH-ROM_Flag.png' },
    { name: 'Samar (Western Samar)', uuid: 'e48932ac-eb36-4a5a-9ef4-5f5028f01d2e', code: 'PH-WSA', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Reconstructed_Flag_of_Samar.png' },
    { name: 'Sarangani', uuid: '387d6e19-38d5-41da-bcf5-b6f53ea1facc', code: 'PH-SAR', url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Flag_of_Sarangani.png' },
    { name: 'Siquijor', uuid: 'f4d761ef-5a23-4783-a4c1-74cb4a090f86', code: 'PH-SIG', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Siquijor_Flag.png' },
    { name: 'Sorsogon', uuid: '6d4ebaa2-9ce0-4656-b8c0-d8579e8ac3b3', code: 'PH-SOR', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/PH-SOR_Flag_2.png' },
    { name: 'South Cotabato', uuid: '90047655-826b-4282-8606-f69552a782da', code: 'PH-SCO', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/South_Cotabato_Flag.png' },
    { name: 'Southern Leyte', uuid: 'aa96bb5a-f7f2-433d-8589-1dfea52df1ac', code: 'PH-SLE', url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Flag_of_Southern_Leyte.svg' },
    { name: 'Sultan Kudarat', uuid: '8d84c164-550c-4c8e-afc3-eb5b6bac6722', code: 'PH-SUK', url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Sultan_Kudarat_Flag.png' },
    { name: 'Sulu', uuid: 'dfdded75-640b-4d84-a852-5dd4e3b5809c', code: 'PH-SLU', url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Sulu_Province_Flag.svg' },
    { name: 'Surigao del Norte', uuid: 'a8b91b96-ab02-4294-ac42-afc862b06e4c', code: 'PH-SUN', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Flag_of_Surigao_del_Norte.svg' },
    { name: 'Surigao del Sur', uuid: '4ce8b632-d26e-471e-867c-37fad949ffd0', code: 'PH-SUR', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Surigao_del_Sur_Flag.png' },
    { name: 'Tarlac', uuid: 'f8de0c87-8379-48f6-9880-0a3a7900490d', code: 'PH-TAR', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Flag_of_the_Province_of_Tarlac.svg' },
    { name: 'Tawi-Tawi', uuid: '1607d25c-762d-48ba-9595-3620672d2cc0', code: 'PH-TAW', url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Tawi-Tawi_Flag.png' },
    { name: 'Zambales', uuid: '4962fd16-a045-4cc0-bc8a-61dd40497c4a', code: 'PH-ZMB', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Zambales_Flag.png' },
    { name: 'Zamboanga del Norte', uuid: '715a13f9-38e2-4560-8549-038463a84f08', code: 'PH-ZAN', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Zamboanga_del_Norte_Flag.png' },
    { name: 'Zamboanga del Sur', uuid: '7fa34b86-c193-421c-8646-096067c38aa9', code: 'PH-ZAS', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Zamboanga_del_Sur_gov._Flag.png' },
    { name: 'Zamboanga Sibugay', uuid: 'd1668335-f65c-4c89-951d-9efd92a169eb', code: 'PH-ZSI', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Zamboanga_Sibugay_Flag.png' },
    // --- Philippines (Cities) ---
    { name: 'Baguio City', uuid: 'd2ace202-f3be-4982-87a5-4ecd21a2d1bb', code: 'PH-BAGU', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Baguioflag.png' },
    { name: 'Butuan City', uuid: '1e81a869-2d78-4f2a-b97d-39f9a98dfd51', code: 'PH-BUTU', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Butuancityflag.jpg' },
    { name: 'Caloocan City', uuid: '6b158d33-3e33-4dc2-9dd6-d700f7c34485', code: 'PH-CALO', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag_of_Caloocan_City.png' },
    { name: 'Dagupan', uuid: '271c4e34-a3bd-4449-9e3f-76b6993c7cc3', code: 'PH-DAGU', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Dagupan%2C_Pangasinan_%28New%29.png' },
    { name: 'Davao City', uuid: 'db66ed80-d106-451a-94bd-7afd875a7993', code: 'PH-DAVA', url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Davao_City.png' },
    { name: 'Makati', uuid: '3b884d7f-dffa-4672-8077-4124a1998c8d', code: 'PH-MAKA', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/The_Official_Flag_of_the_City_of_Makati.jpg' },
    { name: 'Mandaluyong', uuid: '10a9927b-b388-45f5-a35b-a224472828d7', code: 'PH-MAND', url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Flag_of_Mandaluyong.png' },
    { name: 'Manila', uuid: 'dcdf2469-1d20-4378-a2a2-f5f462fcc873', code: 'PH-MANI', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Manila.svg' },
    { name: 'Marikina', uuid: '4ccd2542-2490-46b1-a1e6-b69547c49fbb', code: 'PH-MARI', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Marikina_City_Flag.svg' },
    { name: 'Parañaque', uuid: '9ec4ea14-a856-4e57-9afb-5555b38dfb38', code: 'PH-PARA', url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Paranaque_Flag.jpg' },
    { name: 'Pasay', uuid: '3263f206-a31c-42e2-be63-db8499347ecc', code: 'PH-PASA', url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Flag_of_Pasay.png' },
    { name: 'Pasig City', uuid: '18e4e083-e0d8-4072-8467-1057b2c35e77', code: 'PH-PASI', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Pasig_City_Flag_2.svg' },
    { name: 'Quezon City', uuid: '3e15af1e-32e5-4817-aabf-f5073322a73b', code: 'PH-QUEZ', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Quezon_City_Flag.svg' },
    { name: 'San Juan City', uuid: '8aa27f61-7859-45cb-a60c-0202c7dd96a4', code: 'PH-SANJ', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_San_Juan%2C_Metro_Manila.png' },
    { name: 'Taguig City', uuid: 'fee1bb4b-540f-45b7-ba50-bf22f7a9b3f8', code: 'PH-TAGU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Taguig_City_flag.png' },
    { name: 'Valenzuela City', uuid: 'fa93bee3-f990-4b36-b5b2-218cd55cc278', code: 'PH-VALE', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Valenzuela_City_Flag.svg' },

    // --- Poland (Voivodeships) ---
    { name: 'Dolnośląskie', uuid: 'e01a7d82-16e5-4644-9359-eaf2cef729fa', code: 'PL-DS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_dolno%C5%9Bl%C4%85skie_flag.svg' },
    { name: 'Kujawsko-pomorskie', uuid: '114ed91f-900e-4329-9031-896b183d8e1c', code: 'PL-KP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_kujawsko-pomorskie_flag.svg' },
    { name: 'Lubelskie', uuid: '5189e378-49f7-4766-b5a5-627d79f16bec', code: 'PL-LU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_lubelskie_flag.svg' },
    { name: 'Lubuskie', uuid: '8a3de21e-6bb8-4dcd-9460-5bdbe26ee2bc', code: 'PL-LB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_lubuskie_flag.svg' },
    { name: 'Łódzkie', uuid: 'fd800799-e76a-49cd-a3d8-599aa1570f5e', code: 'PL-LD', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_%C5%82%C3%B3dzkie_flag.svg' },
    { name: 'Małopolskie', uuid: 'c02806b4-ba8f-4b15-8531-f12a59fdc9b3', code: 'PL-MA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_ma%C5%82opolskie_flag.svg' },
    { name: 'Mazowieckie', uuid: '52a0fd3a-8730-45d8-a3af-286f377d91b5', code: 'PL-MZ', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_mazowieckie_flag.svg' },
    { name: 'Opolskie', uuid: '5bd44f46-e60c-4cc3-9fa7-e45e5fd1bfb7', code: 'PL-OP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_opolskie_flag.svg' },
    { name: 'Podkarpackie', uuid: '770de882-48b7-45d7-a6df-7d426cedc39a', code: 'PL-PK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_podkarpackie_flag.svg' },
    { name: 'Podlaskie', uuid: '15d8fc75-c719-4f6d-8818-a95a49304e77', code: 'PL-PD', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_podlaskie_flag.svg' },
    { name: 'Pomorskie', uuid: 'c277ffb1-7e0f-4d3b-8688-03471ecfe49a', code: 'PL-PM', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_pomorskie_flag.svg' },
    { name: 'Śląskie', uuid: '34cee74b-bb90-4f7d-82c1-63ec20007145', code: 'PL-SL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_%C5%9Bl%C4%85skie_flag.svg' },
    { name: 'Świętokrzyskie', uuid: 'c3f1e0ce-b9ef-4648-bb9c-c504cb6dae0f', code: 'PL-SK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_%C5%9Bwi%C4%99tokrzyskie_flag.svg' },
    { name: 'Warmińsko-mazurskie', uuid: '14fec11f-829b-4127-9a96-e83b272ed9ee', code: 'PL-WN', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_warmi%C5%84sko-mazurskie_flag.svg' },
    { name: 'Wielkopolskie', uuid: '52e7ac8f-4a25-49c6-8637-1bdaa4b08d74', code: 'PL-WP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_wielkopolskie_flag.svg' },
    { name: 'Zachodniopomorskie', uuid: '78ab1f28-e113-4491-a483-09addee2ecdc', code: 'PL-ZP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/POL_wojew%C3%B3dztwo_zachodniopomorskie_flag.svg' },

    // --- Portugal (Districts) ---
    { name: 'Aveiro', uuid: 'd7f443f8-baab-45ea-b2eb-750b21e96164', code: 'PT-01', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Aveiro_Flag.svg' },
    { name: 'Beja', uuid: 'ea2c07b3-5d99-4139-84b8-9b8ed0c106eb', code: 'PT-02', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag_of_Beja.svg' },
    { name: 'Braga', uuid: 'a909a4a6-0c95-41a1-b96f-d0a4f7394049', code: 'PT-03', url: 'https://upload.wikimedia.org/wikipedia/commons/archive/4/40/20091120194452%21Pt-brg1.png' },
    { name: 'Bragança', uuid: '589cf788-79c3-418e-ba67-62bdfb3e547f', code: 'PT-04', url: 'https://upload.wikimedia.org/wikipedia/commons/archive/4/4a/20091120194449%21Pt-bgc1.png' },
    { name: 'Castelo Branco', uuid: 'e6d9cf23-db3d-4372-9d5c-98a7a40ce7d1', code: 'PT-05', url: 'https://upload.wikimedia.org/wikipedia/commons/archive/2/2e/20091120194447%21Pt-ctb1.png' },
    { name: 'Coimbra', uuid: 'e342e391-216d-428f-8d89-1f09daf0bda9', code: 'PT-06', url: 'https://upload.wikimedia.org/wikipedia/commons/archive/8/87/20131029011528%21Pt-cbr1.png' },
    { name: 'Évora', uuid: 'cc0c81fa-1d3c-433b-b138-ac1af871f72c', code: 'PT-07', url: 'https://upload.wikimedia.org/wikipedia/commons/archive/0/00/20091120194443%21Pt-evr1.png' },
    { name: 'Faro', uuid: 'abc1b593-cfae-4b8b-bd28-e6533ed0e3eb', code: 'PT-08', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Faroflag.svg' },
    { name: 'Guarda', uuid: '8e09774c-bbde-4872-a8fd-53fb14ae2964', code: 'PT-09', url: 'https://upload.wikimedia.org/wikipedia/commons/archive/9/96/20091120194439%21Pt-grd1.png' },
    { name: 'Leiria', uuid: 'a9cfeb4d-4426-4488-8916-ca1387af9e6e', code: 'PT-10', url: 'https://upload.wikimedia.org/wikipedia/commons/archive/f/f5/20091120194459%21Pt-lra1.png' },
    { name: 'Lisboa', uuid: '4f01d77c-1e16-4e8c-b1c2-7c8d76dcae7b', code: 'PT-11', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Flag_of_Lisbon.svg' },
    { name: 'Portalegre', uuid: 'cafae8f2-6765-4cec-868d-b0fea003ecb0', code: 'PT-12', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Bandeira_de_Portalegre.jpg' },
    { name: 'Porto', uuid: 'a6b011eb-b9ab-453e-af95-4fdd9d040ba1', code: 'PT-13', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Flag_of_Porto.svg' },
    { name: 'Santarém', uuid: 'b2eec9f2-14d6-4359-87f2-5890cf39c0df', code: 'PT-14', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Santarém_PT_Flag.jpg' },
    { name: 'Setúbal', uuid: 'c6fd772b-952f-452c-9fad-3301938de9ca', code: 'PT-15', url: 'https://www.magflags.net/media/catalog/product/cache/8cf168c4cb81685e3b89c0586044f7f8/P/T/PT-15_11.png' },
    { name: 'Viana do Castelo', uuid: '9c48914d-86af-4979-a732-280cc69fba78', code: 'PT-16', url: 'https://www.crwflags.com/fotw/images/p/pt-vct.gif' },
    { name: 'Vila Real', uuid: 'fc3ab0c6-c0e0-4320-86df-9ac7ec2d802e', code: 'PT-17', url: 'https://www.crwflags.com/fotw/images/p/pt-vrl.gif' },
    { name: 'Viseu', uuid: '46696dd4-e1dd-4572-8c50-98dc85b56c5d', code: 'PT-18', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Bandeira_de_Viseu.jpg' },
    // --- Portugal (Autonomous Regions) ---
    { name: 'Açores', uuid: 'c998ef9b-8656-45f3-ba70-8d8c15a33a29', code: 'PT-20', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Flag_of_the_Azores.svg' },
    { name: 'Madeira', uuid: '9cdaf9c8-4d0a-4ca6-8737-4fed25d642c5', code: 'PT-30', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_Madeira.svg' },

    // --- Romania (Counties) ---
    { name: 'Alba', uuid: 'e1448a13-a925-41e0-861e-9c378e323ec6', code: 'RO-AB', url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/RO_Alba_County_Flag.svg' },
    { name: 'Arad', uuid: 'a822e235-69e6-4d16-825e-b2c77aa6a480', code: 'RO-AR', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/ROU_AR_Arad_Flag.svg' },
    { name: 'Argeș', uuid: 'd0063372-8996-4498-b86d-f850bb6b4b32', code: 'RO-AG', url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Drapel_Județul_Argeș.png' },
    { name: 'Bacău', uuid: '07b8aa5c-3082-45d4-a69b-2681e98f9383', code: 'RO-BC', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Bacau_flag.webp' },
    { name: 'Bihor', uuid: '75b9f53b-03e4-4b95-b7d6-3a6bdbded6a2', code: 'RO-BH', url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Flag_of_Bihor_County%2C_Romania.svg' },
    { name: 'Bistrița-Năsăud', uuid: '15b344a0-8fb9-42f3-81b1-c90d15edc30c', code: 'RO-BN', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag-of-bistrita-nasaud-county.jpg' },
    { name: 'Botoșani', uuid: '6c128047-9439-4086-8844-20bf7315b56b', code: 'RO-BT', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag-of-botosani-county.jpg' },
    { name: 'Brăila', uuid: 'ac473e95-8c32-4642-8af4-5ad9f0f09002', code: 'RO-BR', url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Drapel_Județul_Brăila.png' },
    { name: 'Brașov', uuid: 'e7f6c883-54d6-4371-bca4-872c024397b7', code: 'RO-BV', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag-of-Brașov-County.png' },
    { name: 'Buzău', uuid: '6aee9072-54d9-4e07-9fa9-4fe5912f56b8', code: 'RO-BZ', url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Drapel_Județul_Buzău.png' },
    { name: 'Călărași', uuid: 'e587c4f8-7092-46ad-a47b-808b89d3fa80', code: 'RO-CL', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Drapel_Județul_Călărași.png' },
    { name: 'Caraș-Severin', uuid: '4b6dd751-ad34-4a64-8615-8f2c08b20d28', code: 'RO-CS', url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Flag_of_Caras-Severin_County.gif' },
    { name: 'Cluj', uuid: 'cf0788d4-cde5-4cb7-aff1-5452330de8aa', code: 'RO-CJ', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Cluj_flag.webp' },
    { name: 'Constanța', uuid: '7ac5975b-f555-448e-9fc7-104b165795fc', code: 'RO-CT', url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Drapel_Județul_Constanța.png' },
    { name: 'Covasna', uuid: '6c7037d5-c4de-427a-87e5-b213c7d41a39', code: 'RO-CV', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Flag_of_Covasna_County%2C_Romania.svg' },
    { name: 'Dâmbovița', uuid: 'f944648c-ac13-4e17-82f1-1b28ed4d732a', code: 'RO-DB', url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Drapel_Județul_Dâmbovița.png' },
    { name: 'Dolj', uuid: '209c5d0a-a26a-4682-90be-2a4c6b5db6f3', code: 'RO-DJ', url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Drapel_Județul_Dolj.png' },
    { name: 'Galați', uuid: 'f8bf7fc5-0da3-4ccf-8db8-9e93c2ef5e1d', code: 'RO-GL', url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Drapel_Județul_Galați.png' },
    { name: 'Giurgiu', uuid: '7fa57738-5a14-4769-b372-b4e1cebbf3e5', code: 'RO-GR', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Giurgiu_County%2C_Romania.svg' },
    { name: 'Gorj', uuid: '90c02c1d-4432-4911-8513-2e0af9eacf15', code: 'RO-GJ', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Gorj_flag.webp' },
    { name: 'Harghita', uuid: '49c21126-cdde-41d2-b75b-228935b2a068', code: 'RO-HR', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Harghita_County.gif' },
    { name: 'Hunedoara', uuid: '5f090e5d-9d9d-4b26-b1b4-da0e1ed7fbcc', code: 'RO-HD', url: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Hunedoara_flag.webp' },
    { name: 'Ialomița', uuid: 'dbe62274-b3fc-45a1-a2a8-1180e08260ac', code: 'RO-IL', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Ialomiţa_County%2C_Romania.svg' },
    { name: 'Iași', uuid: '3131d772-b6f0-4ddb-a3e8-a499005f6ed1', code: 'RO-IS', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Drapel_Județul_Iași.png' },
    { name: 'Ilfov', uuid: '42d009e4-5fb6-4994-b19d-c7eb496eb0be', code: 'RO-IF', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Ilfov_flag.webp' },
    { name: 'Maramureș', uuid: '855e53ae-36b6-467a-9d50-0aea9efc400b', code: 'RO-MM', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Maramure%C8%99_County.svg' },
    { name: 'Mehedinți', uuid: 'e383f64c-5835-4594-86a9-3aa83adda74d', code: 'RO-MH', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Mehedinti_flag.webp' },
    { name: 'Mureș', uuid: 'b740802c-8e2b-45f3-8713-5c40666e0291', code: 'RO-MS', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Mureș-County-Flag.png' },
    { name: 'Neamț', uuid: '302c12fd-c5fe-4a09-86b1-bec9e68a25b5', code: 'RO-NT', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Drapel_Județul_Neamț.png' },
    { name: 'Olt', uuid: 'c17f341e-fb39-4330-8fd3-5cd7fcbee19c', code: 'RO-OT', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Drapel_Județul_Olt.png' },
    { name: 'Prahova', uuid: '7d56da01-4427-458f-be29-e5df90646aa2', code: 'RO-PH', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Prahova_flag.png' },
    { name: 'Sălaj', uuid: 'a3266621-1224-4370-b163-cf3a3c96fb91', code: 'RO-SJ', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Drapel_Județul_Sălaj.png' },
    { name: 'Satu Mare', uuid: 'c030a597-3f17-4282-9cfb-2e8b128e4eab', code: 'RO-SM', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Flag_of_Satu_Mare_County.png' },
    { name: 'Sibiu', uuid: 'a37d3d0a-26af-4426-b125-f30ee3c6cba4', code: 'RO-SB', url: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Drapel_Județul_Sibiu.png' },
    { name: 'Suceava', uuid: 'e26e09ed-79a9-4e88-84b3-82e9dd11f009', code: 'RO-SV', url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Drapel_Județul_Suceava.png' },
    { name: 'Teleorman', uuid: '10e8ecf7-af60-4803-b784-1b35650b6fef', code: 'RO-TR', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Drapel_Județul_Teleorman.png' },
    { name: 'Timiș', uuid: '29e72968-6ced-495d-a1bf-10680153986c', code: 'RO-TM', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Timis_flag.webp' },
    { name: 'Tulcea', uuid: '2652c57b-013e-4750-b684-7326cf62896c', code: 'RO-TL', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Drapel_Județul_Tulcea.png' },
    { name: 'Vâlcea', uuid: '9529de40-8979-4626-a972-c1e8079c1eff', code: 'RO-VL', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Valcea_flag.webp' },
    { name: 'Vaslui', uuid: '69d4ab57-9a2d-484c-a786-4d8b0542fa9e', code: 'RO-VS', url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Drapel_Județul_Vaslui.png' },
    { name: 'Vrancea', uuid: 'c6773e7d-1aa9-424a-87e2-3717e8798394', code: 'RO-VN', url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Drapel_Județul_Vrancea.png' },
    // --- Romania (Municipality) ---
    { name: 'București', uuid: '72ac17ca-9a6b-415b-9fcc-5d1a8e7afeee', code: 'RO-B', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Bucharest.svg' },

    // --- Russia (Oblasts) ---
    { name: 'Amurskaya oblast\'', uuid: '9061f48b-e736-48e9-9e9f-990e0b887d6c', code: 'RU-AMU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Amur_Oblast.svg' },
    { name: 'Arkhangel\'skaya oblast\'', uuid: '42600c00-4b16-41b0-9c6e-4eda7bf00680', code: 'RU-ARK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Arkhangelsk_Oblast.svg' },
    { name: 'Astrakhanskaya oblast\'', uuid: '6c2c2263-674d-4eb9-9a8a-afa88ae8d9c3', code: 'RU-AST', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Astrakhan_Oblast.svg' },
    { name: 'Belgorodskaya oblast\'', uuid: '18bfd0b7-c24f-488c-9fa1-ae6dd831410e', code: 'RU-BEL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Belgorod_Oblast.svg' },
    { name: 'Bryanskaya oblast\'', uuid: 'da6424a8-f5c3-47ff-a246-8986763a0fe7', code: 'RU-BRY', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Bryansk_Oblast.svg' },
    { name: 'Chelyabinskaya oblast\'', uuid: '26b7ffd5-5df6-4c21-be93-7143df1b45ea', code: 'RU-CHE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Chelyabinsk_Oblast.svg' },
    { name: 'Irkutskaya oblast\'', uuid: '405a06f8-4745-4507-9efb-762dfa3f2676', code: 'RU-IRK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Irkutsk_Oblast.svg' },
    { name: 'Ivanovskaya oblast\'', uuid: '9900c59e-cdc6-4315-bfeb-5df758ddc4bf', code: 'RU-IVA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ivanovo_Oblast.svg' },
    { name: 'Kaliningradskaya oblast\'', uuid: 'e030d5d7-2d03-456f-91b8-a3fadfd6050d', code: 'RU-KGD', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kaliningrad_Oblast.svg' },
    { name: 'Kaluzhskaya oblast\'', uuid: '619d7e3c-a3b6-4126-8df6-35f0832ae223', code: 'RU-KLU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kaluga_Oblast.svg' },
    { name: 'Kemerovskaya oblast\'', uuid: '938f6ca0-c0d1-4a3b-8113-26d97c0ff0ac', code: 'RU-KEM', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kemerovo_Oblast.svg' },
    { name: 'Kirovskaya oblast\'', uuid: '4ee64aff-5e83-4747-92e8-7d0ab2a1310a', code: 'RU-KIR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kirov_Oblast.svg' },
    { name: 'Kostromskaya oblast\'', uuid: '3293f341-d81d-4026-ab9a-529efa244162', code: 'RU-KOS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kostroma_Oblast.svg' },
    { name: 'Kurganskaya oblast\'', uuid: 'c770c24b-a616-44ec-a0a6-037cf768f37f', code: 'RU-KGN', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kurgan_Oblast.svg' },
    { name: 'Kurskaya oblast\'', uuid: 'f2725db1-295d-4d20-8f35-406798dbbaed', code: 'RU-KRS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kursk_Oblast.svg' },
    { name: 'Leningradskaya oblast\'', uuid: 'b64ada09-41aa-4b45-8d53-07c3dc47e6f1', code: 'RU-LEN', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Leningrad_Oblast.svg' },
    { name: 'Lipetskaya oblast\'', uuid: 'd23f4f31-81f0-4418-bb1b-a30c7fd7537f', code: 'RU-LIP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Lipetsk_Oblast.svg' },
    { name: 'Magadanskaya oblast\'', uuid: '26c5a7f9-34f3-4555-8bab-1eacb78088a2', code: 'RU-MAG', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Magadan_Oblast.svg' },
    { name: 'Moskovskaya oblast\'', uuid: 'd59ab45e-edc4-4ddf-a3df-5733db641f3e', code: 'RU-MOS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Moscow_Oblast.svg' },
    { name: 'Murmanskaya oblast\'', uuid: '8607538f-3cc9-4680-8c88-e9ea8e7fae83', code: 'RU-MUR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Murmansk_Oblast.svg' },
    { name: 'Nizhegorodskaya oblast\'', uuid: 'd6acfdca-9aa8-4bb8-9e97-8b1008fa0b64', code: 'RU-NIZ', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Nizhny_Novgorod_Region.svg' },
    { name: 'Novgorodskaya oblast\'', uuid: '961495d4-0a6d-4f9a-ab9e-f0d87d7b8d4a', code: 'RU-NGR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Novgorod_Oblast.svg' },
    { name: 'Novosibirskaya oblast\'', uuid: 'fa06c373-a91e-427a-9718-e6b45503ff24', code: 'RU-NVS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Novosibirsk_Oblast.svg' },
    { name: 'Omskaya oblast\'', uuid: '33dd0294-b926-4953-ba40-3362f787ee70', code: 'RU-OMS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Omsk_Oblast.svg' },
    { name: 'Orenburgskaya oblast\'', uuid: '82eab6be-2d28-471a-a906-9c3c1a9f85f6', code: 'RU-ORE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Orenburg_Oblast.svg' },
    { name: 'Orlovskaya oblast\'', uuid: '08861d19-3c24-464c-a6c8-6eb38b83190e', code: 'RU-ORL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Oryol_Oblast.svg' },
    { name: 'Penzenskaya oblast\'', uuid: '88f4107c-905d-4887-be20-44eaf7cfe058', code: 'RU-PNZ', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Penza_Oblast.svg' },
    { name: 'Pskovskaya oblast\'', uuid: '9f045a89-3731-4122-b27d-65aec2e8705b', code: 'RU-PSK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Pskov_Oblast.svg' },
    { name: 'Rostovskaya oblast\'', uuid: '4f9df1a3-8b21-40cd-bf2c-7dd230938286', code: 'RU-ROS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Rostov_Oblast.svg' },
    { name: 'Ryazanskaya oblast\'', uuid: '7d9445f4-3c24-46e0-8c85-ef4ee214a364', code: 'RU-RYA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ryazan_Oblast.svg' },
    { name: 'Sakhalinskaya oblast\'', uuid: '85b1246b-8936-4f93-b91e-8f17ba9905e5', code: 'RU-SAK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sakhalin_Oblast.svg' },
    { name: 'Samarskaya oblast\'', uuid: 'a48bedb2-305a-4ca0-b549-30d0842a8808', code: 'RU-SAM', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Samara_Oblast.svg' },
    { name: 'Saratovskaya oblast\'', uuid: 'a72b86b4-732b-411e-be92-11de8821e70f', code: 'RU-SAR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Saratov_Oblast.svg' },
    { name: 'Smolenskaya oblast\'', uuid: '391c3811-f741-4926-b1b7-eb09c46cf961', code: 'RU-SMO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Smolensk_Oblast.svg' },
    { name: 'Sverdlovskaya oblast\'', uuid: '7d3118da-038c-46dd-bae9-16689b926862', code: 'RU-SVE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sverdlovsk_Oblast.svg' },
    { name: 'Tambovskaya oblast\'', uuid: '79d10d93-858e-4fdf-96b5-252ad5a90682', code: 'RU-TAM', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tambov_Oblast.svg' },
    { name: 'Tomskaya oblast\'', uuid: 'd87db114-8c07-41cf-af7c-40d4e6fa13ce', code: 'RU-TOM', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tomsk_Oblast.svg' },
    { name: 'Tul\'skaya oblast\'', uuid: '3c964554-785b-452b-a74c-3789715a95ca', code: 'RU-TUL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tula_Oblast.svg' },
    { name: 'Tverskaya oblast\'', uuid: '93b43808-412b-463c-bddd-8ee227766197', code: 'RU-TVE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tver_Oblast.svg' },
    { name: 'Tyumenskaya oblast\'', uuid: '5b0d3b4b-f077-42f2-a3b1-d143936505f4', code: 'RU-TYU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tyumen_Oblast.svg' },
    { name: 'Ul\'yanovskaya oblast\'', uuid: 'd1929b9b-9727-48cc-8d51-ccf300d186c9', code: 'RU-ULY', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ulyanovsk_Oblast.svg' },
    { name: 'Vladimirskaya oblast\'', uuid: 'd9850091-5957-41bd-ab1f-e04a84f0c5fb', code: 'RU-VLA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Vladimir_Oblast.svg' },
    { name: 'Volgogradskaya oblast\'', uuid: '123ec471-830e-4dee-bcc6-dae79e5acf7d', code: 'RU-VGG', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Volgograd_Oblast.svg' },
    { name: 'Vologodskaya oblast\'', uuid: '0298636b-6cd3-4bd2-b4fd-e486d5056c84', code: 'RU-VLG', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Vologda_Oblast.svg' },
    { name: 'Voronezhskaya oblast\'', uuid: '3f7e6cb2-0e57-4295-beb0-ebe75daf0b0d', code: 'RU-VOR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Voronezh_Oblast.svg' },
    { name: 'Yaroslavskaya oblast\'', uuid: '472bcb98-ee64-4381-aa23-6bd8e173c752', code: 'RU-YAR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Yaroslavl_Oblast.svg' },
    { name: 'Yevreyskaya avtonomnaya oblast\'', uuid: '622d7402-109c-426a-9628-91f7565a0b88', code: 'RU-YEV', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Jewish_Autonomous_Oblast.svg' },
    // --- Russia (Republics) ---
    { name: 'Chechenskaya Respublika', uuid: 'b6514d25-505b-413a-a2d0-62b9464496f4', code: 'RU-CE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Chechnya.svg' },
    { name: 'Chuvashskaya Respublika', uuid: '8185eac8-9aec-482b-af94-19b70d04e91e', code: 'RU-CU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Chuvashia.svg' },
    { name: 'Kabardino-Balkarskaya Respublika', uuid: '7d47d86a-6f5f-4c21-a1da-3140c8958715', code: 'RU-KB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kabardino-Balkaria.svg' },
    { name: 'Karachayevo-Cherkesskaya Respublika', uuid: '13be50b7-7b24-4ea3-b5aa-93a301c600fb', code: 'RU-KC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Karachay-Cherkessia.svg' },
    { name: 'Respublika Adygeya', uuid: 'a39536e1-8b06-4d20-a3f0-802c0be3a921', code: 'RU-AD', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Adygea.svg' },
    { name: 'Respublika Altay', uuid: 'ce3b5bfd-8507-4553-9f20-22ca625462e5', code: 'RU-AL', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Altai_Republic.svg' },
    { name: 'Respublika Bashkortostan', uuid: '8570458e-202d-44b9-8d9b-f1d3f4926c6b', code: 'RU-BA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Bashkortostan.svg' },
    { name: 'Respublika Buryatiya', uuid: '51fdd4e4-6c11-46d4-8bec-0c7385d0f83d', code: 'RU-BU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Buryatia.svg' },
    { name: 'Respublika Dagestan', uuid: '37572420-4b2c-47e5-bf2b-536c9a50a362', code: 'RU-DA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Dagestan.svg' },
    { name: 'Respublika Ingushetiya', uuid: 'dbd26a8a-03de-4a71-a81e-11d700e08d4f', code: 'RU-IN', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ingushetia.svg' },
    { name: 'Respublika Kalmykiya', uuid: '7fa4dd42-21f3-4c3d-9862-6845e9153e06', code: 'RU-KL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kalmykia.svg' },
    { name: 'Respublika Kareliya', uuid: 'a8c4b5ca-8e7a-41f3-893f-df91c5d51732', code: 'RU-KR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Karelia.svg' },
    { name: 'Respublika Khakasiya', uuid: 'fc8d4e40-57bb-42fe-a46a-92c935520298', code: 'RU-KK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Khakassia.svg' },
    { name: 'Respublika Komi', uuid: '7fc7ef7e-ee42-40d3-bdd7-e993171cba13', code: 'RU-KO', url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Komi.svg' },
    { name: 'Respublika Mariy El', uuid: '75db1d6c-b090-4114-895e-338b6fb1228c', code: 'RU-ME', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Mari_El.svg' },
    { name: 'Respublika Mordoviya', uuid: 'fbb13feb-0fcf-4f99-83fa-7a5239e68b82', code: 'RU-MO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Mordovia.svg' },
    { name: 'Respublika Sakha (Yakutiya)', uuid: '9795004e-e957-4fc2-8938-aef1b573b297', code: 'RU-SA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sakha.svg' },
    { name: 'Respublika Severnaya Osetiya-Alaniya', uuid: 'e4269131-c8f7-41ff-8600-1f49fe3b319c', code: 'RU-SE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_North_Ossetia.svg' },
    { name: 'Respublika Tatarstan', uuid: '9593b81f-1249-48a9-9155-6456488e3cde', code: 'RU-TA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tatarstan.svg' },
    { name: 'Respublika Tyva', uuid: '1a64314a-ea0d-488d-9be2-ee619ad12a36', code: 'RU-TY', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Tuva.svg' },
    { name: 'Udmurtskaya Respublika', uuid: '85cfb970-3954-432e-a9ba-658e097c9772', code: 'RU-UD', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Udmurtia.svg' },
    // --- Russia (Autonomous Okrugs) ---
    { name: 'Chukotskiy avtonomnyy okrug', uuid: '978b67a8-46e3-4718-984f-5d997eed9913', code: 'RU-CHK', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Chukotka.svg' },
    { name: 'Khanty-Mansiyskiy avtonomnyy okrug-Yugra', uuid: '485bcc38-f11a-4758-99c3-245eac07dd64', code: 'RU-KHM', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Yugra.svg' },
    { name: 'Nenetskiy avtonomnyy okrug', uuid: '4e2042d5-1c82-4015-aa7d-30cc2f9e482a', code: 'RU-NEN', url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Flag_of_Nenets_Autonomous_District.svg' },
    { name: 'Yamalo-Nenetskiy avtonomnyy okrug', uuid: '7065fa43-b1c3-4bd9-8917-4196c89ba9ca', code: 'RU-YAN', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Yamalo-Nenets_Autonomous_Okrug.svg' },
    // --- Russia (Krais) ---
    { name: 'Altayskiy kray', uuid: '7228e432-b2eb-42c3-8b12-063c63038c54', code: 'RU-ALT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Altai_Krai.svg' },
    { name: 'Kamchatskiy kray', uuid: '189f41da-4ec2-4b0d-a870-97d1582b880c', code: 'RU-KAM', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kamchatka_Krai.svg' },
    { name: 'Khabarovskiy kray', uuid: 'fc3cff5b-c47f-4ea2-aa93-2edcb8f95ef1', code: 'RU-KHA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Khabarovsk_Krai.svg' },
    { name: 'Krasnodarskiy kray', uuid: 'b1cfa078-6827-4af2-b197-5d3522367a3d', code: 'RU-KDA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Krasnodar_Krai.svg' },
    { name: 'Krasnoyarskiy kray', uuid: '28e0abb1-6e1b-4291-ba60-bce4633f3f36', code: 'RU-KYA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Krasnoyarsk_Krai.svg' },
    { name: 'Permskiy kray', uuid: '9d563979-3915-4716-9027-0d8e12983039', code: 'RU-PER', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Perm_Krai.svg' },
    { name: 'Primorskiy kray', uuid: 'd73a1012-5ca0-443b-bc77-9fac9010b4eb', code: 'RU-PRI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Primorsky_Krai.svg' },
    { name: 'Stavropol\'skiy kray', uuid: 'eae1f983-f8dd-4e81-9b1f-9af8b48fc51c', code: 'RU-STA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Stavropol_Krai.svg' },
    { name: 'Zabaykal\'skiy kray', uuid: 'c4b1c8e8-1876-47ce-a2a0-5c34db33568f', code: 'RU-ZAB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Zabaykalsky_Krai.svg' },
    // --- Russia (Federal Cities) ---
    { name: 'Moscow', uuid: 'f310740c-ad62-48c0-839b-e86581b9f464', code: 'RU-MOW', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Moscow.svg' },
    { name: 'Sankt-Peterburg', uuid: '808e1ef8-5390-4300-a615-c4df977cc349', code: 'RU-SPE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Saint_Petersburg.svg' },

    // --- San Marino (Municipalities) ---
    { name: 'Acquaviva', uuid: '18c7aa3f-c12b-4ce5-8d54-ffdc6afdb1d9', code: 'SM-01', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Acquaviva_%28RSM%29-Bandiera.svg' },
    { name: 'Borgo Maggiore', uuid: '7af32581-31d1-4d9b-9f26-2051724e7d98', code: 'SM-06', url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Borgo_Maggiore_%28RSM%29-Bandiera.svg' },
    { name: 'Chiesanuova', uuid: 'e42fee3e-df7d-4569-931f-899a561d306a', code: 'SM-02', url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chiesanuova_%28RSM%29-Bandiera.svg' },
    { name: 'Domagnano', uuid: 'c583ca2a-0442-4780-a6f4-7999c6512104', code: 'SM-03', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Domagnano_%28RSM%29-Bandiera.svg' },
    { name: 'Faetano', uuid: 'f2892bb3-5ea4-4f2f-b7c7-322016b57c48', code: 'SM-04', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Faetano_%28RSM%29-Bandiera.svg' },
    { name: 'Fiorentino', uuid: '5c851007-7803-4943-ad45-a713635fc1ae', code: 'SM-05', url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Fiorentino_%28RSM%29-Bandiera.svg' },
    { name: 'Montegiardino', uuid: 'c71f8a3d-f6e5-4d0a-9b6c-232535878b94', code: 'SM-08', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Montegiardino_%28RSM%29-Bandiera.svg' },
    { name: 'San Marino', uuid: '0c616beb-6288-4906-a137-e3cfc27141de', code: 'SM-07', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/San_Marino_%28RSM%29-Bandiera.svg' },
    { name: 'Serravalle', uuid: '98c13a99-411c-400a-8a57-f70e697add3a', code: 'SM-09', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Serravalle_%28RSM%29-Bandiera.svg' },

    // --- Serbia (Autonomous Province) ---
    { name: 'Vojvodina', uuid: '28c6ba1f-78d5-4769-acb7-111a96029e12', code: 'RS-VO', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Flag_of_Vojvodina.svg' },
    // --- Serbia (City) ---
    { name: 'Beograd', uuid: '0e4c5a2b-b595-494d-8c3e-2968d18b6e1f', code: 'RS-00', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Flag_of_Belgrade%2C_Serbia.svg' },

    // --- Slovakia (Regions) ---
    { name: 'Banskobystrický kraj', uuid: '9fc6ee0c-980a-4c41-9616-55ee8521874d', code: 'SK-BC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Banskobystricky_vlajka.svg' },
    { name: 'Bratislavský kraj', uuid: '7e6e18c7-5ca0-49e6-8755-3fdfb46ba684', code: 'SK-BL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bratislavsky_vlajka.svg' },
    { name: 'Košický kraj', uuid: 'b02d061a-c961-4c3e-8841-3a754c492386', code: 'SK-KI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kosicky_vlajka.svg' },
    { name: 'Nitriansky kraj', uuid: '4c223d65-0cb6-4279-8d0b-c99ec4b4341b', code: 'SK-NI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nitriansky_vlajka.svg' },
    { name: 'Prešovský kraj', uuid: 'bab8b52c-8e47-453f-9e50-df8898aa97aa', code: 'SK-PV', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Presovsky_vlajka.svg' },
    { name: 'Trenčiansky kraj', uuid: '08affe0c-f350-4567-866b-75b1cd352219', code: 'SK-TC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Trenciansky_vlajka.svg' },
    { name: 'Trnavský kraj', uuid: 'af74bfa5-35cc-451b-8e94-12aa83645647', code: 'SK-TA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Trnavsky_vlajka.svg' },
    { name: 'Žilinský kraj', uuid: 'c21410fe-17d0-43f2-8c53-a44f1c350612', code: 'SK-ZI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Zilinsky_vlajka.svg' },

    // --- Solomon Islands (Provinces) ---
    { name: 'Central', uuid: 'b90ea314-d4a9-4168-bbdc-70d1ee358671', code: 'SB-CE', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_Central_Province_Solomon_Islands.png' },
    { name: 'Choiseul', uuid: '0eb679ad-2238-4268-ab9a-8aef4dd75a74', code: 'SB-CH', url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Flag_of_Choiseul.png' },
    { name: 'Guadalcanal', uuid: '089c65f8-8dcf-4a74-84e2-67b2858397da', code: 'SB-GU', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Flag_of_Guadalcanal.png' },
    { name: 'Isabel', uuid: '5b666e1a-c054-42a3-aca1-0098e007608d', code: 'SB-IS', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Flag_of_Isabel_Province_Solomon_Islands.png' },
    { name: 'Makira', uuid: '74abcf4b-ff5b-40b6-a22c-40d09112173d', code: 'SB-MK', url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Flag_Makira_and_Ulawa.png' },
    { name: 'Malaita', uuid: '3017c595-39ee-4b9f-9d45-740a29cdc93c', code: 'SB-ML', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Malaita.svg' },
    { name: 'Rennell and Bellona', uuid: '48b70366-9af9-4f25-94d1-ebeb8ba5a556', code: 'SB-RB', url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Rennell_and_Bellona_Province.svg' },
    { name: 'Temotu', uuid: '22522afa-b0f2-45ea-828b-5ac3a81b189f', code: 'SB-TE', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Temotu_province_flag.svg' },
    { name: 'Western', uuid: '11d2aa2f-e4cd-4c43-a84a-b728bca1ae82', code: 'SB-WE', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Western_Province_Solomon_Islands.png' },
    // --- Solomon Islands (Capital Territory) ---
    { name: 'Capital Territory (Honiara)', uuid: '75d2d55d-e6d6-41c8-9c45-02e69500a17b', code: 'SB-CT', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Honiara.svg' },

    // --- South Africa (Provinces) ---
    { name: 'Eastern Cape', uuid: 'b0f5a1fc-2f41-4c64-9383-19074799469c', code: 'ZA-EC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Eastern_Cape_Province.png' },
    { name: 'Free State', uuid: '5376b015-48e6-4be8-9827-1f246c43868e', code: 'ZA-FS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Free_State_Province.png' },
    { name: 'Gauteng', uuid: '9c8c3e3a-6d06-4b89-ac76-96aff8687b45', code: 'ZA-GP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Gauteng_Province.png' },
    { name: 'KwaZulu-Natal', uuid: '5821559c-41a7-433d-b6af-3c96c8ed4a7a', code: 'ZA-NL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_KwaZulu-Natal_Province.png' },
    { name: 'Limpopo', uuid: '222d0da4-b670-4ba7-a094-0dbdee63b1e2', code: 'ZA-LP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Limpopo_Province.png' },
    { name: 'Mpumalanga', uuid: 'fb281ae7-3796-4b5f-9e4d-af96a93c4141', code: 'ZA-MP', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Mpumalanga_Province.svg' },
    { name: 'North West', uuid: '8fba923b-d811-419e-be64-6ab34d5f0ef6', code: 'ZA-NW', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_North_West_Province.png' },
    { name: 'Northern Cape', uuid: '84c2ac7d-79eb-4f8f-8777-09b984f2dd85', code: 'ZA-NC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Northern_Cape_Province.png' },
    { name: 'Western Cape', uuid: '2c2a555d-7e53-4dd2-aa2b-eddc9376c9bf', code: 'ZA-WC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Western_Cape_Province.png' },

    // --- South Korea (Cities) ---
    { name: 'Busan', uuid: 'c8a88ba5-5d4e-4cbf-b8ab-dd0e6d99a940', code: 'KR-26', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Busan.svg' },
    { name: 'Daegu', uuid: 'a2fe541f-e702-459e-b6b9-b119101265fb', code: 'KR-27', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Daegu.svg' },
    { name: 'Daejeon', uuid: 'afc6d9f8-2785-454b-89a4-837bb5d89ca1', code: 'KR-30', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Daejeon.svg' },
    { name: 'Incheon', uuid: '805deaa9-f30c-4856-baa4-19f206df64ce', code: 'KR-28', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Incheon.svg' },
    { name: 'Sejong', uuid: '6a1dccb5-0a56-4be0-97ad-fad586fff64f', code: 'KR-50', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sejong_City.svg' },
    { name: 'Seoul', uuid: 'aa03e165-4c73-4959-91c0-a99f9fa8ecab', code: 'KR-11', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Seoul.svg' },
    { name: 'Ulsan', uuid: '91054c41-1932-4d4e-9c74-f3089cf57227', code: 'KR-31', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ulsan.svg' },
    // --- South Korea (Provinces) ---
    { name: 'Chungcheongbuk-do', uuid: 'b14480fa-ca13-45ef-be7d-c5d306bec497', code: 'KR-43', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_North_Chungcheong_Province.svg' },
    { name: 'Chungcheongnam-do', uuid: '087176dc-cd18-4522-a01a-7affd9ea8a00', code: 'KR-44', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Chungcheong_Province.svg' },
    { name: 'Gangwon-do', uuid: 'a2c306bc-84d2-477b-916a-69b736a03ede', code: 'KR-42', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Gangwon_State.svg' },
    { name: 'Gyeonggi-do', uuid: 'da7988eb-7408-4856-9dd5-33bd62a2385b', code: 'KR-41', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Gyeonggi_Province.svg' },
    { name: 'Gyeongsangbuk-do', uuid: 'ecf7f3bf-ba48-4027-81ae-a7f4d75181eb', code: 'KR-47', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_North_Gyeongsang_Province.svg' },
    { name: 'Gyeongsangnam-do', uuid: 'f9926c51-726a-4298-8a10-20855d802971', code: 'KR-48', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Gyeongsang_Province.svg' },
    { name: 'Jeju-do', uuid: 'f1da4002-2f29-4d12-b771-d251d8f079c2', code: 'KR-49', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Jeju_Province.svg' },
    { name: 'Jeollabuk-do', uuid: 'fee9c74b-b87c-47ac-96ae-b46717ab36fa', code: 'KR-45', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Jeonbuk_State,_South_Korea.svg' },
    // --- South Korea (Former City) ---
    { name: 'Gwangju', uuid: '8bf652ee-a640-4d61-98b3-b37303c2213e', code: 'KR-29', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Gwangju.svg' },
    // --- South Korea (Former Provinces) ---
    { name: 'Jeollanam-do', uuid: '787ea952-67d0-4674-933e-d9174c803b7b', code: 'KR-46', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Jeolla_Province.svg' },

    // --- Spain (Autonomous Communities) ---
    { name: 'Andalucía', uuid: '2b67f2d6-b7ff-4b51-952c-9c4943cd637e', code: 'ES-AN', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Bandera_de_Andalucia.svg' },
    { name: 'Aragón', uuid: '27bb034f-d022-4ecb-b8e4-12ed48f3286c', code: 'ES-AR', url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Flag_of_Aragon.svg' },
    { name: 'Asturias', uuid: '08b11c30-becb-4f53-8f0f-b645d66eedf8', code: 'ES-AS', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_Asturias.svg' },
    { name: 'Canarias', uuid: '45fab208-f543-4826-82ca-fdf2046030f5', code: 'ES-CN', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Flag_of_the_Canary_Islands.svg' },
    { name: 'Cantabria', uuid: '79dc3764-fb03-40a9-8e82-9770eca4d530', code: 'ES-CB', url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Flag_of_Cantabria.svg' },
    { name: 'Castilla y León', uuid: '0611ced6-4fdf-4b28-ab9f-a57ae7be99e2', code: 'ES-CL', url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Flag_of_Castile_and_Le%C3%B3n.svg' },
    { name: 'Castilla-La Mancha', uuid: '7d8cfbd4-dd6f-48bd-a836-79f7016904db', code: 'ES-CM', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Bandera_Castilla-La_Mancha.svg' },
    { name: 'Catalunya', uuid: '92e2d2d3-63b0-4b5a-adca-0e31c367eca2', code: 'ES-CT', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Catalonia.svg' },
    { name: 'Comunidad de Madrid', uuid: '94ac34d2-aa01-49d9-b697-bbf738544bd4', code: 'ES-MD', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_the_Community_of_Madrid.svg' },
    { name: 'Comunidad Valenciana', uuid: '7514d443-6f68-4d09-ab6b-30f92798bb4a', code: 'ES-VC', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Flag_of_the_Valencian_Community_%282x3%29.svg' },
    { name: 'Extremadura', uuid: '891be787-4080-429a-abe3-bd81206986a6', code: 'ES-EX', url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Flag_of_Extremadura%2C_Spain_%28with_coat_of_arms%29.svg' },
    { name: 'Galicia', uuid: '6ed50e09-b358-4d86-9c08-baf2f6956194', code: 'ES-GA', url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Flag_of_Galicia.svg' },
    { name: 'Illes Balears', uuid: 'cef2ba5e-d5e0-4576-a737-f16988288965', code: 'ES-IB', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Flag_of_the_Balearic_Islands.svg' },
    { name: 'La Rioja', uuid: 'b52a9695-fbe0-4369-ae68-6a5e86c180e7', code: 'ES-RI', url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Flag_of_La_Rioja_%28with_coat_of_arms%29.svg' },
    { name: 'Murcia', uuid: '41aee40d-adec-4fe4-a038-e7817fe2f060', code: 'ES-MC', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_Region_of_Murcia.svg' },
    { name: 'Navarra', uuid: '839b2a08-0405-4630-9d92-b29291361985', code: 'ES-NA', url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Bandera_de_Navarra.svg' },
    { name: 'País Vasco', uuid: 'fc0eae1b-654c-476a-bcbf-c79d4d136f2c', code: 'ES-PV', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Flag_of_the_Basque_Country.svg' },
    // --- Spain (Autonomous Cities) ---
    { name: 'Ceuta', uuid: '381524a3-718f-4a22-837e-e3bc698a45ef', code: 'ES-CE', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Ceuta.svg' },
    { name: 'Melilla', uuid: '74bd349c-179d-444b-b816-ec5cdfe789c7', code: 'ES-ML', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Melilla.svg' },

    // --- Sri Lanka (Provinces) ---
    { name: 'Basnāhira paḷāta', uuid: '14ea4825-659e-4448-940f-1c74dd04714b', code: 'LK-1', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Western_Province_Flag_%28SRI_LANKA%29.png' },
    { name: 'Dakuṇu paḷāta', uuid: '1ce53d91-b1a4-4153-a5be-23dad38a0ace', code: 'LK-3', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_the_Southern_Province_%28Sri_Lanka%29.PNG' },
    { name: 'Madhyama paḷāta', uuid: '4785ca7d-8d17-4537-99e0-083147ef754f', code: 'LK-2', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Central_Province.png' },
    { name: 'Næ̆gĕnahira paḷāta', uuid: 'f98bc970-5108-476a-85f5-8546f494551e', code: 'LK-5', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Eastern_Province_Flag_%28SRI_LANKA%29.png' },
    { name: 'Sabaragamuva paḷāta', uuid: '9d5019b9-b8d9-4aed-94c0-5e5229d47958', code: 'LK-9', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_the_Sabaragamuwa_Province_%28Sri_Lanka%29.PNG' },
    { name: 'Uturu paḷāta', uuid: 'bb03f113-27b7-406f-8fb5-49a268f16895', code: 'LK-4', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Flag_of_the_Northern_Province.svg' },
    { name: 'Uturumæ̆da paḷāta', uuid: '6eaabf52-7451-4611-a83f-4d4512ee910e', code: 'LK-7', url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Flag_of_the_North_Central_Province_Sri_Lanka.png' },
    { name: 'Ūva paḷāta', uuid: 'babbb38b-ca9a-4233-ad6a-0c2819ef50e2', code: 'LK-8', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Flag_of_the_Uva_Province_%28Sri_Lanka%29.svg' },
    { name: 'Vayamba paḷāta', uuid: '8dfab964-e56c-4fb8-8218-2fd3b7bb2994', code: 'LK-6', url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Flag_of_the_North_Western_Province_%28Sri_Lanka%29.svg' },

    // --- Sweden (Counties) ---
    { name: 'Blekinge', uuid: 'b8955c64-bd6a-4b6f-ba1c-3a105f9dc85d', code: 'SE-K', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Blekinge_län_vapenflagga.svg' },
    { name: 'Dalarna', uuid: '98b7c74f-3697-4dd1-afd3-5176503e623b', code: 'SE-W', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Dalarnas_län_vapenflagga.svg' },
    { name: 'Gotland', uuid: '403b7b3d-c2ee-49d9-928b-527db11a85a2', code: 'SE-I', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Gotlands_län_vapenflagga.svg' },
    { name: 'Halland', uuid: '7f13ff1e-e767-4496-96d5-c202bbd21515', code: 'SE-N', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Hallands_län_vapenflagga.svg' },
    { name: 'Jämtland', uuid: '240a698a-2692-4839-b2bc-fa86471c80f6', code: 'SE-Z', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Jämtlands_län_vapenflagga.svg' },
    { name: 'Jönköping', uuid: '3ee07a57-23a2-4d10-965b-61a406bd8dc8', code: 'SE-F', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_J%C3%B6nk%C3%B6ping.svg' },
    { name: 'Kalmar', uuid: '482d904f-c3fe-479c-b2fd-5fdbf4913dcc', code: 'SE-H', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kalmar.svg' },
    { name: 'Kronoberg', uuid: 'cd3d395f-4f67-4a44-b372-8260410d4188', code: 'SE-G', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Kronobergs_län_vapenflagga.svg' },
    { name: 'Norrbotten', uuid: '658bcddb-dbca-4c84-8187-2f93b2897480', code: 'SE-BD', url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Norrbottens_län_vapenflagga.svg' },
    { name: 'Örebro', uuid: 'ddc4d4ae-f8e3-4c05-be3f-9c44df994c18', code: 'SE-T', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Örebro_län_vapenflagga.svg' },
    { name: 'Östergötland', uuid: '2901bc80-a47e-41bf-95aa-e5667ba1f1b8', code: 'SE-E', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Östergötlands_län_vapenflagga.svg' },
    { name: 'Skåne', uuid: 'e50f0900-cd64-4181-b14e-0b4515aee76a', code: 'SE-M', url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Vapenflagga_för_Skåne_län.svg' },
    { name: 'Södermanland', uuid: '3966ab58-2862-48ff-8b60-efaf0e852058', code: 'SE-D', url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Södermanlands_län_vapenflagga.svg' },
    { name: 'Stockholms län', uuid: '63ee9426-d32f-4593-a262-6401bc85c6ba', code: 'SE-AB', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Stockholms_län_vapenflagga.svg' },
    { name: 'Uppsala', uuid: '8402526a-eb34-4429-9227-7794cbc59c37', code: 'SE-C', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Uppsala_län_vapenflagga.svg' },
    { name: 'Värmland', uuid: 'aeba3a03-a5fe-4feb-baa9-6e88efdcc091', code: 'SE-S', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Värmlands_län_vapenflagga.svg' },
    { name: 'Västerbotten', uuid: 'c71ade00-7d50-4de8-9c72-cb275d6491a2', code: 'SE-AC', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Västerbottens_län_vapenflagga.svg' },
    { name: 'Västernorrland', uuid: 'a36d4526-1936-4b6e-9e48-a1c86d29fa00', code: 'SE-Y', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Västernorrlands_län_vapenflagga.svg' },
    { name: 'Västmanland', uuid: 'ee7d9558-9540-4f8e-9749-4841f7c7a954', code: 'SE-U', url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Västmanlands_län_vapenflagga.svg' },
    { name: 'Västra Götaland', uuid: '9d5d954d-5d88-42e3-8a55-f5b6a76a2f02', code: 'SE-O', url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Västra_Götalands_län_vapenflagga.svg' },

    // --- Switzerland (Cantons) ---
    { name: 'Aargau', uuid: 'a615e69f-02b7-4a46-9d1a-9a7d7523a493', code: 'CH-AG', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Aargau.svg' },
    { name: 'Appenzell Ausserrhoden', uuid: 'd29290f8-f150-4716-ba10-ef71f82a976a', code: 'CH-AR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Appenzell_Ausserrhoden.svg' },
    { name: 'Appenzell Innerrhoden', uuid: 'daec0765-b38e-4e74-acfc-6753ad6b7ae0', code: 'CH-AI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Appenzell_Innerrhoden.svg' },
    { name: 'Basel-Landschaft', uuid: 'be24a782-f13d-45a3-b141-87c765b15a3a', code: 'CH-BL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Basel-Landschaft.svg' },
    { name: 'Basel-Stadt', uuid: 'd2e39224-187c-4346-b7c4-5d20ac1e11ac', code: 'CH-BS', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Flag_of_Canton_of_Basel.svg' },
    { name: 'Bern', uuid: 'df44433e-f5a3-4b06-9518-fb6841c72819', code: 'CH-BE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Bern.svg' },
    { name: 'Fribourg', uuid: 'b8da69a2-e38c-4873-b0d7-a727c27d5824', code: 'CH-FR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Fribourg.svg' },
    { name: 'Genève', uuid: '46c8ae38-5d1f-4bca-a78b-0189fde74bba', code: 'CH-GE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Geneva.svg' },
    { name: 'Glarus', uuid: 'f55f9d22-e955-4cc4-aa5f-cf92cdf2555e', code: 'CH-GL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Glarus.svg' },
    { name: 'Graubünden', uuid: '360dc1f1-2174-468b-8a49-4c57ce705172', code: 'CH-GR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Graub%C3%BCnden.svg' },
    { name: 'Jura', uuid: '9d813baa-b047-4ca6-b9a0-1645963e679c', code: 'CH-JU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Jura.svg' },
    { name: 'Luzern', uuid: '50a7af21-30e8-4884-b238-6a615728ad23', code: 'CH-LU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Lucerne.svg' },
    { name: 'Neuchâtel', uuid: 'e1183381-0b89-4fd6-adfa-f33f2ece51bd', code: 'CH-NE', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Neuch%C3%A2tel.svg' },
    { name: 'Nidwalden', uuid: '77bd0809-b0f9-4eb1-9041-7d10dcc3990e', code: 'CH-NW', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Nidwalden.svg' },
    { name: 'Obwalden', uuid: '60f0c1c9-13ee-4d6c-96e2-42824e596be1', code: 'CH-OW', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Obwalden.svg' },
    { name: 'Sankt Gallen', uuid: '83811e81-c6de-42a5-8b28-231fbd545cc9', code: 'CH-SG', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Flag_of_Canton_of_Sankt_Gallen.svg' },
    { name: 'Schaffhausen', uuid: '443225e5-8724-4df0-8019-a8409686b0db', code: 'CH-SH', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Schaffhausen.svg' },
    { name: 'Schwyz', uuid: '796fd82b-30f6-4568-822a-d002e1316354', code: 'CH-SZ', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Schwyz.svg' },
    { name: 'Solothurn', uuid: '420454ef-31b7-464a-b812-2b155cbc8ac0', code: 'CH-SO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Solothurn.svg' },
    { name: 'Thurgau', uuid: 'd32929bd-4c78-4afa-8b25-f6a1355f9212', code: 'CH-TG', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Thurgau.svg' },
    { name: 'Ticino', uuid: 'da6c509d-ebd1-4ad0-af18-5474fb6a3c5f', code: 'CH-TI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Ticino.svg' },
    { name: 'Uri', uuid: '92621676-3c24-4f10-bb31-af984de784d2', code: 'CH-UR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Uri.svg' },
    { name: 'Valais', uuid: 'e1384603-3a9e-4427-ac2d-4b8473e8e32c', code: 'CH-VS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Valais.svg' },
    { name: 'Vaud', uuid: '2c333d07-cd97-440c-8c91-8833c921a04a', code: 'CH-VD', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Vaud.svg' },
    { name: 'Zug', uuid: '81c0bef1-9878-48bf-aaa2-e0342f0688cc', code: 'CH-ZG', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Zug.svg' },
    { name: 'Zürich', uuid: '6e9c8367-459e-4271-ac33-7658cdeeb271', code: 'CH-ZH', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canton_of_Z%C3%BCrich.svg' },

    // --- Thailand (Provinces) ---
    { name: 'Amnat Charoen', uuid: '8324277f-7e78-4ebd-99f1-bb183aae9dee', code: 'TH-37', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Flag_of_Amnat_Charoen_province.svg' },
    { name: 'Ang Thong', uuid: '102faab9-acde-44f0-b8fb-70db89613d7c', code: 'TH-15', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Ang_Thong_Province.svg' },
    { name: 'Bueng Kan', uuid: '87972804-ca58-4711-b59a-a4d020cec12a', code: 'TH-38', url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Bueng_Kan_Province.svg' },
    { name: 'Buri Ram', uuid: '65ecbed4-1477-4da7-812d-c27aadd17a62', code: 'TH-31', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/THA28_บุรีรัมย์.png' },
    { name: 'Chachoengsao', uuid: '0f335caa-348c-42ed-8e99-f541a88f3f4b', code: 'TH-24', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Flag_of_Chachoengsao_Province.png' },
    { name: 'Chai Nat', uuid: '37b96bdc-84ad-4e95-8cdd-7fc04ba1a6f1', code: 'TH-18', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Flag_of_Chai_Nat_province.svg' },
    { name: 'Chaiyaphum', uuid: '8a15a245-55f6-4963-b6c7-e963934fa474', code: 'TH-36', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Flag_of_Chaiyaphum_province.svg' },
    { name: 'Chanthaburi', uuid: 'ee80f621-0f7e-4518-a88f-3ca70225d6d7', code: 'TH-22', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Chanthaburi.svg' },
    { name: 'Chiang Mai', uuid: 'f6c8452b-ca64-4d3b-a0ae-1f446a56c43e', code: 'TH-50', url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Chiang_Mai.svg' },
    { name: 'Chiang Rai', uuid: '6c29b501-9526-4584-930a-106a8c884d63', code: 'TH-57', url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Flag_of_Chiang_Rai.svg' },
    { name: 'Chon Buri', uuid: 'bc99c37c-edf0-4f82-868e-25a925c8ac95', code: 'TH-20', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Chonburi_flag.svg' },
    { name: 'Chumphon', uuid: 'fea565a3-84a9-488d-bd10-16a5e8d218cf', code: 'TH-86', url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_Chomphon_Province.svg' },
    { name: 'Kalasin', uuid: '6230bc51-bd7a-4c2b-85fc-61f594b44187', code: 'TH-46', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Kalasin.svg' },
    { name: 'Kamphaeng Phet', uuid: '56810f3e-320d-4580-87c4-9220995959c8', code: 'TH-62', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Flag_of_Kamphaeng_Phet.svg' },
    { name: 'Kanchanaburi', uuid: '87db922c-5c27-49ca-a79a-86b325ffa4da', code: 'TH-71', url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Flag_of_Kanchanaburi_province_%282-1%29.svg' },
    { name: 'Khon Kaen', uuid: 'b00cd800-6d16-4b21-9176-7fe090a80f95', code: 'TH-40', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Flag_of_Khon_Kaen_province.png' },
    { name: 'Krabi', uuid: 'ca8df512-9749-4363-9519-62164ac5bfe6', code: 'TH-81', url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Flag_of_Krabi_%28blue-yellow%29.svg' },
    { name: 'Lampang', uuid: 'a80a8d53-c3f1-4d75-a38e-8935c5a28a88', code: 'TH-52', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Flag_of_Lampang_province.svg' },
    { name: 'Lamphun', uuid: '03a56c8b-5636-4487-887e-0e81584968dc', code: 'TH-51', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Flag_of_Lamphun.svg' },
    { name: 'Loei', uuid: 'c81e2631-785f-4f0b-b996-bbfbeda47ef0', code: 'TH-42', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Flag_of_Loei.svg' },
    { name: 'Lop Buri', uuid: '7ed64b61-c008-498d-8310-c1725fe17af2', code: 'TH-16', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Lopburi_provincial_flag.png' },
    { name: 'Mae Hong Son', uuid: '5481e328-10c1-422b-95e1-a148e4e725f2', code: 'TH-58', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Flag_of_Mae_Hong_Son_Province.svg' },
    { name: 'Maha Sarakham', uuid: '325fc83f-08d7-44ac-b025-fe7844d2d09d', code: 'TH-44', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Maha_Sarakham_Province.svg' },
    { name: 'Mukdahan', uuid: 'ce256065-5e0d-4e22-9a51-56997b8362a3', code: 'TH-49', url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Flag_of_Mokdahan_Province.svg' },
    { name: 'Nakhon Nayok', uuid: '457aecc1-2e13-4adb-a341-2ce0d9885baa', code: 'TH-26', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Nakhon_Nayok.svg' },
    { name: 'Nakhon Pathom', uuid: 'ab13e646-44cb-4b3d-ba40-f41ecd6776f4', code: 'TH-73', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Flag_of_Nakhon_Pathom.svg' },
    { name: 'Nakhon Phanom', uuid: '18235ed8-ae6f-4c7a-80df-d317d573433b', code: 'TH-48', url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Flag_of_Nakhon_Phanom_Province.svg' },
    { name: 'Nakhon Ratchasima', uuid: '5cc74cc0-65ea-41fd-b7f6-5f2632567f0e', code: 'TH-30', url: 'https://www.crwflags.com/fotw/images/t/th-30.gif' },
    { name: 'Nakhon Sawan', uuid: '5b27167c-8272-4207-ba05-5f0e2e46aec1', code: 'TH-60', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_Nakhon_Sawan_province.svg' },
    { name: 'Nakhon Si Thammarat', uuid: 'aa1c3af5-da79-4a3c-aa00-08b6a761eed9', code: 'TH-80', url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Nakhon_Si_Thammarat_Flag.svg' },
    { name: 'Nan', uuid: 'ae73be09-b636-4061-bada-b9c8884d11d5', code: 'TH-55', url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/ธงประจำจังหวัดน่าน.svg' },
    { name: 'Narathiwat', uuid: 'a223af63-403a-4bff-bcfb-46ac1a32b6eb', code: 'TH-96', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Flag_of_Narathiwat.svg' },
    { name: 'Nong Bua Lam Phu', uuid: '0731950f-e6f9-44a1-9671-e6e0aedf6630', code: 'TH-39', url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Flag_of_Nong_Bua_Lamphu_province.svg' },
    { name: 'Nong Khai', uuid: '427d5dde-acce-4e55-9b33-ad3a3aeee463', code: 'TH-43', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Flag_of_Nong_Khai_Province.svg' },
    { name: 'Nonthaburi', uuid: '9719ae32-9b1a-4676-9362-1d8222f7edba', code: 'TH-12', url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/ธงจังหวัดนนทบุรี.svg' },
    { name: 'Pathum Thani', uuid: '5131d1cd-2b74-4433-b862-a5679a84b17b', code: 'TH-13', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Flag_of_Pathum_Thani.svg' },
    { name: 'Pattani', uuid: 'cb4308a3-4c90-4077-a9f8-9069f50f5c06', code: 'TH-94', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Pattani_Province.svg' },
    { name: 'Phangnga', uuid: '6a13b4c0-e40e-4f98-a005-8e766ae2e1fe', code: 'TH-82', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Flag_of_Phang_Nga_province.svg' },
    { name: 'Phatthalung', uuid: '9181d84d-2295-45c7-9a94-19b0ae4c1af7', code: 'TH-93', url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Phatthalung.svg' },
    { name: 'Phayao', uuid: '751d9e7a-99f3-4b48-b25e-ebd69c919478', code: 'TH-56', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Phayao_flag.svg' },
    { name: 'Phetchabun', uuid: '3db17b2a-95a2-42e6-a23e-4de4eb36ecbb', code: 'TH-67', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Phetchabun_province.svg' },
    { name: 'Phetchaburi', uuid: 'ee05585f-fd17-4bb4-909f-ef7b5101c279', code: 'TH-76', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Flag_of_Petchaburi.svg' },
    { name: 'Phichit', uuid: 'a3fc4e08-1a63-4bcb-a82e-9ea64ae49166', code: 'TH-66', url: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_Phichit_Province.svg' },
    { name: 'Phitsanulok', uuid: '7588c4bf-80e0-49a3-827b-f29819b15365', code: 'TH-65', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Phitsanulok_province.png' },
    { name: 'Phra Nakhon Si Ayutthaya', uuid: '3a7d7b61-98d3-47ee-b0f3-6f1596b3d9c1', code: 'TH-14', url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Flag_of_Phra_Nakhon_Si_Ayutthaya_Province.svg' },
    { name: 'Phrae', uuid: 'e0ecdbbf-1158-4735-875f-f2fc14b47bf3', code: 'TH-54', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Phrae_flag.svg' },
    { name: 'Phuket', uuid: '568fc132-aa84-4861-88a1-17455680903a', code: 'TH-83', url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_Phuket.svg' },
    { name: 'Prachin Buri', uuid: 'dd706cff-bdee-4664-a9d5-b3d4dd002d7f', code: 'TH-25', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Flag_of_Prachin_Buri_Province.svg' },
    { name: 'Prachuap Khiri Khan', uuid: '2953bf1b-09e4-4288-a485-0d1b2d4a0b06', code: 'TH-77', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Flag_of_Prachuap_Khiri_Khan.svg' },
    { name: 'Ranong', uuid: '1053712b-37fa-4036-9341-25c57525d8ad', code: 'TH-85', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Provincial_Flag_of_Ranong.svg' },
    { name: 'Ratchaburi', uuid: '3dd15ab1-e81f-49b1-ac22-c8a1f776ab66', code: 'TH-70', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Flag_of_Ratchaburi.svg' },
    { name: 'Rayong', uuid: '3c0ad116-bfa0-4320-9124-a8b889e61d89', code: 'TH-21', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Flag_of_Rayong.svg' },
    { name: 'Roi Et', uuid: '3ec2e28f-131c-4909-bc7e-b3c33fea58ca', code: 'TH-45', url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Roi_Et.svg' },
    { name: 'Sa Kaeo', uuid: '47eb5928-c553-492f-8322-751816d109b7', code: 'TH-27', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Sa_Kaeo.svg' },
    { name: 'Sakon Nakhon', uuid: '665ccd3d-8205-4cef-9b11-09d39374c796', code: 'TH-47', url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_Sakon_Nakhon.svg' },
    { name: 'Samut Prakan', uuid: '49972fe1-44b1-4b87-a5f9-17abe5a6ae7a', code: 'TH-11', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Flag_of_Samut_Prakan_Province.svg' },
    { name: 'Samut Sakhon', uuid: '07c96687-bfe1-40cb-8236-7cf0e88d3b0b', code: 'TH-74', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/ธงจังหวัดสมุทรสาคร.svg' },
    { name: 'Samut Songkhram', uuid: '9b37594d-78ed-4392-b721-8046cf0b84c4', code: 'TH-75', url: 'https://www.crwflags.com/fotw/images/t/th-75.gif' },
    { name: 'Saraburi', uuid: '265c1a01-68f9-4172-94b9-ff72eb5247c3', code: 'TH-19', url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Provincial_Flag_of_Saraburi.svg' },
    { name: 'Satun', uuid: '61d7d7ab-9461-4df0-84be-acd64dcc82b9', code: 'TH-91', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_satun_province.png' },
    { name: 'Si Sa Ket', uuid: 'cb28f75d-c255-4ba5-9b94-0b434e8b9ca0', code: 'TH-33', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Sisaket.svg' },
    { name: 'Sing Buri', uuid: '2d9dcaf7-55eb-4896-883c-527ad1c73c9e', code: 'TH-17', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Sing_Buri.svg' },
    { name: 'Songkhla', uuid: '2748c76a-1e99-4949-b182-abc179cde252', code: 'TH-90', url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Flag_of_Songkhla.svg' },
    { name: 'Sukhothai', uuid: '59e6a51a-ccd6-45c3-9f86-77afb9bf5db2', code: 'TH-64', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Sukhothai_Province.svg' },
    { name: 'Suphan Buri', uuid: '55bc23eb-490d-4cfd-8c15-ab0359506fed', code: 'TH-72', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/67สุพรรณบุรี.jpg' },
    { name: 'Surat Thani', uuid: 'ac729f8a-e8a1-4059-87da-26854a95ff35', code: 'TH-84', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Flag_of_Suratthani_Province.svg' },
    { name: 'Surin', uuid: 'b22266d4-77f1-40a8-b33d-e492f3b6775b', code: 'TH-32', url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Flag_of_Surin_province.svg' },
    { name: 'Tak', uuid: '9e54bee6-b56e-466c-a0af-e421d8cbba35', code: 'TH-63', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Flag_of_Tak_province.svg' },
    { name: 'Trang', uuid: '117d2a71-4dca-40bc-ae06-76d14af73760', code: 'TH-92', url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Flag_of_Trang.svg' },
    { name: 'Trat', uuid: 'd61aa132-ffd1-419f-8ffd-5eb0abe61cb6', code: 'TH-23', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Flag_of_Trat_Province.svg' },
    { name: 'Ubon Ratchathani', uuid: 'badde3f2-2398-4091-8c0f-817fe6e7a563', code: 'TH-34', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Ubon_Ratchathani_Province.svg' },
    { name: 'Udon Thani', uuid: '989080f9-32bb-4a07-8399-06776441426f', code: 'TH-41', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Flag_of_UdonThani_province.svg' },
    { name: 'Uthai Thani', uuid: 'c5d5cfb8-09af-4aec-829e-3eb296a4a9fc', code: 'TH-61', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Flag_of_Uthai_Thani.svg' },
    { name: 'Uttaradit', uuid: '10cc895e-3170-47fc-be40-b4975b201b43', code: 'TH-53', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Uttaradit.svg' },
    { name: 'Yala', uuid: 'ad3cd6e2-2795-44dd-b116-d9b998e69401', code: 'TH-95', url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Flag_of_Yala_province.svg' },
    { name: 'Yasothon', uuid: 'c26a7814-df23-4cf6-bb99-5304927ff747', code: 'TH-35', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Yasothon_province.svg' },
    // --- Thailand (Metropolitan Administration) ---
    { name: 'Bangkok', uuid: '768367d2-ac8c-4daf-ba70-94710ad4870a', code: 'TH-10', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Flag_of_Bangkok.svg' },
    // --- Thailand (Special Administrative City) ---
    { name: 'Pattaya', uuid: 'cf8b8f84-d150-45ad-9d7d-a1d52f92475b', code: 'TH-S', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Pattaya_City_Flag.webp' },

    // --- Ukraine (Oblasts) ---
    { name: 'Cherkas\'ka Oblast\'', uuid: '0877fc7c-eaed-4de5-9a03-0a9f977a4e94', code: 'UA-71', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Cherkasy_Oblast.svg' },
    { name: 'Chernihivs\'ka Oblast\'', uuid: 'a9c9e71e-43f6-4aad-a470-de3f3aec6d40', code: 'UA-74', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Chernihiv_Oblast.svg' },
    { name: 'Chernivets\'ka Oblast\'', uuid: 'f491f92e-e657-43ed-8eb2-5bee763d0ccc', code: 'UA-77', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Chernivtsi_Oblast.svg' },
    { name: 'Dnipropetrovs\'ka Oblast\'', uuid: '3884a385-0bbe-47f9-bd21-f4eb05c535bb', code: 'UA-12', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Dnipropetrovsk_Oblast.svg' },
    { name: 'Donets\'ka Oblast\'', uuid: 'd18f98af-57f4-43af-a12a-a860e0545fe5', code: 'UA-14', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Donetsk_Oblast.svg' },
    { name: 'Ivano-Frankivs\'ka Oblast\'', uuid: '33635a21-84fb-484b-91cd-adc875a17b3c', code: 'UA-26', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ivano-Frankivsk_Oblast.svg' },
    { name: 'Kharkivs\'ka Oblast\'', uuid: 'd4568475-5a6a-43e9-ab49-4bdbe2b746ce', code: 'UA-63', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kharkiv_Oblast.svg' },
    { name: 'Khersons\'ka Oblast\'', uuid: '8cc59f2d-dd08-47f1-bf36-418f6c65a947', code: 'UA-65', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kherson_Oblast.svg' },
    { name: 'Khmel\'nyts\'ka Oblast\'', uuid: '8725b70a-745a-4a38-a004-ecbbb8c08bbc', code: 'UA-68', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Khmelnytskyi_Oblast.svg' },
    { name: 'Kirovohrads\'ka Oblast\'', uuid: '3bef8750-f0fe-42b4-82f0-562a4875c246', code: 'UA-35', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kirovohrad_Oblast.svg' },
    { name: 'Kyïvs\'ka Oblast\'', uuid: '783981f6-86e6-437e-849a-b95bb9039336', code: 'UA-32', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Kyiv_Oblast.svg' },
    { name: 'L\'vivs\'ka Oblast\'', uuid: '997a775f-fd0d-4371-884a-6260d4df1cfa', code: 'UA-46', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Lviv_Oblast.svg' },
    { name: 'Luhans\'ka Oblast\'', uuid: '3890e088-4cdc-4d03-ae73-4fefb0076b15', code: 'UA-09', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Luhansk_Oblast.svg' },
    { name: 'Mykolaïvs\'ka Oblast\'', uuid: '3001cf25-4df2-4ffe-891c-87639d5e9c03', code: 'UA-48', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Mykolaiv_Oblast.svg' },
    { name: 'Odes\'ka Oblast\'', uuid: '2982896a-1d3d-4e10-87f0-e69ed42ff485', code: 'UA-51', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Odesa_Oblast.svg' },
    { name: 'Poltavs\'ka Oblast\'', uuid: '9aa0186f-7e1c-4162-b100-03083f844700', code: 'UA-53', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Poltava_Oblast.svg' },
    { name: 'Rivnens\'ka Oblast\'', uuid: '4588b235-1002-4075-9dcd-604ba603d3d0', code: 'UA-56', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Rivne_Oblast.svg' },
    { name: 'Sums\'ka Oblast\'', uuid: 'eada54dc-7dcc-439b-84b8-7ffe02516ac4', code: 'UA-59', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sumy_Oblast.svg' },
    { name: 'Ternopil\'s\'ka Oblast\'', uuid: 'b875a439-cc00-4b72-bba9-511f873dec9f', code: 'UA-61', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ternopil_Oblast.svg' },
    { name: 'Vinnyts\'ka Oblast\'', uuid: 'c8125356-b93a-46f4-8b77-4bf4ff6b6f04', code: 'UA-05', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Vinnytsia_Oblast.svg' },
    { name: 'Volyns\'ka Oblast\'', uuid: '31039258-dc1d-496d-8339-f7036ea52baa', code: 'UA-07', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Volyn_Oblast.svg' },
    { name: 'Zakarpats\'ka Oblast\'', uuid: '56960785-0d23-4654-bfa3-da6db8fedc37', code: 'UA-21', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Zakarpattia_Oblast.svg' },
    { name: 'Zaporiz\'ka Oblast\'', uuid: '1e114e21-1cf2-4730-8d29-b1a64b920e11', code: 'UA-23', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Zaporizhzhia_Oblast.svg' },
    { name: 'Zhytomyrs\'ka Oblast\'', uuid: '716ce7fe-313c-485e-a219-4e87287612c6', code: 'UA-18', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Zhytomyr_Oblast.svg' },
    // --- Ukraine (Cities) ---
    { name: 'Kyïv', uuid: '51c526a4-ed34-4eaf-94cf-0b96cd019d47', code: 'UA-30', url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Kyiv_Kurovskyi.svg' },
    { name: 'Sevastopol\'', uuid: '9c50516f-5315-4fba-a279-c09511dd6d5a', code: 'UA-40', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Sevastopol.svg' },
    // --- Ukraine (Autonomous Republic) ---
    { name: 'Avtonomna Respublika Krym', uuid: '3cc9dfbe-e4b6-4e49-8bbc-3cb16932086a', code: 'UA-43', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Crimea.svg' },

    // --- United Arab Emirates (Emirates) ---
    { name: '\'Ajmān', uuid: '5f00e0c3-5817-4378-a64d-028571f5d4e4', code: 'AE-AJ', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Flag_of_Ajman.svg' },
    { name: 'Abū Z̧aby [Abu Dhabi]', uuid: 'd73e3cd8-011a-49b6-8bcb-6707ff051d4a', code: 'AE-AZ', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag_of_Abu_Dhabi.svg' },
    { name: 'Al Fujayrah', uuid: '1f99dbe0-05aa-42bc-bab0-f67ac4820c99', code: 'AE-FU', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg' },
    { name: 'Ash Shāriqah [Sharjah]', uuid: 'c5cc4615-765a-410b-82e9-c24d64b917e8', code: 'AE-SH', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Flag_of_Sharjah_and_Ras_Al_Khaimah.svg' },
    { name: 'Dubayy [Dubai]', uuid: 'a8b39e69-e41f-4b8d-8b6e-8ca24884027a', code: 'AE-DU', url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Flag_of_Dubai.svg' },
    { name: 'Ra’s al Khaymah', uuid: 'f5b609cb-e0f7-40af-9a1e-89f8c4e122d8', code: 'AE-RK', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Flag_of_Sharjah_and_Ras_Al_Khaimah.svg' },
    { name: 'Umm al Qaywayn', uuid: '84024802-0143-495d-a460-f76527c23464', code: 'AE-UQ', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_Umm_al-Qaiwain.svg' },

    // --- United Kingdom (Countries) ---
    { name: 'England', uuid: '9d5dd675-3cf4-4296-9e39-67865ebee758', code: 'GB-ENG', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_England.svg' },
    { name: 'Scotland', uuid: '6fa1c7da-6689-4cec-85f9-680f853e8a08', code: 'GB-SCT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Scotland.svg' },
    { name: 'Wales', uuid: '8297708c-5743-47d6-a5ac-f40a41c49ad9', code: 'GB-WLS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Wales.svg' },
    // --- United Kingdom (Crown Dependencies) ---
    { name: 'Alderney', uuid: '10c1cfab-7caf-4f46-b666-188237608b40', code: 'GB-ALD', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Alderney.svg' },
    { name: 'Sark', uuid: '24d14d4f-4fb6-4838-8ffb-470a4e8cc281', code: 'GB-SAR', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Flag_of_Sark_%28bordered%29.svg' },
    // --- United Kingdom (Overseas Territories) ---
    { name: 'Ascension', uuid: '17e091a9-f91d-494f-bd63-3ec6f0c38d73', code: 'SH-AC', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Ascension_Island.svg' },
    { name: 'Saint Helena', uuid: '8a2a7450-8ab1-485f-b63d-f849f2966c0b', code: 'SH-HL', url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_Saint_Helena.svg' },
    { name: 'Tristan da Cunha', uuid: 'd19ab530-a1d4-4c89-ba92-d89ed771fcac', code: 'SH-TA', url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Tristan_da_Cunha.svg' },
    // --- United Kingdom (Region) ---
    { name: 'West Midlands', uuid: '07607044-8140-47ba-bb24-7129babe586b', code: 'GB-WEMI', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_the_West_Midlands_County.svg' },
    // --- United Kingdom (Counties) ---
    { name: 'Cambridgeshire', uuid: 'a7206e39-259e-4d27-8c6c-7c29c3926385', code: 'GB-CAM', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Cambridgeshire_Flag.svg' },
    { name: 'Cumbria', uuid: '8923be10-140a-4efc-bc9a-112ae16512ed', code: 'GB-CMA', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Community_flag_of_Cumbria.svg' },
    { name: 'Derbyshire', uuid: '55dd286a-f047-423b-9062-37408f148633', code: 'GB-DBY', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Derbyshire_flag.svg' },
    { name: 'Devon', uuid: '2021b983-80b8-4f6b-a2a9-7d33c23e15b6', code: 'GB-DEV', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Flag_of_Devon.svg' },
    { name: 'Dorset', uuid: '2d71b77c-cec0-47dd-9516-fd01db91ca13', code: 'GB-DOR', url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Flag_of_Dorset.svg' },
    { name: 'Essex', uuid: 'c58e25fa-9d99-4ff3-b4b8-a7e7b2cf452c', code: 'GB-ESS', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Flag_of_Essex.svg' },
    { name: 'Gloucestershire', uuid: 'da806ae8-ff93-4988-93ee-4bee3c5a56bf', code: 'GB-GLS', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Severn_Cross.svg' },
    { name: 'Hampshire', uuid: 'e12f6f8d-b5e9-4b15-ab88-4298e3e1a1b3', code: 'GB-HAM', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/County_Flag_of_Hampshire.svg' },
    { name: 'Hertfordshire', uuid: '9a5d387b-26b2-4bea-a9c9-f2844148a4aa', code: 'GB-HRT', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/County_Flag_of_Hertfordshire.svg' },
    { name: 'Kent', uuid: '24404231-7564-4b11-9168-95dd148049a7', code: 'GB-KEN', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/FlagOfKent.svg' },
    { name: 'Lancashire', uuid: '5c6f4550-e4ae-4570-99c9-dc133582d1aa', code: 'GB-LAN', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Lancashire_County_Flag.svg' },
    { name: 'Leicestershire', uuid: '939f6e4f-0d8b-4c94-af04-b7f683da8968', code: 'GB-LEC', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Leicestershire.svg' },
    { name: 'Lincolnshire', uuid: '1bede359-1a1e-40d3-a03e-28d928182caf', code: 'GB-LIN', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Lincolnshire_flag.svg' },
    { name: 'Norfolk', uuid: '1f73fbd2-48ee-4951-b750-47c6c92ba7ae', code: 'GB-NFK', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Flag_of_Norfolk.svg' },
    { name: 'North Yorkshire', uuid: 'a584d799-9025-4c7c-a72a-cf214ff16563', code: 'GB-NYK', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_North_Riding_of_Yorkshire.svg' },
    { name: 'Nottinghamshire', uuid: '5ee7ea17-1e59-453f-b410-a1412893f5f2', code: 'GB-NTT', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/County_Flag_of_Nottinghamshire.svg' },
    { name: 'Oxfordshire', uuid: '44e5e20e-8fbc-4b07-b3f2-22f2199186fd', code: 'GB-OXF', url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Flag_of_Oxfordshire.svg' },
    { name: 'Somerset', uuid: 'aff4808a-7e67-49ab-8d51-af0864c824e0', code: 'GB-SOM', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Somerset_Flag.svg' },
    { name: 'Staffordshire', uuid: '84cc125d-5c91-4ec3-ad7c-31751359bb51', code: 'GB-STS', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Staffordshire_Flag.svg' },
    { name: 'Suffolk', uuid: '6e2d2d30-dbc9-4d27-99f7-df571dbd0646', code: 'GB-SFK', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/County_Flag_of_Suffolk.svg' },
    { name: 'Surrey', uuid: 'fe92d6d6-4f35-4a0e-a48a-b802ae9cdaf4', code: 'GB-SRY', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_the_County_of_Surrey.svg' },
    { name: 'Warwickshire', uuid: 'bbfed5f7-9a49-40f0-a787-9ce951e3097d', code: 'GB-WAR', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Warwickshire.svg' },
    { name: 'West Sussex', uuid: 'a7251dbd-388c-4fdf-a294-1bcde106ddf7', code: 'GB-WSX', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Flag_of_West_Sussex.svg' },
    { name: 'Worcestershire', uuid: '2fb56867-9b52-4fd3-a562-6d7d13441d60', code: 'GB-WOR', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Worcestershire_flag.svg' },
    // --- United Kingdom (Unitary Authorities) ---
    { name: 'Bournemouth', uuid: 'ca133b15-39a3-449a-95d8-9008c437da7d', code: 'GB-BCP', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Bournemouth_town_flag.svg' },
    { name: 'Cardiff', uuid: 'f0b226db-8e22-40e6-9a53-d839cfec6228', code: 'GB-CRF', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Flag_of_Cardiff.svg' },
    { name: 'Ceredigion', uuid: 'c80e1519-df6f-4d12-9859-fdd1b1ad695f', code: 'GB-CGN', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Ceredigion.svg' },
    { name: 'Cornwall', uuid: '03d7eb23-c924-4e46-af72-a45f6ee04c8b', code: 'GB-CON', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Saint_Piran%27s_Flag.svg' },
    { name: 'East Riding of Yorkshire', uuid: 'fce537c2-afa0-4bd5-b29b-2b75929f13f6', code: 'GB-ERY', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_North_Riding_of_Yorkshire.svg' },
    { name: 'Gwynedd', uuid: '33a9cc60-fc72-4397-bd95-a94777d9e939', code: 'GB-GWN', url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Gwynedd_%283-2%29.svg' },
    { name: 'Isle of Anglesey', uuid: '74b3db14-539d-488d-8e66-1f5c8036e2ff', code: 'GB-AGY', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Anglesey.svg' },
    { name: 'Isle of Wight', uuid: '428c7efb-6480-483b-97e3-786d3f0c1954', code: 'GB-IOW', url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Flag_of_the_Isle_of_Wight.svg' },
    { name: 'Isles of Scilly', uuid: 'de98091e-bca6-45ff-8bed-c3302c5b0b28', code: 'GB-IOS', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Baner_ynysek_Syllan.svg' },
    { name: 'Kingston upon Hull', uuid: 'aab5b67e-3b98-44a5-8336-1c3d326d9082', code: 'GB-KHL', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Flag_of_Kingston-upon-Hull.png' },
    { name: 'Leicester', uuid: '806b9b3b-5daf-4eaa-807d-7a2a29cde0da', code: 'GB-LCE', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Flag_of_the_City_of_Leicester.png' },
    { name: 'Luton', uuid: 'fce4afff-8d49-4f1f-977a-10edbe839331', code: 'GB-LUT', url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Flag_of_Luton.png' },
    { name: 'Milton Keynes', uuid: '8d28d7ab-0714-4d07-aadb-8bf60dcce6f9', code: 'GB-MIK', url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Flag_of_Milton_Keynes.png' },
    { name: 'Northumberland', uuid: '6beecf16-22b7-4463-9999-73c79243fd56', code: 'GB-NBL', url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Flag_of_Northumberland.svg' },
    { name: 'Nottingham', uuid: 'f988aff4-5221-4b36-9174-befec694f906', code: 'GB-NGM', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_Nottingham.png' },
    { name: 'Pembrokeshire', uuid: '05c149b4-6a57-4af3-ae0e-575022a5537e', code: 'GB-PEM', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Pembrokeshire.svg' },
    { name: 'Plymouth', uuid: '27e496a5-2ad4-4d7e-a4ac-a3869b2bbad7', code: 'GB-PLY', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Plymouth.svg' },
    { name: 'Portsmouth', uuid: '7b6383fb-468f-4a2b-916f-b4cbbfb5253e', code: 'GB-POR', url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/City_Flag_of_Portsmouth.svg' },
    { name: 'Rutland', uuid: 'a8000b64-a257-441c-9b1b-1084a7f5b626', code: 'GB-RUT', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Rutland_County_Flag.svg' },
    { name: 'Shropshire', uuid: '3fd2c297-7015-4cc0-ad37-48dcb262621f', code: 'GB-SHR', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_Shropshire.svg' },
    { name: 'Southampton', uuid: '32950a38-9edd-42fd-aec9-26128507ff06', code: 'GB-STH', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Flag_of_Southampton.png' },
    { name: 'Southend-on-Sea', uuid: 'f706259c-989f-4a92-bbac-211135b5c207', code: 'GB-SOS', url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Flag_of_Southend-on-Sea.png' },
    { name: 'Swansea', uuid: 'f449c819-0a9b-4c08-9446-6e7d5bd48d08', code: 'GB-SWA', url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/SWANSEA_FLAG.jpg' },
    { name: 'Swindon', uuid: 'aee482fe-df6b-4f0f-849f-18f2329bab7c', code: 'GB-SWD', url: 'https://www.fotw.info/images/g/gb-e-swindon.gif' },
    { name: 'Torfaen', uuid: 'b51fabf7-3a82-430e-b553-e45b1ee724c6', code: 'GB-TOF', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/FLAG_OF_TORFAEN.jpg' },
    { name: 'Vale of Glamorgan', uuid: '495c38be-f0cd-4206-a259-7ba778817975', code: 'GB-VGL', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Glamorgan_Flag.svg' },
    { name: 'Wrexham', uuid: 'acd67bc2-3eac-4e04-afe1-70a0663ec59f', code: 'GB-WRC', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Flag_of_Wrexham.png' },
    { name: 'York', uuid: '3a28f05b-59e0-4aa1-9a79-b96f5ef6403b', code: 'GB-YOR', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_York.svg' },
    // --- United Kingdom (Council Areas) ---
    { name: 'Aberdeen', uuid: '7749e9ec-716b-4197-bd2c-1dd480e9c36a', code: 'GB-ABE', url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/City_Flag_of_Aberdeen.svg' },
    { name: 'Dundee', uuid: '9f160583-bd60-4f8d-bfd5-56c2f0d6f51c', code: 'GB-DND', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Dundee_City_Flag.svg' },
    { name: 'East Lothian', uuid: '10748123-5f07-4593-a0b8-4adf51333cca', code: 'GB-ELN', url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_East_Lothian.svg' },
    { name: 'Edinburgh', uuid: '6658f787-692d-417f-852c-dcca728d5849', code: 'GB-EDH', url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Flag_of_Edinburgh.svg' },
    { name: 'Eilean Siar', uuid: '4c21a66f-c266-4d88-843b-757ab540b164', code: 'GB-ELS', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Western_Isles_Council_Flag.svg' },
    { name: 'Glasgow', uuid: 'c279f805-01f8-46f5-99cf-51f165a1adad', code: 'GB-GLG', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_Glasgow%2C_from_image.svg' },
    { name: 'Orkney Islands', uuid: 'e66ff555-5b61-4820-9c1d-b388b7926a3d', code: 'GB-ORK', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/2007_Flag_of_Orkney.svg' },
    { name: 'Shetland Islands', uuid: 'ddb39253-06b3-4e3a-b218-21bdc94172b5', code: 'GB-ZET', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_Shetland.svg' },
    { name: 'South Lanarkshire', uuid: '7845dd3e-c94d-4355-b9be-3456e1ec420c', code: 'GB-SLK', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Flag_of_South_Lanarkshire.svg' },
    // --- United Kingdom (District) ---
    { name: 'Belfast', uuid: 'b3cb9848-1440-4c2b-b258-f849f8a9d50a', code: 'GB-BFS', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Belfast.svg' },
    // --- United Kingdom (Metropolitan Districts) ---
    { name: 'Birmingham', uuid: '226c4dca-ef2a-4d4b-ba25-4118d116557a', code: 'GB-BIR', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Birmingham%2C_United_Kingdom.svg' },
    { name: 'Coventry', uuid: 'aab979a4-b106-4baa-a4a3-fc45f775cff9', code: 'GB-COV', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Coventry_city_flag.svg' },
    // --- United Kingdom (City Corporation) ---
    { name: 'London', uuid: 'f03d09b3-39dc-4083-afd6-159e3f0d462f', code: 'GB-LND', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_the_City_of_London.svg' },

    // --- United States (States) ---
    { name: 'Alabama', uuid: 'cffc0190-1aa2-489f-b6f9-43b9a9e01a91', code: 'US-AL', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Alabama.svg' },
    { name: 'Alaska', uuid: '821b0738-e1a2-4636-82e0-b5ca8b331679', code: 'US-AK', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Alaska.svg' },
    { name: 'Arizona', uuid: 'bf9353d8-da52-4fd9-8645-52b2349b4914', code: 'US-AZ', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arizona.svg' },
    { name: 'Arkansas', uuid: '8788d6c2-c779-4be5-ad47-cf0a95e0f2a0', code: 'US-AR', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg' },
    { name: 'California', uuid: 'ae0110b6-13d4-4998-9116-5b926287aa23', code: 'US-CA', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg' },
    { name: 'Colorado', uuid: '373183af-56db-44d7-b06a-5877c02c5f01', code: 'US-CO', url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Flag_of_Colorado.svg' },
    { name: 'Connecticut', uuid: '88772016-5866-496a-8de7-4340e922d663', code: 'US-CT', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Flag_of_Connecticut.svg' },
    { name: 'Delaware', uuid: '7a0e4090-2ab5-4a28-acef-6173e3885fa7', code: 'US-DE', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Flag_of_Delaware.svg' },
    { name: 'Florida', uuid: 'd2918f1a-c51e-4a4a-ad7f-cdd88877b25f', code: 'US-FL', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg' },
    { name: 'Georgia', uuid: '7e081aa0-817b-3ae0-9fe2-4bb4e3b3cc95', code: 'US-GA', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_the_State_of_Georgia.svg' },
    { name: 'Hawaii', uuid: '1b420c08-51a5-4bdd-9b0e-cd601703d20b', code: 'US-HI', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Hawaii.svg' },
    { name: 'Idaho', uuid: 'f2532a8e-276c-457a-b3d9-0a7706535178', code: 'US-ID', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_Idaho.svg' },
    { name: 'Illinois', uuid: '8c2196d9-b7be-4051-90d1-ac81895355f1', code: 'US-IL', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Illinois.svg' },
    { name: 'Indiana', uuid: 'cc55c78b-15c9-45dd-8ff4-4a212c54eff3', code: 'US-IN', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Indiana.svg' },
    { name: 'Iowa', uuid: '8c3615bc-bd11-4bf0-b237-405161aac8b7', code: 'US-IA', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Iowa.svg' },
    { name: 'Kansas', uuid: 'c747e5a9-3ac7-4dfb-888f-193ff598c62f', code: 'US-KS', url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_Kansas.svg' },
    { name: 'Kentucky', uuid: '85255cb8-edb9-4a66-b23a-a5261d42c116', code: 'US-KY', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Flag_of_Kentucky.svg' },
    { name: 'Louisiana', uuid: 'fc68ecf5-507e-4012-b60b-d93747a3cfa7', code: 'US-LA', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Flag_of_Louisiana.svg' },
    { name: 'Maine', uuid: 'c45232cf-5848-45d7-84ae-94755f8fe37e', code: 'US-ME', url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Maine.svg' },
    { name: 'Maryland', uuid: '1ed51cbe-4272-4df9-9b18-44b0d4714086', code: 'US-MD', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Maryland.svg' },
    { name: 'Massachusetts', uuid: '05f68b4c-10f3-49b5-b28c-260a1b707043', code: 'US-MA', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Massachusetts.svg' },
    { name: 'Michigan', uuid: '29fa065f-a568-418c-98b9-5023f64d9312', code: 'US-MI', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Flag_of_Michigan.svg' },
    { name: 'Minnesota', uuid: 'f5ffcc03-ebf2-466a-bb11-b38c6c0c84f5', code: 'US-MN', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Minnesota.svg' },
    { name: 'Mississippi', uuid: '6fddb177-f3fc-4c30-9d49-9c7e949fe0bc', code: 'US-MS', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Mississippi.svg' },
    { name: 'Missouri', uuid: '1462269e-911b-4db3-be41-434393484e34', code: 'US-MO', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Missouri.svg' },
    { name: 'Montana', uuid: 'fb8840b9-ff2f-4484-8540-7112ee426ea7', code: 'US-MT', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_Montana.svg' },
    { name: 'Nebraska', uuid: 'a5ff428a-ad62-4752-8f8d-14107c574117', code: 'US-NE', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_Nebraska.svg' },
    { name: 'Nevada', uuid: 'ab47b3b2-838d-463c-9907-30dcd3438d65', code: 'US-NV', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Flag_of_Nevada.svg' },
    { name: 'New Hampshire', uuid: '4ca644d9-18a6-4605-9d71-3eae8b3ab2ee', code: 'US-NH', url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Flag_of_New_Hampshire.svg' },
    { name: 'New Jersey', uuid: 'a36544c1-cb40-4f44-9e0e-7a5a69e403a8', code: 'US-NJ', url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_New_Jersey.svg' },
    { name: 'New Mexico', uuid: '0c693f90-d889-4abe-a0e6-6aac212388e3', code: 'US-NM', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_New_Mexico.svg' },
    { name: 'New York', uuid: '75e398a3-5f3f-4224-9cd8-0fe44715bc95', code: 'US-NY', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_New_York.svg' },
    { name: 'North Carolina', uuid: 'd4ab49e7-1d25-45e2-8659-b147e0ea3684', code: 'US-NC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_North_Carolina.svg' },
    { name: 'North Dakota', uuid: 'af4758fa-92d7-4f49-ac74-f58d3113c7c5', code: 'US-ND', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_North_Dakota.svg' },
    { name: 'Ohio', uuid: '0573177b-9ff9-4643-80bc-ed2513419267', code: 'US-OH', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Ohio.svg' },
    { name: 'Oklahoma', uuid: 'd2083d84-09e2-4d45-8fc0-45eed33748b5', code: 'US-OK', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Flag_of_Oklahoma.svg' },
    { name: 'Oregon', uuid: '376ea713-8f27-4ab1-818b-9cca72023382', code: 'US-OR', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Oregon.svg' },
    { name: 'Pennsylvania', uuid: '75d8fdcf-03e9-43d9-9399-131b8e118b0b', code: 'US-PA', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Pennsylvania.svg' },
    { name: 'Rhode Island', uuid: 'b8c5f945-678b-43eb-a77a-f237d7f01493', code: 'US-RI', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Rhode_Island.svg' },
    { name: 'South Carolina', uuid: 'aec173a2-0f12-489e-812b-7d2c252e4b62', code: 'US-SC', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_South_Carolina.svg' },
    { name: 'South Dakota', uuid: '2066f663-1055-4383-aaa6-08d09ec81e57', code: 'US-SD', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_South_Dakota.svg' },
    { name: 'Tennessee', uuid: 'f9caf2d8-9638-4b96-bc49-8462339d4b2e', code: 'US-TN', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Tennessee.svg' },
    { name: 'Texas', uuid: 'f934c8da-e40e-4056-8f8c-212e68fdcaec', code: 'US-TX', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg' },
    { name: 'Utah', uuid: '7deb769c-1eaa-4b7a-aecf-c395d82a1e73', code: 'US-UT', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Utah.svg' },
    { name: 'Vermont', uuid: 'a3435b4a-f42c-404e-beee-f290f62a5e1c', code: 'US-VT', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Vermont.svg' },
    { name: 'Virginia', uuid: '02e01cf9-b0ed-4286-ac6d-16989f92ced6', code: 'US-VA', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Flag_of_Virginia.svg' },
    { name: 'Washington', uuid: '39383cce-6f78-4afe-b19a-8377995ce702', code: 'US-WA', url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Washington.svg' },
    { name: 'West Virginia', uuid: 'bb32d812-8161-44e1-8a73-7a0d4a6d3f96', code: 'US-WV', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_West_Virginia.svg' },
    { name: 'Wisconsin', uuid: '10cb2ebd-1bc7-4c11-b10d-54f60c421d20', code: 'US-WI', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Wisconsin.svg' },
    { name: 'Wyoming', uuid: 'c2dca60c-5a5f-43b9-8591-3d4e454cac4e', code: 'US-WY', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Wyoming.svg' },
    // --- United States (District) ---
    { name: 'Washington D.C.', uuid: 'af59135f-38b5-4ea4-b4e2-dd28c5f0bad7', code: 'US-DC', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Washington%2C_D.C.svg' },
    // --- United States (Territories) ---
    { name: 'Johnston Atoll', uuid: '9eb0b3a4-b212-40ff-9009-6b65ff988ea2', code: 'UM-67', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Flag_of_the_Johnston_Atoll.svg' },
    { name: 'Midway Islands', uuid: '0a2a0867-543f-40db-a8d8-6c6c99d55431', code: 'UM-71', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Flag_of_the_Midway_Islands_%28local%29.svg' },
    { name: 'Palmyra Atoll', uuid: '3704d613-b691-4bc3-a535-4a25f5368d56', code: 'UM-95', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Flag_of_Palmyra_Atoll_%28local%29.svg' },
    { name: 'Wake Island', uuid: '926aa4ca-d61b-4e42-b52b-7312351fabf5', code: 'UM-79', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Flag_of_Wake_Island.svg' },
    // --- United States (Counties) ---
    { name: 'Brevard County', uuid: '99822fe6-b871-4324-9786-20192e9937d4', code: 'US-FL-BRE', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Flag_of_Brevard_County%2C_Florida.svg' },
    { name: 'Broward County', uuid: '4d9d9bb7-a419-40ad-b292-dea20df41a35', code: 'US-FL-BRO', url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Broward_County%2C_Florida.svg' },
    { name: 'Nassau County', uuid: '3d1aad97-ab44-4494-a0d5-2a2a66ffdc0b', code: 'US-NY-NAS', url: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Official_Flag_of_Nassau_County%2C_New_York.svg' },
    { name: 'Orange County', uuid: '8ba9ac5a-5b4e-4ecc-b24a-e730920fc12b', code: 'US-CA-ORC', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Flag_of_Orange_County%2C_California.svg' },
    { name: 'Pasco County', uuid: '3804400c-1253-401f-8f99-334415691870', code: 'US-FL-PAS', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Flag_of_Pasco_County%2C_Florida.png' },
    { name: 'Rockingham County', uuid: '99f0937c-69b7-455c-9b13-fe708da6943e', code: 'US-NH-ROC', url: 'https://upload.wikimedia.org/wikipedia/en/f/ff/Rockingham_County_Flag.gif' },
    // --- United States (Cities) ---
    { name: 'Akron', uuid: 'e12c1d82-97e2-4ec4-99b7-7ed055720437', code: 'US-OH-AKR', url: 'https://upload.wikimedia.org/wikipedia/en/4/44/Flag_of_Akron%2C_Ohio.png' },
    { name: 'Albuquerque', uuid: '075e1cc9-9567-4317-a931-4f6dcecc688f', code: 'US-NM-ALB', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Albuquerque%2C_New_Mexico.svg' },
    { name: 'Alexandria', uuid: '505da2f1-075d-4bcc-9f87-5908795ffe1f', code: 'US-VA-ALX', url: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Flag_of_Alexandria%2C_Virginia.svg' },
    { name: 'Amarillo', uuid: 'c548af05-b00b-4015-a225-b0a9436c09dc', code: 'US-TX-AMA', url: 'https://upload.wikimedia.org/wikipedia/en/3/35/Flag_of_Amarillo.gif' },
    { name: 'Anchorage', uuid: '3dcca86a-1de1-4656-b60f-0d206597716b', code: 'US-AK-ANC', url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Anchorage%2C_Alaska.svg' },
    { name: 'Arlington', uuid: 'bc468dff-11c5-47d0-b5f3-353acbcd14c0', code: 'US-TX-ARL', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Flag_of_Arlington%2C_Texas.svg' },
    { name: 'Asheville', uuid: '148f3952-2151-4a4c-a859-eb850acf248f', code: 'US-NC-ASH', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_the_City_of_Asheville%2C_North_Carolina.gif' },
    { name: 'Atlanta', uuid: '26e0e534-19ea-4645-bfb3-1aa4e83a4046', code: 'US-GA-ATL', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_Atlanta.svg' },
    { name: 'Atlantic City', uuid: '0df0cc88-ee68-4f02-86e4-f16a55bc2fc3', code: 'US-NJ-ATL', url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Flag_of_Atlantic_City%2C_New_Jersey.svg' },
    { name: 'Auburn', uuid: '1e84fea3-f8c8-4214-be4e-488a2bf079da', code: 'US-ME-AUB', url: 'https://upload.wikimedia.org/wikipedia/en/4/42/AuburnMEflag.png' },
    { name: 'Auburn', uuid: '0644b3ae-618a-490a-97c5-a38d7b13a91a', code: 'US-WA-AUB', url: 'https://upload.wikimedia.org/wikipedia/en/d/d9/Flag_of_Auburn%2C_Washington.png' },
    { name: 'Augusta', uuid: 'f353ba6a-10b3-4023-bd45-23ccd8576691', code: 'US-ME-AUG', url: 'https://upload.wikimedia.org/wikipedia/en/6/6b/AugustaMeflag.png' },
    { name: 'Austin', uuid: '58d2816b-daf9-4fc5-962c-06967f14a5e5', code: 'US-TX-ATX', url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Flag_of_Austin%2C_Texas.svg' },
    { name: 'Bakersfield', uuid: '2cda13d7-d08b-469c-a1c8-45ba21e8b170', code: 'US-CA-BAK', url: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_Bakersfield%2C_California.png' },
    { name: 'Baltimore', uuid: '2fb5445d-3987-49fe-957a-f730a7acc4a2', code: 'US-MD-BAL', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Baltimore%2C_Maryland.svg' },
    { name: 'Bangor', uuid: '3a08cb14-184c-4875-afb3-fc217a832571', code: 'US-ME-BAN', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Flag_of_Bangor%2C_Maine.png' },
    { name: 'Bartlett', uuid: 'f8296ba9-5c6d-45b3-8846-ce41461c5bb0', code: 'US-TN-BAR', url: 'https://upload.wikimedia.org/wikipedia/en/5/55/Bartlett_Tennessee_Flag.gif' },
    { name: 'Batavia', uuid: '64112b2c-bc44-4018-907a-396ab09a1cb1', code: 'US-IL-BAT', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/BataviaCommunityFlag.jpg' },
    { name: 'Battle Creek', uuid: '43508b57-576c-4aab-9f8c-05e242005968', code: 'US-MI-BCR', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Flag_of_Battle_Creek%2C_Michigan.svg' },
    { name: 'Baton Rouge', uuid: '34f02dc4-3173-4c68-86d1-c82504759342', code: 'US-LA-BAT', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_Baton_Rouge%2C_Louisiana.svg' },
    { name: 'Bellingham', uuid: '3b3c74f8-3863-4af6-b1af-5a523d9f3831', code: 'US-WA-BEL', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_Bellingham%2C_Washington.svg' },
    { name: 'Bethlehem', uuid: '2f681cf7-2e4f-40fd-b3eb-38c50209aa3c', code: 'US-PA-BET', url: 'https://upload.wikimedia.org/wikipedia/en/3/32/Bethlehem_PA_Flag.png' },
    { name: 'Bettendorf', uuid: '2ae1a6f7-2709-4213-9692-b3ecf1dbe7d7', code: 'US-IA-BET', url: 'https://upload.wikimedia.org/wikipedia/en/a/aa/BettendorfIAflag.gif' },
    { name: 'Birmingham', uuid: '8995a377-da74-40b6-ab76-b1f2d6eed01f', code: 'US-AL-BIR', url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Flag_of_Birmingham%2C_Alabama.svg' },
    { name: 'Boca Raton', uuid: '931592a4-f23a-4bc4-ac27-67142172f11e', code: 'US-FL-BOC', url: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Boca_Raton%2C_FL_Flag.gif' },
    { name: 'Boise', uuid: '0975b71a-995a-4f7b-a1c3-41e302ba4dc6', code: 'US-ID-BOI', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Boise%2C_Idaho.gif' },
    { name: 'Boone', uuid: '733cb7bb-64d5-4a09-a0fd-c8918f214696', code: 'US-NC-BOO', url: 'https://upload.wikimedia.org/wikipedia/en/6/69/Boone%2C_NC_Town_Flag.gif' },
    { name: 'Boston', uuid: 'e331bfdf-b908-429c-a79b-710cf9c06abb', code: 'US-MA-BOS', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Boston.svg' },
    { name: 'Bowie', uuid: '335f4563-412c-4be8-a472-94f5ccc85e1a', code: 'US-MD-BOW', url: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Bowie%2C_Maryland.png' },
    { name: 'Bridgeport', uuid: 'bfbcf45d-5c3b-4331-bfcb-6341209cd5ec', code: 'US-CT-BRI', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Bridgeport_flag.png' },
    { name: 'Buffalo', uuid: '7e5e7fd7-c1eb-4cb8-87e2-fb1c0eda9e48', code: 'US-NY-BUF', url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Buffalo%2C_New_York.svg' },
    { name: 'Burlington', uuid: '453f5392-25d8-408e-b648-321b904e3439', code: 'US-VT-BUR', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Burlington%2C_Vermont.svg' },
    { name: 'Cambridge', uuid: 'ff1b74fd-054b-4136-b948-bb88fe55d93f', code: 'US-MA-CAM', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Cambridge%2C_Massachusetts.svg' },
    { name: 'Canton', uuid: 'e794c48d-2e18-4e1a-830c-cdf24a4ba07c', code: 'US-OH-CAN', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Canton_Ohio_1805_Flag.png' },
    { name: 'Carson', uuid: '29a62a1e-2583-4d1d-b4b6-2e399c2c3b5a', code: 'US-CA-CAR', url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Flag_of_Carson%2C_California.gif' },
    { name: 'Chapel Hill', uuid: 'ca61a254-6d4e-45c1-89d2-a22f5cc158f8', code: 'US-NC-CHH', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Chapel_Hill%2C_North_Carolina.svg' },
    { name: 'Charleston', uuid: 'b037dd05-f5d1-4033-afa7-22ba9d228223', code: 'US-NC-CHT', url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Flag_of_Charleston%2C_South_Carolina.svg' },
    { name: 'Charlotte', uuid: 'a647136e-1680-4456-bd3a-750752331141', code: 'US-NC-CLT', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_Charlotte%2C_North_Carolina.svg' },
    { name: 'Chattanooga', uuid: '1916ac12-64b4-41c5-9f1d-e2912888ed8e', code: 'US-TN-CHA', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Flag_of_Chattanooga%2C_Tennessee.svg' },
    { name: 'Chicago', uuid: '29a709d8-0320-493e-8d0c-f2c386662b7f', code: 'US-IL-CHI', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Chicago%2C_Illinois.svg' },
    { name: 'Chico', uuid: '5b6f54de-fcb9-4d2f-a9ca-ca939a4ff27b', code: 'US-CA-CHI', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Flag_of_Chico%2C_California.jpg' },
    { name: 'Cincinnati', uuid: 'b2cf490f-a8a7-4875-a1b7-addede3b327f', code: 'US-OH-CIN', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Cincinnati%2C_Ohio.svg' },
    { name: 'Cleveland', uuid: '7b2ca1e7-e7f6-4155-881d-c660a45c11e8', code: 'US-OH-CLE', url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Flag_of_Cleveland%2C_Ohio.svg' },
    { name: 'College Park', uuid: '8e509dbf-4cee-405d-ba69-f10d8aba6678', code: 'US-GA-COP', url: 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_College_Park%2C_Georgia.png' },
    { name: 'Colorado Springs', uuid: '6833b340-b82b-4ce6-9434-dad8da899c28', code: 'US-CO-COS', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Colorado_Springs%2C_Colorado.svg' },
    { name: 'Columbia', uuid: '0583b181-db5d-415d-aa52-62f790ba358f', code: 'US-MO-COL', url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Flag_of_Columbia%2C_Missouri.svg' },
    { name: 'Columbia', uuid: '2776df1e-d042-41d6-856e-76c8e1a277b1', code: 'US-SC-COL', url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Flag_of_Columbia%2C_South_Carolina.svg' },
    { name: 'Columbus', uuid: '18187bcb-18e6-4075-903e-fb976db17a55', code: 'US-OH-COL', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag_of_Columbus%2C_Ohio.svg' },
    { name: 'Concord', uuid: 'ba992c1b-3ea0-4cfd-902e-1c4a20decc26', code: 'US-CA-CON', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Concord%2C_California.gif' },
    { name: 'Converse', uuid: 'c15a9650-7a74-4594-a451-2e7342ee1e45', code: 'US-TX-CON', url: 'https://upload.wikimedia.org/wikipedia/en/a/a8/Flag_of_Converse%2C_Texas.png' },
    { name: 'Costa Mesa', uuid: '398c6575-6e22-44f9-b93a-349c9f5c8889', code: 'US-CA-CMS', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Flag_of_Costa_Mesa%2C_California.svg' },
    { name: 'Croton-on-Hudson', uuid: 'a0fd0636-0e57-451b-9e48-2ebc7ed9fec5', code: 'US-NY-COH', url: 'https://upload.wikimedia.org/wikipedia/en/5/59/CrotonOnHudsonNYflag.gif' },
    { name: 'Dahlonega', uuid: '8259f19d-6597-4b57-9e51-7709e1a5f2ed', code: 'US-GA-DAH', url: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Flag_of_Dahlonega%2C_Georgia.png' },
    { name: 'Dallas', uuid: 'e96f1c0d-721b-470d-a9c4-0aa2d89cf9e7', code: 'US-TX-DAL', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Dallas.svg' },
    { name: 'Daly City', uuid: '73b84283-0e73-4217-ba3b-ae42d2014fd9', code: 'US-CA-DAC', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Flag_of_Daly_City%2C_California.gif' },
    { name: 'Dana Point', uuid: '6bd2edb9-1e91-44f6-933a-f307f308bc32', code: 'US-CA-DAP', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Dana_Point%2C_California.webp' },
    { name: 'Dayton', uuid: 'a55188f6-e976-499b-97b2-735985458216', code: 'US-OH-DAY', url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Flag_of_Dayton%2C_Ohio.svg' },
    { name: 'Daytona Beach', uuid: '9501f8a1-4c38-4a9d-b55d-c389fb18d0c2', code: 'US-FL-DAY', url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Flag_of_Daytona_Beach%2C_Florida.jpg' },
    { name: 'Denmark', uuid: 'f4408e56-b169-450a-aefe-9f22bee03a0c', code: 'US-SC-DEN', url: 'https://upload.wikimedia.org/wikipedia/en/7/77/Denmark%2C_SC_City_Flag.gif' },
    { name: 'Denver', uuid: 'fc1aee9a-f1a8-45dc-8820-af6b5d7f7450', code: 'US-CO-DEN', url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Flag_of_Denver%2C_Colorado.svg' },
    { name: 'Des Moines', uuid: '2bda1647-f64b-4277-acce-e9c1296d065e', code: 'US-IA-DMO', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Des_Moines%2C_Iowa.svg' },
    { name: 'Detroit', uuid: 'b03ff310-d8e2-45cf-9455-769f76641eb2', code: 'US-MI-DET', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Detroit.svg' },
    { name: 'Dover', uuid: '04f7aa6d-9f59-4d7a-91ad-717ffecf793f', code: 'US-DE-DOV', url: 'https://upload.wikimedia.org/wikipedia/en/a/aa/Flag_of_Dover_DE.gif' },
    { name: 'El Paso', uuid: 'b1a61563-a0c7-4bca-af23-66892a3c0115', code: 'US-TX-ELP', url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_El_Paso%2C_Texas.svg' },
    { name: 'Erie', uuid: '25a93b61-e210-47e3-bd2e-41b486e78885', code: 'US-PA-ERI', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Flag_of_Erie%2C_Pennsylvania.svg' },
    { name: 'Fairbanks', uuid: '0e270d32-e661-4fb3-838a-22b4dbfb244c', code: 'US-AK-FAI', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flag_of_the_City_of_Fairbanks%2C_Alaska.png' },
    { name: 'Fairfield', uuid: '33fd8384-b102-44fe-abeb-fcd65c324ce7', code: 'US-CT-FAI', url: 'https://upload.wikimedia.org/wikipedia/en/8/82/Flag_of_Fairfield%2C_Connecticut.gif' },
    { name: 'Falls Church', uuid: '8e01a3ca-7db8-41fa-b00c-dede7d832293', code: 'US-VA-FCH', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Flag_of_Falls_Church%2C_Virginia.png' },
    { name: 'Fayetteville', uuid: '90eba4c7-23e3-4b8b-bf57-96a70fb4e106', code: 'US-NC-FAY', url: 'https://upload.wikimedia.org/wikipedia/en/6/66/Fayetteville%2C_NC_City_Flag.gif' },
    { name: 'Flint', uuid: '32c5b871-cc3b-4641-914b-798dcfa6bc3d', code: 'US-MI-FLI', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_Flint%2C_Michigan.svg' },
    { name: 'Florissant', uuid: '77b719d4-257e-479a-8839-4f4e034bdfb7', code: 'US-MO-FLO', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Florissant%2C_Missouri.png' },
    { name: 'Fort Collins', uuid: '0931744e-659a-4db0-ad13-daa4d00f9a41', code: 'US-CO-FOC', url: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Flag_of_Fort_Collins%2C_Colorado.svg' },
    { name: 'Fort Lauderdale', uuid: 'a2993fdb-6cc6-49da-abe6-831142053fd1', code: 'US-FL-LAU', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Flag_of_Fort_Lauderdale%2C_Florida.svg' },
    { name: 'Fort Wayne', uuid: 'ff0d3b50-54b0-4614-8286-1faa697c715c', code: 'US-IN-FOW', url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Flag_of_Fort_Wayne%2C_Indiana.svg' },
    { name: 'Fort Worth', uuid: 'ae96202a-e993-45de-adfe-a8c6b66a781d', code: 'US-TX-FOW', url: 'https://upload.wikimedia.org/wikipedia/en/9/9d/Flag_of_Fort_Worth%2C_Texas.svg' },
    { name: 'Fresno', uuid: '8293dc49-e4e1-4d29-8395-14fe2500c7ae', code: 'US-CA-FRE', url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Fresno%2C_California.svg' },
    { name: 'Frisco', uuid: 'd45d231d-9e45-44be-851c-5430e94e9bc1', code: 'US-TX-FRI', url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Flag_of_Frisco%2C_Texas.svg' },
    { name: 'Fullerton', uuid: '30075929-e086-4ca7-868c-316ae92f522d', code: 'US-CA-FUL', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Flag_of_Fullerton%2C_California.gif' },
    { name: 'Gilroy', uuid: '4d2085f8-c85b-4633-aa7f-bef6b1744eec', code: 'US-CA-GIL', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Gilroy%2C_California.png' },
    { name: 'Grand Rapids', uuid: 'cb8a856b-fd06-4dcf-a94e-d9841b0f85b6', code: 'US-MI-GRP', url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Flag_of_Grand_Rapids%2C_Michigan_%28logo%29.svg' },
    { name: 'Greensboro', uuid: '7fafba3d-8607-4a50-94f0-4b20a9afab84', code: 'US-NC-GRE', url: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Greensboro%2C_NC_City_Flag.gif' },
    { name: 'Hagerstown', uuid: '4d7941c1-46be-4242-b377-122af849417d', code: 'US-MD-HAG', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag_of_Hagerstown%2C_Maryland.jpg' },
    { name: 'Hartford', uuid: '5e81fea0-f163-42d4-82d5-4e443a5483af', code: 'US-CT-HAR', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Hartford%2C_Connecticut.svg' },
    { name: 'Hattiesburg', uuid: '200956d9-f608-47b0-b2f6-54cf63573cc8', code: 'US-MS-HAT', url: 'https://upload.wikimedia.org/wikipedia/en/c/c4/Flag_of_Hattiesburg%2C_Mississippi.png' },
    { name: 'Haverhill', uuid: '156ca867-6674-4bae-9be9-2b4a60ced500', code: 'US-MA-HAV', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Flag_of_Haverhill%2C_Massachusetts.svg' },
    { name: 'Hempstead', uuid: '8781d121-1b3f-461d-ad9a-042ac00533e8', code: 'US-NY-HEM', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_the_Town_of_Hempstead%2C_New_York.svg' },
    { name: 'Hermosa Beach', uuid: 'ae918dff-19af-499f-bc05-125e5e939f82', code: 'US-CA-HER', url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Flag_of_Hermosa_Beach%2C_California.gif' },
    { name: 'High Point', uuid: 'a456946e-2203-4b43-b695-54d48d24eaf6', code: 'US-NC-HIP', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_High_Point%2C_North_Carolina.svg' },
    { name: 'Hoboken', uuid: '0a61386e-15df-4a38-a1f6-d751e133a1a9', code: 'US-NJ-HOB', url: 'https://upload.wikimedia.org/wikipedia/en/0/09/Hoboken%2C_New_Jersey_Flag.png' },
    { name: 'Honolulu', uuid: 'a1411661-be21-4290-8dc1-50f3d8e3ea67', code: 'US-HI-HON', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Honolulu%2C_Hawaii.svg' },
    { name: 'Houston', uuid: 'c920948b-83e3-40b7-8fe9-9ab5abaac55b', code: 'US-TX-HOU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Flag_of_Houston_Texas.svg' },
    { name: 'Huntington Beach', uuid: 'a7e6070e-3afd-423e-bd10-faf0d53e4778', code: 'US-CA-HUB', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Flag_of_Huntington_Beach%2C_California.svg' },
    { name: 'Huntington Park', uuid: 'b0fa1b5d-382d-4abd-989e-ae9bf9e2f34b', code: 'US-CA-HUP', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Huntington_Park%2C_California.gif' },
    { name: 'Huntsville', uuid: 'b6d574cd-df3f-41c5-9c70-11ffbde21726', code: 'US-AL-HUN', url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Flag_of_Huntsville%2C_Alabama.jpg' },
    { name: 'Indianapolis', uuid: '3bb238a4-c2a4-44e5-9843-a63e71b17e83', code: 'US-IN-IND', url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Indianapolis.svg' },
    { name: 'Indio', uuid: '5ff9f2d3-b50a-4d7e-aa9f-af5f8ff1330f', code: 'US-CA-IND', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Indio%2C_California.png' },
    { name: 'Irving', uuid: 'ca7298d8-a2a1-4efe-8e23-389451b6db27', code: 'US-TX-IRV', url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_Irving%2C_Texas_%282009-%29.svg' },
    { name: 'Jackson', uuid: 'c8b40d63-0965-4c7c-b47b-530e2bd0ab0c', code: 'US-TN-JKS', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_Jackson%2C_Tennessee.svg' },
    { name: 'Jacksonville', uuid: '92d87c63-fc98-46cb-b3a6-a75a4b67d1cf', code: 'US-FL-JKS', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Jacksonville%2C_Florida.svg' },
    { name: 'Jersey City', uuid: '88458f70-6ca9-4a4a-ad8e-e8053e18b981', code: 'US-NJ-JRS', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Jersey_City%2C_New_Jersey.png' },
    { name: 'Johnstown', uuid: 'e96c582c-a541-47a5-841e-667c8bc58094', code: 'US-PA-JST', url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Flag_of_Johnstown%2C_Pennsylvania.svg' },
    { name: 'Juneau', uuid: 'edc7ab52-c223-4f29-aa51-e97595a6288c', code: 'US-AK-JUN', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Juneau%2C_Alaska.svg' },
    { name: 'Kalamazoo', uuid: '841c52e6-b273-4cd1-a726-637f99f5ea52', code: 'US-MI-KAL', url: 'https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Kalamazoo%2C_Michigan.svg' },
    { name: 'Kansas City', uuid: 'd08520b0-8bd6-454e-8b6f-634143efdaff', code: 'US-KS-KC', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_Wyandotte_County%2C_Kansas.svg' },
    { name: 'Kansas City', uuid: 'c1fc21db-40e9-47f5-af93-f3ebe6581113', code: 'US-MO-KC', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Kansas_City%2C_Missouri.svg' },
    { name: 'Keene', uuid: '60aa7724-eef6-4501-8058-1293c2e3392b', code: 'US-NH-KEE', url: 'https://upload.wikimedia.org/wikipedia/en/4/4d/KeeneNHflag.gif' },
    { name: 'Kent', uuid: '8b4a60a1-2240-4019-b915-2ca03526013d', code: 'US-OH-KEN', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Kent%2C_Ohio.svg' },
    { name: 'Knoxville', uuid: '2412f885-2939-44dc-ac6a-7c1275052c5c', code: 'US-TN-KNX', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Flag_of_Knoxville%2C_Tennessee.svg' },
    { name: 'Lafayette', uuid: '522c53ef-5013-4cdb-8203-0b74ced3abde', code: 'US-LA-LAF', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Lafayette%2C_Louisiana.svg' },
    { name: 'La Habra', uuid: '097e477d-ec3b-4ec7-aea3-33a6f82404a5', code: 'US-CA-LHB', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Flag_of_La_Habra%2C_California.gif' },
    { name: 'Lakeland', uuid: 'ba493d2f-b09b-47bb-8763-f870f9d0524c', code: 'US-FL-LAK', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Lakeland_Flag.png' },
    { name: 'Lake Zurich', uuid: 'b9932615-cad7-4c9d-8ad9-a1f5dda88885', code: 'US-IL-LZU', url: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Flag_of_Lake_Zurich%2C_Illinois.png' },
    { name: 'Lancaster', uuid: '77f6b33a-5c5c-4ba5-9a33-9d8875f67a60', code: 'US-PA-LAN', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Flag_of_Lancaster%2C_Pennsylvania.svg' },
    { name: 'Las Vegas', uuid: 'cd22d0ba-c79b-45b3-a8e0-617b240df5f0', code: 'US-NV-LV', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Flag_of_Las_Vegas%2C_Nevada.svg' },
    { name: 'Lexington', uuid: '4551ede8-589a-4776-8120-bf43e53c927b', code: 'US-KY-LEX', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Flag_of_the_Lexington_Fayette_Urban_County_Government.png' },
    { name: 'Little Rock', uuid: '9150ffc9-be86-42ff-96b6-a4fee1ce2b52', code: 'US-AR-LIR', url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Little_Rock%2C_Arkansas.svg' },
    { name: 'Las Cruces', uuid: 'ce35adc1-e0f0-4877-b8da-c1eeb47a1d47', code: 'US-NM-LCR', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Flag_of_Las_Cruces%2C_New_Mexico.svg' },
    { name: 'Lockport', uuid: 'c584bd58-1fd7-4e3f-87d2-4ae9715f2220', code: 'US-NY-LKP', url: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Flag_of_Lockport%2C_New_York.png' },
    { name: 'London', uuid: '7bfa293f-d942-46f4-8f95-0a205faa5d2d', code: 'US-KY-LON', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Flag_of_London%2C_Kentucky.svg' },
    { name: 'Long Beach', uuid: 'e183ffae-1d35-4c78-b552-957535e40af1', code: 'US-CA-LOB', url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Long_Beach%2C_California.png' },
    { name: 'Los Alamitos', uuid: '8f3007dd-533d-4380-aaf2-7ba420a9e656', code: 'US-CA-LAL', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Flag_of_Los_Alamitos%2C_California.gif' },
    { name: 'Los Altos', uuid: '9f72ba0b-e782-4ff8-bb3f-f41d2b0c54af', code: 'US-CA-LAT', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Flag_of_Los_Altos%2C_California.gif' },
    { name: 'Los Angeles', uuid: '1f40c6e1-47ba-4e35-996f-fe6ee5840e62', code: 'US-CA-LA', url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Flag_of_Los_Angeles%2C_California.svg' },
    { name: 'Louisville', uuid: 'b21e4552-050d-4c0c-ac5a-031108eb0c47', code: 'US-KY-LOU', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Louisville%2C_KY.png' },
    { name: 'Lowell', uuid: '4a195ad1-1772-46e1-b51c-c93706006663', code: 'US-MA-LOW', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Lowell%2C_Massachusetts.png' },
    { name: 'Loveland', uuid: '0bcdffd7-3d5a-4d85-bde5-690cc4716142', code: 'US-CO-LOV', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Flag_of_Loveland%2C_Colorado.svg' },
    { name: 'Lubbock', uuid: 'b56bd92d-9945-4828-a964-ccb932649633', code: 'US-TX-LUB', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Flag_of_Lubbock%2C_Texas.svg' },
    { name: 'Madison', uuid: '188ae04a-63e2-423a-bc3d-f725f1214a69', code: 'US-WI-MAD', url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Flag_of_Madison%2C_Wisconsin_%282018–present%29.svg' },
    { name: 'Malibu', uuid: 'fb0c4113-d177-4f3f-be56-4fa05d4807b9', code: 'US-CA-MAL', url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Flag_of_Malibu%2C_California.gif' },
    { name: 'Manchester', uuid: '69e6f58c-4887-431e-b6b3-abb83f80a024', code: 'US-CT-MAN', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Manchester%2C_Connecticut.svg' },
    { name: 'Memphis', uuid: 'c2d96f61-75a4-4375-aed5-6aacb0b6326a', code: 'US-TN-MEM', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Flag_of_Memphis%2C_Tennessee.svg' },
    { name: 'Miami', uuid: '4a9aeb42-3763-4234-8fb8-1167ac1dfdfe', code: 'US-FL-MIA', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Miami%2C_Florida.svg' },
    { name: 'Miami Beach', uuid: '26b70c12-9676-41b4-a7e7-bc3d4dd80f65', code: 'US-FL-MIB', url: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Flag_of_Miami_Beach%2C_Florida.svg' },
    { name: 'Michigan City', uuid: 'a98e6774-72e8-4f5d-8cbb-127e1d551ba7', code: 'US-IN-MIC', url: 'https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Michigan_City%2C_Indiana.png' },
    { name: 'Midwest City', uuid: 'b4f3fa28-c080-4ee8-94b3-895edd5116fe', code: 'US-OK-MWC', url: 'https://upload.wikimedia.org/wikipedia/en/b/b3/MidwestCityOKflag.gif' },
    { name: 'Milwaukee', uuid: '4dc3fa97-cf9b-43f0-bec9-fcc52d6215d5', code: 'US-WI-MIL', url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Milwaukee%2C_Wisconsin.svg' },
    { name: 'Minneapolis', uuid: '3e80aaa7-9b71-450f-8147-0ecf101d8f1a', code: 'US-MN-MIN', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Minneapolis.svg' },
    { name: 'Missoula', uuid: '0eda8614-7cb0-4ed4-a1cd-a143d9327bb6', code: 'US-MT-MIS', url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Gay_Pride_Flag.svg' },
    { name: 'Mobile', uuid: '39d41edd-5b4e-496e-a080-077283989dd0', code: 'US-AL-MOB', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Flag_of_Mobile%2C_Alabama.svg' },
    { name: 'Modesto', uuid: '40110a75-ab09-4b39-b798-155de590b746', code: 'US-CA-MOD', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Flag_of_Modesto%2C_California.gif' },
    { name: 'Moreno Valley', uuid: '0392c10d-31f0-44c3-92ec-9cf5212f7baf', code: 'US-CA-MRV', url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Moreno_Valley%2C_California.png' },
    { name: 'Morgantown', uuid: '54a75c95-3aea-4688-b91f-cc3e9d37a082', code: 'US-WV-MOR', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Morgantown%2C_West_Virginia.png' },
    { name: 'Morro Bay', uuid: '451a6663-55e5-4904-ada5-ba6c5bd479c1', code: 'US-CA-MRB', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Morro_Bay%2C_California.png' },
    { name: 'Mount Vernon', uuid: 'b83bd8ff-6283-4d67-8a9f-52f52d1f5fbd', code: 'US-WA-MTV', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Mount_Vernon%2C_Washington.svg' },
    { name: 'Mt. Juliet', uuid: '644ab517-5bff-401a-b0db-0745ccb38a3d', code: 'US-TN-MTJ', url: 'https://upload.wikimedia.org/wikipedia/en/9/97/Flag_of_Mount_Juliet%2C_Tennessee.png' },
    { name: 'Naperville', uuid: 'edace21f-b225-4c78-9640-503fa4615e66', code: 'US-IL-NAP', url: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Flag_of_Naperville%2C_Illinois.png' },
    { name: 'Nashville', uuid: 'e68879f9-bd95-41ff-96ba-c082ff37cc74', code: 'US-TN-NSH', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Nashville.png' },
    { name: 'Newark', uuid: '59d97d00-14df-4bd8-bc93-aeb91448863d', code: 'US-DE-NEW', url: 'https://upload.wikimedia.org/wikipedia/en/4/4e/Newark%2C_DE_Flag.gif' },
    { name: 'Newark', uuid: '85c7cd5f-6fe2-4195-a44d-69fa390bd6ec', code: 'US-NJ-NEW', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Flag_of_Newark%2C_New_Jersey.png' },
    { name: 'New Britain', uuid: '09d3ae74-8d3d-421d-ad6c-f5c9eb410571', code: 'US-CT-NBT', url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Flag_of_New_Britain%2C_Connecticut.png' },
    { name: 'New Haven', uuid: '29754947-4414-4aa1-aeb1-b8bafb8b0e18', code: 'US-CT-NEW', url: 'https://upload.wikimedia.org/wikipedia/en/3/31/NewHavenCTflag.png' },
    { name: 'Newnan', uuid: 'a642c853-a86e-4297-830d-c726fde62f63', code: 'US-GA-NEW', url: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Flag_of_Newnan%2C_Georgia.png' },
    { name: 'New Orleans', uuid: '3c5a0506-d852-4e96-8d1e-d8126328f3be', code: 'US-LA-NO', url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_New_Orleans%2C_Louisiana.svg' },
    { name: 'New York City', uuid: '74e50e58-5deb-4b99-93a2-decbb365c07f', code: 'US-NY-NYC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_New_York_City.svg' },
    { name: 'Norfolk', uuid: '520b4d15-da9b-40ce-8ba5-d797d0eae8a2', code: 'US-VA-NOR', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Flag_of_Norfolk%2C_Virginia.gif' },
    { name: 'Oakland', uuid: '6195f381-5711-4655-bf7c-75918c04b201', code: 'US-CA-OAK', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Flag_of_Oakland%2C_California.svg' },
    { name: 'Ocean City', uuid: '934ccf68-7b2f-49a7-9ec4-64c4387dfc3f', code: 'US-MD-OCY', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Flag_of_Ocean_City%2C_Maryland.svg' },
    { name: 'Oklahoma City', uuid: 'ca61e235-0f31-4c0e-8963-8232222ef6a8', code: 'US-OK-OKC', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Oklahoma_City%2C_Oklahoma.png' },
    { name: 'Olympia', uuid: 'dc14405c-7534-457a-8672-54593b8805b9', code: 'US-WA-OLY', url: 'https://upload.wikimedia.org/wikipedia/en/a/a3/Flag_of_Olympia%2C_Washington.jpeg' },
    { name: 'Omaha', uuid: '7968b302-75a6-4456-a09e-7bf7ac13293a', code: 'US-NE-OMH', url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Flag_of_Omaha%2C_Nebraska.svg' },
    { name: 'Orlando', uuid: 'ec1e55f4-03df-4ba1-a314-1ab959aa3fd6', code: 'US-FL-ORL', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Orlando%2C_Florida.svg' },
    { name: 'Oswego', uuid: '16849775-e58c-4522-886e-b15c65921f61', code: 'US-IL-OSW', url: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Flag_of_Oswego%2C_Illinois.png' },
    { name: 'Owensboro', uuid: 'f1e7975b-c6ac-4106-99d6-f66e557bd8e2', code: 'US-KY-OWE', url: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Flag_of_Owensboro%2C_Kentucky.png' },
    { name: 'Oxford', uuid: 'ce144151-6062-43db-9bab-1950d3d0540d', code: 'US-MS-OXF', url: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Flag_of_Oxford%2C_Mississippi.png' },
    { name: 'Oxford', uuid: '606569b9-687c-4574-a4b6-0fe7e0adf606', code: 'US-OH-OXF', url: 'https://upload.wikimedia.org/wikipedia/en/7/7a/OxfordOHflag.png' },
    { name: 'Palm Beach', uuid: 'b8e624c3-e851-4356-8995-5adea9d8e2a8', code: 'US-FL-PAB', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Flag_of_Palm_Beach%2C_Florida.svg' },
    { name: 'Pasadena', uuid: '56e1c305-859d-4fbb-8a7c-6e45e1b8ebf1', code: 'US-CA-PAS', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Pasadena%2C_California.gif' },
    { name: 'Paterson', uuid: 'fc48401a-52bc-4a20-b756-dcf79aae2591', code: 'US-NJ-PAT', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Flag_of_Paterson%2C_New_Jersey.png' },
    { name: 'Peoria', uuid: '7eb6a212-023b-4a10-a95a-5de38016228a', code: 'US-IL-PEO', url: 'https://upload.wikimedia.org/wikipedia/en/9/96/Flag_of_Peoria%2C_Illinois.png' },
    { name: 'Petaluma', uuid: '208730ac-4bfb-4986-9719-4af73f40f076', code: 'US-CA-PET', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Flag_of_Petaluma%2C_California.gif' },
    { name: 'Phenix City', uuid: '3f8cd9d3-e2a1-4696-9e37-2d53f74a9093', code: 'US-AL-PHC', url: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Flag_of_Phenix_City%2C_Alabama.png' },
    { name: 'Philadelphia', uuid: '0eeb01c2-6e31-46ad-96b8-319749f731d2', code: 'US-PA-PHI', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Flag_of_Philadelphia%2C_Pennsylvania.svg' },
    { name: 'Phoenix', uuid: '7f1c8f3f-69a9-454a-8633-c3d3a628858b', code: 'US-AZ-PHX', url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Flag_of_Phoenix%2C_Arizona.svg' },
    { name: 'Pittsburgh', uuid: '787abc26-28ce-44f8-a2d1-82d86b5d28a8', code: 'US-PA-PIT', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Flag_of_Pittsburgh%2C_Pennsylvania.svg' },
    { name: 'Plantation', uuid: '99c3c77d-9ea0-4550-95f4-2aca18c022db', code: 'US-FL-PLA', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Plantation%2C_Florida.png' },
    { name: 'Pomona', uuid: 'f65f6373-5044-416b-985f-1ea5a1f4e436', code: 'US-CA-POM', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Pomona%2C_California.png' },
    { name: 'Portland', uuid: '71e43d18-c6f2-4c6f-8026-5f85af905bcd', code: 'US-ME-POR', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Portland%2C_Maine.svg' },
    { name: 'Portland', uuid: '2b748d6e-bc1c-4434-9f7b-ecd6332bc557', code: 'US-OR-POR', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Portland%2C_Oregon.svg' },
    { name: 'Portsmouth', uuid: 'b64a4ffd-29a1-4ea1-b9a3-27a43a680eda', code: 'US-NH-POR', url: 'https://upload.wikimedia.org/wikipedia/en/3/3a/PortsmouthNHflag.gif' },
    { name: 'Poughkeepsie', uuid: '1c21104f-2f29-4de1-9b1b-a8290a0e8942', code: 'US-NY-PKS', url: 'https://upload.wikimedia.org/wikipedia/en/2/29/Flag_of_Poughkeepsie%2C_New_York.png' },
    { name: 'Providence', uuid: '1b4c4320-f55b-47ca-84c6-6e95dc5493b4', code: 'US-RI-PRO', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Flag_of_Providence%2C_Rhode_Island.png' },
    { name: 'Provo', uuid: '8d2ad562-290f-440b-b610-6df497dfef95', code: 'US-UT-PRO', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Flag_of_Provo%2C_Utah_%282015–%29.svg' },
    { name: 'Raleigh', uuid: '3f8828b9-ba93-4604-9b92-1f616fa1abd1', code: 'US-NC-RAL', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Flag_of_Raleigh%2C_North_Carolina.svg' },
    { name: 'Reno', uuid: 'a1e179ba-d7a5-4f39-b839-94bac2e9b269', code: 'US-NV-REN', url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Flag_of_Reno%2C_Nevada.svg' },
    { name: 'Redondo Beach', uuid: 'e2aa5579-48d3-48a9-94da-e199e49b3e4a', code: 'US-CA-REN', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Redondo_Beach%2C_California.gif' },
    { name: 'Richland', uuid: '55f75e83-0312-429d-b5a6-364cb497a38f', code: 'US-WA-RIC', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Flag_of_Richland%2C_Washington.svg' },
    { name: 'Richmond', uuid: 'fbc96457-6f43-4f7d-9b11-c6c73d6e80e1', code: 'US-KY-RIC', url: 'https://upload.wikimedia.org/wikipedia/en/1/1e/Flag_of_Richmond%2C_Kentucky.png' },
    { name: 'Richmond', uuid: 'afaa40c1-2e11-4a9b-9a33-ff0603e3e312', code: 'US-VA-RIC', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Richmond%2C_Virginia.svg' },
    { name: 'Riverside', uuid: '0aae418d-8db2-4802-911b-db230839f010', code: 'US-CA-RIV', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Riverside%2C_California_%282020%29.svg' },
    { name: 'Rochester', uuid: '6c4befbe-6188-4460-b306-5cb68f897f7c', code: 'US-MN-ROC', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Rochester_Minnesota.svg' },
    { name: 'Rochester', uuid: '17203e02-355a-40db-a524-980192eb9d0f', code: 'US-NY-ROC', url: 'https://upload.wikimedia.org/wikipedia/en/6/68/Flag_of_Rochester_NY_%282025%29.png' },
    { name: 'Rockford', uuid: '8b3205bc-1e33-425e-bcc3-88d015924e64', code: 'US-IL-RCF', url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Flag_of_Rockford%2C_Illinois.svg' },
    { name: 'Rock Hill', uuid: '55cb203f-39e8-49b5-9a1a-f52b7e7be497', code: 'US-SC-ROC', url: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Rock_Hill%2C_SC_City_Flag.gif' },
    { name: 'Russellville', uuid: '280b2d65-a133-4f2d-ac88-03423f7aabcc', code: 'US-AR-RUS', url: 'https://upload.wikimedia.org/wikipedia/en/6/6f/Flag_of_Russellville%2C_Arkansas.png' },
    { name: 'Sacramento', uuid: '21879fba-fe4e-4dbc-99e8-cad9142e5618', code: 'US-CA-SAC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Flag_of_Sacramento%2C_California.svg' },
    { name: 'Saginaw', uuid: 'bfcb689c-a5c7-4442-bb8e-81df3eb7f861', code: 'US-MI-SAG', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Flag_of_Saginaw%2C_Michigan.gif' },
    { name: 'Saint Paul', uuid: '96713a37-1ebb-419e-b052-ffc93ceabcb2', code: 'US-MN-STP', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Saint_Paul%2C_Minnesota.svg' },
    { name: 'Salem', uuid: '21abf854-fba3-4b34-a944-c4ce09331cc7', code: 'US-MA-SAL', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Flag_of_Salem%2C_Massachusetts.png' },
    { name: 'Salt Lake City', uuid: 'e5936529-76b1-449e-a2e9-6ed98fe8d0d9', code: 'US-UT-SLC', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Salt_Lake_City_%282020%29.svg' },
    { name: 'San Antonio', uuid: 'a6f7157a-bfab-49e8-a22b-240ade4552ca', code: 'US-TX-SA', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Flag_of_San_Antonio%2C_Texas.svg' },
    { name: 'San Bernardino', uuid: '47975cb6-7650-4fac-a47c-cfead95f73d4', code: 'US-CA-SBE', url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Flag_of_San_Bernardino%2C_California.png' },
    { name: 'San Diego', uuid: '82f3a697-ba65-404d-a1ed-360147af7d10', code: 'US-CA-SD', url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_San_Diego%2C_California.svg' },
    { name: 'San Francisco', uuid: '83f22bb6-4631-443c-bace-9fae8540362a', code: 'US-CA-SF', url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Flag_of_San_Francisco%2C_California.svg' },
    { name: 'San Jose', uuid: 'f95f42b0-59a6-410d-a08e-3db77f4aea8a', code: 'US-CA-SJO', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Flag_of_San_José%2C_California.svg' },
    { name: 'San Juan', uuid: 'c3503bb7-f32d-4536-a1af-b2623f54ab4f', code: 'US-PR-SJU', url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_San_Juan%2C_Puerto_Rico.svg' },
    { name: 'Sarasota', uuid: '8e438f38-b9af-4a6d-aa29-8b57770afbd2', code: 'US-FL-SAR', url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Flag_of_Sarasota%2C_Florida.svg' },
    { name: 'Santa Clarita', uuid: 'b438f5d7-7d0a-474e-8767-48947cc37ece', code: 'US-CA-SCL', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Santa_Clarita%2C_California.png' },
    { name: 'Savannah', uuid: 'a050e542-6dbe-4851-baa7-1fff5731c0c3', code: 'US-GA-SAV', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Flag_of_Savannah%2C_Georgia.svg' },
    { name: 'Scottsdale', uuid: '8feab5af-6290-47e6-993d-b839e668211b', code: 'US-AZ-SCO', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Flag_of_Scottsdale%2C_Arizona.svg' },
    { name: 'Seattle', uuid: '10adc6b5-63bf-4b4e-993e-ed83b05c22fc', code: 'US-WA-SEA', url: 'https://upload.wikimedia.org/wikipedia/en/6/6d/Flag_of_Seattle.svg' },
    { name: 'Sedona', uuid: '386a5e10-c750-4787-82e4-92ee13fb4a67', code: 'US-AZ-SED', url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Flag_of_Sedona%2C_Arizona.svg' },
    { name: 'Sevierville', uuid: '1a58c5d8-af00-4895-9ab8-33fd62c0d047', code: 'US-TN-SEV', url: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Flag_of_Sevierville%2C_Tennessee.png' },
    { name: 'Show Low', uuid: '40fea6ec-9142-4bb2-ac3b-3a72ee99d513', code: 'US-AZ-SHL', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Show_Low%2C_Arizona.svg' },
    { name: 'Shreveport', uuid: '792c0b7d-c00d-430c-a431-e0624841d523', code: 'US-LA-SHR', url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Flag_of_Shreveport%2C_Louisiana.png' },
    { name: 'Sitka', uuid: '54c6cc95-6b5d-4979-9c49-14db91ed8509', code: 'US-AK-SIT', url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Flag_of_Sitka%2C_Alaska.gif' },
    { name: 'Spokane', uuid: '9d5ae15a-f1d4-4b84-8a89-b8e1cf3a1aec', code: 'US-WA-SPO', url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Flag_of_Spokane%2C_Washington_%282021–present%29.svg' },
    { name: 'Stamford', uuid: 'c0b7b343-2f13-4c6e-81a3-f5a08b22dde0', code: 'US-CT-STA', url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Flag_of_Stamford%2C_Connecticut.svg' },
    { name: 'St. Joseph', uuid: 'bfae8151-2ba2-4f8f-bf2e-8fc16ce352c6', code: 'US-MO-SJ', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_Saint_Joseph%2C_Missouri.jpg' },
    { name: 'St. Louis', uuid: '759f9567-9107-40ef-a825-e57824a62e70', code: 'US-MO-SL', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_St._Louis%2C_Missouri.svg' },
    { name: 'Stockton', uuid: 'ac84aab3-62db-4e26-9651-93d3f66cf982', code: 'US-CA-STK', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Flag_of_Stockton%2C_California.png' },
    { name: 'St. Petersburg', uuid: '6170a824-ce9d-48d7-b28f-9e493e220436', code: 'US-FL-SPB', url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_St._Petersburg%2C_Florida.svg' },
    { name: 'Stone Mountain', uuid: 'f633113c-91e6-4236-a920-d239e6a15060', code: 'US-GA-STM', url: 'https://upload.wikimedia.org/wikipedia/en/3/38/Flag_of_Stone_Mountain%2C_Georgia.png' },
    { name: 'Syracuse', uuid: '1fee56fe-5b76-4a50-bc63-37ee51d3300f', code: 'US-NY-SYR', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Syracuse%2C_New_York.svg' },
    { name: 'Tacoma', uuid: 'ced2611f-cfac-438a-95d0-02d6f5fb4f84', code: 'US-WA-TAC', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Tacoma%2C_Washington.svg' },
    { name: 'Tampa', uuid: 'ff21865c-ce46-4417-967c-a3d2d02d29bf', code: 'US-FL-TB', url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_Tampa%2C_Florida.svg' },
    { name: 'Tempe', uuid: 'c1140389-8ef9-41c5-aa1c-f8d8d991bce1', code: 'US-AZ-TEM', url: 'https://upload.wikimedia.org/wikipedia/en/7/79/TempeAZflag.gif' },
    { name: 'Tewksbury', uuid: 'bc79e80f-3507-40d2-9245-21c900e85dc4', code: 'US-MA-TEW', url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Flag_of_Tewksbury%2C_Massachusetts.gif' },
    { name: 'Toledo', uuid: '411611e6-9779-404d-bb23-cf11388c7f3e', code: 'US-OH-TOL', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_Toledo%2C_Ohio_%282025–%29.svg' },
    { name: 'Tucson', uuid: '7c71f821-98a0-4f1b-bf6b-87fe1d6c89f0', code: 'US-AZ-TUC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Flag_of_Tucson%2C_Arizona.svg' },
    { name: 'Tupelo', uuid: '157e3c0e-1b68-403d-a515-6e37cb67947b', code: 'US-MS-TUP', url: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_Tupelo%2C_Mississippi.svg' },
    { name: 'Tulsa', uuid: '1be74a46-6d7a-4285-9f41-9df7424319c9', code: 'US-OK-TUL', url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Flag_of_Tulsa%2C_Oklahoma_%282018%29.svg' },
    { name: 'Tuskegee', uuid: '272b76ae-930e-4c07-b80b-6be2060d0a12', code: 'US-AL-TUS', url: 'https://upload.wikimedia.org/wikipedia/en/5/55/Flag_of_Tuskegee%2C_Alabama.png' },
    { name: 'Twentynine Palms', uuid: 'd5e15d72-bc8f-47b6-9a31-7d2dca822a8e', code: 'US-CA-TWP', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Flag_of_Twentynine_Palms%2C_California.gif' },
    { name: 'Valdosta', uuid: '172860f7-4121-419f-916e-793b184a4bf9', code: 'US-GA-VAL', url: 'https://upload.wikimedia.org/wikipedia/en/0/00/Flag_of_Valdosta%2C_Georgia.png' },
    { name: 'Venice', uuid: '88f38706-514b-4d74-b92d-6ed2f82dcee0', code: 'US-FL-VEN', url: 'https://upload.wikimedia.org/wikipedia/en/0/0b/VeniceFLflag.gif' },
    { name: 'Virginia Beach', uuid: '21834e17-8606-4e10-af5c-76d5d668eba9', code: 'US-VA-VIR', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Flag_of_Virginia_Beach%2C_Virginia.png' },
    { name: 'Wabash', uuid: '63ed5c6e-3afb-4b3b-854f-bc078401c716', code: 'US-IN-WAB', url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Wabash_Flag.gif' },
    { name: 'Waco', uuid: 'a2e4f11b-99d1-4aa4-b184-4d6bc29d1365', code: 'US-TX-WAC', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Waco%2C_Texas.svg' },
    { name: 'Walla Walla', uuid: 'b44e6b65-956a-4eca-a586-af1773edcf10', code: 'US-WA-WAL', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Flag_of_Walla_Walla%2C_WA_%28adopted_2021%29.png' },
    { name: 'West Allis', uuid: '232dbf2e-8f5a-42a6-867e-a5340f09a518', code: 'US-WI-WAL', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/West_Allis_City_Flag.gif' },
    { name: 'West Chicago', uuid: 'e6fa96b7-0c92-4000-9290-17c97e19c3a1', code: 'US-IL-WCH', url: 'https://upload.wikimedia.org/wikipedia/en/9/91/Flag_of_West_Chicago%2C_Illinois.png' },
    { name: 'West Hollywood', uuid: '3d628b22-a76b-4f15-9af1-0d6d6964dbe8', code: 'US-CA-WHD', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Flag_of_West_Hollywood%2C_California.svg' },
    { name: 'Wichita', uuid: '7a1008ce-0932-422e-bf78-3b3185ca24f2', code: 'US-KS-WIC', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Wichita%2C_Kansas.svg' },
    { name: 'Wilkes-Barre', uuid: '7a8da20d-4d2e-4882-b020-37d61761c2e5', code: 'US-PA-WIL', url: 'https://upload.wikimedia.org/wikipedia/en/6/6d/Flag_of_Wilkes-Barre%2C_Pennsylvania.png' },
    { name: 'Wilmington', uuid: '791d0c22-5a31-410d-af12-5fd2553bb3a7', code: 'US-DE-WIL', url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Flag_of_the_City_of_Wilmington.png' },
    { name: 'Wilmington', uuid: 'b3195d3d-7442-4ac1-9db3-4e518eb53396', code: 'US-NC-WIL', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Wilmington%2C_NC_City_Flag_%28Revised_Version%29.png' },
    { name: 'Winchester', uuid: '17160c4f-5390-453c-a901-0bb5529f186e', code: 'US-VA-WIN', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Flag_of_Winchester%2C_Virginia_USA.svg' },
    { name: 'Winston-Salem', uuid: '2db9a0a5-3eb7-418a-8cd4-6a8bda9bebb3', code: 'US-NC-WIN', url: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Flag_of_Winston-Salem%2C_North_Carolina.gif' },
    { name: 'Ypsilanti', uuid: '9dcb041d-6107-45e1-a447-be986dddfde5', code: 'US-MI-YPS', url: 'https://upload.wikimedia.org/wikipedia/en/7/75/Flag_of_Ypsilanti.svg' },
    // --- United States (Boroughs) ---
    { name: 'Brooklyn', uuid: 'a71b0d32-7752-49e9-8594-2247ad6ac12c', code: 'US-NY-BRO', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Flag_of_Brooklyn%2C_New_York.svg' },
    { name: 'Manhattan', uuid: '261962ea-d8c2-4eaf-a80c-f14376ffadb0', code: 'US-NY-MNH', url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_the_Borough_of_Manhattan.svg' },
    { name: 'Queens', uuid: '431a085b-9f4c-4fbb-82de-2ca7ce735da8', code: 'US-NY-QUE', url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Flag_of_Queens%2C_New_York.svg' },
    { name: 'Staten Island', uuid: 'a8c1d0e2-0837-454c-afa9-4190b3fe4d92', code: 'US-NY-STI', url: 'https://www.crwflags.com/fotw/images/u/us-ny-si.gif' },
    { name: 'The Bronx', uuid: 'eb4a386e-1178-4e3a-a371-30418dd6fd2e', code: 'US-NY-BRX', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Flag_of_Borough_of_the_Bronx.svg' },

    // --- Uruguay (Departments) ---
    { name: 'Artigas', uuid: 'be86ade4-0166-44e7-82d1-7625a5d6156c', code: 'UY-AR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Artigas_Department.svg' },
    { name: 'Canelones', uuid: '2dcc1093-b5ff-4228-8dcd-7ea063265e7e', code: 'UY-CA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canelones_Department.svg' },
    { name: 'Cerro Largo', uuid: 'be8c2317-bd80-4540-b45c-335a6ce65ed1', code: 'UY-CL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Cerro_Largo_Department.svg' },
    { name: 'Colonia', uuid: '28af4fbb-951a-4a9f-9448-b449166b0cb3', code: 'UY-CO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Colonia_Department.svg' },
    { name: 'Durazno', uuid: 'c03a898d-2bad-431d-aa98-f9775a59ad9f', code: 'UY-DU', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Durazno_Department.svg' },
    { name: 'Flores', uuid: '87bfb905-ea0a-4891-bffc-7e2fe52e8d0f', code: 'UY-FS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Flores_Department.svg' },
    { name: 'Florida', uuid: '289222ec-bf34-4021-b664-f25dbbbf7c38', code: 'UY-FD', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Florida_Department.svg' },
    { name: 'Lavalleja', uuid: '49f00fb2-f114-40be-9b2d-1f934c90b941', code: 'UY-LA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Lavalleja_Department.svg' },
    { name: 'Maldonado', uuid: '17d3f143-3304-43bc-8471-fc123ef70181', code: 'UY-MA', url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Flag_of_Maldonado_Department.png' },
    { name: 'Paysandú', uuid: '665a4625-d61b-4e0e-bcff-05db2bbd1d0b', code: 'UY-PA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Paysand%C3%BA_Department.svg' },
    { name: 'Río Negro', uuid: 'd2a09d24-3e6a-491e-ae80-25d41415106e', code: 'UY-RN', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Flag_of_Rio_Negro_Department.svg' },
    { name: 'Rivera', uuid: '12c77d23-c993-43f0-b44f-830bb954849a', code: 'UY-RV', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Flag_of_Rivera_Department.png' },
    { name: 'Rocha', uuid: 'b5bc1204-b2e7-4cf9-af7a-905d2a3d502f', code: 'UY-RO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Rocha_Department.svg' },
    { name: 'Salto', uuid: '26c5c977-c9a5-4b8e-a985-08e4221e0567', code: 'UY-SA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Salto_Department.svg' },
    { name: 'San José', uuid: '95dac740-75da-484f-8094-3d4b547391fe', code: 'UY-SJ', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_San_Jos%C3%A9_Department.svg' },
    { name: 'Soriano', uuid: '41fe82fc-014c-40fa-b8e0-681bda0eaefa', code: 'UY-SO', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Soriano_Department.svg' },
    { name: 'Treinta y Tres', uuid: '94349cbf-8dde-4187-9343-69f6851c78c2', code: 'UY-TT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Treinta_y_Tres_Department.svg' },

    // --- Vanuatu (Provinces) ---
    { name: 'Malampa', uuid: '6bf165e5-0d1a-4915-a165-c658e9f72981', code: 'VU-MAP', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Malampa_Province.svg' },
    { name: 'Pénama', uuid: 'b611b089-2eb1-4399-a0ea-a0aafd421ba4', code: 'VU-PAM', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Penama_Province.svg' },
    { name: 'Sanma', uuid: 'dffab096-50a9-42e2-969e-da0516c6f561', code: 'VU-SAM', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Sanma_Province.svg' },
    { name: 'Shéfa', uuid: 'e743e67e-4881-4bd6-a153-0055ea9f3861', code: 'VU-SEE', url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Flag_of_Shefa_Province.svg' },
    { name: 'Taféa', uuid: 'cfe79620-6684-45cb-9bbd-99741871933f', code: 'VU-TAE', url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Tafea_Province_Flag.svg' },
    { name: 'Torba', uuid: '78a0facb-4039-4c72-9363-b0ec22a815a6', code: 'VU-TOB', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_Torba_Province.png' },

    // --- Venezuela (States) ---
    { name: 'Amazonas', uuid: '606381b2-9f8e-4146-bc92-605ae8fe458a', code: 'VE-Z', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Flag_of_Amazonas_Indigenous_State.svg' },
    { name: 'Anzoátegui', uuid: 'd254f72c-69db-4efd-ae8a-f97bfe3f40eb', code: 'VE-B', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Anzoátegui_State_%28original_version%29.svg' },
    { name: 'Apure', uuid: '52b6f959-14d1-4937-85b4-9e270245480b', code: 'VE-C', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Apure_State.svg' },
    { name: 'Aragua', uuid: 'c87626d5-7514-4ca3-a899-5170595762e6', code: 'VE-D', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Flag_of_Aragua_State.svg' },
    { name: 'Barinas', uuid: '28a6cca3-e00d-437f-b54b-2374616a8d80', code: 'VE-E', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Flag_of_Barinas_State.svg' },
    { name: 'Bolívar', uuid: 'bfa23914-cb3f-45a4-ab87-9f01181a1fb1', code: 'VE-F', url: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Bolívar_State.svg' },
    { name: 'Carabobo', uuid: 'f7c7c7e6-d7e4-445d-852b-00a6e787cb2a', code: 'VE-G', url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Flag_of_Carabobo_State.svg' },
    { name: 'Cojedes', uuid: '0fcb87e8-e491-4bd8-8434-288953e99cba', code: 'VE-H', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Flag_of_Cojedes_State.svg' },
    { name: 'Delta Amacuro', uuid: '5dfc33de-4fcd-45ec-9211-6a39483ac1ba', code: 'VE-Y', url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_Delta_Amacuro_State.svg' },
    { name: 'Falcón', uuid: '0e02a266-6444-444d-b4b7-00d95f97ebca', code: 'VE-I', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Flag_of_Falcón.svg' },
    { name: 'Guárico', uuid: '3f53bfa2-8a5a-4920-a701-4f1ae5324904', code: 'VE-J', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Flag_of_Guárico_State.svg' },
    { name: 'La Guaira', uuid: '747cb307-8872-4f1a-96b4-de847f45cd90', code: 'VE-X', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_La_Guaira_State.svg' },
    { name: 'Lara', uuid: '9b047cfa-9856-4d12-a848-91094039aeee', code: 'VE-K', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Flag_of_Lara_State.svg' },
    { name: 'Mérida', uuid: 'e0fc16ac-997b-420a-a44a-4a7c15b7452b', code: 'VE-L', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Mérida_State.svg' },
    { name: 'Miranda', uuid: 'bd79b189-ff8d-4a47-a907-a49f71ca7fd2', code: 'VE-M', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Bandera_estatal_de_Miranda.svg' },
    { name: 'Monagas', uuid: 'ab33ecc9-9f0e-429a-ab8b-7f156ae1dfc6', code: 'VE-N', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Monagas_State.svg' },
    { name: 'Nueva Esparta', uuid: '01ac40a3-523c-473c-8613-933dca16063e', code: 'VE-O', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Flag_of_Nueva_Esparta.svg' },
    { name: 'Portuguesa', uuid: '4ce54399-1e2a-4173-9dc5-7883646ab955', code: 'VE-P', url: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Flag_of_Portuguesa.svg' },
    { name: 'Sucre', uuid: '26a04c09-1be6-45ea-a7a3-6092efb69d7d', code: 'VE-R', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Sucre_State.svg' },
    { name: 'Táchira', uuid: '8c171f41-da49-4772-981d-cf43dc41a430', code: 'VE-S', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Táchira.svg' },
    { name: 'Trujillo', uuid: 'd9d8131e-9ce7-4077-a43c-8119910cb734', code: 'VE-T', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Flag_of_Trujillo_State.svg' },
    { name: 'Yaracuy', uuid: '7d218f1e-e98c-4f43-a63a-5bd5007b4ddd', code: 'VE-U', url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Flag_of_Yaracuy_State.svg' },
    { name: 'Zulia', uuid: 'f76c356a-1061-4050-bba1-527dc3a941e5', code: 'VE-V', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Flag_of_Zulia_State.svg' },
    // --- Venezuela (Federal Dependency) ---
    { name: 'Dependencias Federales', uuid: '53ee3820-3b6e-4824-9f0d-96f1e973792c', code: 'VE-W', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Federal_dependencies_of_Venezuela%27s_Flag.svg' },
    // --- Venezuela (Capital District) ---
    { name: 'Distrito Federal', uuid: '8a9b85eb-ded0-469b-9bcc-4f224c1d9c28', code: 'VE-A', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Caracas_%282022%29.svg' },
    // --- Venezuela (City) ---
    { name: 'Caracas', uuid: '58ab1035-dbbb-4e58-87f7-210cd0351664', code: 'VE-CRC', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Caracas_%282022%29.svg' },

    // --- Wallis and Futuna (Chiefdoms) ---
    { name: 'Alo', uuid: '6cbe995a-b434-4381-8db1-33f7f25f95c7', code: 'WF-AL', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Alo.svg' },
    { name: 'Sigave', uuid: 'ab05b0bb-83cc-4caa-8129-6d1ce0fa386a', code: 'WF-SG', url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Sigave.svg' },
    { name: 'Uvea', uuid: '0a03d719-6db9-4e12-9c8f-229751dc1a8c', code: 'WF-UV', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_Uvea.svg' }
  ];



  // Narrow skip: only tab-related containers that caused the extra icon previously
  function shouldSkipElement(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.dataset && (el.dataset.hqSkip === 'true' || el.dataset.hqProcessed === 'true')) return true;
    try {
      if (el.closest('.tabs, ul.tabs, .subtabs, .page_tabs, [role="tablist"], .tabs-wrap')) {
        try { el.dataset.hqSkip = 'true'; } catch (e) { /* console.warn('Failed to set hqSkip dataset property:', e); */ }
        return true;
      }
    } catch (e) {
      // swallow
    }
    return false;
  }


  // Create and style inline <img> for flags
  function createFlagImgElement(code, url) {
    if (nodeCache.has(code)) {
      const cachedImg = nodeCache.get(code).cloneNode(true);
      if (cachedImg.src !== url) cachedImg.src = url;
      return cachedImg;
    }
    const img = document.createElement('img');
    img.className = 'mb-hq-flag-img';
    img.setAttribute('data-hq-flag', code);
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.style.setProperty('width', 'auto', 'important');
    img.style.setProperty('height', '11px', 'important');
    img.style.setProperty('display', 'inline-block', 'important');
    img.style.setProperty('vertical-align', 'baseline', 'important');
    img.style.setProperty('margin-left', '0.40em', 'important');
    img.style.setProperty('margin-right', '0.05em', 'important');
    img.style.setProperty('object-fit', 'contain', 'important');
    img.style.setProperty('box-shadow', '0 0 0 1px #ccc', 'important');
    img.style.setProperty('border', 'none', 'important');
    img.src = url;

    nodeCache.set(code, img.cloneNode(true));
    return img;
  }

  function styleExistingImg(img, code, url) {
    img.classList.add('mb-hq-flag-img');
    img.setAttribute('data-hq-flag', code);
    try { img.alt = ''; } catch (e) { console.warn('Failed to set image alt attribute:', e); }
    try { img.setAttribute('aria-hidden', 'true'); } catch (e) { }
    img.style.setProperty('width', 'auto', 'important');
    img.style.setProperty('height', '11px', 'important');
    img.style.setProperty('display', 'inline-block', 'important');
    img.style.setProperty('vertical-align', 'baseline', 'important');
    img.style.setProperty('margin-right', '0.05em', 'important');
    img.style.setProperty('object-fit', 'contain', 'important');
    img.style.setProperty('box-shadow', '0 0 0 1px #ccc', 'important');
    img.style.setProperty('border', 'none', 'important');
    img.src = url;
  }

  // Remove leftover space reserved by background flags (only when it looks like flag-space)
  function removeLegacySpacingIfNeeded(el) {
    try {
      el.style.setProperty('padding-left', '0px', 'important');
      try { el.style.setProperty('padding-inline-start', '0px', 'important'); } catch (e) { }
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
        const hasAnyFlagImg = !!Array.from(el.querySelectorAll('img')).find(i => (i.src || '').includes('/flags/'));
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
  const flagDataMap = new Map(); // code -> url
  const nodeCache = new Map();
  const uuidFlagMap = new Map(); // uuid -> flag object
  const codeFlagMap = new Map(); // code -> flag object

  // Ensure map populated
  function ensureFlagMap() {
    if (flagDataMap.size === 0) {
      ALL_FLAGS_RAW.forEach(c => {
        flagDataMap.set(c.code, c.url);
        uuidFlagMap.set(c.uuid, c);
        codeFlagMap.set(c.code, c);
      });
    }
  }

  // --- Core DOM processing ---
  function processFlags() {
    try {
      ensureFlagMap();
      // Process .flag wrappers
      document.querySelectorAll('.flag:not([data-hq-processed]):not([data-hq-skip])').forEach(el => {
        if (shouldSkipElement(el)) return;

        // If this flag wraps an area link that will be handled by insertFlags, suppress it
        const childAreaLink = el.querySelector('a[href*="/area/"]');
        if (childAreaLink) {
          el.style.setProperty('background-image', 'none', 'important');
          el.style.setProperty('padding', '0', 'important');
          el.style.setProperty('margin', '0', 'important');
          el.dataset.hqProcessed = '1';
          return;
        }

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
      try { console.error('MBHQ: processFlags failed', e); } catch (e2) { }
    }
  }

  const pendingPromises = new Map();

  // applyHQToElement(el, code, markOnSuccess)
  function applyHQToElement(el, code, markOnSuccess) {
    const url = flagDataMap.get(code);
    if (!url) return;
    if (shouldSkipElement(el)) return;

    // Unify execution path for consistency
    Promise.resolve(url.startsWith('data:') ? url : pendingPromises.get(code) || getCachedFlagDB(code).then(cached => {
      if (cached) {
        flagDataMap.set(code, cached);
        return cached;
      }
      const uuidMatch = el.className.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
      const country = uuidMatch ? uuidFlagMap.get(uuidMatch[0]) : codeFlagMap.get(code);
      if (country) {
        fetchAndCache(country, (newData) => {
          flagDataMap.set(country.code, newData);
          updateAllProcessedFlagsForCode(country.code);
        });
      }
      return url;
    })).then(finalUrl => {
      if (el.dataset.hqProcessed === 'true') return;
      _doApplyHQ(el, code, finalUrl, markOnSuccess);
    });
  }

  function _doApplyHQ(el, code, url, markOnSuccess) {
    if (shouldSkipElement(el)) return;

    // Helper to mark processed (on the wrapper or image)
    function markProcessed(node) {
      try {
        if (node && node.nodeType === 1) {
          node.dataset.hqProcessed = 'true';
          node.dataset.hqCode = code;
        }
      } catch (e) { }
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
        try { if ((img.src || '').includes('/flags/')) return true; } catch (e) { }
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
      } catch (e) { }
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
        el.appendChild(img);

        // mark only after successful insertion
        markProcessed(img);
        markProcessed(el);
      } catch (e) {
        // fallback: insert adjacent
        try {
          el.parentNode && el.parentNode.insertBefore(img, el.nextSibling);
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
      el.appendChild(img);

      markProcessed(img);
      markProcessed(el);
    } catch (e) {
      try { el.parentNode && el.parentNode.insertBefore(img, el.nextSibling); markProcessed(img); markProcessed(el); } catch (e2) { /* fail silently */ }
    }
  }

  function updateAllProcessedFlagsForCode(code) {
    const url = flagDataMap.get(code);
    if (!url) return;
    document.querySelectorAll(`[data-hq-processed="true"][data-hq-code="${code}"]`).forEach(el => {
      if (shouldSkipElement(el)) return;
      if (el.tagName === 'IMG') {
        try { el.src = url; } catch (e) { }
        return;
      }
      let img = null;
      try { img = el.querySelector('img.mb-hq-flag-img[data-hq-flag="' + code + '"]') || el.querySelector('img.mb-hq-flag-img') || el.querySelector('img'); } catch (e) { img = null; }
      if (img) {
        if (shouldSkipElement(img)) return;
        try { styleExistingImg(img, code, url); } catch (e) { }
      }
    });
  }

  // --- Caching logic (IndexedDB) ---
  let dbPromise = null;
  function getDB() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open('MusicBrainzRightSideFlags', 1);
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

  function preloadAllCachedFlags() {
    return getDB().then(db => {
      return new Promise((resolve) => {
        try {
          const transaction = db.transaction('flags', 'readonly');
          const store = transaction.objectStore('flags');
          const request = store.getAllKeys();
          const valuesRequest = store.getAll();

          request.onsuccess = () => {
            valuesRequest.onsuccess = () => {
              const keys = request.result;
              const values = valuesRequest.result;
              for (let i = 0; i < keys.length; i++) {
                flagDataMap.set(keys[i], values[i]);
              }
              resolve();
            };
            valuesRequest.onerror = () => resolve();
          };
          request.onerror = () => resolve();
        } catch (e) { resolve(); }
      });
    }).catch(() => null);
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
    }).catch(() => { });
  }

  function clearOldLocalStorageCache() {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mb_hq_flag_cache_')) localStorage.removeItem(key);
      }
    } catch (e) { }
  }

  function fetchAndCache(country, callback) {
    if (pendingPromises.has(country.code)) return;
    const promise = new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: country.url,
        responseType: 'blob',
        onload: function (response) {
          if (response.status >= 200 && response.status < 300) {
            const reader = new FileReader();
            reader.onloadend = () => {
              try {
                if (typeof reader.result === 'string') {
                  setCachedFlagDB(country.code, reader.result);
                  if (callback) callback(reader.result);
                  resolve(reader.result);
                }
              } catch (e) { reject(e); } // Propagate error
            };
            reader.readAsDataURL(response.response);
          } else {
            reject(new Error(`HTTP error! status: ${response.status}`));
          }
        },
        onerror: function (error) { reject(error); }
      });
    }).finally(() => { pendingPromises.delete(country.code); });
    pendingPromises.set(country.code, promise);

    GM_xmlhttpRequest({
      method: 'GET',
      url: country.url,
      responseType: 'blob',
      onload: function (response) {
        if (response.status >= 200 && response.status < 300) {
          const reader = new FileReader();
          reader.onloadend = () => {
            try {
              if (typeof reader.result === 'string') {
                setCachedFlagDB(country.code, reader.result);
                if (callback) callback(reader.result);
              }
            } catch (e) { } finally {
              try { pendingPromises.delete(country.code); } catch (e) { }
            }
          };
          reader.readAsDataURL(response.response);
        } else {
          try { pendingPromises.delete(country.code); } catch (e) { }
        }
      },
      onerror: function () { try { pendingPromises.delete(country.code); } catch (e) { } }
    });
  }

  function markHidden(el) {
    try {
      if (!el || !el.style) return;
      if (el.dataset && el.dataset.mbFlag === '1') return; // never hide our own nodes
      if (!el.dataset.mbFlagHidden) {
        el.dataset.mbFlagOrigDisplay = el.style.display || '';
        el.dataset.mbFlagHidden = '1';
        el.style.display = 'none';
      }
    } catch (e) { /* ignore */ }
  }

  function restoreHiddenSiteIcons(container) {
    try {
      const parent = container && container.parentNode ? container.parentNode : null;
      if (!parent || parent.nodeType !== Node.ELEMENT_NODE) return;
      const hidden = parent.querySelectorAll && parent.querySelectorAll('[data-mb-flag-hidden="1"]');
      if (!hidden) return;
      hidden.forEach(h => {
        try {
          const el = h;
          const orig = el.dataset.mbFlagOrigDisplay;
          if (typeof orig === 'string') el.style.display = orig;
          else el.style.removeProperty('display');
          delete el.dataset.mbFlagHidden;
          delete el.dataset.mbFlagOrigDisplay;
        } catch (e) { }
      });
    } catch (e) { console.warn('restoreHiddenSiteIcons error', e); }
  }
  function hideAdjacentSiteIcons(link, instanceId) {
    try {
      if (!link) return;

      const markHidden = (n) => {
        if (!n) return;
        if (instanceId) n.dataset.mfeHiddenId = instanceId;
        if (n.style) n.style.setProperty('display', 'none', 'important');
      };

      const isIconOnly = (el) => {
        if (!el) return false;
        // If any visible text node exists, not icon-only
        for (const node of Array.from(el.childNodes || [])) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) return false;
        }
        // If any descendant is not an icon-like element, then not icon-only
        const nonIcon = Array.from(el.querySelectorAll('*')).some(d => {
          if (d.dataset && d.dataset.mbFlag === '1') return false; // ignore our nodes
          const cls = (d.className || '').toString();
          const tag = (d.tagName || '').toUpperCase();
          const isIconLike =
            cls.includes('area-icon') ||
            cls.includes('type-icon') ||
            cls.includes('arealink') ||
            cls.includes('flag') ||
            tag === 'IMG' ||
            tag === 'SVG';
          return !isIconLike;
        });
        return !nonIcon;
      };

      // 1) Hide icons inside the link itself
      try {
        if (link.nodeType === Node.ELEMENT_NODE) {
          const img = link.querySelector && (link.querySelector('img.mb-hq-flag-img') || link.querySelector('span.flag img') || link.querySelector('img[src*="/flags/"]'));
          if (img && !(img.dataset && img.dataset.mbFlag === '1')) markHidden(img);
        }
      } catch (e) { }

      // 2) Scan backwards from link, stop at comma or another <a>
      let prev = link.previousSibling;
      while (prev) {
        if (prev.nodeType === Node.TEXT_NODE && prev.nodeValue.includes(',')) break;
        if (prev.nodeType === Node.ELEMENT_NODE && prev.tagName === 'A') break;

        if (prev.nodeType === Node.ELEMENT_NODE) {
          if (prev.classList.contains('flag') && !prev.querySelector('a')) markHidden(prev);
          if (prev.tagName === 'IMG' && prev.src && prev.src.includes('/flags/')) markHidden(prev);

          prev.querySelectorAll && prev.querySelectorAll('span.flag, img.mb-hq-flag-img, img[src*="/flags/"]').forEach(d => {
            if (d.dataset && d.dataset.mbFlag === '1') return;
            if (d.classList.contains('flag') && d.querySelector('a')) return;
            markHidden(d);
          });
        }
        prev = prev.previousSibling;
      }

      // 3) Scan forwards from link, stop at comma or another <a>
      let nxt = link.nextSibling;
      while (nxt) {
        if (nxt.nodeType === Node.TEXT_NODE && nxt.nodeValue.includes(',')) break;
        if (nxt.nodeType === Node.ELEMENT_NODE && nxt.tagName === 'A') break;

        if (nxt.nodeType === Node.ELEMENT_NODE) {
          if (nxt.classList.contains('flag') && !nxt.querySelector('a')) markHidden(nxt);
          if (nxt.tagName === 'IMG' && nxt.src && nxt.src.includes('/flags/')) markHidden(nxt);

          nxt.querySelectorAll && nxt.querySelectorAll('span.flag, img.mb-hq-flag-img, img[src*="/flags/"]').forEach(d => {
            if (d.dataset && d.dataset.mbFlag === '1') return;
            if (d.classList.contains('flag') && d.querySelector('a')) return;
            markHidden(d);
          });
        }
        nxt = nxt.nextSibling;
      }
    } catch (e) {
      console.warn('hideAdjacentSiteIcons error', e);
    }
  }

  // --- DOM Manipulation & insertion ---

  function nukeIconsAndSpaces(el) {
    try { restoreHiddenSiteIcons(el); } catch (e) { }
    try { el.querySelectorAll && el.querySelectorAll('span.area-icon[data-mb-flag="1"]').forEach(n => n.remove()); } catch (e) { }
    let prev = el.previousSibling;
    while (prev) {
      let toKill = prev;
      prev = prev.previousSibling;
      if (toKill.nodeType === Node.TEXT_NODE && /^[\s\u00A0]*$/.test(toKill.nodeValue || '')) {
        continue;
      } else if (toKill.nodeType === Node.ELEMENT_NODE) {
        const elNode = toKill;
        if (elNode.dataset && elNode.dataset.mbFlag === '1') elNode.remove();
        else break;
      } else break;
    }
  }


  function insertFlags() {
    if (window.location.pathname.includes('/area/')) {
      const uuidMatch = window.location.pathname.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
      const pageMatch = uuidMatch ? uuidFlagMap.get(uuidMatch[0]) : undefined;
      if (pageMatch) {
        document.querySelectorAll('h1').forEach(headingEl => {
          const heading = headingEl;
          const typeIcon = heading.querySelector('.type-icon');
          if (typeIcon) typeIcon.style.setProperty('display', 'none', 'important');

          if (heading.dataset.flagProcessed || heading.querySelector(`a[href*="/area/"]`)) return;
          heading.dataset.flagProcessed = '1';
          let bdi = heading.querySelector('bdi');
          let textNode = Array.from(heading.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim() !== '');
          let target = bdi || textNode || heading;
          if (target.parentElement) nukeIconsAndSpaces(target.parentElement);
          const finalUrl = flagDataMap.get(pageMatch.code) || pageMatch.url;
          const iconSpan = createFlagImgElement(pageMatch.code, finalUrl);
          iconSpan.dataset.mbFlag = "1";
          if (target === heading) {
            heading.appendChild(iconSpan);
          } else if (target.parentNode) {
            let walk = target.nextSibling;
            while (walk) {
              if (walk.nodeType === Node.TEXT_NODE) {
                if (/^\s+/.test(walk.nodeValue)) walk.nodeValue = walk.nodeValue.replace(/^\s+/, '');
                if (walk.nodeValue.length === 0) { walk = walk.nextSibling; continue; }
                break;
              } else if (walk.nodeType === Node.COMMENT_NODE) {
                walk = walk.nextSibling;
              } else break;
            }
            const wrapper = document.createElement('span');
            wrapper.style.whiteSpace = 'nowrap';
            wrapper.className = 'mfe-flag-wrapper';
            target.parentNode.insertBefore(wrapper, target);
            wrapper.appendChild(target);
            wrapper.appendChild(iconSpan);
          }
        });
      }
    }

    document.querySelectorAll('a[href*="/area/"]').forEach(linkEl => {
      const link = linkEl;
      if (link.dataset.flagProcessed) return;
      if (link.closest('.tabs') || link.closest('.external_links')) { link.dataset.flagProcessed = '1'; return; }

      const rawText = link.textContent.replace(/[\s\u200B-\u200F\u202A-\u202E\uFEFF]/g, '');
      if (rawText.length < 2) return;

      if (link.classList.contains('flag') || link.closest('.area-icon') || link.closest('.type-icon') || link.querySelector('img')) {
        link.dataset.flagProcessed = '1';
        return;
      }

      const isDirectAreaLink = new RegExp(`/area/[a-f0-9-]{36}(/?|\\?.*|#.*)$`, 'i').test(link.href);
      if (!isDirectAreaLink) {
        link.dataset.flagProcessed = '1';
        return;
      }

      link.dataset.flagProcessed = '1';

      const uuidMatch = link.href.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
      const match = uuidMatch ? uuidFlagMap.get(uuidMatch[0]) : undefined;

      let instanceId = null;
      if (match) {
        instanceId = Math.random().toString(36).substr(2, 9);
        hideAdjacentSiteIcons(link, instanceId);
        nukeIconsAndSpaces(link);
      }

      let linkWrapper = link;
      if (linkWrapper.parentElement && linkWrapper.parentElement.classList.contains('arealink')) {
        linkWrapper = linkWrapper.parentElement;
      }

      let hasGlobe = false;
      let wrapStartNode = linkWrapper;
      const enclosingArealink = link.closest('.arealink');
      if (enclosingArealink) {
        // Clean up any native trailing whitespace inside arealink that pushes commas away
        let lastChild = enclosingArealink.lastChild;
        while (lastChild && lastChild.nodeType === Node.TEXT_NODE && /^[\s\u00A0\n]*$/.test(lastChild.nodeValue || '')) {
          let toRemove = lastChild;
          lastChild = lastChild.previousSibling;
          toRemove.remove();
        }

        const nativeGlobe = enclosingArealink.querySelector('.area-icon, img[src*="area.svg"]');
        if (nativeGlobe) {
          hasGlobe = true;
          const flagParent = nativeGlobe.closest('.flag');
          wrapStartNode = (flagParent && enclosingArealink.contains(flagParent)) ? flagParent : nativeGlobe;
        }
      }

      if (!hasGlobe) {
        let p = linkWrapper.previousSibling;
        while (p && p.nodeType === Node.TEXT_NODE && /^[\s\u00A0]*$/.test(p.nodeValue || '')) p = p.previousSibling;
        if (p && p.nodeType === Node.ELEMENT_NODE && (
          p.classList.contains('arealink') ||
          p.classList.contains('area-icon') ||
          (p.tagName === 'IMG' && p.src && p.src.includes('area.svg')) ||
          (p.classList.contains('flag') && p.querySelector('.area-icon, img[src*="area.svg"]'))
        )) {
          hasGlobe = true;
          wrapStartNode = p;
        }
      }

      if (!hasGlobe && !link.closest('h1')) {
        linkWrapper.classList.add('arealink');
        linkWrapper.dataset.mbFlag = '1';
        wrapStartNode = linkWrapper;
      }

      let targetNode = linkWrapper;
      let nxt = targetNode.nextSibling;
      if (nxt && nxt.nodeType === Node.TEXT_NODE && /^[\s\u00A0]*$/.test(nxt.nodeValue || '')) {
        targetNode = nxt;
        nxt = nxt.nextSibling;
      }
      if (nxt && nxt.nodeType === Node.ELEMENT_NODE && (nxt.classList.contains('comment') || nxt.classList.contains('disambiguation'))) {
        targetNode = nxt;
        nxt = nxt.nextSibling;
      }
      if (nxt && nxt.nodeType === Node.TEXT_NODE && /^[\s\u00A0]*,/.test(nxt.nodeValue || '')) {
        // If there's a comma right after the comment/link, include it in the wrap!
        // We'll split the text node to only include up to the comma, so trailing spaces can still wrap natively if needed
        const commaIndex = nxt.nodeValue.indexOf(',');
        if (commaIndex !== -1 && commaIndex + 1 < nxt.nodeValue.length) {
          nxt.splitText(commaIndex + 1);
        }
        targetNode = nxt;
      }

      let iconSpan = null;
      if (match) {
        const finalUrl = flagDataMap.get(match.code) || match.url;
        iconSpan = createFlagImgElement(match.code, finalUrl);
        iconSpan.dataset.mbFlag = "1";
        iconSpan.dataset.targetUuid = match.uuid;
        iconSpan.dataset.instanceId = instanceId;
      }

      if (linkWrapper.parentNode) {
        const wrapper = document.createElement('span');
        wrapper.className = 'mfe-flag-wrapper';
        wrapper.style.whiteSpace = 'nowrap';

        wrapStartNode.parentNode.insertBefore(wrapper, wrapStartNode);

        let curr = wrapStartNode;
        let spaceCount = 0;
        let commaNode = null;
        if (targetNode.nodeType === Node.TEXT_NODE && /^[\s\u00A0]*,/.test(targetNode.nodeValue || '')) {
          commaNode = targetNode;
        }

        while (curr) {
          let next = curr.nextSibling;

          // Standardize spaces between globe and text
          if (curr.nodeType === Node.TEXT_NODE && /^[\s\u00A0]+$/.test(curr.nodeValue)) {
            let prevNode = curr.previousSibling;
            let prevIsNoSpaceNode = prevNode && prevNode.nodeType === Node.ELEMENT_NODE && (
              prevNode.classList.contains('arealink') ||
              prevNode.classList.contains('flag')
            );

            if (spaceCount > 0 || curr === wrapStartNode || next === null || prevIsNoSpaceNode) {
              // Remove redundant spaces
              if (curr.parentNode) curr.parentNode.removeChild(curr);
              curr = next;
              continue;
            } else {
              curr.nodeValue = '\u00A0';
              spaceCount++;
            }
          } else if (curr.nodeType === Node.ELEMENT_NODE) {
            spaceCount = 0;
          }

          if (iconSpan && curr === commaNode) {
            wrapper.appendChild(iconSpan);
            iconSpan = null; // Prevent appending again at the end
          }

          wrapper.appendChild(curr);
          if (curr === targetNode) break;
          curr = next;
        }

        if (iconSpan) {
          wrapper.appendChild(iconSpan);
        }
      }
    });
  }

  function cleanupOrphanedFlags() {
    document.querySelectorAll('span.area-icon[data-mb-flag="1"]').forEach(icon => {
      const targetUuid = icon.dataset.targetUuid;
      if (!targetUuid) return;

      let next = icon.nextSibling;
      let foundLink = false;
      // Iterate through siblings to find the associated link
      // The limit of 3 is arbitrary and might need adjustment based on expected DOM structure
      for (let i = 0; i < 5 && next; i++) { // Increased limit for robustness
        if (next.nodeType === Node.ELEMENT_NODE) {
          if (next.tagName === 'A' && next.href && next.href.includes(targetUuid)) {
            foundLink = true;
          }
          break;
        }
        next = next.nextSibling;
      }

      if (!foundLink) {
        console.log(`[DEBUG MFE] Removing orphaned flag for ${targetUuid}`);
        const instanceId = icon.dataset.instanceId;
        icon.remove();

        if (instanceId) {
          document.querySelectorAll(`[data-mfe-hidden-id="${instanceId}"]`).forEach(n => {
            n.style.removeProperty('display');
            delete n.dataset.mfeHiddenId;
          });
        }
      }
    });
  }

  // --- Init + observer (throttle) ---
  function injectLoadingStyle() {
    if (document.getElementById('mfe-loading-style')) return;
    const style = document.createElement('style');
    style.id = 'mfe-loading-style';
    style.textContent = `
      .flag:not([data-hq-processed]):not([data-hq-skip]) { background-image: none !important; }
      img[src*="/flags/"]:not([data-hq-processed]):not([data-hq-skip]) { display: none !important; }

      /* Ensure flags and area links do not wrap across lines */
      .mfe-flag-wrapper {
          display: inline !important;
          white-space: nowrap !important;
      }
      .mfe-flag-wrapper * {
          white-space: nowrap !important;
      }
      .mfe-flag-wrapper a.arealink {
          display: inline-block !important;
      }
      .release-country .mfe-flag-wrapper {
          margin-right: 0.4em !important;
      }
    `;
    if (document.head) document.head.appendChild(style);
  }

  function aggressiveInit() {
    clearOldLocalStorageCache();
    clearStaleProcessedMarkers();
    ensureFlagMap();

    injectLoadingStyle();

    preloadAllCachedFlags().then(() => {
      processFlags();
      insertFlags();
      cleanupOrphanedFlags();

      let timeoutId;
      const observer = new MutationObserver(() => {
        injectLoadingStyle();
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          try { processFlags(); insertFlags(); cleanupOrphanedFlags(); } catch (e) { console.error('MBHQ: MutationObserver callback failed', e); }
        }, 100); // Debounce by 100ms
      });

      observer.observe(document.documentElement, { childList: true, subtree: true });
    });

    try { window.MBHQ_processFlags = processFlags; } catch (e) { }
  }

  aggressiveInit();

})();
