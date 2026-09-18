"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "./button";
import TurnstileWidget, { TurnstileWidgetRef } from "./TurnstileWidget";

interface DropZoneProps {
  compact?: boolean;
}

export default function DropZone({ compact = false }: DropZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileWidgetRef>(null);
  const router = useRouter();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!turnstileToken) {
        toast.error("Please complete the security bot verification before uploading.");
        return;
      }

      if (file.size > 30 * 1024 * 1024) {
        toast.error("File is too large. Max size is 30MB.");
        return;
      }

      setIsUploading(true);
      setUploadProgress("Uploading PDF to vector engine...");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("cf-turnstile-response", turnstileToken);

      try {
        const API_URL =
          process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";
        setUploadProgress("Analyzing embedded layout & font vectors...");

        const response = await fetch(`${API_URL}/api/pdf/upload`, {
          method: "POST",
          headers: {
            "X-Turnstile-Token": turnstileToken,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();

        // Save to localStorage for recent documents list
        try {
          const existing = JSON.parse(
            localStorage.getItem("pustak_recent_files") || "[]"
          );
          const newEntry = {
            id: data.file_id,
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          const updated = [
            newEntry,
            ...existing.filter((f: { id: string }) => f.id !== data.file_id),
          ].slice(0, 10);
          localStorage.setItem("pustak_recent_files", JSON.stringify(updated));
        } catch {
          // ignore
        }

        if (data.is_scanned) {
          toast.error(
            "Notice: This PDF contains scanned images without selectable text.",
            { duration: 6000 }
          );
        } else {
          toast.success("PDF analyzed. Launching editor...");
        }

        router.push(`/editor/${data.file_id}`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload PDF. Ensure backend server is reachable.");
        setIsUploading(false);
      } finally {
        setTurnstileToken("");
        turnstileRef.current?.reset();
      }
    },
    [router, turnstileToken]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      multiple: false,
    });

  return (
    <div
      {...getRootProps()}
      className={`group relative overflow-hidden rounded-2xl transition-colors cursor-pointer border ${
        isDragActive
          ? "border-zinc-500 bg-zinc-900/60"
          : isDragReject
          ? "border-red-500/40 bg-red-500/5"
          : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
      } ${compact ? "p-6" : "p-8 sm:p-12"} ${
        isUploading ? "pointer-events-none opacity-80" : ""
      }`}
    >
      <input {...getInputProps()} />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Minimal Icon Container */}
        <div className="mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-white transition-colors group-hover:border-zinc-700">
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
            ) : isDragReject ? (
              <AlertCircle className="h-5 w-5 text-red-400" />
            ) : (
              <UploadCloud className="h-5 w-5 text-zinc-300" />
            )}
          </div>
        </div>

        {/* Text Instructions */}
        <h3 className="mb-1 text-base sm:text-lg font-bold text-white tracking-tight">
          {isUploading
            ? uploadProgress
            : isDragActive
            ? "Drop your PDF here"
            : "Drop your PDF here, or browse files"}
        </h3>

        <p className="max-w-xs text-xs text-zinc-500 sm:text-sm">
          {isUploading
            ? "Extracting glyphs and layout..."
            : "100% Free • Preserves original fonts • Up to 30MB"}
        </p>

        {/* Action Button */}
        {!isUploading && (
          <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="default"
              size="default"
              className="px-6 h-11 sm:h-10 text-sm font-semibold pointer-events-none w-full sm:w-auto justify-center"
            >
              <FileText className="mr-2 h-4 w-4" />
              Choose PDF File
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
                Auto-deleted after 24h
              </span>
              <span className="text-zinc-700 hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-zinc-500" />
                Zero watermarks
              </span>
            </div>

            {/* Turnstile Bot Verification Widget */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-3 pt-3 border-t border-zinc-900 w-full flex flex-col items-center"
            >
              <div className="text-[11px] text-zinc-400 mb-1.5 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
                <span>Protected by Cloudflare Turnstile</span>
              </div>
              <TurnstileWidget
                ref={turnstileRef}
                action="pdf_upload"
                theme="dark"
                onVerify={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken("")}
                onError={() => setTurnstileToken("")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
