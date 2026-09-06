import type { StoryChapter } from "@/types/character";

type CharacterChapterProps = {
  chapter: StoryChapter;
  act: string;
  actNumeral: string;
  position: "left" | "right";
};

export function CharacterChapter({ chapter, act, actNumeral, position }: CharacterChapterProps) {
  return <section className="profile-section story-beat" data-scroll-section data-section-index={actNumeral} data-beat={position}>
    <div className="story-beat-node" aria-hidden="true"><i /></div>
    <article className="story-beat-card" data-reveal>
      <div className="story-beat-meta"><span>{act}</span><b>{chapter.year}</b></div>
      <h2><em>{chapter.kicker}</em>{chapter.title}</h2>
      <p>{chapter.text}</p>
    </article>
  </section>;
}