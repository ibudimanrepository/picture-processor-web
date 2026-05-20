import { useState, useCallback } from 'react';
import type { ScreenshotItem } from '../types';

const generateId = () =>
  `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

interface UseScreenshotsReturn {
  screenshots: ScreenshotItem[];
  pdfUrl: string | null;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
  setPdfUrl: (url: string | null) => void;
  addScreenshots: (uris: string[]) => void;
  removeScreenshot: (id: string) => void;
  updateScreenshot: (id: string, updates: Partial<ScreenshotItem>) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  clearAll: () => void;
}

export function useScreenshots(): UseScreenshotsReturn {
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const addScreenshots = useCallback((uris: string[]) => {
    const newItems: ScreenshotItem[] = uris.map((uri) => ({
      id: generateId(),
      uri,
      stepTitle: '',
      stepDescription: '',
    }));
    setScreenshots((prev) => [...prev, ...newItems]);
  }, []);

  const removeScreenshot = useCallback((id: string) => {
    setScreenshots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateScreenshot = useCallback(
    (id: string, updates: Partial<ScreenshotItem>) => {
      setScreenshots((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
    },
    []
  );

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setScreenshots((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setScreenshots((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setScreenshots([]);
    setPdfUrl(null);
  }, []);

  return {
    screenshots,
    pdfUrl,
    isProcessing,
    setIsProcessing,
    setPdfUrl,
    addScreenshots,
    removeScreenshot,
    updateScreenshot,
    moveUp,
    moveDown,
    clearAll,
  };
}
