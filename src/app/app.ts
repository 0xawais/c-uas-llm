import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from './gemini.service';
import { filter } from 'rxjs/operators';
import { ChatbotComponent } from './chatbot/chatbot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule, FormsModule, ChatbotComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'tartans4defense';
  
  // Product ID to name mapping
  private productIdMap: { [key: number]: string } = {
    1: 'Roadrunner-M',
    2: 'DroneBuster',
    3: 'Beast+',
    4: 'SilentGuardian EW-300',
    5: 'PhantomNet Disruptor',
    6: 'Wavebreaker Pro',
    7: 'SpectrumHawk X7',
    8: 'StormShield Mobile EW Suite'
  };
  
  // Chatbot properties
  showChatbotModal = false;
  currentMessage = '';
  chatMessages: Array<{ text: string; timestamp: Date }> = [];
  userMessages: Array<{ text: string; timestamp: Date }> = [];
  isTyping = false;
  currentProduct?: string; // Track current product context
  availableProducts: string[] = []; // List of available products
  selectedProductForChat?: string; // Selected product in chat

  constructor(public router: Router, private geminiService: GeminiService) {
    // Load available products when service is ready
    setTimeout(() => {
      this.availableProducts = this.geminiService.getAvailableProducts();
    }, 500);
    
    // Detect product context when route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateProductContext();
      });
  }

  private updateProductContext(): void {
    const currentUrl = this.router.url;
    
    // Check if on product-review page
    if (currentUrl.includes('/product-review/')) {
      const productId = parseInt(currentUrl.split('/product-review/')[1], 10);
      if (productId && this.productIdMap[productId]) {
        // When on a product page, auto-select that product
        this.selectedProductForChat = this.productIdMap[productId];
      }
    } else {
      // On main page or other pages, don't pre-select a product
      this.selectedProductForChat = undefined;
    }
  }

  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }

  openReviewForm(): void {
    this.router.navigate(['/review-system']);
  }

  toggleChatbotModal(): void {
    this.showChatbotModal = !this.showChatbotModal;
    // If opening chat, ensure product context is up to date
    if (this.showChatbotModal) {
      this.updateProductContext();
    }
  }

  closeChatbotModal(): void {
    this.showChatbotModal = false;
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;
    
    // Add user message
    this.userMessages.push({
      text: this.currentMessage,
      timestamp: new Date()
    });
    
    const userQuery = this.currentMessage;
    this.currentMessage = '';
    this.isTyping = true;

    // Use selected product or current product context
    const productContext = this.selectedProductForChat || this.currentProduct;
    
    // Use Gemini service with focused product context
    this.geminiService.generateChatResponse(userQuery, productContext).subscribe({
      next: (response) => {
        this.chatMessages.push({
          text: response,
          timestamp: new Date()
        });
        this.isTyping = false;
      },
      error: (error) => {
        console.error('Error getting chat response:', error);
        this.chatMessages.push({
          text: 'Sorry, I encountered an error while processing your question. Please try again.',
          timestamp: new Date()
        });
        this.isTyping = false;
      }
    });
  }

  selectProductForChat(productName: string): void {
    this.selectedProductForChat = productName;
    this.chatMessages = []; // Clear chat history when switching products
  }

  clearProductSelection(): void {
    this.selectedProductForChat = undefined;
    this.chatMessages = []; // Clear chat history
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}