const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  candidateId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  party: {
    type: String,
    default: 'Independent'
  },
  description: {
    type: String,
    default: 'Umukandida w\'amatora'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);
