"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check } from "lucide-react";

interface EditableField {
  label: string;
  originalValue: string;
  newValue: string;
  x: number;
  y: number;
}

const FIELDS: EditableField[] = [
  {
    label: "Description",
    originalValue: "Software Engineering Services",
    newValue: "UI/UX Design Consulting",
    x: 38,
    y: 48,
  },
  {
    label: "Amount",
    originalValue: "$4,250.00",
    newValue: "$6,800.00",
    x: 72,
    y: 65,
  },
];

const TYPING_SPEED = 55;
const SELECT_DURATION = 400;
const RESTART_DELAY = 3000;
const PHASE_PAUSE = 600;

type Phase = "idle" | "move-cursor" | "click" | "select" | "delete" | "type" | "save" | "done";

export default function AnimatedPdfDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });

  const [cursorPos, setCursorPos] = useState({ x: 20, y: 30 });
  const [currentField, setCurrentField] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [displayValues, setDisplayValues] = useState(
    FIELDS.map((f) => f.originalValue)
  );
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [typedText, setTypedText] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (typingRef.current) clearInterval(typingRef.current);
  }, []);

  const resetDemo = useCallback(() => {
    clearTimers();
    setCursorPos({ x: 20, y: 30 });
    setCurrentField(0);
    setPhase("idle");
    setDisplayValues(FIELDS.map((f) => f.originalValue));
    setSelectedField(null);
    setTypedText("");
    setShowSaved(false);
    setAnimationStarted(false);
  }, [clearTimers]);

  const startAnimation = useCallback(() => {
    if (animationStarted) return;
    setAnimationStarted(true);
    setPhase("move-cursor");
    setCurrentField(0);
  }, [animationStarted]);

  useEffect(() => {
    if (isInView && !animationStarted) {
      timeoutRef.current = setTimeout(startAnimation, 800);
    }
    return () => clearTimers();
  }, [isInView, animationStarted, startAnimation, clearTimers]);

  useEffect(() => {
    clearTimers();
    const field = FIELDS[currentField];

    switch (phase) {
      case "move-cursor":
        setCursorPos({ x: field.x, y: field.y });
        timeoutRef.current = setTimeout(() => setPhase("click"), 700);
        break;

      case "click":
        timeoutRef.current = setTimeout(() => setPhase("select"), 200);
        break;

      case "select":
        setSelectedField(currentField);
        timeoutRef.current = setTimeout(() => setPhase("delete"), SELECT_DURATION + 200);
        break;

      case "delete":
        setDisplayValues((prev) => {
          const next = [...prev];
          next[currentField] = "";
          return next;
        });
        setSelectedField(null);
        setTypedText("");
        timeoutRef.current = setTimeout(() => setPhase("type"), 150);
        break;

      case "type": {
        const target = field.newValue;
        let charIndex = 0;
        setTypedText("");

        typingRef.current = setInterval(() => {
          charIndex++;
          const current = target.slice(0, charIndex);
          setTypedText(current);

          if (charIndex >= target.length) {
            if (typingRef.current) clearInterval(typingRef.current);

            setDisplayValues((prev) => {
              const next = [...prev];
              next[currentField] = target;
              return next;
            });

            setTimeout(() => {
              if (currentField < FIELDS.length - 1) {
                setTypedText("");
                setCurrentField((prev) => prev + 1);
                setPhase("move-cursor");
              } else {
                setTypedText("");
                setPhase("save");
              }
            }, PHASE_PAUSE);
          }
        }, TYPING_SPEED);
        break;
      }

      case "save":
        setCursorPos({ x: 82, y: 82 });
        timeoutRef.current = setTimeout(() => {
          setShowSaved(true);
          setPhase("done");
        }, 800);
        break;

      case "done":
        timeoutRef.current = setTimeout(() => {
          setShowSaved(false);
          resetDemo();
          setTimeout(() => {
            setAnimationStarted(false);
          }, 500);
        }, RESTART_DELAY);
        break;
    }

    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentField]);

  const getFieldDisplay = (index: number) => {
    if (phase === "type" && currentField === index && typedText) {
      return typedText;
    }
    return displayValues[index];
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-3xl mx-auto rounded-xl border border-zinc-800 bg-zinc-950/80 overflow-hidden shadow-2xl shadow-black/40"
    >
      {/* Editor chrome header */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Invoice_May2025.pdf
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          PustakEdits
        </span>
      </div>

      {/* Document canvas */}
      <div className="relative p-5 sm:p-8 min-h-[340px] sm:min-h-[380px] flex items-center justify-center">
        {/* The "PDF document" */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5 sm:p-6 text-zinc-900 relative">
          {/* Invoice header */}
          <div className="flex justify-between items-start border-b border-zinc-200 pb-3 mb-4">
            <div>
              <div className="text-sm font-bold text-zinc-900 tracking-tight">
                ACME STUDIO
              </div>
              <div className="text-[11px] text-zinc-500">Invoice #INV-2049</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Paid
              </span>
              <div className="text-[10px] text-zinc-400 mt-1">May 15, 2025</div>
            </div>
          </div>

          {/* Description field */}
          <div className="mb-3">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase mb-1">
              Description
            </div>
            <div
              className={`relative text-sm font-medium text-zinc-900 px-2.5 py-1.5 rounded border transition-all duration-200 ${
                selectedField === 0
                  ? "border-blue-400 bg-blue-50"
                  : phase === "type" && currentField === 0
                  ? "border-zinc-400 bg-zinc-50"
                  : "border-transparent bg-zinc-50"
              }`}
            >
              <span
                className={
                  selectedField === 0
                    ? "bg-blue-200/70 text-zinc-900 px-0.5 rounded-sm"
                    : ""
                }
              >
                {getFieldDisplay(0)}
              </span>
              {phase === "type" && currentField === 0 && (
                <span className="inline-block w-[2px] h-4 bg-zinc-900 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          </div>

          {/* Divider line items */}
          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Qty</span>
              <span>1</span>
            </div>
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Rate</span>
              <span>—</span>
            </div>
          </div>

          {/* Amount field */}
          <div className="flex justify-between items-center bg-zinc-50 px-3 py-2 rounded border border-zinc-100">
            <span className="text-xs text-zinc-500">Total Due</span>
            <div
              className={`text-sm font-bold text-zinc-900 px-2 py-0.5 rounded transition-all duration-200 ${
                selectedField === 1
                  ? "border border-blue-400 bg-blue-50"
                  : phase === "type" && currentField === 1
                  ? "border border-zinc-400 bg-white"
                  : "border border-transparent"
              }`}
            >
              <span
                className={
                  selectedField === 1
                    ? "bg-blue-200/70 text-zinc-900 px-0.5 rounded-sm"
                    : ""
                }
              >
                {getFieldDisplay(1)}
              </span>
              {phase === "type" && currentField === 1 && (
                <span className="inline-block w-[2px] h-4 bg-zinc-900 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-2.5 border-t border-zinc-100 flex justify-between text-[10px] text-zinc-400">
            <span>Fonts: Inter, Helvetica</span>
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-300 ${
                showSaved
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-zinc-100 text-zinc-500 border border-zinc-200"
              }`}
            >
              {showSaved ? (
                <>
                  <Check size={10} />
                  Saved
                </>
              ) : (
                "Save PDF"
              )}
            </span>
          </div>
        </div>

        {/* Animated cursor */}
        <motion.div
          className="absolute z-30 pointer-events-none"
          animate={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 0.8,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="drop-shadow-md"
          >
            <path
              d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
              fill="white"
              stroke="black"
              strokeWidth="1"
            />
          </svg>

          <AnimatePresence>
            {phase === "click" && (
              <motion.div
                initial={{ scale: 0.3, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-0 left-0 w-4 h-4 -mt-2 -ml-2 rounded-full bg-white/30"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Saved overlay */}
        <AnimatePresence>
          {showSaved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center z-20 bg-black/10 backdrop-blur-[2px] rounded-xl"
            >
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-medium">
                <Check size={16} className="text-emerald-400" />
                PDF Saved Successfully
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom status bar */}
      <div className="h-8 flex items-center justify-between px-4 border-t border-zinc-800 bg-zinc-900/40 text-[10px] font-mono text-zinc-500">
        <span>
          {phase === "idle" && "Ready"}
          {phase === "move-cursor" && "Moving to text block..."}
          {phase === "click" && "Selecting text..."}
          {phase === "select" && "Text selected"}
          {phase === "delete" && "Removing old text..."}
          {phase === "type" && `Typing: "${typedText}"`}
          {phase === "save" && "Saving document..."}
          {phase === "done" && "✓ Document saved"}
        </span>
        <span className="hidden sm:inline">No watermarks • Fonts preserved</span>
      </div>
    </div>
  );
}
