import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  Play, 
  CheckCircle2, 
  Circle, 
  Loader2,
  X,
  Monitor,
  ExternalLink
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface TaskStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed';
}

interface TaskProgressProps {
  isOpen: boolean;
  onClose: () => void;
  onRunComplete: (environment: 'vscode' | 'browser') => void;
}

export function TaskProgress({ isOpen, onClose, onRunComplete }: TaskProgressProps) {
  const [steps, setSteps] = useState<TaskStep[]>([
    { id: '1', title: 'Analyzing prompt and requirements', status: 'pending' },
    { id: '2', title: 'Generating code structure', status: 'pending' },
    { id: '3', title: 'Creating components and logic', status: 'pending' },
    { id: '4', title: 'Optimizing and finalizing', status: 'pending' }
  ]);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when popup closes
      setSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));
      setCurrentStepIndex(-1);
      setIsCompleted(false);
      return;
    }

    // Start the progress simulation
    const timer = setTimeout(() => {
      setCurrentStepIndex(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
      // Update current step to running
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === currentStepIndex ? 'running' : 
                index < currentStepIndex ? 'completed' : 'pending'
      })));

      // Complete current step after delay
      const timer = setTimeout(() => {
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index <= currentStepIndex ? 'completed' : 'pending'
        })));

        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsCompleted(true);
        }
      }, 2000 + Math.random() * 1000); // Random delay between 2-3 seconds

      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, steps.length]);

  const handleRunEnvironment = (environment: 'vscode' | 'browser') => {
    onRunComplete(environment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA] rounded-lg flex items-center justify-center">
              <Monitor className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Nava Computer</h3>
          </div>
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-border/50 hover:bg-muted/50 p-2"
                    title="Run in environment"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border border-border/50">
                  <DropdownMenuItem 
                    onClick={() => handleRunEnvironment('vscode')}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-[#007ACC] rounded flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="currentColor">
                          <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
                        </svg>
                      </div>
                      <span>Run on VS Code</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRunEnvironment('browser')}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] rounded flex items-center justify-center">
                        <ExternalLink className="w-3 h-3 text-white" />
                      </div>
                      <span>Run on Browser</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="p-2 hover:bg-muted/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Task Progress */}
        <div className="space-y-4">
          <h4 className="font-medium text-muted-foreground">Task Progress</h4>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : step.status === 'running' ? (
                    <Loader2 className="w-5 h-5 text-[#7B61FF] animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${
                    step.status === 'completed' ? 'text-foreground' :
                    step.status === 'running' ? 'text-[#7B61FF]' :
                    'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isCompleted ? 'bg-green-500' : 'bg-[#7B61FF] animate-pulse'
            }`}></div>
            <span className="text-sm text-muted-foreground">
              {isCompleted ? 'Task completed! Ready to run.' : 'Processing your request...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}