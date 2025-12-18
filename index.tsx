import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AIHistoryProvider } from './contexts/AIHistoryContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <NotificationProvider>
        <UserProvider>
          <AIHistoryProvider>
            <App />
          </AIHistoryProvider>
        </UserProvider>
      </NotificationProvider>
    </SettingsProvider>
  </React.StrictMode>
);