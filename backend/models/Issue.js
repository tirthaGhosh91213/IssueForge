const mongoose = require('mongoose');


/* ================================
   COMMENT SCHEMA
================================ */
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },

  // who commented (optional but useful)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


/* ================================
   ISSUE SCHEMA
================================ */
const issueSchema = new mongoose.Schema({

  /* Basic Info */
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ''
  },


  /* Project Relation */
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },


  /* Assignment */
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // ⭐ NEW (fixes your error)
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // ⭐ NEW (track time)
  assignedAt: {
    type: Date,
    default: null
  },


  /* Priority */
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },


  /* Status */
  status: {
    type: String,
    enum: ['pending', 'working', 'fixed'],
    default: 'pending'
  },


  /* File */
  media: {
    type: String,
    default: null
  },


  /* Comments */
  comments: [commentSchema]

}, {
  timestamps: true   // createdAt + updatedAt auto
});


module.exports = mongoose.model('Issue', issueSchema);
