const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');

// Admin login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Attempting admin login for username:', username);
        const admin = await Admin.findOne({ username });

        if (!admin) {
            console.log('Admin not found:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        console.log('Password match result:', isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        console.log('Fetched users for admin dashboard:', users.length);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;
        console.log(`Updating user ${userId} with data:`, updateData);

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Generate User Report PDF
exports.generateUserReport = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');

        const doc = new PDFDocument();
        let filename = 'user_report.pdf';
        // Setting response headers
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(25).text('User Report', { align: 'center' }).moveDown();

        if (users.length > 0) {
            let y = doc.y; // current y position

            doc.fontSize(12)
                .text('Name', 50, y, { width: 150, align: 'left' })
                .text('Email', 200, y, { width: 200, align: 'left' })
                .text('Status', 400, y, { width: 100, align: 'left' });
            doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y + 20).lineTo(550, y + 20).stroke();
            y += 30; // move down for user data

            users.forEach(user => {
                if (y + 30 > doc.page.height - doc.page.margins.bottom) {
                    doc.addPage();
                    y = doc.page.margins.top; // reset y for new page
                    doc.fontSize(12)
                        .text('Name', 50, y, { width: 150, align: 'left' })
                        .text('Email', 200, y, { width: 200, align: 'left' })
                        .text('Status', 400, y, { width: 100, align: 'left' });
                    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y + 20).lineTo(550, y + 20).stroke();
                    y += 30;
                }

                doc.fontSize(10)
                    .text(user.name, 50, y, { width: 150, align: 'left' })
                    .text(user.email, 200, y, { width: 200, align: 'left' })
                    .text(user.isActive ? 'Active' : 'Disabled', 400, y, { width: 100, align: 'left' });
                y += 20; // line height
            });
        } else {
            doc.fontSize(12).text('No users found.', { align: 'center' });
        }

        doc.end();

    } catch (error) {
        console.error('Error generating user report:', error);
        res.status(500).json({ message: 'Server error generating PDF' });
    }
}; 