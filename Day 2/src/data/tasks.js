const pool = require('./db');



async function getAll() {
    const result = await pool.query('SELECT * FROM tasks')
    return result.rows;
}

async function getById(id) {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0];
}


async function create(title) {
    const result = await pool.query(
        'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
        [title]
    );
    return result.rows[0];
}

async function update(id, title) {
    const result = await pool.query(
        'UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *',
        [title, id]
    );
    return result.rows[0];
}

async function remove(id) {
    const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
}

module.exports = { getAll, getById, create, update, remove };