import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Database, 
  Mic, 
  MessageSquare,
  Monitor,
  Moon,
  Sun,
  Volume2,
  Trash2,
  Download,
  Upload
} from "lucide-react";
import { useTheme } from './ThemeProvider';
import { toast } from "sonner";

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    // Profile settings
    displayName: 'Yeswanth Kosuri',
    email: 'yeswanth@example.com',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: true,
    
    // Voice settings
    voiceEnabled: true,
    autoTranscribe: true,
    voiceLanguage: 'en-US',
    
    // Chat settings
    saveHistory: true,
    autoSave: true,
    messagePreview: true,
    
    // Privacy settings
    dataCollection: false,
    analytics: false,
    personalizedAds: false
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Setting updated successfully');
  };

  const exportData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nava-ai-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Settings exported successfully');
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all your data? This includes chat history, settings, and preferences. This action cannot be undone.')) {
      localStorage.clear();
      toast.success('All data cleared successfully');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Profile</h2>
                <p className="text-sm text-muted-foreground">Manage your personal information</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={settings.displayName}
                  onChange={(e) => handleSettingChange('displayName', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingChange('email', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">Customize the look and feel</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'light' ? 'Light mode' : 'Dark mode'}
                  </p>
                </div>
              </div>
              <Button onClick={toggleTheme} variant="outline">
                Switch to {theme === 'light' ? 'Dark' : 'Light'}
              </Button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Control how you receive notifications</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <div>
                    <Label>Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
                  </div>
                </div>
                <Switch
                  checked={settings.soundNotifications}
                  onCheckedChange={(checked) => handleSettingChange('soundNotifications', checked)}
                />
              </div>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mic className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Voice & Speech</h2>
                <p className="text-sm text-muted-foreground">Configure voice interaction settings</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Voice Input</Label>
                  <p className="text-sm text-muted-foreground">Enable voice commands</p>
                </div>
                <Switch
                  checked={settings.voiceEnabled}
                  onCheckedChange={(checked) => handleSettingChange('voiceEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Transcribe</Label>
                  <p className="text-sm text-muted-foreground">Automatically convert speech to text</p>
                </div>
                <Switch
                  checked={settings.autoTranscribe}
                  onCheckedChange={(checked) => handleSettingChange('autoTranscribe', checked)}
                />
              </div>
            </div>
          </div>

          {/* Chat Settings */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Chat & History</h2>
                <p className="text-sm text-muted-foreground">Manage conversation settings</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Save Chat History</Label>
                  <p className="text-sm text-muted-foreground">Keep your conversations</p>
                </div>
                <Switch
                  checked={settings.saveHistory}
                  onCheckedChange={(checked) => handleSettingChange('saveHistory', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save conversations</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Privacy & Security</h2>
                <p className="text-sm text-muted-foreground">Control your data and privacy</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Collection</Label>
                  <p className="text-sm text-muted-foreground">Allow anonymous usage data collection</p>
                </div>
                <Switch
                  checked={settings.dataCollection}
                  onCheckedChange={(checked) => handleSettingChange('dataCollection', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">Help improve the service</p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Data Management</h2>
                <p className="text-sm text-muted-foreground">Export or clear your data</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Export Data</Label>
                  <p className="text-sm text-muted-foreground">Download your settings and data</p>
                </div>
                <Button onClick={exportData} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-destructive">Clear All Data</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete all your data</p>
                </div>
                <Button onClick={clearAllData} variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}