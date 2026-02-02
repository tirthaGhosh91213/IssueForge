const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = "issueforge_secret_key"; // move to .env later


/* =================================================
   ADMIN SIGNUP
================================================= */
router.post('/signup', async (req, res) => {

  const { name, email, empId, password } = req.body;

  try {

    const exists = await User.findOne({
      $or: [{ email }, { empId }]
    });

    if (exists)
      return res.json({ success:false, message:'Admin already exists ❌' });

    await User.create({
      name,
      email,
      empId,
      password,
      role: 'admin'
    });

    res.json({
      success:true,
      message:'Admin created successfully ✅'
    });

  } catch (err) {
    res.json({ success:false, message: err.message });
  }
});


/* =================================================
   ADMIN LOGIN + TOKEN
================================================= */
router.post('/login', async (req, res) => {

  try {

    let { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success:false,
        message:'Email & password required ❌'
      });
    }

    email = email.trim();

    const admin = await User.findOne({
      role: 'admin',
      email
    });

    if (!admin)
      return res.json({ success:false, message:'Admin not found ❌' });

    if (admin.password !== password)
      return res.json({ success:false, message:'Wrong password ❌' });


    /* =============================
       CREATE JWT TOKEN
    ============================= */
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        email: admin.email
      },
      SECRET,
      { expiresIn: '1d' }
    );


    res.json({
      success:true,
      message:'Admin login success ✅',
      token
    });

  } catch (err) {
    res.json({
      success:false,
      message: err.message
    });
  }

});

module.exports = router;
