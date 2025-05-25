const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  getPersonalityProfile,
  saveChatMessage,
  getChatHistory,
  clearChatHistory
} = require('../utils/memory');

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/chat → handle a chat message
router.post('/', async (req, res) => {
  try {
    const { profileId, message } = req.body;
    console.log("📨 Incoming message:", message);
    console.log("🔎 Profile ID:", profileId);

    if (!profileId || !message) {
      return res.status(400).json({ error: 'Profile ID and message are required' });
    }

    const profile = await getPersonalityProfile(profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Personality profile not found' });
    }

    console.log("🧠 Using Gemini with profile:", profile.answers);

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user'
    };
    await saveChatMessage(profileId, userMessage);

    const personalityContext = Object.entries(profile.answers)
      .map(([key, val]) => `${key}: ${val}`)
      .join('\n');

    const systemPrompt = `You are an AI personality twin that mimics the user's communication style and personality. Here's their personality profile:\n\n${personalityContext}\n\nBased on this profile, reply to the user’s message with their tone, style, and way of thinking.\n\nUser message: ${message}`;

    console.log("🧾 System prompt:\n", systemPrompt);

    let botResponse = "Sorry, I couldn’t generate a response right now.";

    try {
      const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
      const result = await model.generateContent([systemPrompt]);
      const response = await result.response;
      botResponse = response.text();
    } catch (geminiError) {
      console.error("❌ Gemini error:", geminiError);
    }

    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot'
    };
    await saveChatMessage(profileId, botMessage);

    res.json({ success: true, message: botMessage });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// GET /api/chat/:profileId → get chat history
router.get('/:profileId', async (req, res) => {
  try {
    const chatHistory = await getChatHistory(req.params.profileId);
    res.json({ success: true, messages: chatHistory });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

// DELETE /api/chat/:profileId → clear chat history
router.delete('/:profileId', async (req, res) => {
  try {
    await clearChatHistory(req.params.profileId);
    res.json({ success: true, message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

module.exports = router;
