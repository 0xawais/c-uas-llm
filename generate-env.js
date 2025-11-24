const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read the .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.warn('Warning: .env file not found. Using default values.');
}

// Get the API key from environment
const geminiApiKey = process.env.GEMINI_API_KEY || 'your_gemini_api_key_here';

// Generate development environment file
const devEnvContent = `export const environment = {
  production: false,
  geminiApiKey: '${geminiApiKey}'
};
`;

// Generate production environment file
const prodEnvContent = `export const environment = {
  production: true,
  geminiApiKey: '${geminiApiKey}'
};
`;

// Write the files
fs.writeFileSync(path.join(__dirname, 'src/environments/environment.ts'), devEnvContent);
fs.writeFileSync(path.join(__dirname, 'src/environments/environment.prod.ts'), prodEnvContent);
fs.writeFileSync(path.join(__dirname, 'src/environments/environment.dev.ts'), devEnvContent);

console.log('Environment files generated successfully.');