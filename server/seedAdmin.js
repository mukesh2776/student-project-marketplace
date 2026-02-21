const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existing = await User.findOne({ email: 'student@gmail.com' });
        if (existing) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        // Create admin user (password is auto-hashed by the User model pre-save hook)
        const admin = await User.create({
            name: 'Admin',
            email: 'student@gmail.com',
            password: 'Student@123',
            role: 'admin',
            isVerified: true,
        });

        console.log('✅ Admin user created successfully!');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
