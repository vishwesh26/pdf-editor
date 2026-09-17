'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { TOOL_CATEGORIES, getToolsByCategory } from '@/lib/tools-data';
import ToolIcon from './ToolIcon';

interface ToolsMegaMenuProps {
  onClose: () => void;
}

export default function ToolsMegaMenu({ onClose }: ToolsMegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[min(98vw,1440px)] max-w-[1440px] max-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl border border-zinc-800/90 bg-[#0c0c0e]/98 backdrop-blur-2xl shadow-2xl z-50 p-6 sm:p-8"
    >
      {/* Background radial accent glow */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-teal-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-orange-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Grid of Categories with generous column width */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5 xl:gap-6 relative z-10 text-xs">
        {TOOL_CATEGORIES.map((category) => {
          const tools = getToolsByCategory(category);
          return (
            <div key={category} className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between pb-1.5 border-b border-zinc-800/80 mb-2">
                <span className="truncate" title={category}>
                  {category}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 font-normal shrink-0">
                  {tools.length}
                </span>
              </h4>
              <ul className="space-y-1">
                {tools.map((tool) => {
                  const href = tool.slug === 'edit-pdf' ? '/dashboard' : `/tools/${tool.slug}`;
                  return (
                    <li key={tool.id}>
                      <Link
                        href={href}
                        onClick={onClose}
                        className="group flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-zinc-800/60 transition-all duration-150"
                        title={tool.title}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="p-1 rounded-md bg-zinc-900 border border-zinc-800/80 group-hover:border-zinc-700 transition-colors flex-shrink-0"
                            style={{ color: tool.accentColor }}
                          >
                            <ToolIcon name={tool.icon} size={12} />
                          </span>
                          <span className="text-zinc-300 group-hover:text-white font-medium text-[12px] leading-tight whitespace-nowrap transition-colors">
                            {tool.shortTitle}
                          </span>
                        </div>

                        {tool.badge && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold uppercase flex-shrink-0 ml-1.5 ${
                              tool.badge === 'Flagship'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : tool.badge === 'Popular'
                                ? 'bg-teal-500/15 text-teal-300'
                                : tool.badge === 'AI'
                                ? 'bg-indigo-500/20 text-indigo-300'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {tool.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* MegaMenu Bottom Action Bar */}
      <div className="mt-7 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2 text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            Flagship feature: <strong className="text-white font-semibold">Direct Text Rewriting</strong> in native document PDFs (No white-box overlays).
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/tools"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <span>Explore All 33 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
