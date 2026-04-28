import { ZoomIn, ZoomOut, Save, Download, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";

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
    edits
  } = useEditorStore();

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.25, 3));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.25, 0.5));

  return (
    <div className="h-14 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Pagination */}
        <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 dark:bg-zinc-900 rounded-md p-1">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <span className="text-xs sm:text-sm font-medium w-10 sm:w-16 text-center">
            {currentPage} / {numPages}
          </span>
          <button 
            onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
            disabled={currentPage >= numPages}
            className="p-1 rounded hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-1 sm:mx-2 hidden sm:block"></div>

        {/* Zoom */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={handleZoomOut} className="p-1 sm:p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-900">
            <ZoomOut size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <span className="text-xs sm:text-sm font-medium w-8 sm:w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} className="p-1 sm:p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-900">
            <ZoomIn size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:block text-sm text-muted-foreground mr-2">
          {edits.length} unsaved edits
        </div>
        
        <button 
          onClick={onSave}
          disabled={isProcessing || edits.length === 0}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-xs sm:text-sm transition-colors disabled:opacity-50"
        >
          {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span className="hidden sm:inline">Apply</span>
        </button>
        
        <button 
          onClick={onDownload}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium text-xs sm:text-sm transition-colors"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
    </div>
  );
}
