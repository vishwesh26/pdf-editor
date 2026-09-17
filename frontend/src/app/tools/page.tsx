'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { PDF_TOOLS, TOOL_CATEGORIES } from '@/lib/tools-data';
import ToolIcon from '@/components/tools/ToolIcon';
import { ToolCategory } from '@/types/tools';

export default function ToolsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTools = useMemo(() => {
    return PDF_TOOLS.filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto py-5 sm:py-12 px-2.5 sm:px-6 space-y-5 sm:space-y-10 min-w-0 overflow-x-hidden">
      {/* Header & Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 px-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Full-Featured PDF Workspace</span>
        </div>
        <h1 className="text-2xl sm:text-5xl font-extrabold text-white tracking-tight">
          All PDF Tools in One Place
        </h1>
        <p className="text-xs sm:text-base text-zinc-400 max-w-xl mx-auto">
          Combine, shrink, protect, number, rotate, and convert PDF documents with sub-second browser processing.
        </p>

        {/* Search Bar */}
        <div className="pt-2 sm:pt-4 max-w-md mx-auto relative w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. compress, merge)..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* Featured Flagship Hero Card */}
      <div className="rounded-2xl p-4 sm:p-8 border border-orange-500/30 bg-gradient-to-r from-orange-950/20 via-zinc-950 to-zinc-950/80 relative overflow-hidden shadow-xl w-full max-w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
                Flagship Feature
              </span>
              <span className="text-xs text-zinc-400">PustakEdits Core Innovation</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              Direct Vector PDF Text Editor
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Unlike ordinary PDF editors that paint opaque white boxes over old text, PustakEdits directly rewrites the internal font text layer. Original fonts and clean backgrounds are preserved perfectly.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs sm:text-sm font-bold shadow-lg transition-all w-full md:w-auto shrink-0"
          >
            <span>Launch Text Editor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Category Filter Pills - isolated scroll container that never expands page width */}
      <div className="w-full max-w-full overflow-x-auto pb-1.5 scrollbar-none min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 w-max px-0.5">
          {['All', ...TOOL_CATEGORIES].map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid - 3 Columns in a row on mobile */}
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-4 w-full max-w-full min-w-0">
        {filteredTools.map((tool) => {
          const href = tool.slug === 'edit-pdf' ? '/dashboard' : `/tools/${tool.slug}`;
          return (
            <motion.div
              key={tool.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="w-full min-w-0"
            >
              <Link
                href={href}
                className="group flex flex-col justify-center sm:justify-between h-full min-h-[96px] sm:min-h-[140px] p-2 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all duration-200 shadow-sm w-full min-w-0 overflow-hidden"
              >
                <div className="space-y-1.5 sm:space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left w-full min-w-0">
                  <div className="flex items-center justify-center sm:justify-between w-full">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition-colors shrink-0"
                      style={{ color: tool.accentColor }}
                    >
                      <ToolIcon name={tool.icon} size={16} />
                    </div>

                    {tool.badge && (
                      <span
                        className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                          tool.badge === 'Flagship'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : tool.badge === 'Popular'
                            ? 'bg-teal-500/15 text-teal-300'
                            : tool.badge === 'AI'
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <div className="w-full min-w-0">
                    <h3 className="text-[11px] sm:text-sm font-bold text-white group-hover:text-teal-300 transition-colors leading-snug line-clamp-2 break-words">
                      <span className="sm:hidden">{tool.shortTitle}</span>
                      <span className="hidden sm:inline">{tool.title}</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed hidden sm:block">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex pt-4 mt-4 border-t border-zinc-900 items-center justify-between text-xs text-zinc-500 group-hover:text-zinc-300 font-medium w-full">
                  <span>{tool.isReady ? 'Use Tool' : 'Coming Soon'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16 text-zinc-500 space-y-2">
          <p className="text-sm font-medium">No tools found matching &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs text-teal-400 hover:underline"
          >
            Reset search and filters
          </button>
        </div>
      )}
    </div>
  );
}
