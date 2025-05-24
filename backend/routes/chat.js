
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getPersonalityProfile, saveChatMessage, getChatHistory, clearChatHistory } = require('../utils/memory');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Send message and get AI response
router.post('/', async (req, res) => {
  try {
    const { profileId, message } = req.body;
    
    if (!profileId || !message) {
      return res.status(400).json({ error: 'Profile ID and message are required' });
    }

    // Get personality profile
    const profile = await getPersonalityProfile(profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Personality profile not found' });
    }

    // Save user message
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user'
    };
    await saveChatMessage(profileId, userMessage);

    // Generate AI response
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Create personality-aware prompt
    const personalityContext = Object.entries(profile.answers)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join('\n');
    
    const systemPrompt = `You are an AI personality twin that mimics the user's communication style and personality. Here's their personality profile:

${personalityContext}

Based on this personality profile, respond to messages in a way that matches their tone, decision-making style, and communication preferences. Be conversational and authentic to their personality.

User message: ${message}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const botResponse = response.text();

    // Save bot response
    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot'
    };
    await saveChatMessage(profileId, botMessage);

    res.json({
      success: true,
      message: botMessage
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get chat history
router.get('/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const chatHistory = await getChatHistory(profileId);
    
    res.json({
      success: true,
      messages: chatHistory
    });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

// Clear chat history
router.delete('/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    await clearChatHistory(profileId);
    
    res.json({
      success: true,
      message: 'Chat history cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

module.exports = router;
