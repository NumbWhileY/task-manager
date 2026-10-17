const { z } = require('zod')


const taskSchema = z.object({
    title: z.string().trim().min(1,'title обязателен').max(255,'title максимум 255 символов')
});

module.exports = {taskSchema}