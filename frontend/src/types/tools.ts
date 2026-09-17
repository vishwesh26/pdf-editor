export type CompressionQuality = 'extreme' | 'recommended' | 'low';

export type WatermarkColor = 
  | '#6B7280' 
  | '#EF4444' 
  | '#3B82F6' 
  | '#F59E0B' 
  | '#000000' 
  | '#FFFFFF'
  | (string & {});

export type PageNumberPosition = 
  | 'bottom-center' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'top-center' 
  | 'top-right' 
  | 'top-left';

export type ImageFormat = 'png' | 'jpeg' | 'webp';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ToolJobResult {
  download_url: string;
  file_name: string;
  original_size?: number;
  processed_size?: number;
  savings_percent?: number;
  page_count?: number;
}

export interface ToolJobStatusResponse {
  job_id: string;
  tool: string;
  status: JobStatus;
  progress: number;
  result?: ToolJobResult;
  error?: string;
  created_at: number;
}

export type ToolCategory = 
  | 'Organize PDF'
  | 'Optimize PDF'
  | 'Convert to PDF'
  | 'Convert from PDF'
  | 'Edit PDF'
  | 'PDF Security'
  | 'PDF Intelligence';

export interface PDFToolDef {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: ToolCategory;
  badge?: 'Flagship' | 'Popular' | 'New' | 'AI' | 'Pro' | 'Soon';
  icon: string;
  accentColor: string; // e.g. '#ff5a36' | '#2fd6c4' | '#4c7fff' | '#ffcc4d'
  isReady: boolean;
  isMultiFile?: boolean;
  acceptTypes?: string; // e.g. '.pdf' or 'image/*'
  apiEndpoint?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}
