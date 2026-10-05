const pool = require('./db');



async function getAll(userId) {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1',[userId])
    return result.rows;
}

async function getById(id,userId) {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id,userId]);
    return result.rows[0];
}


async function create(title,userId) {
    const result = await pool.query(
        'INSERT INTO tasks (title,user_id) VALUES ($1,$2) RETURNING *',
        [title,userId]
    );
    return result.rows[0];
}

async function update(id, title,userId) {
    const result = await pool.query(
        'UPDATE tasks SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
        [title, id,userId]
    );
    return result.rows[0];
}

async function remove(id,userId) {
    const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
        [id,userId]
    );
    return result.rows[0];
}

module.exports = { getAll, getById, create, update, remove };