import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../chatbot';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @Input() showHeader: boolean = true;
  @Input() contextProduct: string | undefined;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isTyping: boolean = false;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.messages = this.chatbotService.getMessages();
  }

  sendMessage(): void {
    if (this.newMessage.trim() && !this.isTyping) {
      const originalMessage = this.newMessage.trim();
      let messageToSend = originalMessage;
      
      if (this.contextProduct) {
        messageToSend = `Regarding ${this.contextProduct}: ${originalMessage}`;
      }

      this.newMessage = '';
      this.isTyping = true;
      
      // Start the request
      const request$ = this.chatbotService.sendMessage(messageToSend);
      
      // Update local messages immediately to show user message
      this.messages = this.chatbotService.getMessages();

      request$.subscribe({
        next: (response: ChatMessage) => {
          console.log('[ChatbotComponent] Received response from service:', response);
          this.messages = this.chatbotService.getMessages();
          this.isTyping = false;
        },
        error: (error: any) => {
          console.error('[ChatbotComponent] Error sending message:', error);
          this.addMessage('Sorry, I encountered an error. Please try again.', false);
          this.isTyping = false;
        }
      });
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.chatbotService.clearMessages();
    this.messages = this.chatbotService.getMessages();
  }

  private addMessage(text: string, isUser: boolean): void {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    this.messages.push(message);
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  formatMessage(text: string): string {
    // Convert line breaks to <br> tags and basic markdown
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
