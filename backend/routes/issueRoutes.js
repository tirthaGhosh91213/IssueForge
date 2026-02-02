const express = require('express');
const router = express.Router();
const multer = require('multer');

const Issue = require('../models/Issue');
const User = require('../models/User');
const Project = require('../models/Project');
const sendEmail = require('../utils/sendEmail');


/* =============================
   Multer config
============================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });



  //  CREATE ISSUE (image/video supported)

router.post('/create/:projectId', upload.single('media'), async (req, res) => {

  const { title, description, priority } = req.body;

  const issue = await Issue.create({
    title,
    description,
    priority,
    project: req.params.projectId,
    media: req.file ? req.file.filename : null
  });

  res.json({ success:true, issue });
});



  //  GET ISSUES (pagination + filter + search)

router.get('/', async (req, res) => {

  const { page = 1, limit = 5, status, priority, search, projectId } = req.query;

  const filter = {};

  if (projectId) filter.project = projectId;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;

  const total = await Issue.countDocuments(filter);

  const issues = await Issue.find(filter)
    .populate('assignedTo', 'name email')
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success:true,
    total,
    page:Number(page),
    pages:Math.ceil(total/limit),
    issues
  });
});



  //  GET ISSUE BY ID

router.get('/:id', async (req, res) => {

  const issue = await Issue.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('project', 'name');

  res.json({ success:true, issue });
});



  //  ASSIGN USER + SEND EMAIL

router.put('/assign/:id', async (req, res) => {

  const { userId, adminName } = req.body;

  const issue = await Issue.findById(req.params.id).populate('project');
  const user = await User.findById(userId);

  issue.assignedTo = userId;
  await issue.save();

  const message = `
Hello ${user.name},

You are assigned a new issue.

Project: ${issue.project.name}
Title: ${issue.title}
Description: ${issue.description}
Assigned by: ${adminName}

Thanks.
`;

  await sendEmail(user.email, 'New Issue Assigned 🚀', message);

  res.json({ success:true, message:'Assigned + Email sent ✅' });
});


  //  UPDATE STATUS

router.put('/status/:id', async (req, res) => {

  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new:true }
  );

  res.json({ success:true, issue });
});



  //  ADD COMMENT

router.post('/comment/:id', async (req, res) => {

  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: { text: req.body.text } } },
    { new:true }
  );

  res.json({ success:true, issue });
});



  //  DASHBOARD STATS

router.get('/stats/:projectId', async (req, res) => {

  const id = req.params.projectId;

  const stats = {
    total: await Issue.countDocuments({ project:id }),
    pending: await Issue.countDocuments({ project:id, status:'pending' }),
    working: await Issue.countDocuments({ project:id, status:'working' }),
    fixed: await Issue.countDocuments({ project:id, status:'fixed' })
  };

  res.json({ success:true, stats });
});



  //  DELETE ISSUE (ADMIN ONLY)

router.delete('/:id', async (req, res) => {

  if (req.body.role !== 'admin')
    return res.json({ success:false, message:'Admin only ❌' });

  await Issue.findByIdAndDelete(req.params.id);

  res.json({ success:true, message:'Deleted ✅' });
});


module.exports = router;
