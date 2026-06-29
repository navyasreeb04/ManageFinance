const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Free model – fast and capable
const MODEL_NAME = 'gemini-2.5-flash';

async function getAIInsights(message, transactions, budgets) {
  // 1. Build spending summary
  const spendingSummary = transactions
    .filter(tx => tx.txType === 'DEBIT')
    .reduce((acc, tx) => {
      const cat = tx.type || 'other';
      acc[cat] = (acc[cat] || 0) + tx.amount;
      return acc;
    }, {});

  const totalSpent = Object.values(spendingSummary).reduce((a, b) => a + b, 0);
  const totalReceived = transactions
    .filter(tx => tx.txType === 'CREDIT')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // 2. Format budget information
  let budgetInfo = '';
  if (budgets && Object.keys(budgets).length > 0) {
    budgetInfo = Object.entries(budgets)
      .map(([cat, { limit, spent }]) => {
        const used = spent || 0;
        const pct = limit > 0 ? Math.round((used / limit) * 100) : 0;
        return `- ${cat}: ₹${used.toLocaleString()} / ₹${limit.toLocaleString()} (${pct}% used)`;
      })
      .join('\n');
  } else {
    budgetInfo = 'No budgets set.';
  }

  // 3. Build prompt for Gemini
  const prompt = `
You are a friendly, professional financial advisor for a fintech app called FinTech.

USER QUESTION: ${message}

FINANCIAL DATA:
- Total spent: ₹${totalSpent.toLocaleString()}
- Total received: ₹${totalReceived.toLocaleString()}
- Net balance: ₹${(totalReceived - totalSpent).toLocaleString()}
- Spending by category:
${Object.entries(spendingSummary).map(([cat, amt]) => `  - ${cat}: ₹${amt.toLocaleString()}`).join('\n')}

BUDGETS:
${budgetInfo}

Please respond in a helpful, actionable tone. Give specific advice based on the data. Keep it concise (2-3 paragraphs).In bullet points for each para. Use emojis sparingly but appropriately.
`;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text || "I'm not sure how to respond to that. Could you try rephrasing?";
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to mock response if API fails
    return getMockResponse(message, spendingSummary, totalSpent, totalReceived, budgets);
  }
}

// Fallback mock (same as before)
function getMockResponse(message, spendingSummary, totalSpent, totalReceived, budgets) {
  // ... (keep the mock logic from earlier)
  let parts = [];
  if (totalSpent === 0) {
    parts.push("📊 You haven't made any purchases yet. Start tracking your spending to get insights!");
  } else {
    parts.push(
      `💰 You've spent ₹${totalSpent.toLocaleString()} and received ₹${totalReceived.toLocaleString()}. ` +
      `Net balance change: ₹${(totalReceived - totalSpent).toLocaleString()}.`
    );
    const sorted = Object.entries(spendingSummary).sort((a, b) => b[1] - a[1]);
    if (sorted.length) {
      parts.push(`📌 Top category: ${sorted[0][0]} (₹${sorted[0][1].toLocaleString()}).`);
    }
  }
  // add general advice
  parts.push("💡 Try to save at least 20% of your income.");
  return parts.join('\n\n');
}

module.exports = { getAIInsights };