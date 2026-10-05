# Task Manager — Project Notes

> Контекст для продолжения работы. Стек: Node.js, Express, PostgreSQL, JWT.
> Цель: fullstack-разработчик, поиск работы.

---

## Что это за проект

`task-manager` — REST API для управления задачами. Учебный проект, который эволюционирует:
PostgreSQL → аутентификация → WebSocket → фронтенд на Next.js.

**Текущий статус:** день 6 завершён (05.10.2026). CRUD работает на PostgreSQL,
аутентификация через JWT, роуты защищены, задачи привязаны к пользователям.
Следующий шаг — валидация через zod.

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
    │   │   ├── users.js        ← работа с users (findByEmail, create, findById)
    │   │   └── tasks.js        ← CRUD на SQL с привязкой к user_id
    │   ├── routes/
    │   │   ├── auth.js         ← POST /auth/register, POST /auth/login
    │   │   └── tasks.js        ← 5 роутов /tasks (защищены auth)
    │   └── middlewares/
    │       ├── logger.js       ← логирование каждого запроса
    │       ├── notFound.js     ← 404 в конце
    │       ├── auth.js         ← проверка JWT → req.user
    │       ├── validateTitle.js ← валидация title
    │       └── errorHandler.js ← обработка ошибок
    ├── .env                    ← секреты (НЕ в Git): DB_*, JWT_SECRET
    ├── package.json
    └── .gitignore
```

**Git:** единый репозиторий в корне `JavaScript Intensive`. Одиннадцать коммитов:
- `3ca6f24` Day 6: JWT authentication, protected routes, user-owned tasks
- `Update notes after Day 5`
- `9afc242` Day 5: migrations, users table, foreign key, JOIN
- `dd930b9` Update notes after Day 4
- `e65c36b` Day 4: migrate from in-memory array to PostgreSQL
- `eecce5a` Add PostgreSQL environment info
- `bfc1be0` Day 3: CRUD, validateTitle middleware, errorHandler
- `fa8a2c2` Add project notes for context
- `422c254` Day 3: full CRUD for tasks with in-memory storage
- `f2c0818` Day 2: modular structure + disable x-powered-by
- `482c90f` Days 1-2: raw HTTP server + Express server

**⚠️ Проблема:** email в Git настроен **неверно** — `podzorovvvivan@gmail.com@gmail.com` (двойной домен). Нужно исправить: `git config --global user.email "podzorovvvivan@gmail.com"`.

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
- Методы: GET, POST, PUT, PATCH, DELETE.
- Статусы: 2xx успех, 3xx редирект, 4xx клиент, 5xx сервер.
- Заголовки: `Content-Type`, `Content-Length`, `Host`, `Authorization`, `Cookie`.
- HTTP без состояния — каждый запрос независим.

**Сделано:**
- `Day 1/taskManager/server.js` — HTTP-сервер без фреймворков.
- Роутинг через `if (req.url === '/' && req.method === 'GET')`.
- Тело POST через `req.on('data')` / `req.on('end')`.
- `JSON.parse` в `try/catch` → 400 при невалидном JSON.

**Ключевой инсайт:** Express — это обёртка над тем, что было написано руками.

### День 2 — Express + структура

**Изучено:**
- Middleware — `(req, res, next)`, выполняется между запросом и ответом.
- Порядок middleware **критичен** — Express идёт сверху вниз.
- `express.json()` — парсит тело в `req.body`.
- `express.Router()` — модульные роуты.
- Middleware передаётся **без скобок**: `app.use(logger)`.
- `app.disable('x-powered-by')` — не раскрывать стек.

**Сделано:**
- Переписал сервер на Express — код короче в 2 раза.
- Разбил на модули: `app.js`, `server.js`, `routes/`, `middlewares/`.

### День 3 — CRUD + middleware валидации и ошибок

**Изучено:**
- CRUD — основа любого API.
- Статусы: 200, 201, 204, 400, 404.
- **Порядок проверок:** валидация **до** действия.
- `.json()` для тела, `.end()` для 204.
- **Middleware валидации** — вынесение проверок из роутов.
- **Error-handler** — 4 аргумента `(err, req, res, next)`.
- **DRY** — Don't Repeat Yourself.

**Сделано:**
- `src/data/tasks.js` — модуль CRUD.
- Пять роутов в `src/routes/tasks.js`.
- `src/middlewares/validateTitle.js`, `errorHandler.js`.

### День 4 — PostgreSQL

**Изучено:**
- **Пул соединений** (`Pool`) — переиспользование.
- **`pool.query()`** — без `connect()` для простых запросов.
- **Плейсхолдеры** `$1`, `$2` — защита от SQL-инъекций.
- **`RETURNING *`** — возврат строки после INSERT/UPDATE/DELETE.
- **`async`/`await` по всей цепочке.**
- **`.env` + `dotenv`** — секреты вне кода.

**Сделано:**
- База `task_manager`, таблица `tasks`.
- `src/data/db.js` — пул соединений.
- `data/tasks.js` — пять функций на SQL. **Массив удалён.**

### День 5 — Миграции и связи

**Изучено:**
- **Миграции** — SQL-файлы, применяются через `psql -f`.
- **`IF NOT EXISTS`** — идемпотентность.
- **`UNIQUE`** — запрет дубликатов (email).
- **Foreign key** — `REFERENCES users(id)`.
- **`ON DELETE CASCADE`** — каскадное удаление.
- **`JOIN` vs `LEFT JOIN`** — совпадения vs все строки левой таблицы.

**Сделано:**
- `migrations/001-003`.
- Таблица `users`: `id`, `email UNIQUE`, `password_hash`, `created_at`.
- `tasks.user_id` — foreign key на `users(id)` с `CASCADE`.

### День 6 — Аутентификация (JWT)

**Изучено:**
- **`bcrypt`:** `hash(password, 10)`, `compare(password, hash)`. Медленный специально — защита от подбора.
- **`jsonwebtoken`:** `sign(payload, secret, { expiresIn })`, `verify(token, secret)`.
- **JWT:** `header.payload.signature`. Payload **читается**, но **не подделывается**.
- **Middleware `auth`:** `Bearer <token>` → `jwt.verify` → `req.user = { userId }`.
- **Безопасность:** одинаковые сообщения об ошибках — не раскрывать, что именно неверно.
- **Защита от чужих данных:** `WHERE id = $1 AND user_id = $2`.
- **404 вместо 403:** не подсказывать, что чужая задача существует.

**Сделано:**
- `data/users.js` — `findByEmail`, `create`, `findById`.
- `routes/auth.js` — `POST /auth/register`, `POST /auth/login`.
- `middlewares/auth.js` — проверка JWT.
- `data/tasks.js` — все функции с `user_id`.
- `routes/tasks.js` — все роуты защищены `auth`.
- `JWT_SECRET` в `.env`.

**Проверено curl-ом:**
- Без токена → **401** «Требуется авторизация».
- Логин → **200** + JWT.
- С токеном → **200** + свои задачи.
- Создание → **201** + задача с `user_id`.
- Чужая задача → **404**.
- Невалидный токен → **401**.

---

## Слабые места (что заметил за 6 дней)

Это **важнее** всего остального. На собесе спросят именно об этом.

1. **Опечатки в ключах.** `recived` вместо `received`, `tittle` вместо `title`, `createAt` вместо `createdAt`, `d` вместо `id`, `task` вместо `tasks`, `passswor` вместо `password`. **Реальные баги.**

2. **Забываешь `return`.** В `getById` через `forEach`, в `res.end()`. **Правило:** после `res.end()` / `res.json()` — `return`.

3. **Порядок проверок.** Валидация — всегда **первой**.

4. **Middleware без `next`.** `(req, res)` вместо `(req, res, next)`.

5. **Порядок middleware в `app.js`.** `json` → `logger` → роуты → `notFound` → `errorHandler`.

6. **`app.use(logger())` вместо `app.use(logger)`.** Скобки вызывают **сейчас**.

7. **JSON в curl (PowerShell/cmd).** Двойные кавычки снаружи → `\"` внутри. Одинарные снаружи → двойные внутри без экранирования.

