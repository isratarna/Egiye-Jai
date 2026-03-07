const User = require('../models/User');

module.exports = async function seedAdmin() {
  try {
    const existing = await User.findOne({ role: 'admin' });
    if (existing) return;

    await User.create({
      name: 'EgiyeJai Admin',
      email: process.env.ADMIN_EMAIL || 'admin@egiyejai.org',
      password: process.env.ADMIN_PASSWORD || 'Admin@EgiyeJai2026',
      role: 'admin',
      phone: '+880 1700-000000',
      location: 'Dhaka, Bangladesh',
      bio: 'Platform administrator for EgiyeJai volunteer network.',
    });
    console.log('✅ Admin user seeded:', process.env.ADMIN_EMAIL);
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};
