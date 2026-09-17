"use client";

import { useState } from "react";
import DropZone from "@/components/ui/DropZone";
import {
  FileText,
  Clock,
  Zap,
  Trash2,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  FolderOpen,
  Keyboard,
  Info,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedTabs from "@/components/ui/AnimatedTabs";
import toast from "react-hot-toast";

interface RecentFile {
  id: string;
  name: string;
  size: string;
  date: string;
  time: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("documents");
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("pustak_recent_files");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentFiles.filter((f) => f.id !== id);
    setRecentFiles(updated);
    try {
      localStorage.setItem("pustak_recent_files", JSON.stringify(updated));
      toast.success("Document removed from recent list");
    } catch {
      // ignore
    }
  };

  const handleClearAll = () => {
    setRecentFiles([]);
    try {
      localStorage.removeItem("pustak_recent_files");
      toast.success("All recent files cleared");
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 w-full flex-1 flex flex-col space-y-6 sm:space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              PDF Workspace
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
              Free Plan
            </span>
          </div>
          <p className="text-sm text-zinc-400">
            Upload any document-generated PDF to directly modify its text layer.
          </p>
        </div>

        {/* Animated Tabs */}
        <AnimatedTabs
          tabs={[
            { id: "documents", label: "Documents", icon: <FileText size={15} /> },
            { id: "templates", label: "Templates", icon: <FileCheck2 size={15} /> },
            { id: "security", label: "Security", icon: <ShieldCheck size={15} /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full flex-1">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === "documents" && (
            <>
              {/* Upload Zone */}
              <div>
                <DropZone />
              </div>

              {/* Recent Files Section */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock size={18} className="text-sky-400" />
                    Recent Files in This Session
                  </h2>
                  {recentFiles.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {recentFiles.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {recentFiles.map((file) => (
                      <div
                        key={file.id}
                        className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 backdrop-blur-xl hover:border-sky-500/30 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                            <FileText size={18} />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-sm font-semibold text-white truncate group-hover:text-zinc-200 transition-colors">
                              {file.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                              <span>{file.size}</span>
                              <span>•</span>
                              <span>{file.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <Link href={`/editor/${file.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 text-xs gap-1 border-white/10 hover:border-sky-500/30 text-white hover:text-sky-300"
                            >
                              <span>Edit</span>
                              <ExternalLink size={12} />
                            </Button>
                          </Link>
                          <button
                            onClick={(e) => handleDeleteFile(file.id, e)}
                            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-white/5"
                            title="Remove from list"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-10 text-center backdrop-blur-md">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto text-zinc-500 mb-3">
                      <FolderOpen size={26} />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">
                      No files processed yet
                    </h4>
                    <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                      Drag and drop any document-generated PDF into the upload area above to begin editing.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "templates" && (
            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <FileCheck2 className="text-zinc-300" />
                Sample Documents & Templates
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                Have a PDF document you want to test? Here are sample templates that work seamlessly with text manipulation:
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    title: "Business Consulting Invoice",
                    type: "Invoice (PDF)",
                    desc: "Line items, tax calculations, and billing terms.",
                  },
                  {
                    title: "Standard Independent Agreement",
                    type: "Contract (PDF)",
                    desc: "Confidentiality, milestone dates, and sign-offs.",
                  },
                  {
                    title: "Executive Employment Offer",
                    type: "HR Letter (PDF)",
                    desc: "Position title, compensation packages, and start dates.",
                  },
                ].map((tpl, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-zinc-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {tpl.type}
                      </span>
                      <h4 className="font-bold text-white text-base mt-2 mb-1">
                        {tpl.title}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {tpl.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-zinc-500">
                      <span>Vector Font Ready</span>
                      <Sparkles size={13} className="text-zinc-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Your Privacy & Data Vault
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    PustakEdits was built from the ground up with strict confidentiality guarantees for professional, legal, and financial documents.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                    Automatic 24-Hour File Purging
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Every document you upload is processed in an isolated ephemeral sandbox and permanently wiped 24 hours after initial upload.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                    Zero Data Retention & Training
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    We never read, harvest, or feed your documents into AI models. Your content remains 100% private to your browser session.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Information Widget */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          {/* Storage / Account Card */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Full Access</h3>
                <span className="text-xs text-zinc-400 font-medium">
                  Unlimited Edits Active
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/5 text-xs text-zinc-400">
              <div className="flex justify-between items-center">
                <span>Watermarks:</span>
                <span className="font-bold text-white">0 (Clean Exports)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Max File Size:</span>
                <span className="font-bold text-white">30 MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Retention:</span>
                <span className="font-bold text-white">24h Auto-Purge</span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Card - Hidden on Mobile */}
          <div className="hidden md:block rounded-3xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Keyboard size={14} className="text-zinc-400" />
              Editor Shortcuts
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Click Text Span</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
                  Click
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Save Edit In Modal</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
                  Ctrl + Enter
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Dismiss Modal</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
                  Esc
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Zoom In / Out</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
                  + / -
                </span>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur-xl text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs">
              <Info size={14} />
              <span>Pro Tip</span>
            </div>
            <p className="leading-relaxed">
              For best results, upload PDFs generated directly from Word, Google Docs, Canva, or accounting software where font glyphs are vector embedded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
