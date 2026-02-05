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
   1️⃣ CREATE ISSUE
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

    res.json({ success:true, issue });

  } catch (err) {
    res.json({ success:false, message: err.message });
  }
});



/* =================================
   2️⃣ GET ALL ISSUES (FILTER + PAGINATION)
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
      .sort({ createdAt:-1 });

    res.json({
      success:true,
      total,
      page:Number(page),
      pages:Math.ceil(total/limit),
      issues
    });

  } catch (err) {
    res.json({ success:false, message: err.message });
  }
});



/* =================================
   3️⃣ GET ISSUE BY ID
================================= */
router.get('/:id', async (req, res) => {

  const issue = await Issue.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('assignedBy', 'name email')
    .populate('project', 'name');

  res.json({ success:true, issue });
});



/* =================================
   4️⃣ ASSIGN EMPLOYEE
   PUT /assign/:id
================================= */
router.put('/assign/:id', async (req, res) => {

  try {

    const { userId, adminId } = req.body;

    const issue = await Issue.findById(req.params.id).populate('project');
    const user = await User.findById(userId);

    if (!issue || !user)
      return res.json({ success:false, message:'Issue/User not found ❌' });

    issue.assignedTo = userId;
    issue.assignedBy = adminId;
    issue.assignedAt = new Date();

    await issue.save();

    await sendEmail(
      user.email,
      '🚀 Issue Assigned',
      `You are assigned to issue: ${issue.title}`
    );

    res.json({ success:true, message:'Assigned + email sent ✅' });

  } catch (err) {
    res.json({ success:false, message: err.message });
  }
});



/* =================================
   5️⃣ GET ASSIGNMENT DETAILS
   GET /assignment/:issueId
================================= */
router.get('/assignment/:issueId', async (req, res) => {

  const issue = await Issue.findById(req.params.issueId)
    .populate('assignedTo', 'name email')
    .populate('assignedBy', 'name email')
    .populate('project', 'name');

  res.json({
    success:true,
    issue: issue.title,
    project: issue.project,
    employee: issue.assignedTo,
    assignedBy: issue.assignedBy,
    assignedAt: issue.assignedAt
  });
});



/* =================================
   6️⃣ REMOVE EMPLOYEE
================================= */
router.put('/remove-employee/:id', async (req, res) => {

  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { assignedTo:null, assignedBy:null, assignedAt:null },
    { new:true }
  );

  res.json({ success:true, issue });
});



/* =================================
   7️⃣ UPDATE ISSUE STATUS
   PUT /status/:id
================================= */
router.put('/status/:id', async (req, res) => {

  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { status:req.body.status },
    { new:true }
  );

  res.json({ success:true, issue });
});



/* =================================
   8️⃣ GET STATUS ONLY
   GET /status/:id
================================= */
router.get('/status/:id', async (req, res) => {

  const issue = await Issue.findById(req.params.id).select('status title');

  res.json({
    success:true,
    title: issue.title,
    status: issue.status
  });
});



/* =================================
   9️⃣ ADD COMMENT
   POST /comment/:id
================================= */
router.post('/comment/:id', async (req, res) => {

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
    { new:true }
  );

  res.json({ success:true, issue });
});



/* =================================
   🔟 GET COMMENTS
   GET /comments/:id
================================= */
router.get('/comments/:id', async (req, res) => {

  const issue = await Issue.findById(req.params.id)
    .select('title comments');

  res.json({
    success:true,
    comments: issue.comments
  });
});



/* =================================
   1️⃣1️⃣ GET ISSUES BY PROJECT
================================= */
router.get('/project/:projectId', async (req, res) => {

  const issues = await Issue.find({ project:req.params.projectId })
    .populate('assignedTo', 'name email');

  res.json({ success:true, issues });
});



/* =================================
   1️⃣2️⃣ DELETE ISSUE
================================= */
router.delete('/:id', async (req, res) => {

  await Issue.findByIdAndDelete(req.params.id);

  res.json({ success:true, message:'Deleted ✅' });
});



module.exports = router;
