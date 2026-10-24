import React from 'react';
import { RotateCcw, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onUndo, onDismiss }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50 flex items-center justify-between gap-3 p-3.5 bg-[var(--text-main)] text-[var(--bg-canvas)] shadow-xl rounded-none border border-[var(--border-line)] animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className="flex-1 text-xs sm:text-sm font-medium tracking-tight">
        {message}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onUndo && (
          <button
            onClick={onUndo}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-[var(--bg-canvas)] text-[var(--text-main)] hover:opacity-90 active:scale-95 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        )}
        <button
          onClick={onDismiss}
          className="p-1 text-[var(--bg-canvas)]/70 hover:text-[var(--bg-canvas)] transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
