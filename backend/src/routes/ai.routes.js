const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getAIInsights } = require('../services/ai.service');

router.use(express.json());

router.post('/ask', authMiddleware.authMiddleware, async (req, res) => {
  try {
    const { message, transactions, budgets } = req.body;
    console.log('🤖 AI Question:', message);
    const insights = await getAIInsights(message, transactions, budgets);
    console.log('🤖 AI Response:', insights);
    res.json({ insights });
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

module.exports = router;