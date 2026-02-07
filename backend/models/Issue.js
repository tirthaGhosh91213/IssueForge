const mongoose = require('mongoose');

/* ================================
   COMMENT SCHEMA
================================ */
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

/* ================================
   ISSUE SCHEMA
================================ */
const issueSchema = new mongoose.Schema(
  {
    /* BASIC INFO */
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ''
    },

    /* PROJECT */
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },

    /* ASSIGNMENT (MULTIPLE EMPLOYEES) */
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    assignedAt: {
      type: Date,
      default: null
    },

    /* PRIORITY */
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },

    /* STATUS */
    status: {
      type: String,
      enum: ['pending', 'working', 'fixed'],
      default: 'pending'
    },

    /* MEDIA */
    media: {
      type: String,
      default: null
    },

    /* COMMENTS */
    comments: [commentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);
