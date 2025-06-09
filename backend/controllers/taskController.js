const Task = require('../models/Task');
exports.getTasks = async (req, res) => res.json(await Task.find());
exports.getTask = async (req, res) => res.json(await Task.findById(req.params.id));
exports.createTask = async (req, res) => res.json(await Task.create(req.body));
exports.updateTask = async (req, res) => res.json(await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteTask = async (req, res) => res.json(await Task.findByIdAndDelete(req.params.id));

