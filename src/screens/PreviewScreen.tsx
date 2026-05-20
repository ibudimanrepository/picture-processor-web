import { ActionButton } from '../components/ActionButton';

interface Props {
  pdfUrl: string;
  screenshotCount: number;
  onBack: () => void;
  onNewReport: () => void;
}

export function PreviewScreen({
  pdfUrl,
  screenshotCount,
  onBack,
  onNewReport,
}: Props) {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `snapreport-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = () => {
    if (navigator.share) {
      const blob = fetch(pdfUrl).then((r) => r.blob());
      blob.then((b) => {
        const file = new File([b], `snapreport-${Date.now()}.pdf`, {
          type: 'application/pdf',
        });
        navigator.share({
          title: 'QA Report',
          text: 'Here is your QA testing report',
          files: [file],
        });
      });
    } else {
      handleDownload();
    }
  };

  return (
    <div className="preview-container">
      <header className="preview-topbar">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
      </header>

      <div className="preview-content">
        <div className="checkmark">
          <span className="checkmark-icon">✓</span>
        </div>
        <h2 className="preview-title">Report Ready</h2>
        <p className="preview-subtitle">
          {screenshotCount} step{screenshotCount > 1 ? 's' : ''} included
        </p>
        <p className="preview-hint">
          Share via WhatsApp, Email, AirDrop,<br />
          or any app from the share sheet
        </p>
      </div>

      <div className="preview-bottom">
        <ActionButton title="Share" onPress={handleShare} variant="primary" />
        <div className="button-spacer-v" />
        <ActionButton
          title="Download"
          onPress={handleDownload}
          variant="secondary"
        />
        <div className="button-spacer-v" />
        <ActionButton
          title="New Report"
          onPress={onNewReport}
          variant="secondary"
        />
      </div>
    </div>
  );
}
