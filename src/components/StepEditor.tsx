import { useState } from 'react';
import type { ScreenshotItem } from '../types';

interface Props {
  item: ScreenshotItem;
  onSave: (title: string, description: string) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function StepEditor({ item, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState(item.stepTitle);
  const [description, setDescription] = useState(item.stepDescription);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <span className="modal-title">Edit Step</span>
          <button
            className="modal-done"
            onClick={() => onSave(title, description)}
          >
            Done
          </button>
        </div>
        <div className="modal-body">
          <label className="field-label">Step Title</label>
          <input
            className="field-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Login Screen"
          />

          <label className="field-label">Description</label>
          <textarea
            className="field-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What should the tester verify?"
          />

          <button className="delete-step-btn" onClick={onDelete}>
            Delete Step
          </button>
        </div>
      </div>
    </div>
  );
}
