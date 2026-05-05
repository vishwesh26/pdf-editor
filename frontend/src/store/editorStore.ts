import { create } from 'zustand';

export type TextBlock = {
  id: string;
  page: number;
  text: string;
  bbox: [number, number, number, number];
  font: string;
  size: number;
  color: string;
  flags: number; // PyMuPDF font flags: bit 0 = superscript, bit 1 = italic, bit 2 = serif, bit 3 = monospaced, bit 4 = bold
};

export type Edit = {
  id: string;
  page: number;
  text: string;
  original_bbox: [number, number, number, number];
  font: string;
  size: number;
  color: string;
  flags: number;
};

interface EditorState {
  fileId: string | null;
  numPages: number;
  currentPage: number;
  zoom: number;
  textBlocks: Record<number, TextBlock[]>;
  edits: Edit[];
  selectedBlock: TextBlock | null;
  isProcessing: boolean;
  
  setFileId: (id: string) => void;
  setNumPages: (num: number) => void;
  setCurrentPage: (page: number) => void;
  setZoom: (zoom: number) => void;
  setTextBlocks: (page: number, blocks: TextBlock[]) => void;
  addEdit: (edit: Edit) => void;
  setSelectedBlock: (block: TextBlock | null) => void;
  setIsProcessing: (status: boolean) => void;
  updateTextBlockText: (page: number, id: string, text: string) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  fileId: null,
  numPages: 0,
  currentPage: 1,
  zoom: 1.5,
  textBlocks: {},
  edits: [],
  selectedBlock: null,
  isProcessing: false,

  setFileId: (id) => set({ fileId: id }),
  setNumPages: (num) => set({ numPages: num }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setZoom: (zoom) => set({ zoom }),
  setTextBlocks: (page, blocks) => set((state) => ({
    textBlocks: { ...state.textBlocks, [page]: blocks }
  })),
  addEdit: (edit) => set((state) => {
    // Check if edit for this block ID already exists, if so update it
    const existingIndex = state.edits.findIndex(e => e.id === edit.id);
    if (existingIndex >= 0) {
      const newEdits = [...state.edits];
      newEdits[existingIndex] = edit;
      return { edits: newEdits };
    }
    return { edits: [...state.edits, edit] };
  }),
  setSelectedBlock: (block) => set({ selectedBlock: block }),
  setIsProcessing: (status) => set({ isProcessing: status }),
  updateTextBlockText: (page, id, text) => set((state) => {
    const blocks = state.textBlocks[page] || [];
    const newBlocks = blocks.map(b => b.id === id ? { ...b, text } : b);
    return { textBlocks: { ...state.textBlocks, [page]: newBlocks } };
  }),
  reset: () => set({ edits: [], textBlocks: {}, selectedBlock: null }),
}));
