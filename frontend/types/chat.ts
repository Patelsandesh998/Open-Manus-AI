// types/chat.ts

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  lastUpdated: Date;
  messages: ChatMessage[];
}
