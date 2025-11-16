import React, { useState, useEffect } from 'react';
import { Search, Trash2, Calendar, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ChatMessage, ChatSession } from '../App';

interface HistoryPageProps {
  onContinueChat?: (session: ChatSession) => void;
}

export function HistoryPage({ onContinueChat }: HistoryPageProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('nava-ai-chat-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setChatSessions(parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastUpdated: new Date(session.lastUpdated),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      setChatSessions([]);
      localStorage.removeItem('nava-ai-chat-history');
      setSelectedSession(null);
    }
  };

  const deleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this chat session?')) {
      const updatedSessions = chatSessions.filter(session => session.id !== sessionId);
      setChatSessions(updatedSessions);
      localStorage.setItem('nava-ai-chat-history', JSON.stringify(updatedSessions));
      if (selectedSession === sessionId) {
        setSelectedSession(null);
      }
    }
  };

  const selectedSessionData = chatSessions.find(session => session.id === selectedSession);

  return (
    <div className="flex-1 flex h-[calc(100vh-64px)]">
      {/* Left sidebar - Chat sessions list */}
      <div className="w-1/3 bg-card/30 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Chat History</h2>
            <Button
              onClick={clearHistory}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredSessions.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No conversations found' : 'No chat history yet'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Start chatting to see your conversations here
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all hover:bg-muted/50 ${
                    selectedSession === session.id ? 'bg-primary/10' : 'bg-card/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm truncate flex-1 mr-2">
                      {session.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{session.lastUpdated.toLocaleDateString()}</span>
                    <Clock className="w-3 h-3 ml-2" />
                    <span>{session.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {session.messages[session.messages.length - 1]?.content || 'No messages'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side - Selected conversation */}
      <div className="flex-1 flex flex-col">
        {selectedSessionData ? (
          <>
            <div className="p-6 bg-card/30 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedSessionData.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSessionData.messages.length} messages • Created {selectedSessionData.createdAt.toLocaleDateString()}
                  </p>
                </div>
                {onContinueChat && (
                  <Button
                    onClick={() => onContinueChat(selectedSessionData)}
                    className="bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA] hover:from-[#6B51E5] hover:to-[#8F6ADA] text-white"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {selectedSessionData.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.isUser
                          ? 'bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA] text-white'
                          : 'bg-card/80 backdrop-blur-xl'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <div className={`text-xs mt-2 opacity-70 ${message.isUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {message.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a chat session from the sidebar to view the conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}