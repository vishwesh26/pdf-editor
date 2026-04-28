"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore } from "@/store/editorStore";
import { useAuthStore } from "@/store/authStore";
import PDFViewer from "@/components/pdf/PDFViewer";
import Toolbar from "@/components/pdf/Toolbar";
import TextEditModal from "@/components/pdf/TextEditModal";
import toast from "react-hot-toast";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params.id as string;
  
  const { 
    setFileId, 
    setTextBlocks, 
    edits, 
    isProcessing, 
    setIsProcessing,
    numPages,
    reset
  } = useEditorStore();
  
  const { isPro, downloadsCount, incrementDownloads } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);

  // Fetch text blocks on load
  useEffect(() => {
    if (!fileId) return;
    
    // Clear previous edits and state when opening a new file
    reset();
    
    setFileId(fileId);

    const fetchBlocks = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_URL}/api/pdf/${fileId}/text-blocks`);
        if (!res.ok) throw new Error("Failed to fetch text blocks");
        
        const data = await res.json();
        // data.pages is array of { page: num, blocks: [...] }
        data.pages.forEach((pageData: any) => {
          setTextBlocks(pageData.page, pageData.blocks);
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load PDF text data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlocks();
  }, [fileId, setFileId, setTextBlocks]);

  const handleSave = async () => {
    if (edits.length === 0) return;
    setIsProcessing(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/pdf/${fileId}/update-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edits }),
      });
      
      if (!res.ok) throw new Error("Failed to update PDF");
      
      const data = await res.json();
      toast.success("PDF updated successfully!");
      
      // Redirect to the new edited file
      router.push(`/editor/${data.new_file_id}`);
      
      // We could also just reset edits and reload the viewer, but redirecting 
      // to the new file ensures a clean state.
      // useEditorStore.setState({ edits: [] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply edits.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!isPro && downloadsCount >= 2) {
      toast.error("You've reached your free 2 downloads limit. Please upgrade to Pro.");
      router.push('/pricing');
      return;
    }
    
    incrementDownloads();
    const API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';
    window.open(`${API_URL}/api/pdf/${fileId}/download`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground font-medium text-lg">Analyzing PDF layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <Toolbar onSave={handleSave} onDownload={handleDownload} />
      
      <div className="flex-1 flex bg-gray-100 dark:bg-zinc-900 overflow-hidden relative">
        {/* Sidebar thumbnails shell */}
        <div className="w-48 bg-gray-50 dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 hidden md:flex flex-col items-center py-4 overflow-y-auto shrink-0">
           {Array.from({ length: numPages }).map((_, i) => (
             <div key={i} className="w-32 aspect-[1/1.4] bg-white dark:bg-zinc-800 shadow-sm mb-4 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-xs text-muted-foreground">
               Page {i + 1}
             </div>
           ))}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
          <PDFViewer url={`${process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000'}/api/pdf/${fileId}/download`} />
        </div>
      </div>

      <TextEditModal />
    </div>
  );
}
