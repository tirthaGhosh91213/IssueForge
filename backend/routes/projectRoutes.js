const express = require('express');
const router = express.Router();
const multer = require('multer');
const Project = require('../models/Project');



  //  Multer (image upload)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });



  //  CREATE PROJECT
  //  POST /api/admin/create-project

router.post('/create-project', upload.single('image'), async (req, res) => {

  try {
    const { name, description, githubUrl } = req.body;

    const project = await Project.create({
      name,
      description,
      githubUrl,
      image: req.file ? req.file.filename : null
    });

    res.json({
      success: true,
      message: 'Project created ✅',
      project
    });

  } catch (err) {
    res.json({ success:false, message: err.message });
  }
});


  //  GET ALL PROJECTS (WITH PAGINATION)
  //  GET /api/admin/projects?page=1&limit=5

router.get('/projects', async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const total = await Project.countDocuments();

    const projects = await Project.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: projects.length,
      projects
    });

  } catch (err) {
    res.json({ success:false, message: err.message });
  }
});


  //  GET PROJECT BY ID
  //  GET /api/admin/project/:id

router.get('/project/:id', async (req, res) => {

  try {

    const project = await Project.findById(req.params.id);

    if (!project)
      return res.json({
        success:false,
        message:'Project not found ❌'
      });

    res.json({
      success:true,
      project
    });

  } catch (err) {
    res.json({ success:false, message: err.message });
  }
});


  //  UPDATE PROJECT
  //  PUT /api/admin/project/:id

router.put('/project/:id', upload.single('image'), async (req, res) => {

  try {

    const { name, description, githubUrl } = req.body;

    const updateData = { name, description, githubUrl };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!project)
      return res.json({ success:false, message:'Project not found ❌' });

    res.json({
      success:true,
      message:'Project updated ✅',
      project
    });

  } catch (err) {
    res.json({ success:false, message: err.message });
  }
});


  //  DELETE PROJECT
  //  DELETE /api/admin/project/:id

router.delete('/project/:id', async (req, res) => {

  try {

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project)
      return res.json({ success:false, message:'Project not found ❌' });

    res.json({
      success:true,
      message:'Project deleted ✅'
    });

  } catch (err) {
    res.json({ success:false, message: err.message });
  }
});


module.exports = router;