8. **`errorHandler` не последним.** Express ищет **снизу вверх**.

9. **Хардкод статуса в errorHandler.** `const status = err.status || 500`.

10. **Мёртвый `next()` после `return`.** В error-handler не нужен.

11. **Забываешь `async`/`await` в роутах.** Если функция асинхронная — все, кто её вызывает, тоже.

12. **Возвращаешь `result`, а не `result.rows`.**

13. **`pool.connect()` вместо `pool.query()`.**

14. **Не перезапускаешь сервер после правок.**

15. **PowerShell пишет в Windows-1251.** Редактируй в VS Code.

16. **Забываешь `;` в SQL.** `psql` переходит в режим `-#`.

17. **`UPDATE`/`DELETE` без проверки id.** `UPDATE 0` = ни одна строка.

18. **Путаешь `id` пользователей и задач.** Проверяй `SELECT` перед действием.

19. **Забываешь `module.exports` в новом модуле.** Express падает с `argument handler must be a function`. **Правило:** после создания модуля — **сразу** добавить `module.exports`.

20. **Путаешь `snake_case` и `camelCase`.** В SQL — `user_id`, в JS — `userId`. При переименовании параметра — **проверять массив** тоже. **Правило:** после переименования — `Ctrl+F` по старому имени.

21. **Переименование переменной — не везде.** `existing` → `user` в двух местах, в третьем — забыл. **Правило:** `F2` в VS Code для переименования во всём файле.

---

## Что дальше (порядок изучения)

Без сроков — порядок фиксирован, темп твой.

- [x] ~~HTTP + Node.js~~ — сделано
- [x] ~~Express + структура~~ — сделано
- [x] ~~CRUD + middleware~~ — сделано
- [x] ~~PostgreSQL — замена массива~~ — сделано
- [x] ~~Миграции и связи~~ — сделано
- [x] ~~Аутентификация (JWT)~~ — сделано
- [ ] **Валидация (zod)** — следующий шаг
- [ ] Кастомные ошибки (ValidationError, NotFoundError)
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
- bcrypt: https://www.npmjs.com/package/bcrypt
- jsonwebtoken: https://www.npmjs.com/package/jsonwebtoken
- JWT decoder: https://jwt.io
- javascript.info: https://learn.javascript.ru
- Roadmap Backend: https://roadmap.sh/backend

---

## Как продолжить (для AI)

Если этот файл скидывают в новый чат — контекст такой:

- Пользователь учится на fullstack-разработчика, 6 дней опыта с Node.js/Express/PostgreSQL/JWT.
- Стек: Node.js, Express, PostgreSQL, JWT, bcrypt. Миграции — ручные SQL-файлы.
- Стиль обучения: **не писать код за него**. Говорить, что делать, давать подсказки, разбирать его код. Только направлять.
- Пользователь знает Python и JavaScript, имеет небольшой опыт работы (Node.js + React).
- Цель: найти работу как можно быстрее.
- Слабые места: **опечатки** (главная проблема — 5+ раз за сессию), `return`, `async`/`await`, порядок middleware, `;` в SQL, `snake_case` vs `camelCase`, забывает `module.exports`.

**Формат ответов:** структурированные, с разбором ошибок, без готового кода. Когда он ошибается — объяснять **почему**, а не просто «вот правильно».