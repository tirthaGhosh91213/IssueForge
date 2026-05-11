const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET; 


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

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      empId,
      password: hashedPassword,
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
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!admin)
      return res.json({ success:false, message:'Admin not found ❌' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
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
      token,
      userId: admin._id,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (err) {
    res.json({
      success:false,
      message: err.message
    });
  }

});

module.exports = router;
