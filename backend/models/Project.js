const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  githubUrl: {
    type: String
  },

  image: {
    type: String // store image filename/path
  }

}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
