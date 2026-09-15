"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover';
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+~`|}{[]:;?><,./-=0123456789';

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 10,
  className = '',
  parentClassName = '',
  encryptedClassName = 'text-blue-500/80 font-mono',
  animateOn = 'view'
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const shuffleText = useCallback((originalText: string, revealedCount: number) => {
    return originalText
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' ';
        if (index < revealedCount) return originalText[index];
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join('');
  }, []);

  const triggerDecrypt = useCallback(() => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      iteration++;
      const revealed = Math.floor((iteration / maxIterations) * text.length);
      setDisplayText(shuffleText(text, revealed));

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsDecrypted(true);
      }
    }, speed);
  }, [text, maxIterations, speed, shuffleText]);

  useEffect(() => {
    if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            triggerDecrypt();
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [animateOn, triggerDecrypt]);

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block ${parentClassName}`}
      onMouseEnter={animateOn === 'hover' ? triggerDecrypt : undefined}
    >
      <span className={isDecrypted ? className : encryptedClassName}>
        {displayText}
      </span>
    </motion.span>
  );
}
