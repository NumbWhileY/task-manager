# Task Manager — Project Notes

> Контекст для продолжения работы. Стек: Node.js, Express, PostgreSQL.
> Цель: fullstack-разработчик, поиск работы.

---

## Что это за проект

`task-manager` — REST API для управления задачами. Учебный проект, который эволюционирует:
PostgreSQL → аутентификация → WebSocket → фронтенд на Next.js.

**Текущий статус:** день 5 завершён (03.10.2026). CRUD работает на PostgreSQL,
таблица `users` создана, `tasks` связана с `users` через foreign key. JOIN освоен.
Следующий шаг — аутентификация (JWT).

---

## Структура проекта

```
JavaScript Intensive/
├── notes.md                    ← этот файл
├── Day 1/
│   └── taskManager/
│       └── server.js           ← голый Node.js сервер (для сравнения)
└── Day 2/                      ← основной проект
    ├── migrations/             ← SQL-миграции
    │   ├── 001_create_tasks.sql
    │   ├── 002_create_users.sql
    │   └── 003_add_user_id_to_tasks.sql
    ├── src/
    │   ├── app.js              ← сборка Express: middleware + роуты
    │   ├── server.js           ← запуск: app.listen(3001)
    │   ├── data/
    │   │   ├── db.js           ← пул соединений с PostgreSQL
    │   │   └── tasks.js        ← CRUD на SQL (5 функций)
    │   ├── routes/
    │   │   └── tasks.js        ← 5 роутов /tasks
    │   └── middlewares/
    │       ├── logger.js       ← логирование каждого запроса
    │       ├── notFound.js     ← 404 в конце
    │       ├── validateTitle.js ← валидация title
    │       └── errorHandler.js ← обработка ошибок
    ├── .env                    ← секреты (НЕ в Git)
    ├── package.json
    └── .gitignore
```

**Git:** единый репозиторий в корне `JavaScript Intensive`. Восемь коммитов:
- `Day 5: migrations, users table, foreign key, JOIN`
- `634dad0` Update notes after Day 4
- `e65c36b` Day 4: migrate from in-memory array to PostgreSQL
- `eecce5a` Add PostgreSQL environment info
- `bfc1be0` Day 3: CRUD, validateTitle middleware, errorHandler
- `fa8a2c2` Add project notes for context
- `422c254` Day 3: full CRUD for tasks with in-memory storage
- `f2c0818` Day 2: modular structure + disable x-powered-by
- `482c90f` Days 1-2: raw HTTP server + Express server

---

## Окружение

- **PostgreSQL 15.19** установлен локально.
- Путь: `C:\Program Files\PostgreSQL\15\bin`
- Порт: `5432`.
- Пользователь: `postgres`.
- Добавлен в PATH — `psql` работает из любого места.
- Подключение: `psql -U postgres -h localhost -d task_manager`.
- База: `task_manager`.

**Миграции:**
```bash
psql -U postgres -h localhost -d task_manager -f migrations/XXX_name.sql
```

---

## Что сделано по дням

### День 1 — HTTP + голый Node.js

**Изучено:**
- Структура HTTP-запроса: стартовая строка → заголовки → пустая строка → тело.
- Структура HTTP-ответа: то же самое.
- Методы: GET, POST, PUT, PATCH, DELETE.
- Статусы: 2xx успех, 3xx редирект, 4xx клиент, 5xx сервер.
- Заголовки: `Content-Type`, `Content-Length`, `Host`, `Authorization`, `Cookie`.
- HTTP без состояния — каждый запрос независим.

**Сделано:**
- `Day 1/taskManager/server.js` — HTTP-сервер без фреймворков.
- Роутинг через `if (req.url === '/' && req.method === 'GET')`.
- Тело POST через `req.on('data')` / `req.on('end')`.
- `JSON.parse` в `try/catch` → 400 при невалидном JSON.
- Логирование каждого запроса.

**Ключевой инсайт:** Express — это обёртка над тем, что было написано руками.

### День 2 — Express + структура

**Изучено:**
- Middleware — функция `(req, res, next)`, выполняется между запросом и ответом.
- Порядок middleware **критичен** — Express идёт сверху вниз.
- `express.json()` — парсит тело, кладёт в `req.body`.
- `app.use(path, middleware)` — подключение.
- `express.Router()` — модульные роуты.
- Middleware передаётся **без скобок**: `app.use(logger)`, а не `app.use(logger())`.
- Express 5 vs 4: `app.all('*')` больше не работает, нужен `app.use` без пути.
- `app.disable('x-powered-by')` — не раскрывать стек.

