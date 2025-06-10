const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminData = {
            username: 'kay625',
            password: 'kay123'
        };

        const existingAdmin = await Admin.findOne({ username: adminData.username });
        if (existingAdmin) {
            console.log('Admin account already exists');
            process.exit(0);
        }

        const admin = new Admin(adminData);
        await admin.save();
        console.log('Admin account created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin account:', error);
        process.exit(1);
    }
};

createAdmin(); 