const express = require('express');
const router = express.Router();

const validateTitle = require('../middlewares/validateTitle');
const tasksData = require('../data/tasks')


router.get('/', (req,res) => {
    res.status(200).json(tasksData.getAll())
})


router.get('/:id',(req,res) => {
    const task = tasksData.getById(req.params.id)

    if (!task) {
    return res.status(404).json({ error: 'Задача не найдена' });
    }

    res.status(200).json(task)
})

router.post('/',validateTitle,(req,res) => {

    const task = tasksData.create(req.body.title)

    return res.status(201).json(task)

})


router.put('/:id',validateTitle,(req,res) => {

    const task = tasksData.update(req.params.id, req.body.title);

    if (!task) {
        return res.status(404).json({ error: 'Задача не найдена' });
    }

    return res.status(200).json(task);
})


router.delete('/:id',(req,res) => {
   const removeTask = tasksData.remove(req.params.id)

    if (!removeTask) {
        return res.status(404).json({ error: 'Задача не найдена' });
    }

    return res.status(204).end();

})

module.exports = router;