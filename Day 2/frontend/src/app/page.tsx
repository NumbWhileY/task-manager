'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, createTask, deleteTask, type Task } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async (token: string) => {
    const data = await getTasks(token);
    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      setError('Ошибка загрузки');
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadTasks(token);
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const data = await createTask(token, newTitle, newDescription);
    if (data.id) {
      setNewTitle('');
      setNewDescription('');
      await loadTasks(token);
    } else {
      setError(data.error || 'Ошибка создания');
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const success = await deleteTask(token, id);
    if (success) {
      setTasks(tasks.filter((t) => t.id !== id));
    } else {
      setError('Ошибка удаления');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <div className="p-8 text-white">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Мои задачи</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
          >
            Выйти
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleCreate} className="mb-6 space-y-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Название задачи..."
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Описание (необязательно)..."
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            rows={3}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
          >
            Добавить
          </button>
        </form>

        {tasks.length === 0 ? (
          <p className="text-gray-400">Задач пока нет</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold">{task.title}</p>
                    {task.description && (
                      <p className="text-gray-300 mt-1">{task.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(task.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}