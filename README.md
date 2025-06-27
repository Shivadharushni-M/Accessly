# User Management System

A modern React-based user management system with role-based access control (RBAC), real-time features, and elegant UI.

## 🌐 Browser Compatibility

This application is compatible with all modern browsers:

- **Chrome** 90+ ✅
- **Firefox** 88+ ✅  
- **Safari** 14+ ✅
- **Edge** 90+ ✅

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd MStack/User-Management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Production Build

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist` folder** to any static hosting service.

## 🔧 Environment Variables

Create a `.env` file in the project root for custom configuration:

```env
# Socket server URL (optional - defaults to localhost:4000)
VITE_SOCKET_URL=http://your-socket-server.com

# API base URL (optional - uses MSW mocks by default)
VITE_API_BASE_URL=http://your-api-server.com
```

## 📱 Features

- **Role-Based Access Control**: System Administrator, Tenant Admin, and User roles
- **Real-time Dashboard**: Live updates and notifications
- **User Management**: Complete CRUD operations
- **Organization Management**: Multi-tenant support
- **Modern UI**: Responsive design with dark/light themes
- **Mock API**: MSW for development and testing

## 🛠️ Troubleshooting

### Common Issues

1. **Port 3000 already in use:**
   ```bash
   # Kill process using port 3000
   npx kill-port 3000
   # Or use a different port
   npm run dev -- --port 3001
   ```

2. **Socket connection errors:**
   - The app will continue working without real-time features
   - Check console for warnings about socket connection

3. **Build errors:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Cross-Machine Deployment

The application is designed to work across different machines:

- ✅ **No hardcoded paths**
- ✅ **Environment-based configuration**
- ✅ **Graceful fallbacks for missing services**
- ✅ **Modern browser compatibility**

## 📦 Dependencies

- **React 18.3.1** - UI framework
- **Vite 7.0.0** - Build tool
- **Tailwind CSS** - Styling
- **MSW 2.10.2** - API mocking
- **Socket.io** - Real-time features
- **Zustand** - State management

## 🔒 Security

- Role-based permissions
- Input validation
- XSS protection
- CSRF protection (when connected to real backend)

## 📄 License

This project is for demonstration purposes.