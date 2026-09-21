'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Download,
  AlertCircle,
  Eye,
  EyeOff,
  RotateCw,
  RefreshCcw,
  Sparkles,
  Lock,
  Stamp,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import TurnstileWidget, { TurnstileWidgetRef } from '@/components/ui/TurnstileWidget';
import { PDFToolDef } from '@/types/tools';
import {
  CompressionQuality,
  WatermarkColor,
  PageNumberPosition,
  ImageFormat,
  ToolJobResult,
} from '@/types/tools';
import ToolIcon from './ToolIcon';

interface ToolWorkstationProps {
  tool: PDFToolDef;
  relatedTools: PDFToolDef[];
}

export default function ToolWorkstation({ tool, relatedTools }: ToolWorkstationProps) {
  // File state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bot Security state
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<TurnstileWidgetRef>(null);

  // Job & Progress state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [result, setResult] = useState<ToolJobResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tool-specific parameter states
  const [compressionQuality, setCompressionQuality] = useState<CompressionQuality>('recommended');
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [rotationPages, setRotationPages] = useState<string>('all');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [pageRanges, setPageRanges] = useState<string>('1-2');
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkColor, setWatermarkColor] = useState<string>('#EF4444');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.3);
  const [watermarkRotation, setWatermarkRotation] = useState<number>(45);
  const [pageNumberPosition, setPageNumberPosition] = useState<PageNumberPosition>('bottom-center');
  const [imageFormat, setImageFormat] = useState<ImageFormat>('png');
  const [asMarkdown, setAsMarkdown] = useState<boolean>(false);
  const [redactTerms, setRedactTerms] = useState<string>('');
  const [ocrLanguage, setOcrLanguage] = useState<string>('eng');
  const [ocrFormat, setOcrFormat] = useState<'pdf' | 'txt'>('pdf');
  const [forceOcr, setForceOcr] = useState<boolean>(false);

  // File drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    if (tool.isMultiFile) {
      setSelectedFiles((prev) => [...prev, ...files]);
    } else {
      setSelectedFiles([files[0]]);
    }
    setResult(null);
    setErrorMessage(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    setSelectedFiles([]);
    setResult(null);
    setIsProcessing(false);
    setProgress(0);
    setErrorMessage(null);
    setTurnstileToken('');
    turnstileRef.current?.reset();
  };

  // Poll async background job
  const pollJobStatus = async (pollUrl: string) => {
    const backendUrl =
      process.env.NEXT_PUBLIC_PYTHON_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000";
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${backendUrl}${pollUrl}`);
        if (!res.ok) throw new Error('Polling error');
        const data = await res.json();

        setProgress(data.progress || 20);
        setProgressStatus(
          data.status === 'processing'
            ? `Processing with PyMuPDF (${data.progress}%)...`
            : 'Finalizing document...'
        );

        if (data.status === 'completed') {
          clearInterval(interval);
          setResult(data.result);
          setIsProcessing(false);
          setProgress(100);
          toast.success('Processing complete!');
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setIsProcessing(false);
          setErrorMessage(data.error || 'Operation failed');
          toast.error(data.error || 'Operation failed');
        }
      } catch (err: any) {
        clearInterval(interval);
        setIsProcessing(false);
        setErrorMessage('Failed to track background job.');
      }
    }, 800);
  };

  // Process Tool Execution
  const handleExecute = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please upload a file first');
      return;
    }

    if (!turnstileToken) {
      toast.error('Please complete security bot verification first');
      return;
    }

    if ((tool.id === 'merge-pdf' || tool.id === 'compare-pdf') && selectedFiles.length < 2) {
      toast.error('Please upload at least 2 PDF files to proceed');
      return;
    }

    if (tool.id === 'redact-pdf' && !redactTerms.trim()) {
      toast.error('Please enter the text or keywords to redact');
      return;
    }

    if ((tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') && !password) {
      toast.error('Please enter a password');
      return;
    }

    setIsProcessing(true);
    setProgress(15);
    setProgressStatus('Uploading to high-speed processing engine...');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('cf-turnstile-response', turnstileToken);

    if (tool.isMultiFile) {
      selectedFiles.forEach((file) => formData.append('files', file));
    } else {
      formData.append('file', selectedFiles[0]);
    }

    // Append tool-specific parameters
    if (tool.id === 'compress-pdf') {
      formData.append('quality', compressionQuality);
    } else if (tool.id === 'rotate-pdf') {
      formData.append('angle', rotationAngle.toString());
      formData.append('pages', rotationPages);
    } else if (tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') {
      formData.append('password', password);
    } else if (tool.id === 'split-pdf' || tool.id === 'remove-pages' || tool.id === 'extract-pages') {
      formData.append('pages', pageRanges);
      formData.append('page_ranges', pageRanges);
    } else if (tool.id === 'add-watermark') {
      formData.append('text', watermarkText);
      formData.append('color', watermarkColor);
      formData.append('opacity', watermarkOpacity.toString());
      formData.append('rotation', watermarkRotation.toString());
    } else if (tool.id === 'add-page-numbers') {
      formData.append('position', pageNumberPosition);
      formData.append('format_str', 'Page {n} of {total}');
    } else if (tool.id === 'pdf-to-jpg') {
      formData.append('img_format', imageFormat);
      formData.append('dpi', '150');
    } else if (tool.id === 'pdf-to-text') {
      formData.append('as_markdown', asMarkdown.toString());
    } else if (tool.id === 'pdf-to-markdown') {
      formData.append('as_markdown', 'true');
    } else if (tool.id === 'redact-pdf') {
      formData.append('search_terms', redactTerms);
    } else if (tool.id === 'ocr-pdf') {
      formData.append('language', ocrLanguage);
      formData.append('output_format', ocrFormat);
      formData.append('force_ocr', forceOcr.toString());
    }

    // Smooth progress ticker while awaiting response
    let progressTimer: NodeJS.Timeout | null = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) {
          setProgressStatus('Optimizing document streams & structure...');
          return prev + 12;
        } else if (prev < 70) {
          setProgressStatus('Compressing & restructuring assets...');
          return prev + 10;
        } else if (prev < 90) {
          setProgressStatus('Finalizing document...');
          return prev + 5;
        }
        return prev;
      });
    }, 400);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_PYTHON_API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:8000";
      const endpoint = tool.apiEndpoint || `/api/tools/${tool.slug}`;
      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'X-Turnstile-Token': turnstileToken,
        },
        body: formData,
      });

      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }

      if (res.status === 202) {
        // Asynchronous job triggered by size threshold
        const jobData = await res.json();
        setProgress(30);
        setProgressStatus('Processing large document in background...');
        pollJobStatus(jobData.poll_url);
      } else if (res.ok) {
        // Synchronous job completed
        const data = await res.json();
        setProgress(100);
        setProgressStatus('Processing complete!');
        setResult(data.result);
        setIsProcessing(false);
        toast.success('Document ready!');
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error (${res.status})`);
      }
    } catch (err: any) {
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
      setIsProcessing(false);
      setProgress(0);
      setErrorMessage(err.message || 'An error occurred while processing the document.');
      toast.error(err.message || 'Failed to process document');
    } finally {
      if (progressTimer) {
        clearInterval(progressTimer);
      }
      // Cloudflare Turnstile tokens are single-use; reset widget for next action
      setTurnstileToken('');
      turnstileRef.current?.reset();
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="min-h-[80vh] max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-8 sm:space-y-10">
      {/* Tool Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
          <ToolIcon name={tool.icon} size={14} color={tool.accentColor} />
          <span>{tool.category}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {tool.title}
        </h1>
        <p className="text-sm sm:text-base text-zinc-400">
          {tool.description}
        </p>
      </div>

      {/* Main Workstation Container */}
      <div className="rounded-2xl sm:rounded-3xl border border-zinc-800/90 bg-zinc-950/80 backdrop-blur-xl shadow-2xl p-4 sm:p-8 space-y-6 sm:space-y-8">
        {!result && (
          <>
            {/* Upload Box / Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-teal-400 bg-teal-500/5'
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple={tool.isMultiFile}
                accept={tool.acceptTypes || '.pdf'}
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-900 border border-zinc-800 shadow-inner"
                  style={{ color: tool.accentColor }}
                >
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-semibold text-white">
                    Drop your {tool.acceptTypes === 'image/*' ? 'images' : 'PDF'} here, or{' '}
                    <span className="text-teal-400 hover:underline">browse files</span>
                  </p>
                  <p className="text-xs text-zinc-500">
                    Max file size: 15MB (Free tier) • Protected by AES-256 in-memory processing
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Files List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Selected Files ({selectedFiles.length})</span>
                  <button
                    onClick={resetAll}
                    className="hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                <div className="grid gap-2 max-h-48 overflow-y-auto pr-1">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                        <span className="truncate text-white font-medium">{file.name}</span>
                        <span className="text-zinc-500 font-mono text-[11px] flex-shrink-0">
                          {formatBytes(file.size)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Tool Parameters Panel */}
            {selectedFiles.length > 0 && (
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <span>Options & Settings</span>
                </h3>

                {/* Compress Quality Options */}
                {tool.id === 'compress-pdf' && (
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-300 font-medium">Compression Level</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'extreme', label: 'Extreme', desc: 'Max size reduction (~75%)' },
                        { id: 'recommended', label: 'Recommended', desc: 'Balanced quality (~55%)' },
                        { id: 'low', label: 'Low', desc: 'High visual quality (~30%)' },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setCompressionQuality(preset.id as CompressionQuality)}
                          className={`p-3.5 sm:p-3 rounded-xl border text-left text-xs transition-all ${
                            compressionQuality === preset.id
                              ? 'border-teal-500 bg-teal-500/10 text-white shadow-sm'
                              : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <div className="font-bold text-white">{preset.label}</div>
                          <div className="text-xs sm:text-[10px] text-zinc-400 mt-1 sm:mt-0.5">{preset.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rotate Options */}
                {tool.id === 'rotate-pdf' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-300 font-medium">Angle</label>
                      <div className="flex gap-2">
                        {[90, 180, 270].map((angle) => (
                          <button
                            key={angle}
                            type="button"
                            onClick={() => setRotationAngle(angle)}
                            className={`flex-1 py-2.5 sm:py-2 rounded-xl text-xs font-semibold border transition-all ${
                              rotationAngle === angle
                                ? 'border-teal-500 bg-teal-500/10 text-white'
                                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                            }`}
                          >
                            {angle}°
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-300 font-medium">Pages to Rotate</label>
                      <input
                        type="text"
                        value={rotationPages}
                        onChange={(e) => setRotationPages(e.target.value)}
                        placeholder="all or 1, 3-5"
                        className="w-full px-3 py-2.5 sm:py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                )}

                {/* Protect / Unlock Password Input */}
                {(tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') && (
                  <div className="space-y-1.5 max-w-md">
                    <label className="text-xs text-zinc-300 font-medium">
                      {tool.id === 'protect-pdf' ? 'Set Document Password' : 'Enter PDF Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full px-3 py-2 pr-10 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Watermark Options */}
                {tool.id === 'add-watermark' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-300 font-medium">Watermark Text</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-300 font-medium">Color Preset</label>
                      <div className="flex gap-2 pt-1">
                        {['#EF4444', '#3B82F6', '#F59E0B', '#6B7280', '#000000'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setWatermarkColor(c)}
                            className={`w-6 h-6 rounded-full border-2 transition-transform ${
                              watermarkColor === c ? 'scale-125 border-white' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-300 font-medium">
                        Opacity ({Math.round(watermarkOpacity * 100)}%)
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Page Number Position */}
                {tool.id === 'add-page-numbers' && (
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-300 font-medium">Position on Page</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {[
                        { id: 'bottom-center', label: 'Bottom Center' },
                        { id: 'bottom-right', label: 'Bottom Right' },
                        { id: 'bottom-left', label: 'Bottom Left' },
                        { id: 'top-center', label: 'Top Center' },
                        { id: 'top-right', label: 'Top Right' },
                        { id: 'top-left', label: 'Top Left' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => setPageNumberPosition(pos.id as PageNumberPosition)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                            pageNumberPosition === pos.id
                              ? 'border-teal-500 bg-teal-500/10 text-white'
                              : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Split / Delete Page Ranges */}
                {(tool.id === 'split-pdf' || tool.id === 'remove-pages' || tool.id === 'extract-pages') && (
                  <div className="space-y-1.5 max-w-md">
                    <label className="text-xs text-zinc-300 font-medium">Page Ranges</label>
                    <input
                      type="text"
                      value={pageRanges}
                      onChange={(e) => setPageRanges(e.target.value)}
                      placeholder="e.g. 1-3, 5, 8-10"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                    <p className="text-[11px] text-zinc-500">Use commas for individual pages or hyphens for ranges.</p>
                  </div>
                )}

                {/* Redact Text Input */}
                {tool.id === 'redact-pdf' && (
                  <div className="space-y-1.5 max-w-md">
                    <label className="text-xs text-zinc-300 font-medium">Text or Words to Redact</label>
                    <input
                      type="text"
                      value={redactTerms}
                      onChange={(e) => setRedactTerms(e.target.value)}
                      placeholder="e.g. John Doe, Confidential, 123-45-6789"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                    <p className="text-[11px] text-zinc-500">Separate multiple words, names, or phrases with commas.</p>
                  </div>
                )}

                {/* OCR PDF Options */}
                {tool.id === 'ocr-pdf' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-300 font-medium">Document Language</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'eng', label: 'English' },
                          { id: 'spa', label: 'Spanish' },
                          { id: 'fra', label: 'French' },
                          { id: 'deu', label: 'German' },
                        ].map((lang) => (
                          <button
                            key={lang.id}
                            type="button"
                            onClick={() => setOcrLanguage(lang.id)}
                            className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                              ocrLanguage === lang.id
                                ? 'border-teal-500 bg-teal-500/10 text-white'
                                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                            }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-zinc-300 font-medium">Output Format</label>
                      <div className="grid grid-cols-2 gap-2 max-w-sm">
                        <button
                          type="button"
                          onClick={() => setOcrFormat('pdf')}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                            ocrFormat === 'pdf'
                              ? 'border-teal-500 bg-teal-500/10 text-white'
                              : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          Searchable PDF (.pdf)
                        </button>
                        <button
                          type="button"
                          onClick={() => setOcrFormat('txt')}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                            ocrFormat === 'txt'
                              ? 'border-teal-500 bg-teal-500/10 text-white'
                              : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          Extracted Text (.txt)
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="force-ocr"
                        checked={forceOcr}
                        onChange={(e) => setForceOcr(e.target.checked)}
                        className="rounded border-zinc-700 bg-zinc-900 text-teal-500 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="force-ocr" className="text-xs text-zinc-300 cursor-pointer">
                        Force OCR on all pages (re-scans pages that already contain text)
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Progress Bar (during upload & async execution) */}
            {isProcessing && (
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <RotateCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
                    <span>{progressStatus || 'Processing...'}</span>
                  </span>
                  <span className="font-mono text-white font-bold">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'easeInOut' }}
                  />
                </div>
              </div>
            )}

            {/* Turnstile Bot Verification */}
            {selectedFiles.length > 0 && (
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs font-semibold text-white flex items-center justify-center sm:justify-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>Security Verification</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Cloudflare Turnstile confirms human verification before executing document operations.
                  </p>
                </div>
                <div className="flex justify-center">
                  <TurnstileWidget
                    ref={turnstileRef}
                    action="tool_process"
                    theme="dark"
                    onVerify={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken('')}
                    onError={() => setTurnstileToken('')}
                  />
                </div>
              </div>
            )}

            {/* Execute Button */}
            <div className="pt-2 flex justify-end">
              <button
                disabled={selectedFiles.length === 0 || isProcessing || !turnstileToken}
                onClick={handleExecute}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-white text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Processing Document...</span>
                  </>
                ) : !turnstileToken ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-zinc-500" />
                    <span>Verify to Execute {tool.shortTitle}</span>
                  </>
                ) : (
                  <>
                    <span>Execute {tool.shortTitle}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Result & Download State */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 sm:py-8 space-y-6"
          >
            <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center bg-teal-500/15 border border-teal-500/30 text-teal-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Your File is Ready!</h2>
              <p className="text-xs sm:text-sm text-zinc-400">Processed securely with PustakEdits engine.</p>
            </div>

            {/* Savings stats for compression */}
            {result.savings_percent !== undefined && result.savings_percent > 0 && (
              <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px]">Original</span>
                  <span className="font-mono text-zinc-300 font-bold">{formatBytes(result.original_size)}</span>
                </div>
                <div className="text-zinc-600">→</div>
                <div>
                  <span className="text-teal-400 block text-[10px]">Compressed</span>
                  <span className="font-mono text-white font-bold">{formatBytes(result.processed_size)}</span>
                </div>
                <div className="pl-2 border-l border-zinc-800">
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono font-bold text-[11px]">
                    -{result.savings_percent}%
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a
                href={`${process.env.NEXT_PUBLIC_PYTHON_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${result.download_url}`}
                download={result.file_name}
                className="w-full sm:w-auto px-7 py-3.5 sm:py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>
                  {result.file_name.endsWith('.zip')
                    ? 'Download Images (ZIP)'
                    : result.file_name.endsWith('.docx')
                    ? 'Download Word (.docx)'
                    : result.file_name.endsWith('.xlsx')
                    ? 'Download Excel (.xlsx)'
                    : result.file_name.endsWith('.pptx')
                    ? 'Download PowerPoint (.pptx)'
                    : result.file_name.endsWith('.txt')
                    ? 'Download Text (.txt)'
                    : result.file_name.endsWith('.md')
                    ? 'Download Markdown (.md)'
                    : 'Download Result PDF'}
                </span>
              </a>

              <button
                onClick={resetAll}
                className="w-full sm:w-auto px-5 py-3.5 sm:py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Process Another File</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Related Tools Section */}
      {relatedTools.length > 0 && (
        <div className="pt-8 border-t border-zinc-900 space-y-4">
          <h3 className="text-sm font-bold text-white">Related Tools You Might Need</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedTools.map((rel) => (
              <Link
                key={rel.id}
                href={rel.slug === 'edit-pdf' ? '/dashboard' : `/tools/${rel.slug}`}
                className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center gap-3 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800"
                  style={{ color: rel.accentColor }}
                >
                  <ToolIcon name={rel.icon} size={15} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors truncate">
                    {rel.title}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">{rel.category}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