**Сделано:**
- Переписал сервер на Express — код короче в 2 раза.
- Разбил на модули: `app.js`, `server.js`, `routes/`, `middlewares/`.
- Логирование — через middleware, один раз для всех.
- 404 — через `app.use` в конце.

### День 3 — CRUD + middleware валидации и ошибок

**Изучено:**
- CRUD — Create, Read, Update, Delete. Основа любого API.
- Разделение ответственности: `data/` — работа с данными, `routes/` — HTTP.
- Статусы: 200 (ок), 201 (создано), 204 (удалено, без тела), 400 (плохой запрос), 404 (не найдено).
- **Порядок проверок:** валидация **до** действия. Иначе можно испортить данные.
- `.json()` для тела, `.end()` для 204 (без тела).
- Параметры URL — **всегда строки**. `Number(id)` при сравнении.
- **Middleware валидации** — вынесение проверок из роутов в отдельную функцию.
- **Error-handler** — middleware с **4 аргументами** `(err, req, res, next)`. Express различает его по количеству аргументов.
- **`err.status`** — `express.json()` при битом JSON ставит `err.status = 400`.
- **Порядок в app.js:** `json` → `logger` → роуты → `notFound` → `errorHandler`.
- **DRY** — Don't Repeat Yourself.

**Сделано:**
- `src/data/tasks.js` — модуль с функциями CRUD.
- Пять роутов в `src/routes/tasks.js`.
- `src/middlewares/validateTitle.js` — валидация title.
- `src/middlewares/errorHandler.js` — централизованная обработка.
- Убрано дублирование валидации из роутов.

### День 4 — PostgreSQL

**Изучено:**
- **Пул соединений** (`Pool`) — переиспользование, не создавать на каждый запрос.
- **`pool.query()`** — для простых запросов `connect()` не нужен.
- **Плейсхолдеры** `$1`, `$2` — защита от **SQL-инъекций**. Никогда не конкатенируй SQL с данными клиента.
- **`RETURNING *`** — возврат строки после INSERT/UPDATE/DELETE.
- **`result.rows`** — массив строк, `result.rows[0]` — первая.
- **`async`/`await` по всей цепочке:** функция → роут.
- **`.env` + `dotenv`** — секреты вне кода.
- **`"type": "module"`** в `package.json` ломает `require` — проект становится ESM.

**Сделано:**
- База `task_manager`, таблица `tasks`:
  - `id SERIAL PRIMARY KEY`
  - `title VARCHAR(255) NOT NULL`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
- `src/data/db.js` — пул соединений с `.env`.
- `data/tasks.js` — пять функций на SQL. **Массив в памяти удалён.**
- Роуты — все `async` + `await`.
- Данные **выживают перезапуск сервера**.

### День 5 — Миграции и связи

**Изучено:**
- **Миграции** — SQL-файлы в `migrations/`, применяются через `psql -f`.
- **`IF NOT EXISTS`** — идемпотентность, можно применять повторно.
- **`UNIQUE`** — запрет дубликатов (email).
- **Foreign key** — `REFERENCES users(id)`, защита от ссылок на несуществующие записи.
- **`ON DELETE CASCADE`** — при удалении пользователя удаляются его задачи.
- **`JOIN` vs `LEFT JOIN`:**
  - `JOIN` — только строки **с совпадением** в обеих таблицах.
  - `LEFT JOIN` — **все** строки из левой таблицы, даже без совпадения (справа — `NULL`).

**Сделано:**
- `migrations/001_create_tasks.sql`
- `migrations/002_create_users.sql`
- `migrations/003_add_user_id_to_tasks.sql`
- Таблица `users`: `id`, `email UNIQUE NOT NULL`, `password_hash`, `created_at`.
- Колонка `user_id` в `tasks` — foreign key на `users(id)`, `ON DELETE CASCADE`.
- Удалил `node-pg-migrate` — используем ручные миграции.

---

## Слабые места (что заметил за 5 дней)

Это **важнее** всего остального. На собесе спросят именно об этом.

1. **Опечатки в ключах.** `recived` вместо `received`, `tittle` вместо `title`, `createAt` вместо `createdAt`, `d` вместо `id`, `task` вместо `tasks`. Это **реальные баги**, не придирки.

2. **Забываешь `return`.** В `getById` через `forEach`, в `res.end()`. Привычка: **после каждого `res.end()` / `res.json()` — `return`**.

3. **Порядок проверок.** Ставил `update` **до** валидации. Валидация — всегда **первой**.

4. **Middleware без `next`.** Писал `(req, res)` вместо `(req, res, next)`. Express различает по количеству аргументов: 2 — финальный, 3 — middleware.

