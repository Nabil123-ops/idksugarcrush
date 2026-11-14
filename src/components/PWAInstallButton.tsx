import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Download, Smartphone, X } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'compact' | 'full' }> = ({
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (Capacitor.isNativePlatform() || isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={
          variant === 'full'
            ? 'w-full candy-btn-blue py-2.5 rounded-full font-display font-black text-base text-white flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform'
            : 'candy-btn-blue flex items-center justify-center gap-2 w-full max-w-[290px] sm:max-w-[320px] py-2 px-4 rounded-full font-display font-extrabold text-xs tracking-wide text-white drop-shadow transition-transform active:scale-95 cursor-pointer mt-2'
        }
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>INSTALL APP</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={
            variant === 'full'
              ? 'w-full candy-btn-blue py-2.5 rounded-full font-display font-black text-base text-white flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform'
              : 'candy-btn-blue flex items-center justify-center gap-2 w-full max-w-[290px] sm:max-w-[320px] py-2 px-4 rounded-full font-display font-extrabold text-xs tracking-wide text-white drop-shadow transition-transform active:scale-95 cursor-pointer mt-2'
          }
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>INSTALL ON IPHONE / IPAD</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/80 p-4">
            <div className="w-full max-w-sm candy-panel-gold rounded-[28px] p-5 text-purple-950 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-lg">Install Sugar Crown</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-full bg-white/80 hover:bg-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-semibold text-purple-900 leading-relaxed">
                1. Tap the <strong>Share</strong> button in Safari&apos;s toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong> for fullscreen offline play.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="candy-btn-green w-full py-2 rounded-full font-display font-black text-sm text-white cursor-pointer"
              >
                GOT IT
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-3 left-3 z-50 flex items-center gap-2 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-display font-extrabold text-white shadow-lg border border-white/60 pointer-events-none">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      <span>Offline Mode</span>
    </div>
  );
};
