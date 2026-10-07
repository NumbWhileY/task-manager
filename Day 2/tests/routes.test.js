const request = require('supertest');
const app = require('../src/app');



test('GET /tasks без токена → 401', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(401);
});


test('GET /tasks с токеном → 200', async () => {
    await request(app)
        .post('/auth/register')
        .send({ email: 'routes@example.com', password: 'secret123' });
    
    const login = await request(app)
        .post('/auth/login')
        .send({ email: 'routes@example.com', password: 'secret123' });
    
    const token = login.body.token;
    
    const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});


test('POST /tasks с токеном → 201', async () => {
    await request(app)
        .post('/auth/register')
        .send({ email: 'create@example.com', password: 'secret123' });
    
    const login = await request(app)
        .post('/auth/login')
        .send({ email: 'create@example.com', password: 'secret123' });
    
    const token = login.body.token;
    
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Моя задача' });
    
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Моя задача');
    expect(res.body.user_id).toBeDefined();
});