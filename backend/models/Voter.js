const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  rwandanId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    length: 16
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  village: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Village',
    required: true
  },
  isEligible: {
    type: Boolean,
    default: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  // Note: Actual voting data (hasVoted, votedCandidateId) is stored on blockchain
  // This is just for eligibility management
}, {
  timestamps: true
});

module.exports = mongoose.model('Voter', voterSchema); 