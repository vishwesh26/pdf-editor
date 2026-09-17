"use client";

import {
  ZoomIn,
  ZoomOut,
  Save,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileEdit,
} from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  onSave: () => void;
  onDownload: () => void;
}

export default function Toolbar({ onSave, onDownload }: ToolbarProps) {
  const {
    currentPage,
    numPages,
    setCurrentPage,
    zoom,
    setZoom,
    isProcessing,
    edits,
  } = useEditorStore();

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.25, 3));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.25, 0.5));
  const handleFitPage = () => setZoom(1.0);

  return (
    <div className="h-14 sm:h-16 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl flex items-center justify-between px-2.5 sm:px-6 sticky top-0 z-30 shadow-md">
      {/* Left: Document indicator & Pagination */}
      <div className="flex items-center gap-1.5 sm:gap-4">
        {/* Document breadcrumb icon */}
        <div className="hidden lg:flex items-center gap-2 pr-4 border-r border-white/10 text-xs text-zinc-300 font-medium">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white">
            <FileEdit size={14} />
          </div>
          <span>Active PDF</span>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-zinc-900/90 border border-white/10 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="px-1.5 sm:px-2 text-[11px] sm:text-xs font-semibold text-white tracking-wide flex items-center gap-0.5 sm:gap-1">
            <span>{currentPage}</span>
            <span className="text-zinc-500">/</span>
            <span className="text-zinc-400">{Math.max(1, numPages)}</span>
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
            disabled={currentPage >= numPages}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-zinc-900/90 border border-white/10 rounded-xl p-1 shadow-inner">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>

          <button
            onClick={handleFitPage}
            className="px-1.5 sm:px-2 text-[11px] sm:text-xs font-mono font-semibold text-zinc-300 hover:text-white transition-colors"
            title="Reset Zoom to 100%"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={handleZoomIn}
            disabled={zoom >= 3.0}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
        </div>
      </div>

      {/* Right: Edits Counter & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Unsaved Edits Badge */}
        {edits.length > 0 ? (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>
              {edits.length} Unsaved {edits.length === 1 ? "Edit" : "Edits"}
            </span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-500 mr-2">
            <span>Click text to edit</span>
          </div>
        )}

        {/* Apply & Save Edits Button */}
        <Button
          onClick={onSave}
          disabled={isProcessing || edits.length === 0}
          variant="white"
          size="sm"
          className="gap-1.5 text-xs font-semibold px-3 sm:px-4 h-9 disabled:opacity-30"
        >
          {isProcessing ? (
            <Loader2 size={14} className="animate-spin text-black" />
          ) : (
            <Save size={14} />
          )}
          <span className="hidden sm:inline">Apply Edits</span>
          <span className="sm:hidden">Save</span>
        </Button>

        {/* Download Button */}
        <Button
          onClick={onDownload}
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs font-semibold px-3 sm:px-4 h-9 border-white/15 text-white hover:bg-white/10"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>
    </div>
  );
}
