const User = require('../models/User');
exports.getUsers = async (req, res) => res.json(await User.find());
exports.updateUser = async (req, res) => res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deactivateUser = async (req, res) => res.json(await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }));
