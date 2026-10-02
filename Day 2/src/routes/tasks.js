const express = require('express');
const router = express.Router();

const validateTitle = require('../middlewares/validateTitle');
const tasksData = require('../data/tasks')


router.get('/', async (req,res) => {
    const tasks = await tasksData.getAll();
    res.status(200).json(tasks);
})


router.get('/:id',async (req,res) => {
    const task =  await tasksData.getById(req.params.id)

    if (!task) {
    return res.status(404).json({ error: 'Задача не найдена' });
    }

    res.status(200).json(task)
})

router.post('/',validateTitle,async(req,res) => {

    const task = await tasksData.create(req.body.title)

    return res.status(201).json(task)

})


router.put('/:id',validateTitle,async(req,res) => {

    const task = await tasksData.update(req.params.id, req.body.title);

    if (!task) {
        return res.status(404).json({ error: 'Задача не найдена' });
    }

    return res.status(200).json(task);
})


router.delete('/:id',async(req,res) => {
   const removeTask =  await tasksData.remove(req.params.id)

    if (!removeTask) {
        return res.status(404).json({ error: 'Задача не найдена' });
    }

    return res.status(204).end();

})

module.exports = router;