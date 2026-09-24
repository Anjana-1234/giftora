// One-off utility: promotes an existing user to admin by email.
// Usage:  node scripts/makeAdmin.js someone@example.com
//
// There is no signup form for admins on purpose — letting anyone flip
// their own isAdmin flag via a public form would be a security hole.
// The person must already have a normal account (via /signup); this
// script just updates that account in the database.

const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.log('❌ Usage: node scripts/makeAdmin.js <email>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ No user found with email: ${email}`);
      return;
    }

    if (user.isAdmin) {
      console.log(`ℹ️  ${email} is already an admin.`);
      return;
    }

    user.isAdmin = true;
    await user.save();
    console.log(`🌟 ${email} is now an admin.`);

  } catch (error) {
    console.log('❌ Failed:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

makeAdmin();