# Internationalization (i18n) Implementation for Nava AI

This document describes the comprehensive internationalization implementation for the Nava AI platform, supporting multiple languages including Indian regional languages.

## 🌍 Supported Languages

- **English** (en) - Default language
- **Hindi** (hi) - हिन्दी
- **Telugu** (te) - తెలుగు
- **Kannada** (kn) - ಕನ್ನಡ
- **Tamil** (ta) - தமிழ்
- **Bengali** (bn) - বাংলা
- **Spanish** (es) - Español

## 🏗️ Architecture Overview

The i18n implementation follows a full-stack approach:

### Frontend (React + i18next)
- **Library**: `react-i18next` with `i18next`
- **Language Detection**: Automatic browser language detection
- **Persistence**: Language preference stored in localStorage
- **Dynamic Loading**: Translation files loaded on demand

### Backend (Node.js + Express)
- **Library**: `i18next` with `i18next-express-middleware`
- **File Backend**: `i18next-fs-backend` for loading translation files
- **Middleware**: Automatic language detection from headers/cookies

## 📁 File Structure

```
├── lib/
│   └── i18n.ts                 # Frontend i18n configuration
├── locales/                    # Frontend translation files
│   ├── en.json
│   ├── hi.json
│   ├── te.json
│   ├── kn.json
│   ├── ta.json
│   ├── bn.json
│   └── es.json
├── components/
│   └── LanguageSwitcher.tsx    # Language switcher component
├── server/
│   ├── config/
│   │   └── i18n.js            # Backend i18n configuration
│   └── locales/               # Backend translation files
│       ├── en.json
│       └── hi.json
```

## 🚀 Frontend Implementation

### 1. Configuration (`lib/i18n.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import en from '../locales/en.json';
import hi from '../locales/hi.json';
// ... other languages

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  // ... other languages
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
```

### 2. Language Switcher Component

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  // ... other languages
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };
  
  // Component implementation...
}
```

### 3. Using Translations in Components

```typescript
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('landing.title')}</h1>
      <p>{t('landing.subtitle')}</p>
      <button>{t('navigation.login')}</button>
    </div>
  );
}
```

### 4. Translation Files Structure

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "navigation": {
    "home": "Home",
    "login": "Login",
    "signup": "Sign Up"
  },
  "landing": {
    "title": "Welcome to Nava AI",
    "subtitle": "Transform your ideas into reality..."
  },
  "home": {
    "welcome": "Hello {{name}}",
    "responses": {
      "greeting": "Hi {{name}}! How can I help you today?",
      "jokes": [
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        "Why did the AI go to therapy? It had too many deep learning issues! 🤖"
      ]
    }
  }
}
```

## 🔧 Backend Implementation

### 1. Configuration (`server/config/i18n.js`)

```javascript
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-express-middleware';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: './locales/{{lng}}.json'
    },
    detection: {
      order: ['header', 'cookie', 'querystring'],
      caches: ['cookie']
    }
  });

export default i18next;
export { middleware };
```

### 2. Server Integration (`server/index.js`)

```javascript
import i18next, { middleware } from "./config/i18n.js";

// Initialize i18n middleware
app.use(middleware.handle(i18next));

// Using translations in routes
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: req.t('api.welcome'),
    timestamp: new Date().toISOString(),
  });
});
```

## 🎯 Key Features

### 1. Automatic Language Detection
- **Frontend**: Detects browser language and falls back to English
- **Backend**: Detects language from HTTP headers, cookies, or query parameters

### 2. Language Persistence
- **Frontend**: Stores user's language preference in localStorage
- **Backend**: Uses cookies to maintain language preference across requests

### 3. Dynamic Language Switching
- Users can switch languages instantly without page reload
- All UI elements update immediately
- Language preference persists across sessions

### 4. Comprehensive Translation Coverage
- **UI Elements**: All buttons, labels, and messages
- **Navigation**: Menu items and page titles
- **Content**: Landing page content, feature descriptions
- **Interactive Elements**: Chat responses, error messages
- **Backend Messages**: API responses and error messages

### 5. Indian Language Support
- **Hindi**: Complete translation with Devanagari script
- **Telugu**: Full Telugu language support
- **Kannada**: Complete Kannada translation
- **Tamil**: Full Tamil language support
- **Bengali**: Complete Bengali translation

## 📝 Usage Examples

### Frontend Usage

```typescript
// Basic translation
const title = t('landing.title');

