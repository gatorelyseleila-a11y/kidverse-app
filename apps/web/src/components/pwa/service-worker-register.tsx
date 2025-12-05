'use client';

import { useEffect, useState } from 'react';
import { Download, X, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export function ServiceWorkerRegister() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setShowUpdatePrompt(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    }

    // Install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt after 30 seconds if not installed
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleUpdate = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl shadow-lg animate-pulse">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Mode hors-ligne</span>
        </div>
      )}

      {/* Install prompt */}
      {showInstallPrompt && deferredPrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-slide-up">
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-orange rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              K
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Installer KIDVERSE</h3>
              <p className="text-sm text-gray-500 mt-1">
                Installez l'application pour un accès rapide et une utilisation hors-ligne.
              </p>
              <button
                onClick={handleInstall}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blue-dark transition-colors"
              >
                <Download className="w-4 h-4" />
                Installer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update prompt */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
          <button
            onClick={() => setShowUpdatePrompt(false)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Mise à jour disponible</h3>
              <p className="text-sm text-gray-500 mt-1">
                Une nouvelle version de KIDVERSE est disponible.
              </p>
              <button
                onClick={handleUpdate}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

