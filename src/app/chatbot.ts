import { Injectable } from '@angular/core';
import { GeminiService } from './gemini.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private knowledgeBase: any = null;
  private messages: ChatMessage[] = [];
  private readonly WELCOME_MESSAGE = "Hello! I'm your C-UAS expert assistant. I can help you learn about counter-drone systems, compare products, and find the right solutions for your needs. What would you like to know?";

  constructor(
    private geminiService: GeminiService,
    private http: HttpClient
  ) {
    this.loadKnowledgeBase();
    this.addWelcomeMessage();
  }

  private addWelcomeMessage(): void {
    this.messages.push({
      id: this.generateId(),
      text: this.WELCOME_MESSAGE,
      isUser: false,
      timestamp: new Date()
    });
  }

  private loadKnowledgeBase(): void {
    this.http.get('/assets/data/knowledge-base.json').subscribe({
      next: (data) => {
        this.knowledgeBase = data;
        console.log('Knowledge base loaded successfully');
      },
      error: (error) => {
        console.error('Failed to load knowledge base:', error);
      }
    });
  }

  sendMessage(message: string): Observable<ChatMessage> {
    const userMessage: ChatMessage = {
      id: this.generateId(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    this.messages.push(userMessage);

    return this.getAIResponse(message).pipe(
      map(response => {
        console.log('[ChatbotService] Gemini response:', response);
        const aiMessage: ChatMessage = {
          id: this.generateId(),
          text: response,
          isUser: false,
          timestamp: new Date()
        };
        this.messages.push(aiMessage);
        return aiMessage;
      })
    );
  }

  private getAIResponse(userMessage: string): Observable<string> {
    console.log('[ChatbotService] getAIResponse called');
    if (!this.knowledgeBase) {
      console.log('[ChatbotService] KB not loaded yet');
      return new Observable(observer => {
        observer.next("I'm still loading the knowledge base. Please try again in a moment.");
        observer.complete();
      });
    }

    // Build conversation history for context
    // Exclude the current message which is already in this.messages but we want to pass it separately
    const historyMessages = this.messages.slice(0, -1);
    let prompt = userMessage;

    if (historyMessages.length > 0) {
      const history = historyMessages
        .slice(-10) // Keep last 10 messages for context
        .map(m => `${m.isUser ? 'User' : 'Assistant'}: ${m.text}`)
        .join('\n');
      
      prompt = `
Previous Conversation:
${history}

Current Question: ${userMessage}
`;
    }

    console.log('[ChatbotService] Calling GeminiService with context');
    return this.geminiService.generateChatResponse(prompt);
  }

  // Helper method no longer needed for prompt building, but keeping it if we want to revert or use for other purposes
  private buildPrompt(userMessage: string): string {
    return userMessage;
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  clearMessages(): void {
    this.messages = [];
    this.addWelcomeMessage();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
