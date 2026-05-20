import React, { useState, useRef } from 'react';
import type { ScreenshotItem } from '../types';
import { generatePDF } from '../services/pdfGenerator';
import { compressImage } from '../utils/imageUtils';
import { EmptyState } from '../components/EmptyState';
import { ScreenshotItemComponent } from '../components/ScreenshotItem';
import { StepEditor } from '../components/StepEditor';
import { ActionButton } from '../components/ActionButton';

interface Props {
  screenshots: ScreenshotItem[];
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
  setPdfUrl: (url: string | null) => void;
  addScreenshots: (uris: string[]) => void;
  removeScreenshot: (id: string) => void;
  updateScreenshot: (id: string, updates: Partial<ScreenshotItem>) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  onNavigateToPreview: () => void;
}

export function HomeScreen({
  screenshots,
  isProcessing,
  setIsProcessing,
  setPdfUrl,
  addScreenshots,
  removeScreenshot,
  updateScreenshot,
  moveUp,
  moveDown,
  onNavigateToPreview,
}: Props) {
  const [editingItem, setEditingItem] = useState<ScreenshotItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uris: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const compressed = await compressImage(files[i]);
      uris.push(compressed);
    }
    addScreenshots(uris);

    // Reset so same files can be re-selected
    e.target.value = '';
  };

  const handleProcess = async () => {
    if (screenshots.length === 0) return;
    setIsProcessing(true);
    try {
      const url = await generatePDF(screenshots);
      setPdfUrl(url);
      onNavigateToPreview();
    } catch {
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const count = screenshots.length;

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="app-title">SnapReport</h1>
        <p className="app-subtitle">
          {count > 0
            ? `${count} screenshot${count > 1 ? 's' : ''}`
            : 'QA Testing Report Generator'}
        </p>
      </header>

      {count === 0 ? (
        <EmptyState onAddPress={() => fileInputRef.current?.click()} />
      ) : (
        <div className="screenshot-list">
          {screenshots.map((item, index) => (
            <ScreenshotItemComponent
              key={item.id}
              item={item}
              index={index}
              totalCount={count}
              onPress={() => setEditingItem(item)}
              onMoveUp={() => moveUp(index)}
              onMoveDown={() => moveDown(index)}
              onDelete={() => removeScreenshot(item.id)}
            />
          ))}
        </div>
      )}

      {count > 0 && (
        <div className="bottom-bar">
          <ActionButton
            title="Upload"
            onPress={() => fileInputRef.current?.click()}
            variant="secondary"
          />
          <div className="button-spacer" />
          <ActionButton
            title={`Process ${count} Step${count > 1 ? 's' : ''}`}
            onPress={handleProcess}
            variant="primary"
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        style={{ display: 'none' }}
      />

      {editingItem && (
        <StepEditor
          item={editingItem}
          onSave={(title, desc) => {
            updateScreenshot(editingItem.id, {
              stepTitle: title,
              stepDescription: desc,
            });
            setEditingItem(null);
          }}
          onDelete={() => {
            removeScreenshot(editingItem.id);
            setEditingItem(null);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}

      {isProcessing && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p className="loading-text">Generating report...</p>
          <p className="loading-subtext">
            Compressing and processing {count} screenshot{count > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
