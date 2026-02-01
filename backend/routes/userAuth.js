const express = require('express');
const router = express.Router();
const User = require('../models/User');


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
      email: email
    });

    console.log("Searching email:", email);
    console.log("Found user:", user);

    if (!user)
      return res.json({ success:false, message:'User not found ❌' });

    if (user.password !== password)
      return res.json({ success:false, message:'Wrong password ❌' });

    res.json({
      success:true,
      message:'User login success ✅'
    });

  } catch (err) {
    res.json({
      success:false,
      message: err.message
    });
  }

});

module.exports = router;
