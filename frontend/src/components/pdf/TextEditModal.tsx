"use client";

import { useState } from "react";
import { useEditorStore, TextBlock } from "@/store/editorStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Type, Palette, Move, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextEditFormProps {
  block: TextBlock;
  onSave: (newText: string) => void;
  onCancel: () => void;
}

function TextEditForm({ block, onSave, onCancel }: TextEditFormProps) {
  const [text, setText] = useState(block.text);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSave(text);
    }
  };

  const fontName = block.font ? block.font.split(",")[0] : "Embedded Font";
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div onKeyDown={handleKeyDown}>
      {/* Modal Header */}
      <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-zinc-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
            <Type size={15} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Edit Text Layer</h3>
            <p className="text-[11px] text-zinc-400">Page {block.page} Text Span</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-zinc-400 hover:text-white rounded-lg p-1.5 hover:bg-white/10 transition-colors"
          title="Close (Esc)"
        >
          <X size={18} />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-5 space-y-4">
        {/* Font Properties Inspector Strip */}
        <div className="grid grid-cols-3 gap-2 text-xs bg-zinc-900/90 p-3 rounded-2xl border border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1">
              <Type size={10} /> Font
            </span>
            <span className="font-semibold text-white truncate" title={fontName}>
              {fontName}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1">
              <Move size={10} /> Size
            </span>
            <span className="font-semibold text-white">
              {Math.round(block.size)} pt
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1">
              <Palette size={10} /> Color
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                style={{ backgroundColor: block.color || "#000000" }}
              />
              <span className="font-mono text-[11px] text-zinc-300">
                {block.color || "#000"}
              </span>
            </div>
          </div>
        </div>

        {/* Text Area Input */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-28 sm:h-36 px-4 py-3 bg-zinc-900 border border-white/10 rounded-2xl focus:border-white/40 focus:ring-1 focus:ring-white/20 outline-none resize-none text-sm sm:text-base text-white font-sans leading-relaxed transition-all shadow-inner"
            autoFocus
            placeholder="Enter text..."
          />
          <div className="flex justify-between items-center text-[11px] text-zinc-500 mt-1 px-1">
            <span>
              {charCount} chars • {wordCount} words
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft size={11} /> Ctrl + Enter to save
            </span>
          </div>
        </div>
      </div>

      {/* Modal Footer Actions */}
      <div className="px-5 py-4 bg-zinc-950/80 border-t border-white/10 flex justify-end gap-2.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-xs text-zinc-400 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          variant="white"
          size="sm"
          onClick={() => onSave(text)}
          className="text-xs font-semibold px-5 gap-1.5"
        >
          <Check size={14} />
          <span>Save Edit</span>
        </Button>
      </div>
    </div>
  );
}

export default function TextEditModal() {
  const { selectedBlock, setSelectedBlock, addEdit, updateTextBlockText } =
    useEditorStore();

  if (!selectedBlock) return null;

  const handleSave = (newText: string) => {
    addEdit({
      id: selectedBlock.id,
      page: selectedBlock.page,
      text: newText,
      original_bbox: selectedBlock.bbox,
      font: selectedBlock.font,
      size: selectedBlock.size,
      color: selectedBlock.color,
      flags: selectedBlock.flags,
    });

    updateTextBlockText(selectedBlock.page, selectedBlock.id, newText);
    setSelectedBlock(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-zinc-950/95 w-full max-w-md sm:max-w-lg rounded-3xl shadow-2xl border border-white/15 overflow-hidden backdrop-blur-2xl"
        >
          <TextEditForm
            key={selectedBlock.id}
            block={selectedBlock}
            onSave={handleSave}
            onCancel={() => setSelectedBlock(null)}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
