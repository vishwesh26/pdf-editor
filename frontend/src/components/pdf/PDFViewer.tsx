"use client";

import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import { useEditorStore, TextBlock } from "@/store/editorStore";

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
    setSelectedBlock
  } = useEditorStore();
  
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageViewport, setPageViewport] = useState<pdfjsLib.PageViewport | null>(null);

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

        const renderContext: any = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (error: any) {
        if (error.name !== 'RenderingCancelledException') {
          console.error("Error rendering page:", error);
        }
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
    <div className="relative inline-block bg-white shadow-md" ref={containerRef}>
      <canvas ref={canvasRef} className="block" />
      
      {/* Text Overlay Layer */}
      {pageViewport && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {blocks.map((block) => {
            // block.bbox is [x0, y0, x1, y1] in PDF points
            const [x0, y0, x1, y1] = block.bbox;
            
            // Convert to canvas pixels using simple scaling
            // PyMuPDF provides bbox relative to the top-left in standard points (72 dpi).
            // We just multiply by zoom to get CSS pixels relative to the top-left.
            const left = x0 * zoom;
            const top = y0 * zoom;
            const width = (x1 - x0) * zoom;
            const height = (y1 - y0) * zoom;

            return (
              <div
                key={block.id}
                className="absolute border border-transparent hover:border-blue-500 bg-blue-500/10 cursor-text pointer-events-auto transition-colors"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                }}
                onClick={() => setSelectedBlock(block)}
                title="Click to edit text"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
