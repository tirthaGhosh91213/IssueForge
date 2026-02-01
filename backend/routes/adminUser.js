const express = require('express');
const router = express.Router();
const User = require('../models/User');


/* ADMIN CREATE USER */
router.post('/create-user', async (req, res) => {

  const { name, email, empId, password } = req.body;

  const exists = await User.findOne({
    $or: [{ email }, { empId }]
  });

  if (exists)
    return res.json({ success:false, message:'User already exists ❌' });

  await User.create({
    name,
    email,
    empId,
    password,
    role: 'user'
  });

  res.json({
    success:true,
    message:'User created successfully ✅'
  });
});

module.exports = router;
