// ==UserScript==
// @name         MusicBrainz: Right Side Flags Everywhere
// @namespace    https://github.com/Lotheric/metabrainz-userscripts/
// @version      2026-09-11.2035
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
    { name: 'Charlottetown', uuid: '17b6837b-bd65-4ad9-8440-c28794348704', code: 'CA-PE-CHA', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Charlottetown.svg' },
    { name: 'Halifax', uuid: 'd5210692-e55c-4111-9517-5d798cf172cd', code: 'CA-NS-HFX', url: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Halifax_Flag.svg' },
    { name: 'Hamilton', uuid: 'c45dab1e-8cb1-4ca3-af6c-0762c590f333', code: 'CA-QC-HAM', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Hamilton.svg' },
    { name: 'Montréal', uuid: 'c3cc624e-b963-49cf-ad0b-e318cb341963', code: 'CA-QC-MTL', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Flag_of_Montreal.svg' },
    { name: 'Ottawa', uuid: 'bbc88d72-1f32-4936-8dc6-b62b3318e1c4', code: 'CA-QC-OTT', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Ottawa%2C_Ontario.svg' },
    { name: 'Québec', uuid: 'e1804252-7413-4a4d-a34d-d21a8e8e752b', code: 'CA-QC-QUE', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Flag_of_Quebec_City.svg' },
    { name: 'Regina', uuid: 'f2855648-5890-4942-b248-f8ca0d5e2a89', code: 'CA-SK-REG', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Flag_of_Regina.svg' },
    { name: 'Toronto', uuid: '74b24e62-d2fe-42d2-9d96-31f2da756c77', code: 'CA-ON-TOR', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Toronto%2C_Canada.svg' },
    { name: 'Vancouver', uuid: '6ccc62d1-bdd8-4f08-8fae-bfaa5310e5ef', code: 'CA-ON-VAN', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag_of_Vancouver.svg' },
    { name: 'Winnipeg', uuid: '35307acf-aba0-4ca7-9df6-b9398d873a8f', code: 'CA-ON-WPG', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Flag_of_Winnipeg.svg' },

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

    // --- Slovakia (Regions) ---
    { name: 'Banskobystrický kraj', uuid: '9fc6ee0c-980a-4c41-9616-55ee8521874d', code: 'SK-BC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Banskobystricky_vlajka.svg' },
    { name: 'Bratislavský kraj', uuid: '7e6e18c7-5ca0-49e6-8755-3fdfb46ba684', code: 'SK-BL', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bratislavsky_vlajka.svg' },
    { name: 'Košický kraj', uuid: 'b02d061a-c961-4c3e-8841-3a754c492386', code: 'SK-KI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kosicky_vlajka.svg' },
    { name: 'Nitriansky kraj', uuid: '4c223d65-0cb6-4279-8d0b-c99ec4b4341b', code: 'SK-NI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nitriansky_vlajka.svg' },
    { name: 'Prešovský kraj', uuid: 'bab8b52c-8e47-453f-9e50-df8898aa97aa', code: 'SK-PV', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Presovsky_vlajka.svg' },
    { name: 'Trenčiansky kraj', uuid: '08affe0c-f350-4567-866b-75b1cd352219', code: 'SK-TC', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Trenciansky_vlajka.svg' },
    { name: 'Trnavský kraj', uuid: 'af74bfa5-35cc-451b-8e94-12aa83645647', code: 'SK-TA', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Trnavsky_vlajka.svg' },
    { name: 'Žilinský kraj', uuid: 'c21410fe-17d0-43f2-8c53-a44f1c350612', code: 'SK-ZI', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Zilinsky_vlajka.svg' },

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
    // --- United States (Cities) ---
    { name: 'Atlanta', uuid: '26e0e534-19ea-4645-bfb3-1aa4e83a4046', code: 'US-GA-ATL', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_Atlanta.svg' },
    { name: 'Austin', uuid: '58d2816b-daf9-4fc5-962c-06967f14a5e5', code: 'US-TX-ATX', url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Flag_of_Austin%2C_Texas.svg' },
    { name: 'Baltimore', uuid: '2fb5445d-3987-49fe-957a-f730a7acc4a2', code: 'US-MD-BAL', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Baltimore%2C_Maryland.svg' },
    { name: 'Boston', uuid: 'e331bfdf-b908-429c-a79b-710cf9c06abb', code: 'US-MA-BOS', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Boston.svg' },
    { name: 'Charlotte', uuid: 'a647136e-1680-4456-bd3a-750752331141', code: 'US-NC-CLT', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_Charlotte%2C_North_Carolina.svg' },
    { name: 'Chicago', uuid: '29a709d8-0320-493e-8d0c-f2c386662b7f', code: 'US-IL-CHI', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Chicago%2C_Illinois.svg' },
    { name: 'Cincinnati', uuid: 'b2cf490f-a8a7-4875-a1b7-addede3b327f', code: 'US-OH-CIN', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Cincinnati%2C_Ohio.svg' },
    { name: 'Cleveland', uuid: '7b2ca1e7-e7f6-4155-881d-c660a45c11e8', code: 'US-OH-CLE', url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Flag_of_Cleveland%2C_Ohio.svg' },
    { name: 'Columbus', uuid: '18187bcb-18e6-4075-903e-fb976db17a55', code: 'US-OH-COL', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag_of_Columbus%2C_Ohio.svg' },
    { name: 'Dallas', uuid: 'e96f1c0d-721b-470d-a9c4-0aa2d89cf9e7', code: 'US-TX-DAL', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Dallas.svg' },
    { name: 'Denver', uuid: 'fc1aee9a-f1a8-45dc-8820-af6b5d7f7450', code: 'US-CO-DEN', url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Flag_of_Denver%2C_Colorado.svg' },
    { name: 'Detroit', uuid: 'b03ff310-d8e2-45cf-9455-769f76641eb2', code: 'US-MI-DET', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Detroit.svg' },
    { name: 'Houston', uuid: 'c920948b-83e3-40b7-8fe9-9ab5abaac55b', code: 'US-TX-HOU', url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Flag_of_Houston_Texas.svg' },
    { name: 'Indianapolis', uuid: '3bb238a4-c2a4-44e5-9843-a63e71b17e83', code: 'US-IN-IND', url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Indianapolis.svg' },
    { name: 'Jacksonville', uuid: '92d87c63-fc98-46cb-b3a6-a75a4b67d1cf', code: 'US-FL-JKS', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Jacksonville%2C_Florida.svg' },
    { name: 'Kansas City', uuid: 'c1fc21db-40e9-47f5-af93-f3ebe6581113', code: 'US-MO-KC', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Kansas_City%2C_Missouri.svg' },
    { name: 'Las Vegas', uuid: 'cd22d0ba-c79b-45b3-a8e0-617b240df5f0', code: 'US-NV-LV', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Flag_of_Las_Vegas%2C_Nevada.svg' },
    { name: 'Los Angeles', uuid: '1f40c6e1-47ba-4e35-996f-fe6ee5840e62', code: 'US-CA-LA', url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Flag_of_Los_Angeles%2C_California.svg' },
    { name: 'New Orleans', uuid: '3c5a0506-d852-4e96-8d1e-d8126328f3be', code: 'US-LA-NO', url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_New_Orleans%2C_Louisiana.svg' },
    { name: 'New York City', uuid: '74e50e58-5deb-4b99-93a2-decbb365c07f', code: 'US-NY-NYC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_New_York_City.svg' },
    { name: 'Miami', uuid: '4a9aeb42-3763-4234-8fb8-1167ac1dfdfe', code: 'US-FL-MIA', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Miami%2C_Florida.svg' },
    { name: 'Minneapolis', uuid: '3e80aaa7-9b71-450f-8147-0ecf101d8f1a', code: 'US-MN-MIN', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Minneapolis.svg' },
    { name: 'Nashville', uuid: 'e68879f9-bd95-41ff-96ba-c082ff37cc74', code: 'US-TN-NSH', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Nashville.png' },
    { name: 'Orlando', uuid: 'ec1e55f4-03df-4ba1-a314-1ab959aa3fd6', code: 'US-FL-ORL', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Orlando%2C_Florida.svg' },
    { name: 'Philadelphia', uuid: '0eeb01c2-6e31-46ad-96b8-319749f731d2', code: 'US-PA-PHI', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Flag_of_Philadelphia%2C_Pennsylvania.svg' },
    { name: 'Phoenix', uuid: '7f1c8f3f-69a9-454a-8633-c3d3a628858b', code: 'US-AZ-PHX', url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Flag_of_Phoenix%2C_Arizona.svg' },
    { name: 'Pittsburgh', uuid: '787abc26-28ce-44f8-a2d1-82d86b5d28a8', code: 'US-PA-PIT', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Flag_of_Pittsburgh%2C_Pennsylvania.svg' },
    { name: 'Portland', uuid: '2b748d6e-bc1c-4434-9f7b-ecd6332bc557', code: 'US-OR-POR', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Portland%2C_Oregon.svg' },
    { name: 'Raleigh', uuid: '3f8828b9-ba93-4604-9b92-1f616fa1abd1', code: 'US-NC-RAL', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Flag_of_Raleigh%2C_North_Carolina.svg' },
    { name: 'Sacramento', uuid: '21879fba-fe4e-4dbc-99e8-cad9142e5618', code: 'US-CA-SAC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Flag_of_Sacramento%2C_California.svg' },
    { name: 'Salt Lake City', uuid: 'e5936529-76b1-449e-a2e9-6ed98fe8d0d9', code: 'US-UT-SLC', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Salt_Lake_City_%282020%29.svg' },
    { name: 'San Antonio', uuid: 'a6f7157a-bfab-49e8-a22b-240ade4552ca', code: 'US-TX-SA', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Flag_of_San_Antonio%2C_Texas.svg' },
    { name: 'San Diego', uuid: '82f3a697-ba65-404d-a1ed-360147af7d10', code: 'US-CA-SD', url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_San_Diego%2C_California.svg' },
    { name: 'San Francisco', uuid: '83f22bb6-4631-443c-bace-9fae8540362a', code: 'US-CA-SF', url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Flag_of_San_Francisco%2C_California.svg' },
    { name: 'San Juan', uuid: 'c3503bb7-f32d-4536-a1af-b2623f54ab4f', code: 'US-PR-SJ', url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_San_Juan%2C_Puerto_Rico.svg' },
    { name: 'Seattle', uuid: '10adc6b5-63bf-4b4e-993e-ed83b05c22fc', code: 'US-WA-SEA', url: 'https://upload.wikimedia.org/wikipedia/en/6/6d/Flag_of_Seattle.svg' },
    { name: 'St. Louis', uuid: '759f9567-9107-40ef-a825-e57824a62e70', code: 'US-MO-SL', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_St._Louis%2C_Missouri.svg' },
    { name: 'Tampa', uuid: 'ff21865c-ce46-4417-967c-a3d2d02d29bf', code: 'US-FL-TB', url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_Tampa%2C_Florida.svg' },

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
    { name: 'Treinta y Tres', uuid: '94349cbf-8dde-4187-9343-69f6851c78c2', code: 'UY-TT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Treinta_y_Tres_Department.svg' }
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
        if (toKill.parentNode) toKill.parentNode.removeChild(toKill);
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
      if (linkWrapper.parentElement && (linkWrapper.parentElement.classList.contains('arealink') || linkWrapper.parentElement.tagName === 'BDI' || linkWrapper.parentElement.tagName === 'BDO')) {
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
