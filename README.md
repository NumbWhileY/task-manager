# Task Manager

![Tests](https://github.com/NumbWhileY/task-manager/actions/workflows/test.yml/badge.svg)

REST API для управления задачами. Учебный проект — эволюция от голого HTTP-сервера
до production-ready бэкенда с Docker.

## Стек

- **Node.js** + **Express** — веб-фреймворк.
- **PostgreSQL** — база данных.
- **JWT** + **bcrypt** — аутентификация.
- **zod** — валидация.
- **Jest** + **Supertest** — тесты (18 штук).
- **pino** — логирование.
- **Docker** + **docker-compose** — контейнеризация.
- **GitHub Actions** — CI.

## Возможности

- Регистрация и логин (JWT).
- CRUD для задач (создание, чтение, обновление, удаление).
- Задачи привязаны к пользователю (только свои).
- Валидация входных данных через схемы.
- Кастомные классы ошибок.
- Структурное логирование.

## Запуск

### Локально

```bash
cd "Day 2"
npm install
# Создай .env по примеру
npm run dev
