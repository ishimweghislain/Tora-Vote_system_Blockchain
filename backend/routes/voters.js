const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');
const Village = require('../models/Village');

// Register a new voter
router.post('/register', async (req, res) => {
  try {
    const { rwandanId, fullName, gender, villageId } = req.body;
    
    // Validate required fields
    if (!rwandanId || !fullName || !gender || !villageId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate Rwandan ID format (16 digits)
    if (rwandanId.length !== 16 || !/^\d+$/.test(rwandanId)) {
      return res.status(400).json({ error: 'Rwandan ID must be 16 digits' });
    }
    
    // Validate gender
    if (!['Male', 'Female'].includes(gender)) {
      return res.status(400).json({ error: 'Gender must be Male or Female' });
    }
    
    // Check if village exists
    const village = await Village.findById(villageId);
    if (!village) {
      return res.status(400).json({ error: 'Invalid village selected' });
    }
    
    // Check if voter already exists
    const existingVoter = await Voter.findOne({ rwandanId });
    if (existingVoter) {
      return res.status(400).json({ error: 'Voter with this ID is already registered' });
    }
    
    // Create new voter
    const voter = new Voter({
      rwandanId,
      fullName,
      gender,
      village: villageId
    });
    
    await voter.save();
    
    // Populate village details
    await voter.populate('village');
    
    res.status(201).json({
      message: 'Voter registered successfully',
      voter: {
        rwandanId: voter.rwandanId,
        fullName: voter.fullName,
        gender: voter.gender,
        village: voter.village,
        isEligible: voter.isEligible
      }
    });
  } catch (error) {
    console.error('Voter registration error:', error);
    res.status(500).json({ error: 'Failed to register voter' });
  }
});

// Get all voters
router.get('/', async (req, res) => {
  try {
    const voters = await Voter.find().populate('village').sort({ fullName: 1 });
    res.json(voters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voters' });
  }
});

// Get voter by Rwandan ID
router.get('/:rwandanId', async (req, res) => {
  try {
    const voter = await Voter.findOne({ rwandanId: req.params.rwandanId }).populate('village');
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }
    res.json(voter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voter' });
  }
});

// Update voter eligibility
router.patch('/:rwandanId/eligibility', async (req, res) => {
  try {
    const { isEligible } = req.body;
    
    if (typeof isEligible !== 'boolean') {
      return res.status(400).json({ error: 'isEligible must be a boolean' });
    }
    
    const voter = await Voter.findOneAndUpdate(
      { rwandanId: req.params.rwandanId },
      { isEligible },
      { new: true }
    ).populate('village');
    
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }
    
    res.json({
      message: 'Voter eligibility updated successfully',
      voter
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update voter eligibility' });
  }
});

// Delete voter
router.delete('/:rwandanId', async (req, res) => {
  try {
    const voter = await Voter.findOneAndDelete({ rwandanId: req.params.rwandanId });
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }
    
    res.json({ message: 'Voter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete voter' });
  }
});

module.exports = router; 