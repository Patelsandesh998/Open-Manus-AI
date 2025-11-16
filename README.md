# OpenManus-Full
  Nava ai - AI Dashboard

A modern AI dashboard with glassmorphism effects, light/dark mode support, and comprehensive chat functionality.
🚀 Technologies Used

* React 18 - Modern React with hooks
* TypeScript - Type-safe JavaScript
* Vite - Fast build tool and dev server
* Tailwind CSS v4 - Utility-first CSS framework
* Shadcn/ui - Beautiful, accessible component library
* Lucide React - Icon library
* Recharts - Chart library
* LocalStorage - Persistent chat history
📋 Prerequisites

Before you begin, ensure you have installed:
* Node.js (v18 or higher) - Download here
* npm (comes with Node.js) or yarn or pnpm
Check your installation:
node --version  # should be v18 or higher
npm --version   # should be 9 or higher

🛠️ Installation & Setup

1. Download/Clone the project

Place all the project files in a folder (e.g., nava-ai)
2. Install Dependencies

Open your terminal in the project folder and run:
npm install

This will install all the dependencies listed in package.json.
3. Run Development Server

npm run dev

The app will start at http://localhost:5173
4. Build for Production

npm run build

This creates an optimized production build in the dist folder.
5. Preview Production Build

npm run preview
1️⃣ Frontend Setup (React)
cd frontend
npm install
npm run dev

2️⃣ Server Setup (Node.js)
cd frontend/server
npm install
node index.js

3️⃣ Backend Setup (Python + FastAPI)
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api:app --reload

📁 Project Structure

nava-ai/
├── components/           # React components
│   ├── ui/              # Shadcn UI components
│   ├── figma/           # Figma-specific components
│   ├── AnimatedSphere.tsx
│   ├── DashboardLayout.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── LandingPage.tsx
│   └── ...
├── styles/
│   └── globals.css      # Global styles & Tailwind config
├── App.tsx              # Main app component
├── main.tsx             # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration

🎨 Features

* ✅ Login/Sign Up Pages - Social authentication UI
* ✅ Landing Page - 3D animated sphere with cursor tracking
* ✅ Home Dashboard - AI task creation with sidebar navigation
* ✅ Chat Interface - Intelligent responses with math capabilities
* ✅ Voice Input - Animated sphere responds to voice
* ✅ Sandbox Page - Test AI outputs
* ✅ Chat History - Persistent storage with LocalStorage
* ✅ Light/Dark Mode - Glassmorphism effects in both themes
* ✅ Responsive Design - Works on all screen sizes
🎯 Usage

1. Landing Page - Click "Get Started" to see login
2. Login - Click "Sign in with Google" or any social option
3. Home Dashboard - Start chatting with Nava ai
4. Try Commands:
    * "Hello" - Get a greeting
    * "15 + 25" - Math calculations
    * "Create code" - Opens sandbox
    * "What can you do" - See capabilities
5. Voice Input - Click the mic icon to use voice
6. History - View past conversations in sidebar
🔧 VS Code Setup (Recommended)

Recommended Extensions:

1. ESLint - Code linting
2. Prettier - Code formatting
3. Tailwind CSS IntelliSense - Tailwind autocomplete
4. TypeScript Vue Plugin (Volar) - Better TS support
Settings:

Add to .vscode/settings.json:
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}

🐛 Troubleshooting

Port already in use

# Kill process on port 5173
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

Module not found errors

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

Build errors

# Clean build cache
rm -rf dist .vite
npm run build

📝 Customization

Change Accent Color

Edit /styles/globals.css:
:root {
  --primary: #7B61FF; /* Change this color */
}

Change Font

Edit index.html and globals.css to use a different Google Font.
Add New Pages

1. Create component in /components/
2. Add route in App.tsx
3. Add navigation in DashboardLayout.tsx
🌐 Browser Support

* Chrome (recommended)
* Firefox
* Safari
* Edge
📦 Dependencies Overview

Package	Purpose
react	UI library
tailwindcss	Styling
@radix-ui/*	Accessible components
lucide-react	Icons
recharts	Charts
sonner	Toast notifications
next-themes	Theme switching
🤝 Contributing

This is a prototype project. Feel free to fork and modify!
📄 License

MIT License - Feel free to use for personal or commercial projects.
🆘 Need Help?

* Check the browser console for errors (F12)
* Make sure all files are in the correct folders
* Verify Node.js version is 18+
* Clear browser cache if styling looks broken
🎉 Enjoy using Nava AI!
