const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  rwandanId: {
    type: String,
    required: true,
    unique: true, // Each voter can only vote once
    trim: true,
    length: 16
  },
  candidateId: {
    type: Number,
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  voterName: {
    type: String,
    required: true
  },
  village: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Village',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // For blockchain integration later
  blockchainTxHash: {
    type: String,
    default: null
  },
  verified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
voteSchema.index({ rwandanId: 1 });
voteSchema.index({ candidateId: 1 });
voteSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Vote', voteSchema);
