require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function hashExistingPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find();
    let updatedCount = 0;

    for (let user of users) {
      // Check if password is already a bcrypt hash (starts with $2a$ or $2b$)
      if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await user.save();
        updatedCount++;
        console.log(`Updated password for user: ${user.email}`);
      }
    }

    console.log(`Finished. Updated ${updatedCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

hashExistingPasswords();
