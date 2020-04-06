const express = require("express");
const Task = require("../model/task");
const auth = require("../middleware/auth");
const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save()
        res.status(200).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
});

router.get('/tasks',auth, async (req, res) => {
    try {
        const tasks = await Task.find({owner: req.user._id});
        // await req.user.populate('tasks').execPopulate()
        res.status(200).send(tasks);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id; 
    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        if(!task) {
            return res.status(200).send();
        }
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

//update
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['description', 'completed'];
    const isValid = updates.every(key => allowUpdates.includes(key));
    
    if(!isValid) {
        return res.status(400).send('Request body is not proper');
    }
    
    try {
        const task  = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if(!task) {
           return res.status(400).send('Task not found');
        }
        updates.forEach(key => task[key] = req.body[key]);
        await task.save();
        res.send(task);

    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task) {
           return res.status(400).send('Task not found')
        }
        res.status(200).send('Task Deleted');
    } catch (e) {
        res.status(400).send(e)
    }
});

module.exports = router;