const express = require('express');
const router = express.Router();
const multer = require('multer');

const Issue = require('../models/Issue');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

/* =================================
   MULTER CONFIG
================================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

/* =================================
   1️⃣ GET ALL ISSUES (FILTER + PAGINATION)
   GET /api/issues
================================= */
router.get('/', async (req, res) => {
  try {
    const { page=1, limit=5, status, priority, projectId, search } = req.query;
    const filter = {};

    if (projectId) filter.project = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const total = await Issue.countDocuments(filter);

    const issues = await Issue.find(filter)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name')
      .populate('project', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      issues
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* =================================
   ⭐ 2️⃣ GET ISSUES WITH EMPLOYEES (MOVED TO TOP)
   GET /api/issues/with-employees ✅ FIXED
================================= */
router.get('/with-employees', async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name')
      .populate('project', 'name');

    const result = issues.map(issue => ({
      issueId: issue._id,
      title: issue.title,
      project: issue.project?.name,
      status: issue.status,
      employee: issue.assignedTo ? `${issue.assignedTo.name} (${issue.assignedTo.email})` : "Not Assigned",
      assignedBy: issue.assignedBy?.name || "—"
    }));

    res.json({
      success: true,
      total: result.length,
      issues: result
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* =================================
   3️⃣ GET ISSUE BY ID (AFTER specific routes)
   GET /api/issues/:id
================================= */
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('project', 'name');

    if (!issue) {
      return res.json({ success: false, message: 'Issue not found' });
    }

    res.json({ success: true, issue });
  } catch (err) {
    res.json({ success: false, message: 'Invalid ID format' });
  }
});

/* =================================
   4️⃣ CREATE ISSUE
   POST /api/issues/create/:projectId
================================= */
router.post('/create/:projectId', upload.single('media'), async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const issue = await Issue.create({
      title,
      description,
      priority,
      project: req.params.projectId,
      status: 'pending',
      media: req.file?.filename || null
    });

    res.json({ success: true, issue });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* =================================
   🔄 UPDATE ISSUE
   PUT /api/issues/update/:id
================================= */
router.put('/update/:id', upload.single('media'), async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;

    const updateData = {};

    // update only provided fields
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;

    if (req.file) {
      updateData.media = req.file.filename;
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!issue) {
      return res.json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      message: 'Issue updated successfully ✅',
      issue
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    });
  }
});

/* =================================
   ⭐ 5️⃣ ASSIGN MULTIPLE EMPLOYEES
   PUT /api/issues/assign/:id
================================= */
router.put('/assign/:id', async (req, res) => {
  try {
    const { userIds, adminId } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.json({
        success: false,
        message: 'userIds array required'
      });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.json({ success: false, message: 'Issue not found' });
    }

    const existingIds = issue.assignedTo.map(id => id.toString());

    // filter only NEW users
    const newUserIds = userIds.filter(
      id => !existingIds.includes(id)
    );

    if (newUserIds.length === 0) {
      return res.json({
        success: false,
        message: 'Users already assigned'
      });
    }

    issue.assignedTo.push(...newUserIds);
    issue.assignedBy = adminId;
    issue.assignedAt = new Date();
    await issue.save();

    const users = await User.find({ _id: { $in: newUserIds } });

    // send email only to new users
    for (const user of users) {
      await sendEmail(
        user.email,
        '🚀 Issue Assigned',
        `You have been assigned to issue: ${issue.title}`
      );
    }

    res.json({
      success: true,
      message: 'Employee(s) assigned successfully ✅',
      assignedUsers: users.map(u => ({
        id: u._id,
        name: u.name
      }))
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// remove emp

router.put('/remove-employee/:issueId', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: 'userId required'
      });
    }

    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
      return res.json({ success: false, message: 'Issue not found' });
    }

    issue.assignedTo = issue.assignedTo.filter(
      id => id.toString() !== userId
    );

    await issue.save();

    res.json({
      success: true,
      message: 'Employee removed successfully ✅',
      remainingEmployees: issue.assignedTo
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});



/* =================================
   6️⃣ GET ASSIGNMENT DETAILS
   GET /api/issues/assignment/:issueId
================================= */
router.get('/assignment/:issueId', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('project', 'name');

    if (!issue) {
      return res.json({ success: false, message: 'Issue not found' });
    }

    res.json({
      success: true,
      issue: issue.title,
      project: issue.project?.name,
      employee: issue.assignedTo,
      assignedBy: issue.assignedBy,
      assignedAt: issue.assignedAt
    });
  } catch (err) {
    res.json({ success: false, message: 'Invalid ID format' });
  }
});

/* =================================
   7️⃣ REMOVE EMPLOYEE
   PUT /api/issues/remove-employee/:id
================================= */
router.put('/remove-employee/:id', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { assignedTo: null, assignedBy: null, assignedAt: null },
      { new: true }
    );

    if (!issue) {
      return res.json({ success: false, message: 'Issue not found' });
    }

    res.json({ success: true, issue });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* =================================
   8️⃣ UPDATE ISSUE STATUS
   PUT /api/issues/status/:id
================================= */
router.put('/status/:id', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!issue) {
      return res.json({ success: false, message: 'Issue not found' });
    }

    res.json({ success: true, issue });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* =================================
   9️⃣ GET STATUS ONLY
   GET /api/issues/status/:id
================================= */
router.get('/status/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).select('status title');

    if (!issue) {
      return res.json({ success: false, message: 'Issue not found' });
    }

    res.json({
      success: true,
      title: issue.title,
      status: issue.status
    });
  } catch (err) {
    res.json({ success: false, message: 'Invalid ID format' });
  }
});

/* =================================
   🔟 ADD COMMENT
   POST /api/issues/comment/:id
================================= */
router.post('/comment/:id', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            text: req.body.text,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!issue) {
      return res.json({ success: false, message: 'Issue not found' });
    }

    res.json({ success: true, issue });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* =================================
   1️⃣1️⃣ GET COMMENTS
   GET /api/issues/comments/:id
================================= */
router.get('/comments/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .select('title comments');

    if (!issue) {
      return res.json({ success: false, message: 'Issue not found' });
    }

    res.json({
      success: true,
      comments: issue.comments
    });
  } catch (err) {
    res.json({ success: false, message: 'Invalid ID format' });
  }
});

/* =================================
   1️⃣2️⃣ GET ISSUES BY PROJECT
   GET /api/issues/project/:projectId
================================= */
router.get('/project/:projectId', async (req, res) => {
  try {
    const issues = await Issue.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email');

    res.json({ success: true, issues });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* =================================
   1️⃣3️⃣ DELETE ISSUE
   DELETE /api/issues/:id
================================= */
router.delete('/:id', async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted ✅' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});
/* =================================
   ⭐ GET ISSUES ASSIGNED TO ONE USER
   GET /api/issues/assigned/user/:userId
================================= */
router.get('/assigned/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Optional: check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.json({
        success: false,
        message: 'User not found ❌'
      });
    }

    const issues = await Issue.find({
      assignedTo: userId
    })
      .populate('project', 'name')
      .populate('assignedBy', 'name email')
      .select('title status priority project assignedAt');

    res.json({
      success: true,
      user: {
        id: userExists._id,
        name: userExists.name,
        email: userExists.email
      },
      totalIssues: issues.length,
      issues
    });

  } catch (err) {
    res.json({
      success: false,
      message: err.message
    });
  }
});


module.exports = router;
