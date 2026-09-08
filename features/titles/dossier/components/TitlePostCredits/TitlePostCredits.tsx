import { ProgressSpoilerGate } from "@/features/spoilers/ProgressSpoilerGate";
import { SpoilerDisclosure } from "@/components/common/SpoilerDisclosure";
import type { SpoilerRequirement } from "@/types/spoiler";
import type { TitleDetails } from "@/types/title";

export function TitlePostCredits({ scenes, requirement }: { scenes: TitleDetails["postCredits"]; requirement: SpoilerRequirement }) {
  return <section className="title-postcredits profile-section"><header><p className="section-label">04 / DESPUÉS DE LOS CRÉDITOS</p><h2>QUÉ OCULTA<br /><em>EL FINAL</em></h2></header>{scenes.length
    ? <ProgressSpoilerGate requirement={requirement}><SpoilerDisclosure label={`${scenes.length} ${scenes.length === 1 ? "ESCENA" : "ESCENAS"} POSCRÉDITOS`}>{scenes.map((scene) => <article key={scene.label}><span>{scene.label}</span><p>{scene.description}</p></article>)}</SpoilerDisclosure></ProgressSpoilerGate>
    : <div className="no-postcredits"><strong>SIN ESCENAS POSCRÉDITOS</strong><p>La historia termina antes de que finalicen los créditos.</p></div>}</section>;
}
