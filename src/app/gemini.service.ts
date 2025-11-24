// gemini.service.ts
import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    // Get API key from environment configuration
    const apiKey = environment.geminiApiKey;
    if (!apiKey || apiKey === 'your_development_gemini_api_key_here' || apiKey === 'your_production_gemini_api_key_here') {
      console.warn('Gemini API key not configured. Please set your API key in the environment files.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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
      console.error('Error generating review summary:', error);
      return 'Unable to generate summary at this time. Please try again later.';
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
}