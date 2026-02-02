const express = require('express');
const router = express.Router();
const User = require('../models/User');

const sendEmail = require('../utils/sendEmail');


/* =================================================
   PROMOTE USER → ADMIN + EMAIL
   PUT /api/admin/make-admin/:userId
================================================= */
router.put('/make-admin/:userId', async (req, res) => {

  try {

    const user = await User.findById(req.params.userId);

    if (!user)
      return res.json({ success:false, message:'User not found ❌' });

    if (user.role === 'admin')
      return res.json({ success:false, message:'Already admin ⚠️' });


    /* =============================
       UPDATE ROLE
    ============================= */
    user.role = 'admin';
    await user.save();


    /* =============================
       BEAUTIFUL EMAIL MESSAGE
    ============================= */
    const message = `
Hello ${user.name},

🎉 Congratulations!

You have been promoted to ADMIN in ULMiND.

Now you can:
• Create Projects
• Manage Users
• Assign Issues
• Monitor Dashboard
• Full system access

Login here:
http://localhost:7000

Lead your team like a pro 🚀

Thanks,
ULMiND Team
`;


    /* =============================
       SEND EMAIL
    ============================= */
    await sendEmail(
      user.email,
      '🎉 You are now an Admin - ULMiND',
      message
    );


    res.json({
      success:true,
      message:'User promoted to admin + email sent ✅',
      user
    });

  } catch (err) {
    res.json({ success:false, message: err.message });
  }

});
module.exports = router;