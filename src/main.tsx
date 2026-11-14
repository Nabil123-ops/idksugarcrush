import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  StatusBar.setBackgroundColor({ color: '#4c1d95' }).catch(() => {});
  SplashScreen.hide().catch(() => {});
} else {
  registerSW({ immediate: true });
}

createRoot(document.getElementById('root')!).render(<App />);
