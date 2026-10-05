const { z } = require('zod')

const registerSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(6,"Пароль слишком короткий")
})

const loginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(1,"Пароль обязателен")
})

module.exports = { registerSchema, loginSchema };