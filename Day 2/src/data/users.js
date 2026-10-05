const pool = require('./db')

async function findByEmail(email) {
    const result = await pool.query('SELECT id, email, password_hash, created_at from users WHERE email = $1',[email])
    return result.rows[0]
}

async function create(email,passwordHash) {
    const user = await pool.query('INSERT INTO users (email,password_hash) VALUES ($1,$2) RETURNING id, email, created_at',[email,passwordHash])
    return user.rows[0]
}

async function findById(id) {
    const result = await pool.query('SELECT id, email, created_at from users WHERE id = $1',[id])
    return result.rows[0]
}


module.exports = { findByEmail, create, findById };