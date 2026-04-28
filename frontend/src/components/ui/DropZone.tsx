"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DropZone() {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File is too large. Max size is 25MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/pdf/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      
      if (data.is_scanned) {
        toast.error("Warning: This appears to be a scanned PDF. Text editing may not work.", { duration: 5000 });
      } else {
        toast.success("PDF uploaded successfully!");
      }

      // Redirect to editor
      router.push(`/editor/${data.file_id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload PDF. Please try again.");
      setIsUploading(false);
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-200 
        ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50'}
        ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        {isUploading ? (
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        ) : isDragReject ? (
          <AlertCircle className="w-16 h-16 text-red-500" />
        ) : (
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
            <UploadCloud size={32} />
          </div>
        )}
        
        <div>
          <h3 className="text-xl font-bold mb-2">
            {isUploading ? "Processing PDF..." : 
             isDragActive ? "Drop the PDF here" : 
             "Click or drag PDF to upload"}
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {isUploading ? "Extracting text layers, please wait." : 
             "Only document-generated PDFs are supported. Scanned images cannot be edited."}
          </p>
        </div>
        
        {!isUploading && (
          <div className="mt-6">
            <span className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-medium text-sm">
              Select File
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
