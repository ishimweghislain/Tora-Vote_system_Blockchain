const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');

// Store votes in memory for demo (in real app, this would be blockchain)
let votes = [];
let candidates = [
  { id: 1, name: 'KAGAME PAUL', voteCount: 0 },
  { id: 2, name: 'ANDY ISHIMWE', voteCount: 0 },
  { id: 3, name: 'ISHIMWE GHISLAIN', voteCount: 0 }
];

// Submit a vote
router.post('/submit', async (req, res) => {
  try {
    const { rwandanId, candidateId } = req.body;
    
    // Validate required fields
    if (!rwandanId || !candidateId) {
      return res.status(400).json({ error: 'Rwandan ID and candidate ID are required' });
    }
    
    // Check if voter is registered
    const voter = await Voter.findOne({ rwandanId });
    if (!voter) {
      return res.status(400).json({ error: 'Voter not registered' });
    }
    
    // Check if voter has already voted
    const existingVote = votes.find(v => v.rwandanId === rwandanId);
    if (existingVote) {
      return res.status(400).json({ error: 'Voter has already voted' });
    }
    
    // Check if candidate exists
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) {
      return res.status(400).json({ error: 'Invalid candidate' });
    }
    
    // Record the vote
    votes.push({
      rwandanId,
      candidateId,
      timestamp: new Date(),
      voterName: voter.fullName
    });
    
    // Update candidate vote count
    candidate.voteCount++;
    
    res.json({
      message: 'Vote submitted successfully',
      vote: {
        rwandanId,
        candidateId,
        candidateName: candidate.name,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// Get all votes
router.get('/', (req, res) => {
  res.json({
    votes,
    candidates,
    totalVotes: votes.length
  });
});

// Get candidate results
router.get('/results', (req, res) => {
  res.json({
    candidates: candidates.map(c => ({
      ...c,
      percentage: votes.length > 0 ? ((c.voteCount / votes.length) * 100).toFixed(1) : 0
    })),
    totalVotes: votes.length
  });
});

// Reset votes (for testing)
router.delete('/reset', (req, res) => {
  votes = [];
  candidates.forEach(c => c.voteCount = 0);
  res.json({ message: 'Votes reset successfully' });
});

module.exports = router;
