require('dotenv').config({ quiet: true });

process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'task_manager_test';

const pool = require('../src/data/db');

beforeEach(async () => {
    await pool.query('TRUNCATE users RESTART IDENTITY CASCADE');
});

afterAll(async () => {
    await pool.end();
});