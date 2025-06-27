import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

console.log('Setting up MSW with handlers:', handlers.length);
console.log('Available handlers:', handlers.map(h => h.info?.header || 'Unknown handler'));

export const worker = setupWorker(...handlers);

// Add better debugging
worker.events.on('request:start', ({ request }) => {
  console.log('🔄 MSW intercepted request:', request.method, request.url);
});

worker.events.on('request:unhandled', ({ request }) => {
  console.warn('⚠️ MSW unhandled request:', request.method, request.url);
});

worker.events.on('request:end', ({ request, response }) => {
  console.log('✅ MSW handled request:', request.method, request.url, '->', response.status);
});

worker.events.on('unhandledException', ({ error, request }) => {
  console.error('❌ MSW unhandled exception:', error, 'for request:', request.method, request.url);
});

// To start the worker, import and call worker.start() in your main entry point (e.g., main.jsx) during development.