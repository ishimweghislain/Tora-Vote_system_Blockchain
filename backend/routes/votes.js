const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');

// Check if voter has already voted
router.get('/check/:rwandanId', async (req, res) => {
  try {
    const { rwandanId } = req.params;

    const existingVote = await Vote.findOne({ rwandanId });

    res.json({
      hasVoted: !!existingVote,
      voteTimestamp: existingVote ? existingVote.timestamp : null
    });
  } catch (error) {
    console.error('Vote check error:', error);
    res.status(500).json({ error: 'Failed to check vote status' });
  }
});

// Submit a vote
router.post('/submit', async (req, res) => {
  try {
    const { rwandanId, candidateId } = req.body;

    // Validate required fields
    if (!rwandanId || !candidateId) {
      return res.status(400).json({ error: 'Rwandan ID and candidate ID are required' });
    }

    // Check if voter is registered and eligible
    const voter = await Voter.findOne({ rwandanId }).populate('village');
    if (!voter) {
      return res.status(400).json({ error: 'Voter not registered' });
    }

    if (!voter.isEligible) {
      return res.status(400).json({ error: 'Voter is not eligible to vote' });
    }

    // Check if voter has already voted
    const existingVote = await Vote.findOne({ rwandanId });
    if (existingVote) {
      return res.status(400).json({ error: 'Voter has already voted' });
    }

    // Check if candidate exists
    const candidate = await Candidate.findOne({ candidateId });
    if (!candidate || !candidate.isActive) {
      return res.status(400).json({ error: 'Invalid candidate' });
    }

    // Create and save the vote
    const vote = new Vote({
      rwandanId,
      candidateId,
      candidateName: candidate.name,
      voterName: voter.fullName,
      village: voter.village._id
    });

    await vote.save();

    res.json({
      message: 'Vote submitted successfully',
      vote: {
        rwandanId,
        candidateId,
        candidateName: candidate.name,
        timestamp: vote.timestamp
      }
    });
  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// Get all votes (admin only)
router.get('/', async (req, res) => {
  try {
    const votes = await Vote.find()
      .populate('village', 'name district province')
      .sort({ timestamp: -1 });

    const candidates = await Candidate.find({ isActive: true });

    res.json({
      votes,
      candidates,
      totalVotes: votes.length
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// Get candidate results
router.get('/results', async (req, res) => {
  try {
    const candidates = await Candidate.find({ isActive: true });
    const votes = await Vote.find();

    // Calculate vote counts for each candidate
    const candidateResults = candidates.map(candidate => {
      const voteCount = votes.filter(vote => vote.candidateId === candidate.candidateId).length;
      const percentage = votes.length > 0 ? ((voteCount / votes.length) * 100).toFixed(1) : 0;

      return {
        id: candidate.candidateId,
        name: candidate.name,
        imageUrl: candidate.imageUrl,
        voteCount,
        percentage
      };
    });

    res.json({
      candidates: candidateResults,
      totalVotes: votes.length
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Get voting statistics
router.get('/stats', async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments();
    const totalVoters = await Voter.countDocuments();
    const totalCandidates = await Candidate.countDocuments({ isActive: true });

    // Votes by village
    const votesByVillage = await Vote.aggregate([
      {
        $lookup: {
          from: 'villages',
          localField: 'village',
          foreignField: '_id',
          as: 'villageInfo'
        }
      },
      {
        $unwind: '$villageInfo'
      },
      {
        $group: {
          _id: '$villageInfo.name',
          count: { $sum: 1 },
          district: { $first: '$villageInfo.district' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      totalVotes,
      totalVoters,
      totalCandidates,
      turnoutPercentage: totalVoters > 0 ? ((totalVotes / totalVoters) * 100).toFixed(1) : 0,
      votesByVillage
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Reset votes (for testing - admin only)
router.delete('/reset', async (req, res) => {
  try {
    await Vote.deleteMany({});
    res.json({ message: 'All votes reset successfully' });
  } catch (error) {
    console.error('Error resetting votes:', error);
    res.status(500).json({ error: 'Failed to reset votes' });
  }
});

module.exports = router;
