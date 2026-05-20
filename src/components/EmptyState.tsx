import { ActionButton } from './ActionButton';

interface Props {
  onAddPress: () => void;
}

export function EmptyState({ onAddPress }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📸</div>
      <h2 className="empty-title">No Screenshots Yet</h2>
      <p className="empty-desc">
        Select screenshots from your device<br />to create a testing report
      </p>
      <div className="empty-button">
        <ActionButton title="Upload" onPress={onAddPress} variant="primary" />
      </div>
    </div>
  );
}
