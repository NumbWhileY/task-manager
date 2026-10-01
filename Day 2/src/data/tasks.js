const tasks = [];

let nextId = 1;


function getAll() {
    return tasks
}

function getById(id) {
    return tasks.find(task => task.id === Number(id))
}


function create(title) {
    const task = {
        id: nextId++,
        title,
        createdAt: new Date().toISOString()
    };
    tasks.push(task);
    return task;
}

function update(id, title) {
    const task = tasks.find(t => t.id === Number(id));
    if (!task) return undefined;
    task.title = title;
    return task;
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === Number(id));
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { getAll, getById, create, update, remove };