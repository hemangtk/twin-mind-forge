
const express = require('express');
const router = express.Router();
const { savePersonalityProfile, getPersonalityProfile } = require('../utils/memory');

// Save personality profile
router.post('/', async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ error: 'Personality answers are required' });
    }

    const profile = {
      id: Date.now().toString(),
      answers,
      createdAt: new Date().toISOString()
    };

    await savePersonalityProfile(profile);
    
    res.json({ 
      success: true, 
      profileId: profile.id,
      message: 'Personality profile created successfully' 
    });
  } catch (error) {
    console.error('Error saving personality profile:', error);
    res.status(500).json({ error: 'Failed to save personality profile' });
  }
});

// Get personality profile
router.get('/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await getPersonalityProfile(profileId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Personality profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error retrieving personality profile:', error);
    res.status(500).json({ error: 'Failed to retrieve personality profile' });
  }
});

module.exports = router;
