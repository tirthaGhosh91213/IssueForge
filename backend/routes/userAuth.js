const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET;


/* =============================
   USER LOGIN (EMAIL ONLY)
   POST /api/user/login
============================= */
router.post('/login', async (req, res) => {

  try {

    let { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success:false,
        message:'Email & password required ❌'
      });
    }

    // remove spaces
    email = email.trim();

    const user = await User.findOne({
      role: 'user',
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    console.log("Searching email:", email);
    console.log("Found user:", user);

    if (!user)
      return res.json({ success:false, message:'User not found ❌' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success:false, message:'Wrong password ❌' });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email
      },
      SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success:true,
      message:'User login success ✅',
      token,
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      role: user.role
    });

  } catch (err) {
    res.json({
      success:false,
      message: err.message
    });
  }

});

module.exports = router;
