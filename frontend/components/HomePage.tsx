import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Image,
  Globe,
  BarChart3,
  PieChart,
  MoreHorizontal,
  Presentation,
  Upload,
  Paperclip,
  Sparkles,
  Mic,
  ChevronDown
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { VoiceModal } from './VoiceModal';
import { AnimatedSphere } from './AnimatedSphere';
import { ChatMessage, ChatSession } from '../App';
import { useUser, UserButton } from "@clerk/clerk-react";

interface HomePageProps {
  onNavigateToSandbox?: () => void;
  continueSession?: ChatSession | null;
}

export function HomePage({ onNavigateToSandbox, continueSession }: HomePageProps) {
  const [email, setEmail] = useState('');
  const [isDraft, setIsDraft] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Nava AI');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState(() => Date.now().toString());
  const [showOptions, setShowOptions] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const username =
    user?.username ||
    user?.firstName ||
    user?.fullName ||
    (userEmail ? userEmail.split("@")[0] : "User");

  useEffect(() => {
    const savedDraft = localStorage.getItem('isDraft');
    const savedPrivate = localStorage.getItem('isPrivate');
    if (savedDraft !== null) setIsDraft(savedDraft === 'true');
    if (savedPrivate !== null) setIsPrivate(savedPrivate === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('isDraft', String(isDraft));
    localStorage.setItem('isPrivate', String(isPrivate));
  }, [isDraft, isPrivate]);


  const aiModels = [
    "GPT-4",
    "GPT-4o",
    "Claude 3.5 Sonnet",
    "Claude 3 Opus",
    "Gemini 1.5 Pro",
    "Gemini Nano",
    "Perplexity",
    "Mistral 7B",
    "Mixtral 8x7B",
    "LLaMA 3",
    "Cohere Command R+",
    "Groq LPU",
    "DeepSeek V3",
    "OpenHermes",
    "Falcon 180B"
  ];

  const options = [
    { icon: Image, label: 'Image' },
    { icon: Presentation, label: 'Slides' },
    { icon: Globe, label: 'Webpage' },
    { icon: BarChart3, label: 'Spreadsheet' },
    { icon: PieChart, label: 'Visualization' },
    { icon: MoreHorizontal, label: 'More' },
  ];

  // Load continue session when provided
  useEffect(() => {
    if (continueSession) {
      setChatMessages(continueSession.messages);
      setCurrentSessionId(continueSession.id);
    }
  }, [continueSession]);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Save chat to history when messages change
  React.useEffect(() => {
    if (chatMessages.length > 0) {
      const existingHistory = JSON.parse(localStorage.getItem('nava-ai-chat-history') || '[]');
      const sessionIndex = existingHistory.findIndex((session: any) => session.id === currentSessionId);

      const sessionTitle = chatMessages[0]?.content.slice(0, 50) + (chatMessages[0]?.content.length > 50 ? '...' : '');

      const session = {
        id: currentSessionId,
        title: sessionTitle,
        messages: chatMessages,
        createdAt: chatMessages[0]?.timestamp || new Date(),
        lastUpdated: new Date()
      };

      if (sessionIndex >= 0) {
        existingHistory[sessionIndex] = session;
      } else {
        existingHistory.unshift(session);
      }

      // Keep only last 50 sessions
      const limitedHistory = existingHistory.slice(0, 50);
      localStorage.setItem('nava-ai-chat-history', JSON.stringify(limitedHistory));
    }
  }, [chatMessages, currentSessionId]);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleVoiceChat = () => {
    setIsVoiceModalOpen(true);
  };

  const handleVoiceTranscript = (text: string) => {
    setPrompt(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();

    // Basic greetings
    if (input === 'hi' || input === 'hey') {
      return `Hi ${username}! How can I help you today?`;
    }

    if (input === 'hello' || input.startsWith('hello')) {
      return `Hello ${username}! What would you like me to create for you?`;
    }

    // Mathematical operations
    if (input.includes('add') || input.includes('+')) {
      const numbers = userInput.match(/\d+(\.\d+)?/g);
      if (numbers && numbers.length >= 2) {
        const sum = numbers.reduce((acc, num) => acc + parseFloat(num), 0);
        return `The sum of ${numbers.join(' + ')} = ${sum}`;
      }
      return "I can help with addition! Try something like 'add 15 and 25' or '15 + 25'";
    }

    if (input.includes('subtract') || input.includes('-')) {
      const numbers = userInput.match(/\d+(\.\d+)?/g);
      if (numbers && numbers.length >= 2) {
        const result = parseFloat(numbers[0]) - parseFloat(numbers[1]);
        return `${numbers[0]} - ${numbers[1]} = ${result}`;
      }
      return "I can help with subtraction! Try something like 'subtract 25 from 50' or '50 - 25'";
    }

    if (input.includes('multiply') || input.includes('*') || input.includes('×')) {
      const numbers = userInput.match(/\d+(\.\d+)?/g);
      if (numbers && numbers.length >= 2) {
        const result = numbers.reduce((acc, num) => acc * parseFloat(num), 1);
        return `${numbers.join(' × ')} = ${result}`;
      }
      return "I can help with multiplication! Try something like 'multiply 8 by 7' or '8 * 7'";
    }

    if (input.includes('divide') || input.includes('/') || input.includes('÷')) {
      const numbers = userInput.match(/\d+(\.\d+)?/g);
      if (numbers && numbers.length >= 2) {
        const result = parseFloat(numbers[0]) / parseFloat(numbers[1]);
        return `${numbers[0]} ÷ ${numbers[1]} = ${result}`;
      }
      return "I can help with division! Try something like 'divide 100 by 4' or '100 / 4'";
    }

    // Other basic responses
    if (input.includes('how are you')) {
      return "I'm doing great! Ready to help you create amazing things with AI. What project are you working on?";
    }

    if (input.includes('what can you do')) {
      return "I can help you:\n• Create presentations, websites, and apps\n• Write and debug code\n• Solve math problems\n• Generate images and content\n• Analyze data and much more!\n\nJust tell me what you need!";
    }

    if (input.includes('thank you') || input.includes('thanks')) {
      return "You're welcome, ! Happy to help. Is there anything else you'd like to create?";
    }

    // Time and date
    if (input.includes('time') || input.includes('date')) {
      const now = new Date();
      return `Current time: ${now.toLocaleTimeString()}\nToday's date: ${now.toLocaleDateString()}`;
    }

    // Fun responses
    if (input.includes('joke')) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        "Why did the AI go to therapy? It had too many deep learning issues! 🤖",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // Default response for other inputs
    return `I understand you want to "${userInput}". Let me help you with that! For more complex tasks, try using keywords like 'code', 'website', 'presentation', or ask me math questions!`;
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: prompt,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Check if user wants code generation
    if (prompt.toLowerCase().includes('code')) {
      // Add a response message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'll help you with that code! Opening the sandbox to generate and test your code...",
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);

      // Navigate to sandbox after a brief delay
      setTimeout(() => {
        if (onNavigateToSandbox) {
          onNavigateToSandbox();
        }
      }, 1500);
    } else {
      // Generate regular response
      const response = generateResponse(prompt);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setTimeout(() => {
        setChatMessages(prev => [...prev, aiMessage]);
      }, 500);
    }

    setPrompt('');
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Scrollable Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 scrollbar-thin"
        style={{
          height: "calc(100vh - 140px)", // accounts for footer height
          overflowX: "hidden",
        }}
      >

        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center min-h-full px-4 text-center">
            <div className=" sm:max-w-2xl">
              <div className="mb-6 sm:mb-8 flex justify-center scale-75 sm:scale-100">
                <AnimatedSphere size="small" />
              </div>

              <h1 className="text-2xl sm:text-4xl mb-2 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Hello <span className="font-semibold">{username || 'User'}</span>
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8">
                What can I create for you today?
              </p>

              <div className="flex items-center justify-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-400/10 rounded-lg sm:rounded-xl inline-flex text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full animate-pulse"></div>

                {/* Status toggle */}
                <span
                  onClick={() => setIsDraft(prev => !prev)}
                  className="text-orange-600 dark:text-orange-400 cursor-pointer hover:underline"
                >
                  {isDraft ? 'Draft' : 'Published'}
                </span>

                <span className="text-muted-foreground">•</span>

                {/* Visibility toggle */}
                <span
                  onClick={() => setIsPrivate(prev => !prev)}
                  className={`cursor-pointer hover:underline ${isPrivate ? 'text-muted-foreground' : 'text-green-400'
                    }`}
                >
                  {isPrivate ? 'Private' : 'Public'}
                </span>
              </div>


            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full py-4 px-3 sm:px-6">
            <div className="space-y-3 pb-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser
                    ? "justify-end"
                    : "justify-start items-start space-x-2"
                    }`}
                >
                  {!message.isUser && (
                    <div className="flex-shrink-0 self-start hidden sm:block">
                      <div className="w-5 h-5 flex items-center justify-center mt-0.5 mb-1">
                        <div className="scale-[0.25] transform-gpu">
                          <AnimatedSphere size="small" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] sm:max-w-[75%] p-2 sm:p-3 rounded-xl ${message.isUser
                      ? "bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA] text-white ml-1 sm:ml-2"
                      : "bg-card border border-border"
                      }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed break-words">
                      {message.content}
                    </p>
                    <div
                      className={`text-[10px] sm:text-[11px] mt-1 opacity-70 ${message.isUser ? "text-white/70" : "text-muted-foreground"
                        }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      {/* Fixed Footer - Input Area */}
      <div
        className="sticky bottom-0 left-0 w-full"
        style={{
          padding: "0.5rem 1rem",
          maxHeight: "30vh",
        }}
      >

        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-md p-2 sm:p-3 flex flex-col gap-2 sm:gap-3">
            {/* Input Row */}
            <div className="flex items-center w-full gap-2 sm:gap-3">
              {/* Model Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="bg-gradient-to-r from-[#7B61FF]/10 to-[#9F7AEA]/10 hover:from-[#7B61FF]/20 hover:to-[#9F7AEA]/20 rounded-lg p-1.5 sm:p-2"
                    title="Choose AI model"
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#7B61FF]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-44 sm:w-52 bg-card/95 backdrop-blur-xl max-h-[250px] overflow-y-auto"
                >
                  {aiModels.map((model) => (
                    <DropdownMenuItem
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`cursor-pointer ${selectedModel === model
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50"
                        }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs sm:text-sm">{model}</span>
                        {selectedModel === model && (
                          <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Input
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  // Store in localStorage for sandbox access
                  localStorage.setItem('navaSandboxPrompt', e.target.value);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Ask Nava AI anything..."
                className="flex-1 text-sm sm:text-base bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground/70"
              />

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <button
                  onClick={handleFileUpload}
                  className="p-1.5 sm:p-2 hover:bg-muted/50 rounded-lg"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                </button>

                <button
                  onClick={handleImageUpload}
                  className="p-1.5 sm:p-2 hover:bg-muted/50 rounded-lg"
                  title="Upload image"
                >
                  <Upload className="w-4 h-4 text-muted-foreground" />
                </button>

                <button
                  onClick={handleVoiceChat}
                  className="p-1.5 sm:p-2 hover:bg-muted/50 rounded-lg"
                  title="Voice chat"
                >
                  <Mic className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Compact More Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-1.5 sm:p-2 hover:bg-muted/50 rounded-lg"
                      title="More options"
                    >
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="min-w-[10rem] bg-card/95 backdrop-blur-xl"
                  >
                    {options.map((option, i) => {
                      const IconComponent = option.icon;
                      return (
                        <DropdownMenuItem
                          key={i}
                          onClick={() => console.log(`Selected: ${option.label}`)}
                          className="flex items-center gap-2 text-sm hover:bg-muted/50 cursor-pointer"
                        >
                          <IconComponent className="w-4 h-4 text-muted-foreground" />
                          <span>{option.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  className="px-3 sm:px-5 py-2 bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA] text-white rounded-lg text-sm sm:text-base hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4 mr-1 sm:mr-2" />
                  Generate
                </Button>
              </div>
            </div>

            {/* Model Label */}
            {(chatMessages.length === 0 || showOptions) && (
              <div className="flex justify-center text-xs sm:text-sm text-muted-foreground mt-1">
                <Sparkles className="w-3 h-3 text-[#7B61FF] mr-1" />
                <span>{selectedModel}</span>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Voice Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscript={handleVoiceTranscript}
      />
    </div>

  );
}