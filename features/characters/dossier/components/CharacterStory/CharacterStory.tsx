"use client";

import { UNREVIEWED_SPOILER } from "@/services/progress/spoilerPolicy";

import Image from "next/image";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { StoryChapter } from "@/types/character";
import { useSpoilerProgress } from "@/hooks/useSpoilerProgress";
import { canRevealSpoiler } from "@/services/progress/spoilerPolicy";
import Link from "next/link";
import { getNextWatch } from "@/services/progress/nextWatch";
import { NextTrailer } from "@/features/spoilers/NextTrailer";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type CharacterStoryProps = {
  acts: { label: string; numeral: string; chapter: StoryChapter; image?: string }[];
  portrait?: string;
  portraitPosition?: string;
  characterName: string;
  titleIds: readonly string[];
};

const MOOD_BY_ACT: Record<string, string> = {
  I: "origin",
  II: "power",
  III: "crisis",
  IV: "resolution",
};

export function CharacterStory({ acts: sourceActs, portrait, portraitPosition, characterName, titleIds }: CharacterStoryProps) {
  const progress = useSpoilerProgress();
  const visibleActs = sourceActs.filter((act) => canRevealSpoiler(act.chapter.spoiler ?? UNREVIEWED_SPOILER, progress));
  const hasMore = visibleActs.length < sourceActs.length;
  const next = getNextWatch(progress, titleIds);
  const acts: (CharacterStoryProps["acts"][number] & { preview?: boolean })[] = [...visibleActs];
  if (hasMore) acts.push({ preview: true, numeral: "▶", label: "TU PRÓXIMA HISTORIA", chapter: {
    year: "CONTINÚA", kicker: `SIGUE A ${characterName}`, title: next?.title ?? "Tu historia continúa",
    text: !progress.ready ? "Preparando tu recorrido según lo que has visto." : next ? "Este es tu siguiente título pendiente. Descubre su tráiler y vuelve después de verlo para continuar la historia." : "No quedan títulos estrenados pendientes en el recorrido de este personaje. Su historia continuará aquí.",
  } });
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const actsKey = acts.map((a) => `${a.numeral}:${a.chapter.year}`).join(",") + (next?.slug ?? "");

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>(".story-step"));
    const images = Array.from(section.querySelectorAll<HTMLElement>(".story-image"));
    const imageReveals = Array.from(section.querySelectorAll<HTMLElement>(".story-image-clip"));
    const progressDots = Array.from(section.querySelectorAll<HTMLElement>(".story-progress-btn"));
    const progressFill = section.querySelector<HTMLElement>(".story-progress-fill");

    if (!cards.length) return;

    const media = gsap.matchMedia();
    media.add({ mobile: "(max-width: 900px)", desktop: "(min-width: 901px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { mobile, reduced } = context.conditions!;
      const setAct = (index: number): void => {
        const act = Math.max(0, Math.min(cards.length - 1, index));
        setActiveIndex(act);
        cards.forEach((card, i) => card.setAttribute("data-active", i === act ? "true" : "false"));
        progressDots.forEach((dot, dotIndex) => {
          const state = dotIndex <= act ? "true" : "false";
          if (dot.getAttribute("data-active") !== state) dot.setAttribute("data-active", state);
        });
        section.querySelectorAll<HTMLElement>(".story-year-storyline b").forEach((yearEl, yearIndex) => {
          const state = yearIndex <= act ? "true" : "false";
          if (yearEl.getAttribute("data-active") !== state) yearEl.setAttribute("data-active", state);
        });
      };

      setAct(cards.findLastIndex(card => card.getBoundingClientRect().top <= innerHeight * .4));

      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 40%",
          end: "top 40%",
          onEnter: () => setAct(index),
          onLeaveBack: () => setAct(index - 1),
        });
      });

      // Mobile keeps the entire copy readable; only the background follows scroll.
      // matchMedia reverts the desktop tweens when resizing or changing motion preferences.
      if (mobile || reduced) {
        gsap.set(imageReveals, { clipPath: "none" });
        gsap.set(images, { opacity: (index: number) => index === 0 ? 1 : 0 });
        images.forEach((image, index) => {
          gsap.set(image, { zIndex: index });
          if (index === 0 || !cards[index]) return;
          gsap.fromTo(image, { opacity: 0 }, {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: cards[index],
              start: reduced ? "top 45%" : "top 85%",
              end: "top 45%",
              scrub: reduced ? true : 0.25,
            },
          });
        });
        if (mobile && !reduced) {
          cards.forEach((card) => {
            gsap.fromTo(card.querySelector("h3"), { y: 18 }, {
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "top 55%", scrub: 0.25 },
            });
          });
        }
        return;
      }

      cards.forEach((card, index) => {
        const clip = imageReveals[index];
        const image = images[index];
        const img = clip?.querySelector("img");
        const dir = index % 2 === 0 ? 1 : -1;
        const meta = card.querySelectorAll<HTMLElement>(".story-meta");
        const kicker = card.querySelectorAll<HTMLElement>("h3 > em");
        const letters = card.querySelectorAll<HTMLElement>(".story-title-letter");
        const body = card.querySelectorAll<HTMLElement>(".story-card-text");
        const foot = card.querySelectorAll<HTMLElement>(".story-card-foot");

        if (clip) gsap.set(clip, { zIndex: index });
        if (image) gsap.set(image, { zIndex: index });
        gsap.set([...meta, ...kicker, ...letters, ...body, ...foot], { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: index === 0 ? "top 100%" : "top 92%",
            end: "bottom top",
            scrub: 0.5,
          },
          defaults: { ease: "power2.out" },
        });

        if (card.hasAttribute("data-next-watch") && clip && image) {
          gsap.set(image, { scale: 1, y: 0, rotate: 0 });
          if (index > 0) tl.fromTo(clip, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .16 }, 0);
        } else if (index > 0 && clip && image && img) {
          tl.fromTo(clip, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.16, ease: "power1.inOut" }, 0)
            .fromTo(image, { scale: 1.14, y: 0, rotate: dir * 3 }, { scale: 1.02, y: index % 2 === 0 ? -30 : 30, rotate: 0, duration: 0.14 }, 0)
            .fromTo(img, { scale: 1.18, x: dir * 34, filter: "blur(6px)" }, { scale: 1, x: 0, filter: "blur(0px)", duration: 0.16 }, 0.02);
        }

        tl.fromTo(meta, { opacity: 0, y: -26 }, { opacity: 1, y: 0, duration: 0.09 }, 0.05)
          .fromTo(kicker, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.09 }, 0.085)
          .fromTo(letters, { opacity: 0, y: "74%", rotationX: -74 }, { opacity: 1, y: 0, rotationX: 0, duration: 0.13, ease: "power3.out", stagger: 0.006 }, 0.11)
          .fromTo(body, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.11 }, 0.26)
          .fromTo(foot, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.09 }, 0.3);

        if (index === cards.length - 1) {
          // Mantiene el ritmo de entrada y deja el desenlace legible hasta salir.
          tl.to({}, { duration: 0.38 }, 0.39);
        } else {
          tl.to(meta, { opacity: 0, y: -26, duration: 0.1, ease: "power2.in" }, 0.5)
          .to(kicker, { opacity: 0, x: -16, duration: 0.1, ease: "power2.in" }, 0.54)
          .to(letters, { opacity: 0, y: "-42%", rotationX: 16, filter: "blur(3px)", duration: 0.12, ease: "power2.in" }, 0.56)
          .to(body, { opacity: 0, y: -22, duration: 0.11, ease: "power2.in" }, 0.62)
          .to(foot, { opacity: 0, y: -12, duration: 0.1, ease: "power2.in" }, 0.67);
        }
      });

      const cover = images[0];
      if (cover && !cards[0].hasAttribute("data-next-watch")) {
        gsap.fromTo(
          cover,
          { scale: 1.06, y: -14 },
          {
            scale: 1.12,
            y: 14,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      }

      if (progressFill) {
        gsap.to(progressFill, {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            end: "bottom 60%",
            scrub: 0.4,
          },
        });
      }
    }, section);

    return () => media.revert();
  }, [actsKey]);

  return (
    <>
      <section className="story-corridor profile-section" data-smooth-entry>
        <p className="section-label">LA HISTORIA</p>
        <h2>TU RECORRIDO<br /><em>HASTA AQUÍ</em></h2>
        <span>LA HISTORIA DE {characterName}, CAPÍTULO A CAPÍTULO, SEGÚN LO QUE YA HAS VISTO.</span>
      </section>

      {acts.length > 0 && <section ref={sectionRef} className="story-cinema" data-history data-scroll-section data-section-index="HISTORIA" aria-label={`Historia de ${characterName}`}>
        <div className="story-images">
          <div className="story-image-base" aria-hidden="true">
            {!acts[0]?.preview && (acts[0]?.image || portrait) ? <Image src={acts[0]?.image || portrait!} alt="" fill sizes="(max-width: 900px) 100vw, 47vw" style={{ objectPosition: acts[0]?.image ? "center" : portraitPosition }} /> : null}
          </div>
          {acts.map((act, index) => (
            <div className={`story-image${act.preview ? " story-trailer-image" : ""}`} aria-hidden={act.preview ? activeIndex !== index : true} inert={act.preview && activeIndex !== index} key={`${act.numeral}-${act.chapter.year}`}>
              <div className="story-image-clip" data-index={index}>
                {act.preview ? <div className="story-trailer-stage">{next?.trailerId ? <NextTrailer key={`${next.slug}:${activeIndex === index}`} slug={next.slug} title={next.title} videoId={next.trailerId} active={activeIndex === index} /> : <p>{next ? "Tráiler no disponible en el catálogo" : "La historia continuará"}</p>}</div> : (act.image || portrait) ? <Image src={act.image || portrait!} alt="" fill sizes="(max-width: 900px) 100vw, 47vw" style={{ objectPosition: act.image ? "center" : portraitPosition }} /> : null}
                <div className="story-image-aura" aria-hidden="true" />
                <div className="story-image-grain" />
              </div>
            </div>
          ))}
          <span className="story-year-storyline" aria-hidden="true">
            {acts.map((a) => (
              <b key={a.numeral}>{a.chapter.year}</b>
            ))}
          </span>
          <div className="story-progress" aria-hidden="true">
            <i className="story-progress-track" />
            <i className="story-progress-fill" />
            {acts.map((act, index) => (
              <span className="story-progress-btn" data-active={index === 0 ? "true" : "false"} key={act.numeral}>
                <b>{act.numeral}</b>
                <small>{act.chapter.year}</small>
              </span>
            ))}
          </div>
          <em className="story-film-tag" aria-hidden="true">NEXUS ARCHIVE · CINE CÓSMICO</em>
        </div>

        <div className="story-track">
          {acts.map((act, index) => {
            const mood = MOOD_BY_ACT[act.numeral] ?? "origin";
            const numbers = `${String(index + 1).padStart(2, "0")} · ${String(acts.length).padStart(2, "0")}`;
            const titleWords = act.chapter.title.split(/\s+/);
            return (
              <article className={`story-step story-card${act.preview ? " story-next-card" : ""}`} data-next-watch={act.preview || undefined} key={act.numeral} data-mood={mood} data-index={index} data-active={index === 0 ? "true" : "false"} data-history-step={act.preview ? undefined : true} aria-label={`${act.label} · ${act.chapter.title}`} aria-live="polite">
                <div className="story-meta">
                  <span>{act.label}</span>
                  <b>{act.chapter.year}</b>
                  <em>{numbers}</em>
                </div>
                <h3>
                  <em>{act.chapter.kicker}</em>
                  <span className="story-title" aria-label={act.chapter.title}>
                    {titleWords.map((word, wordIndex) => (
                      <Fragment key={wordIndex}>
                        {wordIndex > 0 ? " " : null}
                        <span className="story-title-word" aria-hidden="true">
                          {Array.from(word).map((letter, letterIndex) => (
                            <i className="story-title-letter" key={letterIndex}>{letter}</i>
                          ))}
                        </span>
                      </Fragment>
                    ))}
                  </span>
                </h3>
                <p className="story-card-text">{act.chapter.text}</p>
                <div className="story-card-foot">
                  {act.preview ? <div className="next-watch-actions"><Link className="story-chip" href={next ? `/titulos/${next.slug}` : "/titulos"}>EXPLORAR TÍTULO ↗</Link><Link className="story-chip" href="/titulos">ACTUALIZAR LO QUE HE VISTO ↗</Link></div> : <span className="story-chip">
                    <i />
                    ACTO {act.numeral} · {mood.toUpperCase()}
                  </span>}
                </div>
              </article>
            );
          })}
        </div>
      </section>}
    </>
  );
}
