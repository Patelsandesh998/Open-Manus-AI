# 🚀 How to Run Nava AI with Internationalization

## Prerequisites Installation

Since Node.js and npm are not currently installed on your system, please follow these steps:

### 1. Install Node.js and npm

**Option A: Download from Official Website (Recommended)**
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (Long Term Support)
3. Run the installer and follow the installation wizard
4. Restart your command prompt/PowerShell

**Option B: Using Chocolatey (if you have it)**
```powershell
choco install nodejs
```

**Option C: Using Winget (Windows Package Manager)**
```powershell
winget install OpenJS.NodeJS
```

### 2. Verify Installation
After installation, open a new PowerShell window and run:
```powershell
node --version
npm --version
```

You should see version numbers for both commands.

## 🏃‍♂️ Running the Project

### 1. Install Dependencies
```powershell
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Start the Development Server
```powershell
# Start the frontend (in one terminal)
npm run dev

# Start the backend (in another terminal)
cd server
npm start
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🌍 Language Switcher Features

The language switcher is now positioned in the **top header navbar** and includes:

### ✅ **Available Languages**
- 🇺🇸 **English** (en)
- 🇮🇳 **Hindi** (hi) - हिन्दी
- 🇮🇳 **Telugu** (te) - తెలుగు
- 🇮🇳 **Kannada** (kn) - ಕನ್ನಡ
- 🇮🇳 **Tamil** (ta) - தமிழ்
- 🇮🇳 **Bengali** (bn) - বাংলা
- 🇪🇸 **Spanish** (es) - Español

### 🎯 **Key Features**
- **Small Button Design**: Compact language switcher in the header
- **Flag Icons**: Visual representation with country flags
- **Native Names**: Languages displayed in their native scripts
- **Instant Switching**: No page reload required
- **Persistent Choice**: Language preference saved across sessions
- **Responsive**: Works on both desktop and mobile

### 📍 **Location**
The language switcher is positioned in the **top-right header** between the theme toggle and user profile dropdown.

## 🔧 Troubleshooting

### If npm is still not recognized:
1. **Restart your computer** after installing Node.js
2. **Check PATH environment variable**:
   - Open System Properties → Environment Variables
   - Ensure Node.js installation directory is in PATH
3. **Try using full path**:
   ```powershell
   "C:\Program Files\nodejs\npm.cmd" install
   ```

### If you get permission errors:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### If port 5173 is already in use:
```powershell
# Kill process using the port
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

## 🎨 UI Preview

Once running, you'll see:
- **Header**: Logo, navigation, notifications, theme toggle, **language switcher**, and user profile
- **Language Switcher**: Small globe icon with current language flag
- **Dropdown**: Click to see all available languages with flags and native names
- **Instant Translation**: All UI elements change immediately when language is switched

## 📱 Mobile Support

The language switcher is fully responsive:
- **Desktop**: Shows flag + language name
- **Mobile**: Shows only flag icon to save space
- **Touch-friendly**: Easy to tap on mobile devices

---

**Note**: The language switcher will be visible in the header once you successfully run the project with Node.js and npm installed.
