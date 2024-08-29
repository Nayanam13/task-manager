const router = require('express').Router();
const Task = require('../models/Task');
const authMiddleware = require('../auth/authMiddleware')

// Get tasks
router.get('/', authMiddleware,async (req, res) => {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
});

// Create a task
router.post('/', authMiddleware ,async (req, res) => {
    const { title, status } = req.body;
    const task = new Task({ title, status, userId: req.user.id });
    await task.save();
    res.json(task);
});

// Update a task
router.put('/:id',authMiddleware, async (req, res) => {
    const { title, status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { title, status }, { new: true });
    res.json(task);
});

// Delete a task
router.delete('/:id',authMiddleware, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

module.exports = router;
