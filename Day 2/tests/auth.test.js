const request = require('supertest');
const app = require('../src/app');


test('POST /auth/register создаёт пользователя', async () => {
    const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'secret123' });
    
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('test@example.com');
    expect(res.body.id).toBeDefined();
    expect(res.body.password_hash).toBeUndefined();
});



test('POST /auth/register с существующим email → 409', async () => {
    await request(app)
        .post('/auth/register')
        .send({ email: 'dup@example.com', password: 'secret123' });
    
    const res = await request(app)
        .post('/auth/register')
        .send({ email: 'dup@example.com', password: 'secret123' });
    
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Email уже занят');
});



test('POST /auth/register с невалидным email → 400', async () => {
    const res = await request(app)
        .post('/auth/register')
        .send({ email: 'not-email', password: 'secret123' });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Некорректный email');
});


test('POST /auth/register с коротким паролем → 400', async () => {
    const res = await request(app)
        .post('/auth/register')
        .send({ email: 'short@example.com', password: '123' });
    
    expect(res.status).toBe(400);
});


test('POST /auth/login возвращает токен', async () => {
    await request(app)
        .post('/auth/register')
        .send({ email: 'login@example.com', password: 'secret123' });
    
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'login@example.com', password: 'secret123' });
    
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
});



test('POST /auth/login с неверным паролем → 401', async () => {
    await request(app)
        .post('/auth/register')
        .send({ email: 'wrong@example.com', password: 'secret123' });
    
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrong' });
    
    expect(res.status).toBe(401);
});



test('POST /auth/login с несуществующим email → 401', async () => {
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'nobody@example.com', password: 'secret123' });
    
    expect(res.status).toBe(401);
});