5. **Порядок middleware в `app.js`.** Ставил `notFound` **до** роутов. Правило: `json` → `logger` → роуты → `notFound` → `errorHandler`.

6. **`app.use(logger())` вместо `app.use(logger)`.** Скобки вызывают функцию **сейчас**, а не передают Express.

7. **JSON в curl (PowerShell/cmd).** Двойные кавычки снаружи → экранирование `\"` внутри. Или одинарные снаружи → двойные внутри без экранирования.

8. **`errorHandler` не последним.** Express ищет error-handler **снизу вверх**. Правило: **всегда последним**.

9. **Хардкод статуса в errorHandler.** Правильно: `const status = err.status || 500`.

10. **Мёртвый `next()` после `return`.** В error-handler `next()` не нужен.

11. **Забываешь `async`/`await` в роутах.** `GET /` возвращал `{}` вместо массива. **Правило:** если функция асинхронная — все, кто её вызывает, тоже async + await.

12. **Возвращаешь `result`, а не `result.rows`.** Клиент получает гигантский объект с метаданными.

13. **Используешь `pool.connect()` вместо `pool.query()`.** Для простых запросов `connect` **не нужен**.

14. **Не перезапускаешь сервер после правок.** `node src/server.js` **не подхватывает** изменения. `Ctrl+C` → заново.

15. **PowerShell пишет в Windows-1251, а не UTF-8.** Кириллица в файлах, отредактированных через PowerShell, ломается. **Редактируй в VS Code.**

16. **Забываешь `;` в SQL.** `psql` переходит в режим `-#` — ждёт продолжения. **Точка с запятой обязательна.**

17. **Делаешь `UPDATE`/`DELETE` без проверки, какие id есть.** `UPDATE 0` = ни одна строка не обновилась. Сначала `SELECT`, потом действие.

18. **Путаешь `id` пользователей и задач.** Пользователь мог быть `id:3`, а не `id:1` — из-за удалений и `SERIAL`. **Проверяй `SELECT` перед `INSERT`/`UPDATE`.**

---

## Что дальше (порядок изучения)

Без сроков — порядок фиксирован, темп твой.

- [x] ~~HTTP + Node.js~~ — сделано
- [x] ~~Express + структура~~ — сделано
- [x] ~~CRUD + middleware~~ — сделано
- [x] ~~PostgreSQL — замена массива~~ — сделано
- [x] ~~Миграции и связи~~ — сделано
- [ ] **Аутентификация (JWT)** + HTTPS-теория — регистрация, логин, middleware `auth`
- [ ] Валидация (zod/joi)
- [ ] gRPC
- [ ] GraphQL
- [ ] NoSQL (MongoDB) — обзорно
- [ ] WebSocket
- [ ] Redis (кэширование)
- [ ] Message Brokers (RabbitMQ, Kafka)
- [ ] Search Engines (Elasticsearch)
- [ ] Тесты (Jest + Supertest)
- [ ] Мониторинг (Winston, Prometheus)
- [ ] DevOps: Docker, CI/CD, Nginx, Apache, HTTPS, SSH
- [ ] Архитектура: слои, паттерны, микросервисы
- [ ] Масштабирование (LB, репликация, шардинг)
- [ ] TypeScript
- [ ] Next.js + фронтенд

---

## Полезные ссылки

- MDN HTTP: https://developer.mozilla.org/ru/docs/Web/HTTP
- Express Routing: https://expressjs.com/ru/guide/routing.html
- PostgreSQL Docs: https://www.postgresql.org/docs/
- node-postgres (pg): https://node-postgres.com/
- javascript.info: https://learn.javascript.ru
- Roadmap Backend: https://roadmap.sh/backend

---

## Как продолжить (для AI)

Если этот файл скидывают в новый чат — контекст такой:

- Пользователь учится на fullstack-разработчика, 5 дней опыта с Node.js/Express/PostgreSQL.
- Стек: Node.js, Express, PostgreSQL. Данные в базе, не в памяти. Миграции — ручные SQL-файлы.
- Стиль обучения: **не писать код за него**. Говорить, что делать, давать подсказки, разбирать его код. Только направлять.
- Пользователь знает Python и JavaScript, имеет небольшой опыт работы (Node.js + React).
- Цель: найти работу как можно быстрее.
- Слабые места: см. раздел выше — **опечатки** (главная проблема), `return`, `async`/`await`, порядок middleware, `;` в SQL.

**Формат ответов:** структурированные, с разбором ошибок, без готового кода. Когда он ошибается — объяснять **почему**, а не просто «вот правильно».