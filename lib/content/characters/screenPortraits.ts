/**
 * Retratos procedentes de las fichas "On Screen" de la guía oficial de Marvel.
 * Se centralizan aquí para que el catálogo no vuelva a mezclar arte de cómic con
 * las encarnaciones audiovisuales de los personajes.
 */
const screenPortraits: Readonly<Record<string, string>> = {
  "ant-man": "https://cdn.marvel.com/content/2x/010ant_ons_cut_dsk_01_1.webp",
  "black-widow": "https://cdn.marvel.com/content/1x/011blw_ons_crd_04.webp",
  "captain-america": "https://cdn.marvel.com/content/1x/003cap_ons_crd_03.webp",
  "captain-marvel": "https://cdn.marvel.com/content/2x/008cmv_ons_mas_dsk_03_0.webp",
  gamora: "https://cdn.marvel.com/content/1x/022gam_ons_crd_02.webp",
  groot: "https://cdn.marvel.com/content/1x/024grt_ons_crd_02.webp",
  hulk: "https://cdn.marvel.com/content/1x/006hbb_ons_crd_03.webp",
  hawkeye: "https://cdn.marvel.com/content/2x/018hcb_ons_mas_dsk_02_0.webp",
  iron: "https://cdn.marvel.com/content/1x/002irm_ons_crd_03.webp",
  killmonger: "https://cdn.marvel.com/content/2x/108kmg_ons_cut_dsk_01.webp",
  loki: "https://cdn.marvel.com/content/2x/017lok_ons_cut_dsk_01_0.webp",
  mantis: "https://cdn.marvel.com/content/1x/045mts_ons_crd_01.webp",
  "kate-bishop": "https://cdn.marvel.com/content/1x/kate_ons_crd_01.webp",
  nebula: "https://cdn.marvel.com/content/1x/043neb_ons_crd_04.webp",
  "nick-fury": "https://cdn.marvel.com/content/1x/284nfy_ons_crd_03.webp",
  panther: "https://cdn.marvel.com/content/2x/007blp_ons_mas_dsk_02_0.webp",
  rocket: "https://cdn.marvel.com/content/1x/023rra_ons_crd_04.webp",
  "sam-wilson": "https://cdn.marvel.com/content/1x/cap_ons_crd_01.webp",
  spider: "https://cdn.marvel.com/content/1x/005smp_ons_crd_02.webp",
  "star-lord": "https://cdn.marvel.com/content/1x/021slq_ons_crd_03.webp",
  strange: "https://cdn.marvel.com/content/1x/009drs_ons_crd_03.webp",
  thor: "https://cdn.marvel.com/content/1x/004tho_ons_crd_04.webp",
  vision: "https://cdn.marvel.com/content/1x/013vis_ons_crd_01-1.webp",
  "war-machine": "https://cdn.marvel.com/content/1x/042wmr_ons_crd_04.webp",
  wanda: "https://cdn.marvel.com/content/1x/012scw_ons_crd_03.webp",
};

export function getScreenPortrait(characterId: string, fallback: string) {
  return screenPortraits[characterId] ?? fallback;
}
