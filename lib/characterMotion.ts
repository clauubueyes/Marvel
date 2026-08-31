import type { Character } from "@/lib/characters";

export type MotionSignature = "tech" | "mystic" | "cosmic" | "kinetic" | "stealth" | "gamma" | "regal" | "quantum";

export type CharacterMotionProfile = {
  signature: MotionSignature;
  seed: number;
  tempo: number;
  drift: number;
};

const signatureByCharacter: Partial<Record<string, MotionSignature>> = {
  iron: "tech", "war-machine": "tech", ultron: "tech", vision: "tech", rocket: "tech", nebula: "tech",
  strange: "mystic", wanda: "mystic", "agatha-harkness": "mystic", "doctor-doom": "mystic", loki: "mystic", "moon-knight": "mystic",
  thor: "cosmic", "captain-marvel": "cosmic", "star-lord": "cosmic", gamora: "cosmic", mantis: "cosmic", thanos: "cosmic", groot: "cosmic",
  spider: "kinetic", hawkeye: "kinetic", "kate-bishop": "kinetic", "human-torch": "kinetic", "shang-chi": "kinetic", wasp: "kinetic", "ms-marvel": "kinetic",
  "black-widow": "stealth", "yelena-belova": "stealth", "winter-soldier": "stealth", daredevil: "stealth", kingpin: "stealth",
  hulk: "gamma", thing: "gamma", hela: "gamma",
  panther: "regal", shuri: "regal", killmonger: "regal", "captain-america": "regal", "sam-wilson": "regal",
  "mister-fantastic": "quantum", "invisible-woman": "quantum", "ant-man": "quantum",
};

function hash(value: string) {
  return Array.from(value).reduce((total, character) => ((total << 5) - total + character.charCodeAt(0)) | 0, 0);
}

function inferSignature(character: Character): MotionSignature {
  const text = `${character.power} ${character.abilities.join(" ")} ${character.role}`.toLowerCase();
  if (/magia|hech|bruja|dios|arcano/.test(text)) return "mystic";
  if (/tecn|ingen|armadura|sintét|cibern|inteligencia artificial/.test(text)) return "tech";
  if (/cósm|galax|energía|vuelo/.test(text)) return "cosmic";
  if (/gamma|fuerza|resistencia|roca/.test(text)) return "gamma";
  if (/espion|infiltr|táctic|sentidos/.test(text)) return "stealth";
  if (/dimensi|tamaño|invisib|campo/.test(text)) return "quantum";
  return character.category === "VILLANO" ? "regal" : "kinetic";
}

export function getCharacterMotionProfile(character: Character): CharacterMotionProfile {
  const seed = Math.abs(hash(character.id));
  return {
    signature: signatureByCharacter[character.id] ?? inferSignature(character),
    seed,
    tempo: 0.82 + (seed % 7) * 0.055,
    drift: 10 + (seed % 9),
  };
}
