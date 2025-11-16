// utils/history.ts
import { ChatSession } from '../types/chat';

/**
 * Save or update a session inside localStorage chat history.
 */
export function saveToHistory(session: ChatSession) {
  const existing = localStorage.getItem('nava-ai-chat-history');
  let history: ChatSession[] = [];

  if (existing) {
    try {
      history = JSON.parse(existing);
    } catch {
      history = [];
    }
  }

  // Replace or append
  const index = history.findIndex((s) => s.id === session.id);
  if (index !== -1) {
    history[index] = session;
  } else {
    history.push(session);
  }

  localStorage.setItem('nava-ai-chat-history', JSON.stringify(history));
}
