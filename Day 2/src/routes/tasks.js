const express = require('express');
const router = express.Router();


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

router.post('/', (req,res) => {
    if(!req.body.title) {
        return res.status(400).json({'error': 'title обязателен'})
    }

    if (typeof req.body.title !== 'string') {
        return res.status(400).json({'error': 'title должен быть строкой'})
    }

    const task = tasksData.create(req.body.title)

    return res.status(201).json(task)

})


router.put('/:id',(req,res) => {

    if(!req.body.title) {
        return res.status(400).json({'error': 'title обязателен'})
    }

    if (typeof req.body.title !== 'string') {
        return res.status(400).json({'error': 'title должен быть строкой'})
    }

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