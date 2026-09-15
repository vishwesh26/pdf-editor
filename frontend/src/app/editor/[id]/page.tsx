"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore, TextBlock } from "@/store/editorStore";

import PDFViewer from "@/components/pdf/PDFViewer";
import Toolbar from "@/components/pdf/Toolbar";
import TextEditModal from "@/components/pdf/TextEditModal";
import toast from "react-hot-toast";
import { FileText, PanelLeftClose, PanelLeft, Sparkles, AlertCircle } from "lucide-react";

interface PageTextData {
  page: number;
  blocks: TextBlock[];
}

interface TextBlocksResponse {
  pages: PageTextData[];
  page_count?: number;
}

export default function EditorPage() {
  const params = useParams();
  const fileId = (params?.id as string) || "";
  const router = useRouter();

  const {
    setFileId,
    setTextBlocks,
    edits,
    setIsProcessing,
    numPages,
    currentPage,
    setCurrentPage,
    reset,
  } = useEditorStore();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch text blocks on mount
  useEffect(() => {
    if (!fileId) return;

    reset();
    setFileId(fileId);

    const fetchBlocks = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/api/pdf/${fileId}/text-blocks`);
        if (!res.ok) throw new Error("Failed to fetch text blocks");

        const data: TextBlocksResponse = await res.json();
        data.pages.forEach((pageData) => {
          setTextBlocks(pageData.page, pageData.blocks);
        });
      } catch (err) {
        console.error(err);
        setLoadError(
          "Unable to connect to the PDF analysis server. Please ensure the backend is running."
        );
        toast.error("Failed to load PDF text layers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlocks();
  }, [fileId, setFileId, setTextBlocks, reset]);

  const handleSave = async () => {
    if (edits.length === 0) return;
    setIsProcessing(true);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/pdf/${fileId}/update-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edits }),
      });

      if (!res.ok) throw new Error("Failed to update PDF");

      const data = await res.json();
      toast.success("All edits applied to PDF stream!");

      // Redirect to the new edited file version
      router.push(`/editor/${data.new_file_id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply text edits.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const API_URL =
      process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";
    window.open(`${API_URL}/api/pdf/${fileId}/download`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-950 px-4 min-h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
              <FileText className="h-8 w-8 text-zinc-300" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Analyzing PDF Stream</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Extracting font metrics, bounding boxes, and glyph vectors for live editing...
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-950 px-4 min-h-[calc(100vh-80px)]">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 max-w-md text-center backdrop-blur-xl">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Failed to Load Document</h3>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white text-black font-semibold rounded-xl text-xs hover:bg-white/90 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-76px)] overflow-hidden bg-zinc-950">
      {/* Top Floating Glass Toolbar */}
      <Toolbar onSave={handleSave} onDownload={handleDownload} />

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-3 top-3 z-20 p-2 rounded-xl border border-white/10 bg-zinc-900/90 text-zinc-400 hover:text-white backdrop-blur-md transition-colors shadow-lg"
          title={sidebarOpen ? "Hide Pages Sidebar" : "Show Pages Sidebar"}
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
        </button>

        {/* Collapsible Page Thumbnails Sidebar */}
        {sidebarOpen && (
          <aside className="w-48 sm:w-56 bg-zinc-950/95 border-r border-white/10 flex flex-col shrink-0 z-10 transition-all">
            <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider pl-12">
              <span>Pages ({numPages || 1})</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {Array.from({ length: Math.max(1, numPages) }).map((_, i) => {
                const pageNum = i + 1;
                const isSelected = currentPage === pageNum;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-full rounded-xl p-2.5 flex flex-col items-center gap-2 transition-all text-left group ${
                      isSelected
                        ? "border border-white/40 bg-white/10 shadow-sm"
                        : "border border-white/10 bg-zinc-900/40 hover:border-white/20 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="w-full aspect-[1/1.3] bg-white rounded-lg shadow-inner flex flex-col justify-between p-2 overflow-hidden relative">
                      <div className="space-y-1 opacity-40">
                        <div className="w-1/2 h-1 bg-zinc-400 rounded"></div>
                        <div className="w-full h-0.5 bg-zinc-300 rounded"></div>
                        <div className="w-4/5 h-0.5 bg-zinc-300 rounded"></div>
                        <div className="w-2/3 h-0.5 bg-zinc-300 rounded"></div>
                      </div>
                      <div className="text-[9px] font-mono text-right text-zinc-500 font-bold">
                        {pageNum}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      Page {pageNum}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Blueprint Canvas Workspace */}
        <main className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-dot-grid">
          <div className="py-4">
            <PDFViewer
              url={`${
                process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000"
              }/api/pdf/${fileId}/download`}
            />
          </div>
        </main>
      </div>

      {/* Floating Typography Inspector Modal */}
      <TextEditModal />
    </div>
  );
}
