
const fs = require('fs').promises;
const path = require('path');

// Create data directory if it doesn't exist
const DATA_DIR = path.join(__dirname, '../data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');
const CHATS_FILE = path.join(DATA_DIR, 'chats.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Save personality profile
async function savePersonalityProfile(profile) {
  await ensureDataDir();
  
  let profiles = [];
  try {
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    profiles = JSON.parse(data);
  } catch {
    // File doesn't exist yet, start with empty array
  }
  
  profiles.push(profile);
  await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2));
  return profile;
}

// Get personality profile
async function getPersonalityProfile(profileId) {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    const profiles = JSON.parse(data);
    return profiles.find(p => p.id === profileId);
  } catch {
    return null;
  }
}

async function updatePersonalityProfile(profileId, newAnswers) {
  await ensureDataDir();

  try {
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    const profiles = JSON.parse(data);
    const index = profiles.findIndex(p => p.id === profileId);
    if (index === -1) return null;

    profiles[index].answers = {
      ...profiles[index].answers,
      ...newAnswers // merge with existing answers
    };

    await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2));
    return profiles[index];
  } catch {
    return null;
  }
}

// Save chat message
async function saveChatMessage(profileId, message) {
  await ensureDataDir();
  
  let chats = {};
  try {
    const data = await fs.readFile(CHATS_FILE, 'utf8');
    chats = JSON.parse(data);
  } catch {
    // File doesn't exist yet, start with empty object
  }
  
  if (!chats[profileId]) {
    chats[profileId] = [];
  }
  
  chats[profileId].push({
    ...message,
    timestamp: new Date().toISOString()
  });
  
  await fs.writeFile(CHATS_FILE, JSON.stringify(chats, null, 2));
  return message;
}

// Get chat history
async function getChatHistory(profileId) {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(CHATS_FILE, 'utf8');
    const chats = JSON.parse(data);
    return chats[profileId] || [];
  } catch {
    return [];
  }
}

// Clear chat history
async function clearChatHistory(profileId) {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(CHATS_FILE, 'utf8');
    const chats = JSON.parse(data);
    delete chats[profileId];
    await fs.writeFile(CHATS_FILE, JSON.stringify(chats, null, 2));
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  savePersonalityProfile,
  getPersonalityProfile,
  updatePersonalityProfile,
  saveChatMessage,
  getChatHistory,
  clearChatHistory
};
