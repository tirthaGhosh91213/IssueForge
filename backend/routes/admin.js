const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

/* CREATE FIRST ADMIN */
router.post('/create-admin', async (req, res) => {

  try {

    const { email, empId, password } = req.body;

    const admin = await Admin.create({
      email,
      empId,
      password,
      role: 'admin'
    });

    res.json({
      success: true,
      message: 'Admin created ✅',
      admin
    });

  } catch (err) {
    res.json({
      success: false,
      message: err.message
    });
  }

});

module.exports = router;
