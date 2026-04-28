import { useEditorStore } from "@/store/editorStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

export default function TextEditModal() {
  const { selectedBlock, setSelectedBlock, addEdit, updateTextBlockText } = useEditorStore();
  const [text, setText] = useState("");

  useEffect(() => {
    if (selectedBlock) {
      setText(selectedBlock.text);
    }
  }, [selectedBlock]);

  if (!selectedBlock) return null;

  const handleSave = () => {
    // Add to edits queue
    addEdit({
      id: selectedBlock.id,
      page: selectedBlock.page,
      text: text,
      original_bbox: selectedBlock.bbox,
      font: selectedBlock.font,
      size: selectedBlock.size,
      color: selectedBlock.color
    });

    // Optimistically update the UI text block
    updateTextBlockText(selectedBlock.page, selectedBlock.id, text);
    
    // Close modal
    setSelectedBlock(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="bg-white dark:bg-zinc-900 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-950">
            <h3 className="font-bold text-base sm:text-lg">Edit Text</h3>
            <button 
              onClick={() => setSelectedBlock(null)}
              className="text-gray-500 hover:text-black dark:hover:text-white transition-colors p-2"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap gap-2 sm:gap-4 text-xs text-muted-foreground bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-gray-100 dark:border-zinc-800">
              <div><span className="font-semibold text-foreground">Font:</span> {selectedBlock.font.split(',')[0]}</div>
              <div><span className="font-semibold text-foreground">Size:</span> {Math.round(selectedBlock.size)}pt</div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground">Color:</span> 
                <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: selectedBlock.color }}></span>
              </div>
            </div>

            <label className="block text-sm font-medium mb-2">Text Content</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-24 sm:h-32 px-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm sm:text-base"
              autoFocus
            />
          </div>
          
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-2 sm:gap-3">
            <button 
              onClick={() => setSelectedBlock(null)}
              className="px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors flex-1 sm:flex-none"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20 flex-1 sm:flex-none"
            >
              <Check size={16} />
              Save Edit
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