// Translation with variables
const welcome = t('home.welcome', { name: 'John' });

// Array of translations
const jokes = t('home.responses.jokes', { returnObjects: true }) as string[];

// Conditional translation
const message = isError ? t('errors.generic') : t('success.saved');
```

### Backend Usage

```javascript
// In route handlers
app.post('/api/auth/login', (req, res) => {
  try {
    // Authentication logic...
    res.json({
      success: true,
      message: req.t('auth.loginSuccess')
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: req.t('auth.loginFailed')
    });
  }
});
```

## 🔄 Language Switching Flow

1. **User clicks language switcher**
2. **Frontend calls `i18n.changeLanguage(newLang)`**
3. **Language preference saved to localStorage**
4. **All components re-render with new translations**
5. **Backend receives language preference via headers/cookies**
6. **API responses return translated messages**

## 🛠️ Development Guidelines

### Adding New Languages

1. **Create translation file**: `locales/{lang}.json`
2. **Add to i18n config**: Import and add to resources object
3. **Add to language switcher**: Include in languages array
4. **Test thoroughly**: Ensure all UI elements are translated

### Adding New Translation Keys

1. **Add to English file first**: `locales/en.json`
2. **Add to all other language files**: Maintain consistency
3. **Use descriptive keys**: Follow hierarchical structure
4. **Test interpolation**: Ensure variables work correctly

### Best Practices

- **Use semantic keys**: `navigation.login` instead of `button1`
- **Group related translations**: Keep related keys together
- **Handle pluralization**: Use i18next pluralization features
- **Test edge cases**: Empty strings, missing keys, long text
- **Maintain consistency**: Keep translation quality consistent across languages

## 🚀 Deployment Considerations

### Frontend
- Translation files are bundled with the application
- No additional build steps required
- Language switching works offline

### Backend
- Translation files must be deployed with the server
- Ensure proper file permissions for translation files
- Consider CDN for translation file delivery in production

## 🔍 Testing

### Manual Testing
1. **Language Switching**: Test all language options
2. **Persistence**: Verify language preference persists
3. **Fallback**: Test behavior with missing translations
4. **Edge Cases**: Test with very long text, special characters

### Automated Testing
```typescript
// Example test for language switching
test('should switch language correctly', () => {
  const { getByText } = render(<LanguageSwitcher />);
  
  fireEvent.click(getByText('हिन्दी'));
  expect(i18n.language).toBe('hi');
  
  fireEvent.click(getByText('English'));
  expect(i18n.language).toBe('en');
});
```

## 📊 Performance Considerations

- **Bundle Size**: Translation files add to bundle size
- **Loading Time**: Initial language detection adds minimal overhead
- **Memory Usage**: All translations loaded in memory
- **Caching**: Browser caches translation files

## 🔮 Future Enhancements

1. **Lazy Loading**: Load translation files on demand
2. **RTL Support**: Add right-to-left language support
3. **Pluralization**: Implement proper pluralization rules
4. **Date/Number Formatting**: Add locale-specific formatting
5. **Translation Management**: Add admin interface for translation updates

## 📞 Support

For questions or issues with the i18n implementation:

1. Check the translation files for missing keys
2. Verify language codes are correct
3. Test with browser developer tools
4. Check console for i18next errors

---

This implementation provides a robust, scalable internationalization solution that supports multiple languages and provides a seamless user experience across different locales.
