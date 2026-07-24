// ==UserScript==
// @name         MusicBrainz: More Flags Everywhere
// @namespace    https://musicbrainz.org/
// @version      2026-07-23.2248
// @description  Shows flags of areas that aren't countries on MusicBrainz.
// @downloadURL  https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_More_Flags_Everywhere.user.js
// @updateURL    https://github.com/Lotheric/metabrainz-userscripts/raw/refs/heads/main/MusicBrainz_More_Flags_Everywhere.user.js
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
   * @typedef {Object} Region
   * @property {string} name - The human-readable name of the region.
   * @property {string} uuid - The MusicBrainz Area UUID for precise matching.
   * @property {string} code - The short code (e.g., CA-QC, US-AL, ES-AN).
   * @property {string} url - The URL to the official Wikimedia flag SVG.
   */

  /** @type {Region[]} */
  const REGIONS = [
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
    { name: 'Luxembourg', uuid: '76598a03-cf08-4c03-9a73-ab6edcde6849', code: 'BE-WLX', url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Official_flag_of_the_Arelerland.svg' },
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

    // --- United Kingdom (Countries) ---
    { name: 'England', uuid: '9d5dd675-3cf4-4296-9e39-67865ebee758', code: 'GB-ENG', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_England.svg' },
    { name: 'Northern Ireland', uuid: '2b30f961-ed7c-40d2-a9c5-6a905b35439a', code: 'GB-NIR', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ulster_banner.svg' },
    { name: 'Scotland', uuid: '6fa1c7da-6689-4cec-85f9-680f853e8a08', code: 'GB-SCT', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Scotland.svg' },
    { name: 'Wales', uuid: '8297708c-5743-47d6-a5ac-f40a41c49ad9', code: 'GB-WLS', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Wales.svg' },

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
    { name: 'Georgia', uuid: 'd10ba752-c9ce-4804-afc0-7ff94aa5d8d6', code: 'US-GA', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_the_State_of_Georgia.svg' },
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
    { name: 'Washington D.C.', uuid: 'af59135f-38b5-4ea4-b4e2-dd28c5f0bad7', code: 'US-DC', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Washington%2C_D.C.svg' }
  ];

  const css = `
    img.flag-custom-region {
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

  // --- Caching Logic ---

  /**
   * @param {string} code
   * @returns {string | null}
   */
  function getCachedFlag(code) {
    try {
      return localStorage.getItem('mb_flag_cache_' + code);
    } catch (e) {
      return null;
    }
  }

  /**
   * @param {Region} match
   */
  function fetchAndCache(match) {
    const fetchingKey = 'mb_flag_fetching_' + match.code;
    const cacheKey = 'mb_flag_cache_' + match.code;

    try {
      if (sessionStorage.getItem(fetchingKey)) return;
      sessionStorage.setItem(fetchingKey, '1');
    } catch (e) {}

    fetch(match.url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
      })
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            if (typeof reader.result === 'string') {
              localStorage.setItem(cacheKey, reader.result);
            }
          } catch (e) {
            console.warn('Could not save flag to localStorage', e);
          } finally {
            try { sessionStorage.removeItem(fetchingKey); } catch (e) {}
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => {
        console.error(`Error fetching flag for ${match.name}:`, err);
        try { sessionStorage.removeItem(fetchingKey); } catch (e) {}
      });
  }

  // --- DOM Manipulation ---

  /**
   * @param {Element} el
   */
  function nukeIconsAndSpaces(el) {
    el.querySelectorAll('.area-icon, .type-icon, .arealink').forEach(n => n.remove());

    let prev = el.previousSibling;
    while (prev) {
      let toKill = prev;
      prev = prev.previousSibling;

      if (toKill.nodeType === Node.TEXT_NODE && /^[\s\u00A0]*$/.test(toKill.nodeValue || '')) {
        if (toKill.parentNode) toKill.parentNode.removeChild(toKill);
      } else if (toKill.nodeType === Node.ELEMENT_NODE) {
        const elNode = /** @type {Element} */ (toKill);
        if (elNode.classList.contains('area-icon') ||
            elNode.classList.contains('type-icon') ||
            elNode.classList.contains('arealink') ||
            (elNode.tagName === 'SPAN' && (!elNode.textContent || !elNode.textContent.trim()))) {
          elNode.remove();
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }

  /**
   * @param {Region} match
   * @returns {HTMLSpanElement}
   */
  function createFlagIcon(match) {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'area-icon';

    const img = document.createElement('img');
    img.className = 'flag flag-custom-region';

    const cachedSrc = getCachedFlag(match.code);
    if (cachedSrc) {
      img.src = cachedSrc;
    } else {
      img.src = match.url;
      fetchAndCache(match);
    }

    img.alt = match.name;
    img.title = match.name;

    iconSpan.appendChild(img);
    return iconSpan;
  }

  function insertFlags() {
    if (window.location.pathname.includes('/area/')) {
      const pageMatch = REGIONS.find(p => window.location.pathname.includes(p.uuid));

      if (pageMatch) {
        document.querySelectorAll('h1').forEach(/** @param {Element} headingEl */ (headingEl) => {
          const heading = /** @type {HTMLElement} */ (headingEl);
          if (heading.dataset.flagProcessed || heading.querySelector(`a[href*="/area/"]`)) return;

          heading.dataset.flagProcessed = '1';

          let bdi = heading.querySelector('bdi');
          let textNode = Array.from(heading.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim() !== '');

          /** @type {Element | Node} */
          let target = bdi || textNode || heading;

          if (target.parentElement) nukeIconsAndSpaces(target.parentElement);

          const iconSpan = createFlagIcon(pageMatch);

          if (target === heading) {
              heading.prepend(document.createTextNode(' '));
              heading.prepend(iconSpan);
          } else if (target.parentNode) {
              target.parentNode.insertBefore(iconSpan, target);
              target.parentNode.insertBefore(document.createTextNode(' '), target);
          }
        });
      }
    }

    document.querySelectorAll('a[href*="/area/"]').forEach(/** @param {Element} linkEl */ (linkEl) => {
      const link = /** @type {HTMLAnchorElement} */ (linkEl);
      if (link.dataset.flagProcessed) return;

      if (link.closest('.tabs')) {
        link.dataset.flagProcessed = '1';
        return;
      }

      const match = REGIONS.find(p => {
        const regex = new RegExp(`/area/${p.uuid}(/?|\\?.*|#.*)$`, 'i');
        return regex.test(link.href);
      });

      if (match) {
        link.dataset.flagProcessed = '1';

        /** @type {Element} */
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
