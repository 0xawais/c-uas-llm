# C-UAS Product Review Web Application
## Technical Documentation & Setup Guide

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Key Features](#2-key-features)
3. [Technology Stack](#3-technology-stack)
4. [System Requirements](#4-system-requirements)
5. [Installation & Setup](#5-installation--setup)
6. [Configuration](#6-configuration)
7. [Application Architecture](#7-application-architecture)
8. [User Guide](#8-user-guide)
9. [API Integration](#9-api-integration)
10. [Deployment](#10-deployment)
11. [Security Considerations](#11-security-considerations)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Application Overview

The **C-UAS Product Review Web Application** is a comprehensive Angular-based platform designed for military personnel to browse, review, and compare Counter-Unmanned Aerial Systems (C-UAS) products. The application features an AI-powered chatbot assistant that leverages Google Gemini to provide intelligent answers about C-UAS products, specifications, and recommendations.

### Purpose
- Provide a centralized platform for C-UAS product information
- Enable military personnel to submit and view product reviews
- Offer AI-assisted guidance for product selection and comparison
- Facilitate knowledge sharing across military branches

### Target Users
- U.S. Military personnel (Army, Navy, Air Force, Marines, Special Operations)
- Defense procurement officers
- Military technology analysts
- Base security personnel

---

## 2. Key Features

### 2.1 Product Review System
- **Multi-category rating system** with 5 rating dimensions:
  - Transportability
  - Ease of Use
  - Interoperability
  - Detection Capability
  - Reliability
- User-submitted reviews with military service branch identification
- Average rating calculations with visual star indicators
- Review filtering and sorting capabilities

### 2.2 AI-Powered Chatbot (Gemini Integration)
- **Real-time conversational AI** using Google Gemini
- Context-aware responses based on comprehensive knowledge base
- Product comparison assistance
- Specification lookup and recommendations
- Conversation history for contextual follow-up questions
- Product-specific context when browsing individual products

### 2.3 Authentication System
- Military email validation (`.mil` domain required)
- CAC (Common Access Card) authentication support
- Role-based access control (Admin vs. Standard User)
- Persistent session management

### 2.4 Admin Dashboard
- Product statistics and analytics
- Review management and moderation
- Real-time visitor tracking (simulated)
- Review distribution by military branch and role
- Word cloud analysis of review content
- Add/Edit product capabilities

### 2.5 AI-Generated Review Summaries
- Automatic summary generation using Gemini AI
- Quick overview summaries for products
- Detailed analysis summaries available on demand

---

## 3. Technology Stack

### Frontend Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 20.3.0 | Core frontend framework |
| TypeScript | Latest | Programming language |
| SCSS | - | Styling preprocessor |
| RxJS | 7.8.0 | Reactive programming |

### AI Integration
| Technology | Version | Purpose |
|------------|---------|---------|
| Google Generative AI | 0.24.1 | Gemini AI SDK for chatbot |
| Marked | 17.0.1 | Markdown parsing for AI responses |

### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| Angular CLI | 20.3.7 | Development tooling |
| Node.js | 18+ | Runtime environment |
| npm | Latest | Package management |
| Karma | 6.4.0 | Unit testing |
| Jasmine | 5.9.0 | Testing framework |

### Environment Management
| Package | Purpose |
|---------|---------|
| dotenv | 17.2.3 | Environment variable management |

---

## 4. System Requirements

### Minimum Requirements
- **Operating System:** Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Node.js:** Version 18.x or higher
- **npm:** Version 9.x or higher
- **Memory:** 4GB RAM minimum (8GB recommended)
- **Storage:** 500MB free disk space
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Development Environment
- Code editor (VS Code recommended)
- Git for version control
- Terminal/Command line access
- Internet connection (for Gemini API)

---

## 5. Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/0xawais/c-uas-llm.git
cd c-uas-llm/c-uas-llm
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Angular core modules
- Google Generative AI SDK
- Development dependencies

### Step 3: Configure Environment Variables

1. **Create the `.env` file** from the example template:

```bash
cp .env.example .env
```

2. **Obtain a Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the API key

3. **Add your API key** to the `.env` file:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Step 4: Generate Environment Files

```bash
npm run generate-env
```

This script reads the `.env` file and generates:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

### Step 5: Start the Development Server

```bash
npm start
```

Or alternatively:

```bash
ng serve
```

### Step 6: Access the Application

Open your browser and navigate to:

```
http://localhost:4200
```

---

## 6. Configuration

### 6.1 Gemini API Configuration

The application uses Google Gemini AI for:
- Chatbot responses
- Review summarization
- AI-generated review assistance

**API Key Security:**
- Never commit the `.env` file to version control
- The `.env` file is included in `.gitignore`
- Use environment-specific API keys for production

### 6.2 Authentication Configuration

Default admin emails (configurable in `auth.service.ts`):
```typescript
private adminEmails = [
  'admin@military.mil',
  'admin@navy.mil',
  'admin@army.mil'
];
```

Email validation pattern:
```typescript
const milEmailPattern = /^[^\s@]+@[^\s@]+\.mil$/i;
```

### 6.3 Product Data Configuration

Product data is stored in JSON files:
- `src/assets/data/products.json` - Product catalog
- `src/assets/data/knowledge-base.json` - AI knowledge base

To add or modify products:
1. Edit the JSON files directly
2. Rebuild the application

---

## 7. Application Architecture

### 7.1 Directory Structure

```
c-uas-llm/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin dashboard component
│   │   ├── chatbot/            # Chatbot UI component
│   │   ├── header/             # Navigation header
│   │   ├── login/              # Login page
│   │   ├── nav-system/         # Product catalog/home page
│   │   ├── product-review/     # Product detail & reviews
│   │   ├── review-system/      # Review submission form
│   │   ├── app.ts              # Root component
│   │   ├── app.routes.ts       # Route definitions
│   │   ├── auth.service.ts     # Authentication service
│   │   ├── auth.guard.ts       # Route protection
│   │   ├── chatbot.ts          # Chatbot service
│   │   ├── gemini.service.ts   # Gemini AI integration
│   │   └── product.service.ts  # Product data service
│   ├── assets/
│   │   └── data/
│   │       ├── products.json       # Product catalog
│   │       └── knowledge-base.json # AI knowledge base
│   └── environments/
│       ├── environment.ts      # Dev environment
│       └── environment.prod.ts # Prod environment
├── package.json
├── angular.json
├── generate-env.js             # Environment generator
└── .env                        # API keys (not in repo)
```

### 7.2 Core Services

| Service | File | Purpose |
|---------|------|---------|
| AuthService | `auth.service.ts` | User authentication & session management |
| ProductService | `product.service.ts` | Product data access & review management |
| GeminiService | `gemini.service.ts` | Google Gemini AI API integration |
| ChatbotService | `chatbot.ts` | Chatbot state & conversation management |

### 7.3 Route Structure

| Route | Component | Protection | Description |
|-------|-----------|------------|-------------|
| `/` | NavSystem | Auth Required | Product catalog home |
| `/product-review/:id` | ProductReviewComponent | Auth Required | Product details & reviews |
| `/review-system` | ReviewSystem | Auth Required | Submit new review |
| `/chatbot` | ChatbotComponent | Auth Required | Standalone chatbot page |
| `/admin` | AdminComponent | Auth Required | Admin dashboard |
| `/login` | Login | Public | Login page |

---

## 8. User Guide

### 8.1 Login Process

1. Navigate to the application URL
2. Enter your military email (must end with `.mil`)
3. Enter any password (demo mode)
4. Click "Sign In" or use "CAC Login" for simulated CAC authentication

**Demo Credentials:**
- Email: `user@military.mil`
- Password: Any non-empty string

**Admin Access:**
- Email: `admin@military.mil`
- Password: Any non-empty string

### 8.2 Browsing Products

1. After login, view the product catalog on the home page
2. Click on any product card to view detailed information
3. Use the star ratings to gauge product quality
4. View manufacturer contact details for procurement

### 8.3 Using the AI Chatbot

1. Click the floating chatbot button (bottom-right corner)
2. Select a product context (optional) for focused assistance
3. Type your question in the input field
4. Press Enter or click Send
5. The AI will respond with relevant information

**Example Questions:**
- "What is the weight of the DroneBuster?"
- "Compare Roadrunner-M and PhantomNet Disruptor"
- "Which product is best for convoy protection?"
- "How do I contact Anduril Industries?"

### 8.4 Submitting Reviews

1. Navigate to a product page
2. Click "Write a Review" or use the floating "Review Product" button
3. Fill in your information (name, military service, role)
4. Rate each category (1-5 stars)
5. Add optional comments for specific categories
6. Submit the review

### 8.5 Admin Functions

1. Login with admin credentials
2. Access the Admin Dashboard from the header menu
3. View analytics and statistics
4. Manage products and reviews
5. Monitor user activity

---

## 9. API Integration

### 9.1 Gemini AI Integration

The application uses the Google Generative AI SDK:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(environment.geminiApiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: '...'
});
```

### 9.2 System Instructions

The AI is configured with detailed system instructions including:
- Role definition (C-UAS Expert Assistant)
- Response formatting guidelines
- Knowledge base context
- Behavioral constraints

### 9.3 Rate Limiting

Google Gemini API has usage limits:
- Free tier: 60 requests per minute
- Consider implementing client-side throttling for production

---

## 10. Deployment

### 10.1 Production Build

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

### 10.2 Build Output

```
dist/
└── c-uas-app/
    └── browser/
        ├── index.html
        ├── main.js
        ├── polyfills.js
        ├── styles.css
        └── assets/
```

### 10.3 Deployment Options

**Option 1: Static Hosting (Recommended)**
- AWS S3 + CloudFront
- Azure Static Web Apps
- Netlify
- Vercel

**Option 2: Traditional Web Server**
- Nginx
- Apache
- IIS

**Option 3: Container Deployment**
```dockerfile
FROM nginx:alpine
COPY dist/c-uas-app/browser /usr/share/nginx/html
EXPOSE 80
```

### 10.4 Environment Variables in Production

For production deployment, set environment variables securely:

```bash
# Example for cloud deployment
export GEMINI_API_KEY=your_production_api_key
npm run build
```

---

## 11. Security Considerations

**⚠️ IMPORTANT: This is a prototype application.**

This application has been developed as a proof-of-concept demonstration for the Lean Innovation Lab. The following security limitations should be noted:

### Current Limitations

- **No Real Authentication:** The login system is simulated for demonstration purposes only. There is no backend authentication, password verification, or secure credential storage implemented.

- **No Security Review:** This prototype has not undergone a formal security review or penetration testing.

- **API Key Exposure:** The Gemini API key is embedded in the client-side code. In a production environment, API calls should be routed through a secure backend.

- **Local Storage Only:** User session data is stored in browser localStorage, which is not a secure authentication mechanism.

### Before Production Use

If this application is to be deployed in a production environment, the following must be implemented:

1. Backend authentication system with secure credential storage
2. Server-side API proxy to protect API keys
3. Comprehensive security audit and penetration testing
4. HTTPS enforcement
5. Proper session management with secure tokens
6. Input validation and sanitization review
7. Compliance review for applicable regulations (NIST, DoD SRG, etc.)

---

## 12. Troubleshooting

### Common Issues

#### Issue: "Module not found" errors
**Solution:**
```bash
rm -rf node_modules
npm install
```

#### Issue: Gemini API not responding
**Solutions:**
1. Verify API key is correct in `.env`
2. Run `npm run generate-env` to regenerate environment files
3. Check API quota at Google AI Studio
4. Verify internet connectivity

#### Issue: Login not working
**Solution:**
- Ensure email ends with `.mil`
- Clear browser localStorage
- Check browser console for errors

#### Issue: Products not loading
**Solutions:**
1. Verify `assets` configuration in `angular.json`:
```json
"assets": [
  { "glob": "**/*", "input": "src/assets", "output": "/assets" }
]
```
2. Check browser network tab for 404 errors
3. Restart the development server

#### Issue: Chatbot showing "I'm still loading"
**Solution:**
- Wait for knowledge base to load (up to 5 seconds)
- Check browser console for JSON loading errors
- Verify `knowledge-base.json` exists in assets

### Getting Help

For additional support:
1. Check the browser console for error messages
2. Review the Angular CLI documentation
3. Consult the Google Generative AI documentation

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | November 2025 | Initial release |

---

## License

This application is developed for the Lean Innovation Lab - Fall 2025 Masters Program.

---
