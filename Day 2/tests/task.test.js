const tasksData = require('../src/data/tasks');
const usersData = require('../src/data/users');

test('getAll возвращает массив', async () => {
    const tasks = await tasksData.getAll(1);
    expect(Array.isArray(tasks)).toBe(true);
});





test('create создаёт задачу с id и title', async () => {
    const user = await usersData.create('test@example.com', 'hash123');
    const task = await tasksData.create('Тестовая задача', user.id);
    
    expect(task.id).toBeDefined();
    expect(task.title).toBe('Тестовая задача');
    expect(task.user_id).toBe(user.id);
});




test('getById находит задачу по id', async () => {
    const user = await usersData.create('test@example.com', 'hash123');
    const created = await tasksData.create('Найти меня', user.id);
    
    const found = await tasksData.getById(created.id, user.id);
    
    expect(found).toBeDefined();
    expect(found.id).toBe(created.id);
    expect(found.title).toBe('Найти меня');
});

test('getById возвращает undefined для несуществующей', async () => {
    const found = await tasksData.getById(99999, 1);
    expect(found).toBeUndefined();
});


test('update обновляет title', async () => {
    const user = await usersData.create('test@example.com', 'hash123');
    const created = await tasksData.create('Старый title', user.id);
    
    const updated = await tasksData.update(created.id, 'Новый title', user.id);
    
    expect(updated).toBeDefined();
    expect(updated.id).toBe(created.id);
    expect(updated.title).toBe('Новый title');
});

test('update возвращает undefined для несуществующей', async () => {
    const updated = await tasksData.update(99999, 'Новый', 1);
    expect(updated).toBeUndefined();
});


test('remove удаляет задачу', async () => {
    const user = await usersData.create('test@example.com', 'hash123');
    const created = await tasksData.create('Удалить меня', user.id);
    
    const removed = await tasksData.remove(created.id, user.id);
    
    expect(removed).toBeDefined();
    expect(removed.id).toBe(created.id);
    
    const found = await tasksData.getById(created.id, user.id);
    expect(found).toBeUndefined();
});

test('remove возвращает undefined для несуществующей', async () => {
    const removed = await tasksData.remove(99999, 1);
    expect(removed).toBeUndefined();
});