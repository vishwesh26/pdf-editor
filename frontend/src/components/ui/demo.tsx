"use client";

import { useState } from "react";
import { GridPulse } from "@/components/ui/grid-pulse";

/** A halo in the page colour, so lit cells never crowd the letters. */
const guard =
  "[text-shadow:0_0_6px_var(--color-background),0_0_14px_var(--color-background),0_0_30px_var(--color-background),0_0_52px_var(--color-background)]";

export default function GridPulseDemo() {
  const [text, setText] = useState(true);
  return (
    <section className="relative flex min-h-[560px] w-full items-center overflow-hidden bg-background">
      <GridPulse />
      <button
        id="grid-pulse-text"
        type="button"
        role="switch"
        aria-checked={text}
        onClick={() => setText(!text)}
        className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 py-1.5 pl-1.5 pr-3 text-sm text-foreground backdrop-blur"
      >
        <span
          aria-hidden
          className={`relative h-5 w-9 rounded-full transition-colors ${text ? "bg-foreground" : "bg-foreground/20"}`}
        >
          <span
            className={`absolute top-0.5 size-4 rounded-full bg-background transition-[left] ${text ? "left-[18px]" : "left-0.5"}`}
          />
        </span>
        Text
      </button>
      {text ? (
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
          <h1
            className={`text-[clamp(56px,11vw,144px)] font-semibold leading-[0.9] tracking-[-0.045em] text-foreground ${guard}`}
          >
            grid pulse
          </h1>
          <p
            data-grid-avoid
            className={`mt-7 max-w-[42ch] text-[clamp(16px,1.5vw,20px)] leading-normal text-foreground ${guard}`}
          >
            A fine grid that lights up where the pointer passes and lets go a
            moment later. Move across it.
          </p>
        </div>
      ) : null}
    </section>
  );
}
