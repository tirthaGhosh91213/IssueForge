const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const issueSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: String,

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  status: {
    type: String,
    enum: ['pending', 'working', 'fixed'],
    default: 'pending'
  },

  media: String,

  comments: [commentSchema]

}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
