"use client";

import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import { useEditorStore } from "@/store/editorStore";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
}

export default function PDFViewer({ url }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    currentPage,
    zoom,
    setNumPages,
    textBlocks,
    setSelectedBlock,
  } = useEditorStore();

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageViewport, setPageViewport] = useState<pdfjsLib.PageViewport | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  // Load PDF document
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };
    loadPdf();
  }, [url, setNumPages]);

  // Render Page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: pdfjsLib.RenderTask | null = null;
    let isMounted = true;

    const renderPage = async () => {
      try {
        setIsRendering(true);
        const page = await pdfDoc.getPage(currentPage);
        if (!isMounted) return;

        // Calculate viewport
        const viewport = page.getViewport({ scale: zoom });
        setPageViewport(viewport);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.name !== "RenderingCancelledException"
        ) {
          console.error("Error rendering page:", error);
        }
      } finally {
        if (isMounted) setIsRendering(false);
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, currentPage, zoom]);

  const blocks = textBlocks[currentPage] || [];

  return (
    <div
      className="relative inline-block bg-white rounded-xl shadow-2xl shadow-black/60 border border-zinc-200/80 overflow-hidden"
      ref={containerRef}
    >
      {/* Canvas */}
      <canvas ref={canvasRef} className="block transition-opacity duration-200" />

      {/* Rendering shimmer overlay */}
      {isRendering && (
        <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* Text Overlay Layer for Interactive Text Selection */}
      {pageViewport && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {blocks.map((block) => {
            const [x0, y0, x1, y1] = block.bbox;

            const left = x0 * zoom;
            const top = y0 * zoom;
            const width = (x1 - x0) * zoom;
            const height = (y1 - y0) * zoom;

            return (
              <div
                key={block.id}
                className="absolute border border-blue-400/20 hover:border-blue-500 bg-blue-500/5 hover:bg-blue-500/20 cursor-text pointer-events-auto transition-all rounded-[2px] group"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                }}
                onClick={() => setSelectedBlock(block)}
                title={`Click to edit: "${block.text}"`}
              >
                {/* Floating tooltip on hover showing font metadata */}
                <div className="pointer-events-none absolute -top-6 left-0 bg-zinc-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 font-mono flex items-center gap-1 border border-white/10">
                  <span>{block.font.split(",")[0]}</span>
                  <span>•</span>
                  <span>{Math.round(block.size)}pt</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
