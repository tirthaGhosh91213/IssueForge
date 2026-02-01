const express = require('express');
const router = express.Router();
const User = require('../models/User');

  //  ADMIN SIGNUP
  //  POST /api/admin/signup

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

  //  ADMIN LOGIN 
  //  POST /api/admin/login

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
      email: email
    });

    console.log("Searching admin:", email);
    console.log("Found:", admin);

    if (!admin)
      return res.json({ success:false, message:'Admin not found ❌' });

    if (admin.password !== password)
      return res.json({ success:false, message:'Wrong password ❌' });

    res.json({
      success:true,
      message:'Admin login success ✅'
    });

  } catch (err) {
    res.json({
      success:false,
      message: err.message
    });
  }

});

module.exports = router;
