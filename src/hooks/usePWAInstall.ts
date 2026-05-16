import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(display-mode: standalone)');
    setIsInstalled(mql.matches);

    const ua = navigator.userAgent;
    setIsIOS(/iphone|ipad|ipod/i.test(ua) && !(window as { MSStream?: unknown }).MSStream);

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleChange = (e: MediaQueryListEvent) => setIsInstalled(e.matches);

    window.addEventListener('beforeinstallprompt', handlePrompt);
    mql.addEventListener('change', handleChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };

  const canInstall = !isInstalled && (!!installPrompt || isIOS);

  return { install, canInstall, isInstalled, isIOS };
};
