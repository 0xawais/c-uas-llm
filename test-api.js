const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyBPbftBtYy7vvOviHquVwiQUaXeDw9KWY4';

async function testGeminiAPI() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent('Say hello world');
    const response = await result.response;
    console.log('✅ API Key is valid!');
    console.log('Response:', response.text());
  } catch (error) {
    console.log('❌ API Key is invalid or has issues:');
    console.log('Error:', error.message);
  }
}

testGeminiAPI();