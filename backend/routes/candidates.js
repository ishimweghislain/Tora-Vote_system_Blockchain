const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// Get all active candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find({ isActive: true }).sort({ candidateId: 1 });
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// Get candidate by ID
router.get('/:candidateId', async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ 
      candidateId: req.params.candidateId,
      isActive: true 
    });
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
});

// Add new candidate (admin only)
router.post('/', async (req, res) => {
  try {
    const { candidateId, name, imageUrl, party, description } = req.body;
    
    // Validate required fields
    if (!candidateId || !name) {
      return res.status(400).json({ error: 'Candidate ID and name are required' });
    }
    
    // Check if candidate ID already exists
    const existingCandidate = await Candidate.findOne({ candidateId });
    if (existingCandidate) {
      return res.status(400).json({ error: 'Candidate with this ID already exists' });
    }
    
    const candidate = new Candidate({
      candidateId,
      name,
      imageUrl,
      party,
      description
    });
    
    await candidate.save();
    
    res.status(201).json({
      message: 'Candidate added successfully',
      candidate
    });
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ error: 'Failed to add candidate' });
  }
});

// Update candidate (admin only)
router.patch('/:candidateId', async (req, res) => {
  try {
    const { name, imageUrl, party, description, isActive } = req.body;
    
    const candidate = await Candidate.findOneAndUpdate(
      { candidateId: req.params.candidateId },
      { name, imageUrl, party, description, isActive },
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json({
      message: 'Candidate updated successfully',
      candidate
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

// Delete candidate (admin only)
router.delete('/:candidateId', async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndDelete({ candidateId: req.params.candidateId });
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

module.exports = router;
