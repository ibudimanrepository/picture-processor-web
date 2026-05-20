import type { ScreenshotItem as ScreenshotItemType } from '../types';

interface Props {
  item: ScreenshotItemType;
  index: number;
  totalCount: number;
  onPress: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export function ScreenshotItemComponent({
  item,
  index,
  totalCount,
  onPress,
  onMoveUp,
  onMoveDown,
  onDelete,
}: Props) {
  const stepNum = index + 1;
  const hasDesc = item.stepDescription.length > 0;
  const isFirst = index === 0;
  const isLast = index === totalCount - 1;

  return (
    <div className="screenshot-card" onClick={onPress}>
      <img src={item.uri} className="screenshot-thumb" alt={`Screenshot ${stepNum}`} />
      <div className="screenshot-info">
        <span className="step-num">Step {stepNum}</span>
        <span className="step-title">
          {item.stepTitle || 'Tap to add title'}
        </span>
        {hasDesc && (
          <span className="step-desc truncate">{item.stepDescription}</span>
        )}
      </div>
      <div className="screenshot-actions">
        <button
          className={`arrow-btn ${isFirst ? 'arrow-disabled' : ''}`}
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          disabled={isFirst}
        >
          ▲
        </button>
        <button
          className={`arrow-btn ${isLast ? 'arrow-disabled' : ''}`}
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          disabled={isLast}
        >
          ▼
        </button>
        <button
          className="delete-btn"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
