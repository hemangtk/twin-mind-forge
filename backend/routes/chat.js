const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  getPersonalityProfile,
  saveChatMessage,
  getChatHistory,
  clearChatHistory
} = require('../utils/memory');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { profileId, message } = req.body;

    console.log("📨 Message received:", message);
    console.log("🆔 Profile ID:", profileId);

    if (!profileId || !message) {
      return res.status(400).json({ error: 'Profile ID and message are required' });
    }

    const profile = await getPersonalityProfile(profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Personality profile not found' });
    }

    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user'
    };
    await saveChatMessage(profileId, userMessage);

    const personalityContext = Object.entries(profile.answers)
      .map(([key, val]) => `${key}: ${val}`)
      .join('\n');

    const systemPrompt = `You are an AI personality twin that mimics the user's communication style and personality. Here's their personality profile:\n\n${personalityContext}\n\nUser message: ${message}`;

    console.log("🧾 Sending to Gemini:\n", systemPrompt);

    let botResponse = "Sorry, I couldn’t generate a response right now.";

try {
  const result = await model.generateContent([systemPrompt]);

  if (!result || !result.response) {
    console.error("❌ No response from Gemini.");
    throw new Error("No valid response from Gemini.");
  }

  const response = await result.response;

  // Safely handle .text() whether it's async or not
  let text;
  if (typeof response.text === 'function') {
    text = await response.text();
  } else {
    text = response.text || '';
  }

  botResponse = text?.trim() || "Sorry, I didn’t quite get that.";
  console.log("💬 Gemini replied:", botResponse);
} catch (err) {
  console.error("❌ Gemini crash caught:", err.stack || err.message);
  botResponse = "Hmm... I'm having trouble replying right now.";
}



    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot'
    };
    await saveChatMessage(profileId, botMessage);

    res.json({ success: true, message: botMessage });

  } catch (err) {
    console.error("🔥 Critical chat error:", err.stack || err.message);
    res.status(500).json({ error: 'Failed to get response. Please try again later.' });
  }
});

// GET chat history
router.get('/:profileId', async (req, res) => {
  try {
    const chatHistory = await getChatHistory(req.params.profileId);
    res.json({ success: true, messages: chatHistory });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

// DELETE chat history
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
