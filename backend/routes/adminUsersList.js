const express = require('express');
const router = express.Router();
const User = require('../models/User');



  //  GET ALL USERS (admin only)
  //  GET /api/admin/users

router.get('/users', async (req, res) => {

  try {

    const users = await User.find({ role: 'user' })
      .select('-password'); // hide password for safety

    res.json({
      success: true,
      count: users.length,
      users
    });

  } catch (err) {
    res.json({
      success:false,
      message: err.message
    });
  }

});

module.exports = router;
