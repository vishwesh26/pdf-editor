import React from 'react';
import {
  Layers,
  Scissors,
  Trash2,
  FileOutput,
  RotateCw,
  Minimize2,
  Wrench,
  Image as ImageIcon,
  FileText,
  Globe,
  FileImage,
  FileCode,
  FileSpreadsheet,
  Pencil,
  Binary,
  Stamp,
  Crop,
  Lock,
  Unlock,
  PenTool,
  Sparkles,
  Languages,
  FileBox,
  Presentation,
  GitCompare,
  EyeOff,
  FileArchive,
  Scan,
} from 'lucide-react';

interface ToolIconProps {
  name: string;
  className?: string;
  color?: string;
  size?: number;
}

export default function ToolIcon({ name, className = 'w-4 h-4', color, size = 16 }: ToolIconProps) {
  const iconProps = { className, size, style: color ? { color } : undefined };

  switch (name) {
    case 'Layers': return <Layers {...iconProps} />;
    case 'Scissors': return <Scissors {...iconProps} />;
    case 'Trash2': return <Trash2 {...iconProps} />;
    case 'RotateCw': return <RotateCw {...iconProps} />;
    case 'Minimize2': return <Minimize2 {...iconProps} />;
    case 'Wrench': return <Wrench {...iconProps} />;
    case 'Image': return <ImageIcon {...iconProps} />;
    case 'FileText': return <FileText {...iconProps} />;
    case 'Globe': return <Globe {...iconProps} />;
    case 'FileImage': return <FileImage {...iconProps} />;
    case 'FileCode': return <FileCode {...iconProps} />;
    case 'FileSpreadsheet': return <FileSpreadsheet {...iconProps} />;
    case 'Presentation': return <Presentation {...iconProps} />;
    case 'GitCompare': return <GitCompare {...iconProps} />;
    case 'EyeOff': return <EyeOff {...iconProps} />;
    case 'FileArchive': return <FileArchive {...iconProps} />;
    case 'Scan': return <Scan {...iconProps} />;
    case 'Pencil': return <Pencil {...iconProps} />;
    case 'Binary': return <Binary {...iconProps} />;
    case 'Stamp': return <Stamp {...iconProps} />;
    case 'Crop': return <Crop {...iconProps} />;
    case 'Lock': return <Lock {...iconProps} />;
    case 'Unlock': return <Unlock {...iconProps} />;
    case 'PenTool': return <PenTool {...iconProps} />;
    case 'Sparkles': return <Sparkles {...iconProps} />;
    case 'Languages': return <Languages {...iconProps} />;
    default: return <FileBox {...iconProps} />;
  }
}
