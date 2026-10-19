const pool = require('./db');

interface Task {
    id: number;
    title: string;
    description: string | null;
    user_id: number;
    created_at: string;
}

async function getAll(userId: number): Promise<Task[]> {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    return result.rows;
}

async function getById(id: number, userId: number): Promise<Task | undefined> {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
    return result.rows[0];
}

async function create(title: string, userId: number, description?: string): Promise<Task> {
    const result = await pool.query(
        'INSERT INTO tasks (title, user_id, description) VALUES ($1, $2, $3) RETURNING *',
        [title, userId, description || null]
    );
    return result.rows[0];
}

async function update(id: number, title: string, userId: number, description?: string): Promise<Task | undefined> {
    const result = await pool.query(
        'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
        [title, description || null, id, userId]
    );
    return result.rows[0];
}

async function remove(id: number, userId: number): Promise<Task | undefined> {
    const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
    );
    return result.rows[0];
}

module.exports = { getAll, getById, create, update, remove };