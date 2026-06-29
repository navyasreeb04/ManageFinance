require('dotenv').config();
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

async function test() {
  try {
    const response = await client.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [{ role: 'user', content: 'Hello' }],
    });
    console.log('✅ Success:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();