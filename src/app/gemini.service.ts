// gemini.service.ts
import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private knowledgeBase: any;

  constructor(private http: HttpClient) {
    // Get API key from environment configuration
    const apiKey = environment.geminiApiKey;
    if (!apiKey || apiKey === 'your_development_gemini_api_key_here' || apiKey === 'your_production_gemini_api_key_here') {
      console.warn('Gemini API key not configured. Please set your API key in the environment files.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.loadKnowledgeBase();
  }

  private loadKnowledgeBase(): void {
    console.log('[GeminiService] Loading knowledge base...');
    this.http.get('/assets/data/knowledge-base.json').subscribe({
      next: (data) => {
        console.log('[GeminiService] Knowledge base loaded successfully');
        this.knowledgeBase = data;
      },
      error: (error) => {
        console.error('[GeminiService] Error loading knowledge base:', error);
      }
    });
  }

  private getProductKnowledgeContext(productName?: string): string {
    if (!this.knowledgeBase) {
      return 'Knowledge base not yet loaded. Please try again in a moment.';
    }

    const products = this.knowledgeBase.products || {};
    const allProductNames = Object.keys(products).join(', ');
    
    let productContext = '';
    
    if (productName) {
      // Find specific product in knowledge base - try exact match and partial matches
      let product: any = products[productName];
      
      // If not found, try to find by searching all products
      if (!product) {
        for (const key in products) {
          if (key.toLowerCase().includes(productName.toLowerCase()) || 
              productName.toLowerCase().includes(key.toLowerCase())) {
            product = products[key];
            productName = key;
            break;
          }
        }
      }
      
      if (product) {
        // Build ONLY the specific product context - minimal data for faster processing
        productContext = `
=== PRODUCT CONTEXT: ${productName} ===
Manufacturer: ${product.manufacturer}
Category: ${product.category}
Description: ${product.description}
Weight: ${product.weight || 'N/A'}
Carrying Capacity: ${product.carryingCapacity || 'N/A'}
Key Features: ${product.keyFeatures?.join(', ') || 'N/A'}
Use Cases: ${product.useCases?.join(', ') || 'N/A'}
Operation Steps:
${product.operationSteps?.map((step: string, i: number) => `  ${i+1}. ${step}`).join('\n') || 'N/A'}
`;
      }
    }

    // Build system prompt with available products
    const baseContext = `You are a helpful AI assistant specializing in Counter-Unmanned Aerial Systems (C-UAS) products.
Available products: ${allProductNames}

IMPORTANT:
- Answer ONLY using information from the provided product context
- Be specific with numbers, weights, and measurements
- If information is not available, say "I don't have that information"
- Do NOT make up or assume any information

${productContext}`;

    return baseContext;
  }

  // Get list of all available products
  getAvailableProducts(): string[] {
    if (!this.knowledgeBase || !this.knowledgeBase.products) {
      return [];
    }
    return Object.keys(this.knowledgeBase.products);
  }

  async generateReviewSummary(productName: string, reviews: any[]): Promise<string> {
    if (reviews.length === 0) {
      return 'No reviews available for this product yet.';
    }

    try {
      const reviewTexts = reviews.map(review => {
        const categoryRatings = review.categoryRatings;
        const avgRating = ((categoryRatings.transportability + categoryRatings.easeOfUse +
                          categoryRatings.interoperability + categoryRatings.detection +
                          categoryRatings.reliability) / 5).toFixed(1);

        return `Reviewer: ${review.author} (${review.milService} - ${review.role})
Rating: ${avgRating}/5
Transportability: ${categoryRatings.transportability}/5
Ease of Use: ${categoryRatings.easeOfUse}/5
Interoperability: ${categoryRatings.interoperability}/5
Detection: ${categoryRatings.detection}/5
Reliability: ${categoryRatings.reliability}/5
Review: ${review.reviewText}`;
      }).join('\n\n---\n\n');

      const prompt = `Provide a brief 2-3 sentence summary of the reviews for the "${productName}" counter-UAS system, highlighting overall sentiment and key points.

Reviews:
${reviewTexts}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating review summary:', error);
      return 'Unable to generate summary at this time. Please try again later.';
    }
  }

  async generateDetailedReviewSummary(productName: string, reviews: any[]): Promise<string> {
    if (reviews.length === 0) {
      return 'No reviews available for this product yet.';
    }

    try {
      const reviewTexts = reviews.map(review => {
        const categoryRatings = review.categoryRatings;
        const avgRating = ((categoryRatings.transportability + categoryRatings.easeOfUse +
                          categoryRatings.interoperability + categoryRatings.detection +
                          categoryRatings.reliability) / 5).toFixed(1);

        return `Reviewer: ${review.author} (${review.milService} - ${review.role})
Rating: ${avgRating}/5
Transportability: ${categoryRatings.transportability}/5
Ease of Use: ${categoryRatings.easeOfUse}/5
Interoperability: ${categoryRatings.interoperability}/5
Detection: ${categoryRatings.detection}/5
Reliability: ${categoryRatings.reliability}/5
Review: ${review.reviewText}`;
      }).join('\n\n---\n\n');

      const prompt = `Please provide a comprehensive summary of all reviews for the "${productName}" counter-UAS system. Analyze the following reviews and provide:

1. Overall sentiment and average ratings across all categories
2. Key strengths and weaknesses mentioned
3. Common themes and patterns in feedback
4. Recommendations or concerns from users
5. Summary of suitability for different military contexts

Reviews:
${reviewTexts}

Please keep the summary concise but informative, focusing on actionable insights for potential users.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating detailed review summary:', error);
      return 'Unable to generate detailed summary at this time. Please try again later.';
    }
  }

  async generateCustomReview(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating custom review:', error);
      return 'Unable to generate review content at this time. Please try again later.';
    }
  }

  generateChatResponse(prompt: string, productName?: string): Observable<string> {
    console.log('[GeminiService] generateChatResponse called');
    return new Observable(observer => {
      try {
        let attempts = 0;
        // Wait a bit if knowledge base is still loading
        const waitForKB = () => {
          if (!this.knowledgeBase) {
            attempts++;
            if (attempts % 10 === 0) console.log(`[GeminiService] Waiting for KB... attempt ${attempts}`);
            setTimeout(waitForKB, 100);
            return;
          }
          console.log('[GeminiService] KB ready, generating content...');

          const kbContext = this.getProductKnowledgeContext(productName);
          // Build comprehensive knowledge base text for Gemini
          let knowledgeBaseText = '';
          if (this.knowledgeBase) {
            // Use full JSON to ensure all details (specs, use cases, etc.) are included
            knowledgeBaseText = JSON.stringify(this.knowledgeBase, null, 2);
          }

          const fullPrompt = `${kbContext}

FULL KNOWLEDGE BASE DATA:
${knowledgeBaseText}

User Question: ${prompt}

INSTRUCTIONS:
1. Answer questions based ONLY on the information in the knowledge base above.
2. Be concise, helpful, and accurate. Keep responses short and to the point (max 2-3 sentences unless detailed specs are requested).
3. When comparing products, use specific data from the knowledge base.
4. If asked about products not in the knowledge base, politely state that information.
5. Provide practical recommendations based on use cases and requirements.
6. Use clear, professional language suitable for defense and security professionals.
7. If the information is not available, clearly state that you cannot find it in the knowledge base.`;

          this.model.generateContent(fullPrompt)
            .then((result: any) => {
              try {
                const text = result.response.text();
                console.log('[GeminiService] Gemini API raw result:', result);
                console.log('[GeminiService] Extracted text:', text);
                observer.next(text);
                observer.complete();
              } catch (error: any) {
                console.error('Error extracting text from response:', error);
                observer.next('I apologize, but I encountered an error while processing your question. Please try again.');
                observer.complete();
              }
            })
            .catch((error: any) => {
              console.error('Error generating chat response:', error);
              observer.next('I apologize, but I encountered an error while processing your question. Please try again.');
              observer.complete();
            });
        };

        waitForKB();
      } catch (error: any) {
        console.error('Error in generateChatResponse:', error);
        observer.next('I apologize, but I encountered an error while processing your question. Please try again.');
        observer.complete();
      }
    });
  }
}