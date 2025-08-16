const express = require('express');
const router = express.Router();
const Village = require('../models/Village');

// Get all villages
router.get('/', async (req, res) => {
  try {
    const villages = await Village.find().sort({ name: 1 });
    res.json(villages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch villages' });
  }
});

// Get villages by district
router.get('/district/:district', async (req, res) => {
  try {
    const villages = await Village.find({ district: req.params.district }).sort({ name: 1 });
    res.json(villages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch villages by district' });
  }
});

// Get villages by province
router.get('/province/:province', async (req, res) => {
  try {
    const villages = await Village.find({ province: req.params.province }).sort({ name: 1 });
    res.json(villages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch villages by province' });
  }
});

// Search villages by name
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const villages = await Village.find({
      name: { $regex: q, $options: 'i' }
    }).limit(20).sort({ name: 1 });
    
    res.json(villages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search villages' });
  }
});

module.exports = router; 