const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Issue = require('../models/Issue');

const sendEmail = require('../utils/sendEmail');


/* =================================================
   PROMOTE USER → ADMIN + EMAIL
   PUT /api/admin/make-admin/:userId
================================================= */
router.put('/make-admin/:userId', async (req, res) => {

  try {

    const user = await User.findById(req.params.userId);

    if (!user)
      return res.json({ success:false, message:'User not found ❌' });

    if (user.role === 'admin')
      return res.json({ success:false, message:'Already admin ⚠️' });


    /* =============================
       UPDATE ROLE
    ============================= */
    user.role = 'admin';
    await user.save();


    /* =============================
       BEAUTIFUL EMAIL MESSAGE
    ============================= */
    const message = `
Hello ${user.name},

🎉 Congratulations!

You have been promoted to ADMIN in ULMiND.

Now you can:
• Create Projects
• Manage Users
• Assign Issues
• Monitor Dashboard
• Full system access

Login here:
http://localhost:7000

Lead your team like a pro 🚀

Thanks,
ULMiND Team
`;


    /* =============================
       SEND EMAIL
    ============================= */
    await sendEmail(
      user.email,
      '🎉 You are now an Admin - ULMiND',
      message
    );


    res.json({
      success:true,
      message:'User promoted to admin + email sent ✅',
      user
    });

  } catch (err) {
    res.json({ success:false, message: err.message });
  }

});
/* =================================================
   DELETE USER
   DELETE /api/admin/user/:id
================================================= */
router.delete('/user/:id', async (req, res) => {

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success:true,
    message:'User deleted ✅'
  });
});

/* =================================================
   GET ANALYTICS FOR ADMIN DASHBOARD
   GET /api/admin/analytics
================================================= */
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProjects = await Project.countDocuments();
    const totalIssues = await Issue.countDocuments();

    // Group issues by status
    const statusAggregation = await Issue.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const issuesByStatus = {
      pending: 0,
      working: 0,
      fixed: 0
    };
    statusAggregation.forEach(item => {
      if(item._id) issuesByStatus[item._id] = item.count;
    });

    // Group issues by priority
    const priorityAggregation = await Issue.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);
    const issuesByPriority = {
      low: 0,
      medium: 0,
      high: 0
    };
    priorityAggregation.forEach(item => {
      if(item._id) issuesByPriority[item._id] = item.count;
    });

    // Recent 5 issues
    const recentIssues = await Issue.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('project', 'name')
      .populate('assignedTo', 'name email');

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalProjects,
        totalIssues
      },
      issuesByStatus,
      issuesByPriority,
      recentIssues
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;