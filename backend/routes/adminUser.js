const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');


/* =================================================
   ADMIN CREATE USER + WELCOME EMAIL
   POST /api/admin/create-user
================================================= */
router.post('/create-user', async (req, res) => {

  try {

    const { name, email, empId, password } = req.body;

    /* =============================
       CHECK USER EXISTS
    ============================= */
    const exists = await User.findOne({
      $or: [{ email }, { empId }]
    });

    if (exists)
      return res.json({ success:false, message:'User already exists ❌' });


    /* =============================
       CREATE USER
    ============================= */
    await User.create({
      name,
      email,
      empId,
      password,
      role: 'user'
    });


    /* =============================
       WELCOME EMAIL MESSAGE
    ============================= */
    const message = `
Hello ${name},

🎉 Welcome to ULMiND!

Your account has been created successfully.

Login Details:
---------------------------------
Email: ${email}
Employee ID: ${empId}
Password: ${password}
---------------------------------

You can now login and:
• View Projects
• Work on Issues
• Track Tasks
• Collaborate with Team

Login here:
http://localhost:3000

Happy coding 🚀

Thanks,
ULMiND Team
`;


    /* =============================
       SEND EMAIL
    ============================= */
    await sendEmail(
      email,
      '🎉 Welcome to ULMiND - Account Created',
      message
    );


    res.json({
      success:true,
      message:'User created + welcome email sent ✅'
    });

  } catch (err) {
    res.json({
      success:false,
      message: err.message
    });
  }

});

module.exports = router;
