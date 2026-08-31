/**
 * Retratos procedentes de las fichas "On Screen" de la guía oficial de Marvel.
 * Se centralizan aquí para que el catálogo no vuelva a mezclar arte de cómic con
 * las encarnaciones audiovisuales de los personajes.
 */
const screenPortraits: Readonly<Record<string, string>> = {
  "ant-man": "https://cdn.marvel.com/content/2x/010ant_ons_crd_03.webp",
  "agatha-harkness": "/characters/agatha-harkness.webp",
  "black-widow": "https://cdn.marvel.com/content/2x/011blw_ons_crd_04.webp",
  "captain-america": "https://cdn.marvel.com/content/2x/003cap_ons_crd_03.webp",
  "captain-marvel": "https://cdn.marvel.com/content/2x/008cmv_ons_crd_03.webp",
  gamora: "https://cdn.marvel.com/content/2x/022gam_ons_crd_02.webp",
  "green-goblin": "https://cdn.marvel.com/content/2x/104gno_ons_mas_dsk_01.webp",
  groot: "https://cdn.marvel.com/content/2x/024grt_ons_crd_02.webp",
  hulk: "https://cdn.marvel.com/content/2x/006hbb_ons_crd_03.webp",
  hawkeye: "https://cdn.marvel.com/content/2x/hawkeye_ons_crd_01.webp",
  iron: "https://cdn.marvel.com/content/2x/002irm_ons_crd_03.webp",
  killmonger: "https://cdn.marvel.com/content/2x/108kmg_ons_crd_02.webp",
  hela: "https://cdn.marvel.com/content/2x/113hla_ons_crd_01-1.webp",
  "human-torch": "/characters/human-torch.webp",
  "invisible-woman": "/characters/invisible-woman.jpg",
  loki: "https://cdn.marvel.com/content/2x/017lok_ons_crd_03.webp",
  mantis: "https://cdn.marvel.com/content/2x/045mts_ons_mas_dsk_02_1.webp",
  "kate-bishop": "https://cdn.marvel.com/content/2x/kate_ons_crd_01.webp",
  nebula: "https://cdn.marvel.com/content/2x/043neb_ons_crd_04.webp",
  "nick-fury": "https://cdn.marvel.com/content/2x/284nfy_ons_crd_03.webp",
  okoye: "https://cdn.marvel.com/content/2x/110oky_ons_crd_03.webp",
  "moon-knight": "/characters/moon-knight.jpg",
  "monica-rambeau": "https://cdn.marvel.com/content/2x/180mrb_ons_mas_dsk_02_0.webp",
  "mister-fantastic": "/characters/mister-fantastic.webp",
  mysterio: "/characters/mysterio.jpg",
  "ms-marvel": "https://cdn.marvel.com/content/2x/038mmk_ons_mas_dsk_02.webp",
  panther: "https://cdn.marvel.com/content/2x/007blp_ons_crd_02.webp",
  "peggy-carter": "/characters/peggy-carter.jpg",
  rocket: "https://cdn.marvel.com/content/2x/023rra_ons_crd_04.webp",
  "sam-wilson": "https://cdn.marvel.com/content/2x/cap_ons_crd_01.webp",
  "shang-chi": "https://cdn.marvel.com/content/2x/242shc_ons_crd_01.webp",
  shuri: "https://cdn.marvel.com/content/2x/107shr_ons_crd_02.webp",
  spider: "https://cdn.marvel.com/content/2x/005smp_ons_crd_02.webp",
  "star-lord": "https://cdn.marvel.com/content/2x/021slq_ons_crd_03.webp",
  strange: "https://cdn.marvel.com/content/2x/009drs_ons_crd_03.webp",
  thor: "https://cdn.marvel.com/content/2x/004tho_ons_crd_04.webp",
  thanos: "https://cdn.marvel.com/content/2x/019tha_ons_crd_03.webp",
  thing: "/characters/the-thing.avif",
  ultron: "https://cdn.marvel.com/content/2x/061ult_ons_crd_01-1.webp",
  vision: "https://cdn.marvel.com/content/2x/013vis_ons_crd_01-1.webp",
  "war-machine": "https://cdn.marvel.com/content/2x/042wmr_ons_crd_04.webp",
  wanda: "https://cdn.marvel.com/content/2x/012scw_ons_crd_03.webp",
  wasp: "https://cdn.marvel.com/content/2x/041wjd_ons_crd_02.webp",
  wong: "https://cdn.marvel.com/content/2x/079wng_ons_crd_03.webp",
  "winter-soldier": "https://cdn.marvel.com/content/2x/015wsb_ons_crd_03.webp",
  "yelena-belova": "https://cdn.marvel.com/content/2x/433ybv_ons_mas_dsk_04.webp",
  daredevil: "https://cdn.marvel.com/content/2x/026ddm_ons_crd_02.webp",
  kingpin: "/characters/kingpin.jpg",
  "doctor-doom": "/characters/doctor-doom.jpg",
};

export function getScreenPortrait(characterId: string) {
  const portrait = screenPortraits[characterId];
  if (!portrait) throw new Error(`Falta el retrato audiovisual del personaje: ${characterId}`);
  return portrait.startsWith("http") ? `/characters/${characterId}.webp` : portrait;
}
