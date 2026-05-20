import { useState } from 'react';
import { useScreenshots } from './hooks/useScreenshots';
import { HomeScreen } from './screens/HomeScreen';
import { PreviewScreen } from './screens/PreviewScreen';

type Screen = 'home' | 'preview';

export default function App() {
  const hook = useScreenshots();
  const [screen, setScreen] = useState<Screen>('home');

  return screen === 'home' ? (
    <HomeScreen
      screenshots={hook.screenshots}
      isProcessing={hook.isProcessing}
      setIsProcessing={hook.setIsProcessing}
      setPdfUrl={hook.setPdfUrl}
      addScreenshots={hook.addScreenshots}
      removeScreenshot={hook.removeScreenshot}
      updateScreenshot={hook.updateScreenshot}
      moveUp={hook.moveUp}
      moveDown={hook.moveDown}
      onNavigateToPreview={() => setScreen('preview')}
    />
  ) : (
    <PreviewScreen
      pdfUrl={hook.pdfUrl!}
      screenshotCount={hook.screenshots.length}
      onBack={() => setScreen('home')}
      onNewReport={() => {
        hook.clearAll();
        setScreen('home');
      }}
    />
  );
}
