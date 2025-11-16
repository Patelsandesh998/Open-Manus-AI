import { Button } from './ui/button';
import { 
  Plus, 
  History, 
  HelpCircle, 
  Settings, 
  Star,
  Calendar,
  FileText
} from 'lucide-react';
import { ShiningStars } from './ShiningStars';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentPage, onNavigate, isOpen, onClose }: SidebarProps) {
  if (!isOpen) return null;

  const handleNewTask = () => {
    // Navigate to home and close sidebar
    onNavigate('home');
    onClose();
  };

  const handleFavorites = () => {
    // For now, just show an alert - could navigate to favorites page later
    alert('Favorites functionality coming soon!');
  };

  const handleHistory = () => {
    onNavigate('history');
    onClose();
  };

  const handleHelp = () => {
    alert('Help & Support: Contact us at support@nava-ai.com');
  };

  const handleSettings = () => {
    onNavigate('settings');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-background flex flex-col h-full transform transition-transform duration-300 border-r border-border ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Logo with Shining Stars */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <ShiningStars size="small" count={15} />
          <span className="font-medium text-foreground">
            Nava <span className="text-primary">AI</span>
          </span>
        </div>
      </div>

        {/* New Task Button with 3D effect */}
        <div className="p-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 blur-lg opacity-50 group-hover:opacity-75 rounded-xl transform group-hover:scale-105 transition-all duration-300"></div>
            <Button 
              onClick={handleNewTask}
              className="relative w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

      {/* Navigation */}
      <div className="flex-1 px-4">
        <nav className="space-y-2">
          <button 
            onClick={() => onNavigate('home')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate('home');
              }
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              currentPage === 'home' 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Navigate to All tasks"
          >
            <FileText className="w-4 h-4" />
            <span>All</span>
          </button>
          
          <button 
            onClick={handleFavorites}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </button>
          
          {/*<button 
            onClick={() => onNavigate('sandbox')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              currentPage === 'sandbox' 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Sandbox</span>
          </button>*/}
          <button
            onClick={() => {
              onNavigate('pricing');
              onClose();
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              currentPage === 'pricing'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Navigate to Pricing"
          >
            <FileText className="w-4 h-4" />
            <span>Pricing</span>
          </button>
        </nav>
      </div>

      {/* Bottom icons */}
      <div className="p-4">
        <div className="space-y-2">
          <button 
            onClick={handleHistory}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              currentPage === 'history' 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
          
          <button 
            onClick={handleHelp}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
          
          <button 
            onClick={handleSettings}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              currentPage === 'settings' 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>
      </div>
    </>
  );
}