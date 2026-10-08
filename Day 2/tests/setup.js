require('dotenv').config({ quiet: true });

process.env.DB_NAME = process.env.DB_NAME_TEST;

const pool = require('../src/data/db');

beforeEach(async () => {
    await pool.query('TRUNCATE users RESTART IDENTITY CASCADE');
});

afterAll(async () => {
    await pool.end();
});