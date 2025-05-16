import { useEffect } from 'react';

interface KeyboardShortcutProps {
  onSubmit: () => void;
  onClear: () => void;
  isEnabled?: boolean;
}

export function useKeyboardShortcuts({ onSubmit, onClear, isEnabled = true }: KeyboardShortcutProps) {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClear();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSubmit, onClear, isEnabled]);
}