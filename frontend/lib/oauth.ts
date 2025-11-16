// OAuth Configuration and Helper Functions

interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

// Google OAuth Configuration
export const googleOAuthConfig: OAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  redirectUri: typeof window !== 'undefined' ? window.location.origin + '/auth/callback/google' : '',
  scope: 'email profile openid',
};

// Check if OAuth is configured
export const isGoogleConfigured = () => !!import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const isMicrosoftConfigured = () => !!import.meta.env.VITE_MICROSOFT_CLIENT_ID;
export const isAppleConfigured = () => !!import.meta.env.VITE_APPLE_CLIENT_ID;

// Microsoft OAuth Configuration
export const microsoftOAuthConfig: OAuthConfig = {
  clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
  redirectUri: typeof window !== 'undefined' ? window.location.origin + '/auth/callback/microsoft' : '',
  scope: 'openid profile email User.Read',
};

// Apple OAuth Configuration
export const appleOAuthConfig = {
  clientId: import.meta.env.VITE_APPLE_CLIENT_ID || '',
  redirectUri: typeof window !== 'undefined' ? window.location.origin + '/auth/callback/apple' : '',
  scope: 'name email',
};

// Initialize Google OAuth
export const initGoogleOAuth = () => {
  return new Promise<any>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    // Skip if not configured
    if (!isGoogleConfigured()) {
      resolve(null); // Resolve with null instead of rejecting
      return;
    }

    // Check if already loaded
    if (window.google) {
      resolve(window.google);
      return;
    }

    // Load Google OAuth script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleOAuthConfig.clientId,
          callback: (response: any) => resolve(response),
        });
        resolve(window.google);
      } else {
        reject(new Error('Google OAuth failed to load'));
      }
    };
    
    script.onerror = () => reject(new Error('Failed to load Google OAuth script'));
    document.head.appendChild(script);
  });
};

// Google Sign In
export const signInWithGoogle = async () => {
  return new Promise<any>((resolve, reject) => {
    try {
      if (!isGoogleConfigured()) {
        reject(new Error('Google OAuth is not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file.'));
        return;
      }

      if (!window.google) {
        reject(new Error('Google OAuth not initialized'));
        return;
      }

      // Use the One Tap prompt approach
      window.google.accounts.id.initialize({
        client_id: googleOAuthConfig.clientId,
        callback: (response: any) => {
          // Clean up temporary button if it exists
          const tempContainer = document.getElementById('google-signin-button-temp');
          if (tempContainer) {
            document.body.removeChild(tempContainer);
          }
          
          if (response.credential) {
            // Decode JWT token to get user info
            try {
              const payload = JSON.parse(atob(response.credential.split('.')[1]));
              resolve({
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                providerId: payload.sub,
              });
            } catch (error) {
              reject(new Error('Failed to decode Google credential'));
            }
          } else {
            reject(new Error('No credential received'));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Try to show One Tap prompt
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One Tap doesn't work, use renderButton approach
          // Create a temporary container for the button
          const container = document.createElement('div');
          container.id = 'google-signin-button-temp';
          container.style.position = 'fixed';
          container.style.top = '50%';
          container.style.left = '50%';
          container.style.transform = 'translate(-50%, -50%)';
          container.style.zIndex = '10000';
          container.style.background = 'white';
          container.style.padding = '20px';
          container.style.borderRadius = '8px';
          container.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          
          // Add close button
          const closeBtn = document.createElement('button');
          closeBtn.textContent = '×';
          closeBtn.style.position = 'absolute';
          closeBtn.style.top = '5px';
          closeBtn.style.right = '5px';
          closeBtn.style.border = 'none';
          closeBtn.style.background = 'none';
          closeBtn.style.fontSize = '24px';
          closeBtn.style.cursor = 'pointer';
          closeBtn.onclick = () => {
            document.body.removeChild(container);
            reject(new Error('Sign-in cancelled'));
          };
          container.appendChild(closeBtn);
          
          const buttonContainer = document.createElement('div');
          buttonContainer.id = 'google-button-container';
          container.appendChild(buttonContainer);
          
          document.body.appendChild(container);
          
          window.google.accounts.id.renderButton(
            buttonContainer,
            {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 300,
            }
          );
          
          // Set a timeout to auto-close
          setTimeout(() => {
            if (document.getElementById('google-signin-button-temp')) {
              document.body.removeChild(container);
              reject(new Error('Sign-in timeout'));
            }
          }, 60000); // 1 minute timeout
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Microsoft Sign In
export const signInWithMicrosoft = async () => {
  return new Promise<any>((resolve, reject) => {
    try {
      if (!isMicrosoftConfigured()) {
        reject(new Error('Microsoft OAuth is not configured. Please add VITE_MICROSOFT_CLIENT_ID to your .env file.'));
        return;
      }

      // Open Microsoft login popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${microsoftOAuthConfig.clientId}` +
        `&response_type=id_token token` +
        `&redirect_uri=${encodeURIComponent(microsoftOAuthConfig.redirectUri)}` +
        `&scope=${encodeURIComponent(microsoftOAuthConfig.scope)}` +
        `&response_mode=fragment` +
        `&nonce=${Math.random().toString(36).substring(7)}`;

      const popup = window.open(
        authUrl,
        'Microsoft Sign In',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for message from popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'microsoft-auth-success') {
          window.removeEventListener('message', messageHandler);
          popup?.close();
          resolve(event.data.userData);
        } else if (event.data.type === 'microsoft-auth-error') {
          window.removeEventListener('message', messageHandler);
          popup?.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageHandler);

      // Check if popup was closed
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);
    } catch (error) {
      reject(error);
    }
  });
};

// Apple Sign In
export const signInWithApple = async () => {
  return new Promise<any>((resolve, reject) => {
    try {
      if (!isAppleConfigured()) {
        reject(new Error('Apple OAuth is not configured. Please add VITE_APPLE_CLIENT_ID to your .env file.'));
        return;
      }

      // Apple Sign In uses AppleID.auth.init
      if (!window.AppleID) {
        // Load Apple JS SDK
        const script = document.createElement('script');
        script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        script.async = true;
        
        script.onload = () => {
          initAppleSignIn().then(resolve).catch(reject);
        };
        
        script.onerror = () => reject(new Error('Failed to load Apple Sign In'));
        document.head.appendChild(script);
      } else {
        initAppleSignIn().then(resolve).catch(reject);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const initAppleSignIn = () => {
  return new Promise<any>((resolve, reject) => {
    try {
      window.AppleID.auth.init({
        clientId: appleOAuthConfig.clientId,
        scope: appleOAuthConfig.scope,
        redirectURI: appleOAuthConfig.redirectUri,
        usePopup: true,
      });

      window.AppleID.auth.signIn().then((response: any) => {
        // Decode the identity token
        const idToken = response.authorization.id_token;
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        
        resolve({
          email: payload.email,
          name: response.user?.name ? `${response.user.name.firstName} ${response.user.name.lastName}` : payload.email.split('@')[0],
          providerId: payload.sub,
        });
      }).catch((error: any) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Extend Window interface for OAuth libraries
declare global {
  interface Window {
    google?: any;
    AppleID?: any;
  }
}

export default {
  signInWithGoogle,
  signInWithMicrosoft,
  signInWithApple,
  initGoogleOAuth,
};
