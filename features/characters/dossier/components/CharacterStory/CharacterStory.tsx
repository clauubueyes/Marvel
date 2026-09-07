"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { StoryChapter } from "@/types/character";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type CharacterStoryProps = {
  acts: { label: string; numeral: string; chapter: StoryChapter }[];
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
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>(".story-card"));
    const images = Array.from(section.querySelectorAll<HTMLElement>(".story-image"));
    const imageReveals = Array.from(section.querySelectorAll<HTMLElement>(".story-image-clip"));
    const imageImgs = Array.from(section.querySelectorAll<HTMLElement>(".story-image-clip img"));
    const progressDots = Array.from(section.querySelectorAll<HTMLElement>(".story-progress-btn"));
    const progressFill = section.querySelector<HTMLElement>(".story-progress-fill");

    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.set(cards, { autoAlpha: 0 });
      gsap.set(cards[0], { autoAlpha: 1 });

      let current = 0;
      const activate = (index: number): void => {
        if (index < 0 || index >= cards.length || index === current) return;
        const card = cards[index];
        gsap.to(cards[current], { autoAlpha: 0, x: index % 2 === 0 ? -40 : 40, duration: 0.55, ease: "power2.inOut" });
        current = index;
        gsap.fromTo(
          card,
          { autoAlpha: 0, x: index % 2 === 0 ? 60 : -60, filter: "blur(4px)" },
          { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out", overwrite: true },
        );
        gsap.fromTo(
          card.querySelectorAll(".story-title-letter"),
          { opacity: 0, y: "70%", rotationX: -70 },
          { opacity: 1, y: 0, rotationX: 0, duration: 0.7, ease: "power3.out", stagger: 0.018 },
        );
        gsap.fromTo(
          card.querySelectorAll(".story-meta"),
          { opacity: 0, y: -18 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        );
        gsap.fromTo(
          card.querySelectorAll(".story-card-text"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.12, ease: "power2.out" },
        );
        progressDots.forEach((dot, dotIndex) => {
          const state = dotIndex <= index ? "true" : "false";
          if (dot.getAttribute("data-active") !== state) dot.setAttribute("data-active", state);
        });
        section.querySelectorAll<HTMLElement>(".story-year-storyline b").forEach((yearEl, yearIndex) => {
          const state = yearIndex <= index ? "true" : "false";
          if (yearEl.getAttribute("data-active") !== state) yearEl.setAttribute("data-active", state);
        });
      };

      cards.forEach((card, index) => {
        if (index === 0) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top 62%",
          end: "top 62%",
          onEnter: () => activate(index),
          onLeaveBack: () => activate(index - 1),
        });
      });

      cards.forEach((card, index) => {
        const image = images[index];
        const clip = imageReveals[index];
        const img = imageImgs[index];
        if (index === 0 || !image || !clip) return;

        const dir = index % 2 === 0 ? 1 : -1;
        gsap.fromTo(
          clip,
          { clipPath: "inset(0% 0% 100% 0%)", zIndex: index },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            zIndex: index,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 86%",
              end: "center 48%",
              scrub: 0.5,
            },
          },
        );
        gsap.fromTo(
          image,
          { scale: 1.14, y: 0, rotate: dir * 3 },
          {
            scale: 1.02,
            y: index % 2 === 0 ? -30 : 30,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 86%",
              end: "center 48%",
              scrub: 0.6,
            },
          },
        );
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.18, x: dir * 34, filter: "blur(6px)" },
            {
              scale: 1,
              x: 0,
              filter: "blur(0px)",
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 86%",
                end: "center 48%",
                scrub: 0.7,
              },
            },
          );
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

    return () => ctx.revert();
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
            {portrait ? <Image src={portrait} alt="" fill sizes="(max-width: 900px) 100vw, 42vw" style={portraitPosition ? { objectPosition: portraitPosition } : undefined} /> : null}
          </div>
          {acts.map((act, index) => (
            <div className="story-image" key={`${act.numeral}-${act.chapter.year}`}>
              <div className="story-image-clip" data-index={index}>
                {portrait ? <Image src={portrait} alt="" fill sizes="(max-width: 900px) 100vw, 42vw" style={portraitPosition ? { objectPosition: portraitPosition } : undefined} /> : null}
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
            const titleLetters = Array.from(act.chapter.title);
            return (
              <article className={`story-card`} key={act.numeral} data-mood={mood} data-index={index} data-history-step aria-label={`${act.label} · ${act.chapter.title}`}>
                <div className="story-meta">
                  <span>{act.label}</span>
                  <b>{act.chapter.year}</b>
                  <em>{numbers}</em>
                </div>
                <h3>
                  <em>{act.chapter.kicker}</em>
                  <span className="story-title" aria-label={act.chapter.title}>
                    {titleLetters.map((letter, letterIndex) =>
                      letter === " " ? (
                        <span className="story-space" key={letterIndex} aria-hidden="true">{" "}</span>
                      ) : (
                        <i className="story-title-letter" style={{ "--letter": letterIndex } as CSSProperties} key={letterIndex} aria-hidden="true">{letter}</i>
                      ),
                    )}
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