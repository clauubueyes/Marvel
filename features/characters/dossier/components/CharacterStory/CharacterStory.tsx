"use client";

import Image from "next/image";
import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { StoryChapter } from "@/types/character";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type CharacterStoryProps = {
  acts: { label: string; numeral: string; chapter: StoryChapter; image?: string }[];
  portrait?: string;
  portraitPosition?: string;
  characterName: string;
};

const MOOD_BY_ACT: Record<string, string> = {
  I: "origin",
  II: "power",
  III: "crisis",
  IV: "resolution",
};

export function CharacterStory({ acts, portrait, portraitPosition, characterName }: CharacterStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const actsKey = acts.map((a) => `${a.numeral}:${a.chapter.year}`).join(",");

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>(".story-card"));
    const images = Array.from(section.querySelectorAll<HTMLElement>(".story-image"));
    const imageReveals = Array.from(section.querySelectorAll<HTMLElement>(".story-image-clip"));
    const imageImgs = Array.from(section.querySelectorAll<HTMLElement>(".story-image-clip img"));
    const progressDots = Array.from(section.querySelectorAll<HTMLElement>(".story-progress-btn"));
    const progressFill = section.querySelector<HTMLElement>(".story-progress-fill");

    if (!cards.length) return;

    const media = gsap.matchMedia();
    media.add({ mobile: "(max-width: 900px)", desktop: "(min-width: 901px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { mobile, reduced } = context.conditions!;
      const setAct = (index: number): void => {
        const act = Math.max(0, Math.min(cards.length - 1, index));
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
        const img = imageImgs[index];
        const dir = index % 2 === 0 ? 1 : -1;
        const meta = card.querySelectorAll<HTMLElement>(".story-meta");
        const kicker = card.querySelectorAll<HTMLElement>(".story-card h3 > em");
        const letters = card.querySelectorAll<HTMLElement>(".story-title-letter");
        const body = card.querySelectorAll<HTMLElement>(".story-card-text");
        const foot = card.querySelectorAll<HTMLElement>(".story-card-foot");

        if (clip) gsap.set(clip, { zIndex: index });
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

        if (index > 0 && clip && image && img) {
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
      if (cover) {
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
        <h2>CUATRO ACTOS<br /><em>UNA LÍNEA DE TIEMPO</em></h2>
        <span>LA VERDAD DE {characterName} SE CUENTA DE CORRIDO, CAPÍTULO A CAPÍTULO, SIN EXPEDIENTES DE POR MEDIO.</span>
      </section>

      <section ref={sectionRef} className="story-cinema" data-history data-scroll-section data-section-index="HISTORIA" aria-label={`Historia de ${characterName}`}>
        <div className="story-images" aria-hidden="true">
          <div className="story-image-base">
            {acts[0]?.image || portrait ? <Image src={acts[0]?.image || portrait!} alt="" fill sizes="(max-width: 900px) 100vw, 47vw" style={{ objectPosition: acts[0]?.image ? "center" : portraitPosition }} /> : null}
          </div>
          {acts.map((act, index) => (
            <div className="story-image" key={`${act.numeral}-${act.chapter.year}`}>
              <div className="story-image-clip" data-index={index}>
                {act.image || portrait ? <Image src={act.image || portrait!} alt="" fill sizes="(max-width: 900px) 100vw, 47vw" style={{ objectPosition: act.image ? "center" : portraitPosition }} /> : null}
                <div className="story-image-aura" aria-hidden="true" />
                <div className="story-image-grain" />
              </div>
            </div>
          ))}
          <span className="story-year-storyline">
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
          <em className="story-film-tag">NEXUS ARCHIVE · CINE CÓSMICO</em>
        </div>

        <div className="story-track">
          {acts.map((act, index) => {
            const mood = MOOD_BY_ACT[act.numeral] ?? "origin";
            const numbers = `${String(index + 1).padStart(2, "0")} · ${String(acts.length).padStart(2, "0")}`;
            const titleWords = act.chapter.title.split(/\s+/);
            return (
              <article className={`story-card`} key={act.numeral} data-mood={mood} data-index={index} data-active={index === 0 ? "true" : "false"} data-history-step aria-label={`${act.label} · ${act.chapter.title}`}>
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
                  <span className="story-chip">
                    <i />
                    ACTO {act.numeral} · {mood.toUpperCase()}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
