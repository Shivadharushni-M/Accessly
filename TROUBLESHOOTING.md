# Troubleshooting Guide

## Common Issues and Solutions

### 1. MSW Timeout Error

**Error**: `MSW failed to start: Error: MSW start timeout`

**Solutions**:
- **Clear browser cache** and refresh the page
- **Check browser console** for additional error messages
- **Disable browser extensions** that might interfere with service workers
- **Try incognito/private mode** to rule out extension conflicts
- **Restart the development server**:
  ```bash
  npm run dev
  ```

### 2. React Router Warnings

**Warning**: `React Router Future Flag Warning`

**Status**: ✅ **FIXED** - These warnings have been addressed by adding future flags to BrowserRouter.

### 3. 404 API Errors

**Error**: `Failed to load resource: 404 (Not Found)`

**Solutions**:
- **Ensure MSW is running** - Check console for "MSW started successfully"
- **Clear localStorage** - Open DevTools → Application → Storage → Clear Site Data
- **Check API endpoints** - Verify the request URL matches the mock handlers

### 4. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:
```bash
# Kill process using port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- --port 3001
```

### 5. Socket Connection Errors

**Warning**: `Socket connection failed`

**Status**: ✅ **HANDLED** - The app continues working without real-time features.

### 6. Build Errors

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Unsupported Browsers
- ❌ Internet Explorer (any version)
- ❌ Old versions of Chrome/Firefox/Safari

## Development vs Production

### Development Mode
- MSW mocks are enabled
- Hot reload is active
- Debug logging is enabled
- Service worker is disabled

### Production Mode
- MSW mocks are disabled
- Optimized build
- Service worker is enabled
- Debug logging is disabled

## Environment Variables

Create a `.env` file in the project root:

```env
# Socket server URL (optional)
VITE_SOCKET_URL=http://localhost:4000

# API base URL (optional)
VITE_API_BASE_URL=http://localhost:8000

# Enable/disable MSW
VITE_ENABLE_MSW=true
```

## Debug Mode

To enable debug mode, add this to your `.env` file:

```env
VITE_DEBUG=true
```

This will show additional console logs for troubleshooting.

## Getting Help

If you're still experiencing issues:

1. **Check the console** for error messages
2. **Clear browser cache** and try again
3. **Try a different browser** to rule out browser-specific issues
4. **Check Node.js version** - Ensure you have Node.js 18+
5. **Review the README.md** for setup instructions

## Common Console Messages

### Normal Messages
- `Preparing app...` - App initialization started
- `MSW worker imported, starting...` - MSW setup in progress
- `MSW started successfully` - Mock API is ready
- `Rendering app...` - React app is rendering

### Warning Messages (Usually OK)
- `Socket connection failed` - Real-time features disabled
- `MSW unhandled request` - API endpoint not mocked (normal for some requests)

### Error Messages (Need Attention)
- `MSW failed to start` - Mock API not working
- `Failed to start app` - Critical startup failure
- `Service Worker registration failed` - PWA features disabled 