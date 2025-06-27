import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';

console.log('Preparing app...');
async function prepare() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mocks');
      console.log('MSW worker imported, starting...');
      
      // Increase timeout and add better error handling
      await Promise.race([
        worker.start({
          onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
          serviceWorker: {
            url: '/mockServiceWorker.js'
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('MSW start timeout after 10 seconds')), 10000)
        )
      ]);
      console.log('MSW started successfully');
    } catch (err) {
      console.warn('MSW failed to start, continuing without mocks:', err.message);
      // Don't throw error, just continue without MSW
    }
  }
}

prepare().then(() => {
  console.log('Rendering app...');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch((err) => {
  console.error('Failed to start app:', err);
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <div style={{
      color: 'red',
      padding: 40,
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>Failed to start app</h2>
      <p>{String(err)}</p>
      <p>Please refresh the page or check the console for more details.</p>
    </div>
  );
});

// Only register service worker in production or if explicitly enabled
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', { type: 'module' })
    .then(registration => {
      console.log('Service Worker registered:', registration);
    })
    .catch(error => {
      console.warn('Service Worker registration failed:', error);
    });
}
