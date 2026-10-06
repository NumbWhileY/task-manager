const express = require('express');
const router = express.Router();

const userData = require('../data/users')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const { ConflictError, UnauthorizedError } = require('../errors');


const validate = require('../middlewares/validate')

const {loginSchema, registerSchema} = require('../schemas/auth')


router.post('/register',validate(registerSchema),async(req,res) => {

    const existing = await userData.findByEmail(req.body.email);
    
    if (existing) throw new ConflictError('Email уже занят');

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await userData.create(req.body.email, hash);
    return res.status(201).json(user)
})


router.post('/login',validate(loginSchema),async(req,res) => {
   
    const user = await userData.findByEmail(req.body.email);
    if (!user) throw new UnauthorizedError('Неверный email или пароль');

    const valid = await bcrypt.compare(req.body.password, user.password_hash);
    if (!valid) throw new UnauthorizedError('Неверный email или пароль');
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    return res.status(200).json({ token });
})


module.exports = router