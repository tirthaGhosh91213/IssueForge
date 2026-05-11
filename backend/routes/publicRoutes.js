const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Issue = require('../models/Issue');
const User = require('../models/User');

router.get('/stats', async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: 'fixed' }); // 'fixed' or 'resolved'? Let's check model
    const totalUsers = await User.countDocuments();

    // Get some recent issues for the dashboard preview
    const recentIssues = await Issue.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title priority status');

    res.json({
      success: true,
      stats: {
        totalProjects,
        totalIssues,
        resolvedIssues,
        totalUsers
      },
      recentIssues
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
