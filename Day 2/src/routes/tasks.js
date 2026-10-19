const express = require('express');
const router = express.Router();

const validate = require('../middlewares/validate')

const {taskSchema} = require('../schemas/task')
const tasksData = require('../data/tasks')
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../errors');


router.get('/',auth,async (req,res) => {
    const tasks = await tasksData.getAll(req.user.userId);
    res.status(200).json(tasks);
})


router.get('/:id',auth,async (req,res) => {
    const task =  await tasksData.getById(req.params.id,req.user.userId)

    if (!task) throw new NotFoundError('Задача не найдена');

    res.status(200).json(task)
})

router.post('/',auth,validate(taskSchema),async(req,res) => {

    const task = await tasksData.create(req.body.title, req.user.userId, req.body.description);
    return res.status(201).json(task)

})


router.put('/:id',auth,validate(taskSchema),async(req,res) => {

    const task = await tasksData.update(req.params.id, req.body.title, req.user.userId, req.body.description);
    if (!task) throw new NotFoundError('Задача не найдена');

    return res.status(200).json(task);
})


router.delete('/:id',auth,async(req,res) => {
   const removeTask =  await tasksData.remove(req.params.id,req.user.userId)

    if (!removeTask) throw new NotFoundError('Задача не найдена');

    return res.status(204).end();

})

module.exports = router;