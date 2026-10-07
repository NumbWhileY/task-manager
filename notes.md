# Task Manager — Project Notes

> Контекст для продолжения работы. Стек: Node.js, Express, PostgreSQL, JWT, zod, Jest.
> Цель: fullstack-разработчик, поиск работы.

---

## Что это за проект

`task-manager` — REST API для управления задачами. Учебный проект, который эволюционирует:
PostgreSQL → аутентификация → валидация → кастомные ошибки → тесты → WebSocket → фронтенд на Next.js.

**Текущий статус:** день 9 завершён (07.10.2026). CRUD работает на PostgreSQL,
аутентификация через JWT, роуты защищены, задачи привязаны к пользователям,
валидация через `zod`, кастомные ошибки, **18 тестов** (unit + integration).
Следующий шаг — мониторинг (Winston/Pino).

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
    │   ├── errors/
    │   │   ├── AppError.js     ← базовый класс
    │   │   └── index.js        ← NotFoundError, ValidationError, UnauthorizedError, ConflictError
    │   ├── schemas/
    │   │   ├── auth.js         ← registerSchema, loginSchema
    │   │   └── task.js         ← taskSchema
    │   ├── routes/
    │   │   ├── auth.js         ← POST /auth/register, POST /auth/login
    │   │   └── tasks.js        ← 5 роутов /tasks (защищены auth)
    │   └── middlewares/
    │       ├── logger.js       ← логирование каждого запроса
    │       ├── notFound.js     ← 404 в конце
    │       ├── auth.js         ← проверка JWT → req.user
    │       ├── validate.js     ← универсальный validate(schema)
    │       └── errorHandler.js ← обработка ошибок (statusCode)
    ├── tests/                  ← тесты
    │   ├── setup.js            ← setup/teardown (beforeEach, afterAll)
    │   ├── task.test.js        ← 8 unit-тестов для data/tasks.js
    │   ├── auth.test.js        ← 7 integration-тестов для /auth/*
    │   └── routes.test.js      ← 3 integration-теста для /tasks
    ├── jest.config.js          ← конфиг Jest
    ├── .env                    ← секреты (НЕ в Git): DB_*, DB_NAME_TEST, JWT_SECRET
    ├── package.json
    └── .gitignore
```

**Git:** единый репозиторий в корне `JavaScript Intensive`. Семнадцать коммитов:
- `13be1c0` Day 9: Jest + Supertest tests (unit + integration)
- `Update notes after Day 9`
- `Day 8: custom error classes (NotFoundError, ConflictError, UnauthorizedError)`
- `Update notes after Day 8`
- `Update notes after Day 7`
- `0f317be` Day 7: zod validation, universal validate middleware
- `a9605c9` Update notes after Day 6
- `3ca6f24` Day 6: JWT authentication, protected routes, user-owned tasks
- `9afc242` Day 5: migrations, users table, foreign key, JOIN
- `dd930b9` Update notes after Day 5
- `634dad0` Update notes after Day 4
- `e65c36b` Day 4: migrate from in-memory array to PostgreSQL
- `eecce5a` Add PostgreSQL environment info
- `bfc1be0` Day 3: CRUD, validateTitle middleware, errorHandler
- `fa8a2c2` Add project notes for context
- `422c254` Day 3: full CRUD for tasks with in-memory storage
- `f2c0818` Day 2: modular structure + disable x-powered-by
- `482c90f` Days 1-2: raw HTTP server + Express server

**Email в Git — исправлен:** `podzorovvvivan@gmail.com`.
**Осталось:** старые коммиты **с неверным** email — при пуше на GitHub **не свяжутся** с аккаунтом. Если критично — исправить через `git filter-branch` **перед** публикацией.

---

## Окружение

- **PostgreSQL 15.19** установлен локально.
- Путь: `C:\Program Files\PostgreSQL\15\bin`
- Порт: `5432`.
- Пользователь: `postgres`.
- Добавлен в PATH — `psql` работает из любого места.
- **Две базы:**
  - `task_manager` — разработка.
  - `task_manager_test` — тесты.
- Подключение: `psql -U postgres -h localhost -d task_manager`.

**Миграции:**
```bash
psql -U postgres -h localhost -d task_manager -f migrations/XXX_name.sql
psql -U postgres -h localhost -d task_manager_test -f migrations/XXX_name.sql
```

**Зависимости:**
- `express` — веб-фреймворк.
- `pg` — PostgreSQL клиент.
- `dotenv` — переменные окружения.
- `bcrypt` — хеширование паролей.
- `jsonwebtoken` — JWT.
- `zod` 4.6.5 — валидация.

**Dev-зависимости:**
- `jest` 30.5.2 — тест-фреймворк.
- `supertest` 7.3.1 — HTTP-тесты.

**Скрипты:**
```bash
npm test         # один прогон тестов
npm run test:watch # следит за файлами
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
- **`bcrypt`:** `hash(password, 10)`, `compare(password, hash)`. Медленный специально.
- **`jsonwebtoken`:** `sign(payload, secret, { expiresIn })`, `verify(token, secret)`.
- **JWT:** `header.payload.signature`. Payload **читается**, но **не подделывается**.
- **Middleware `auth`:** `Bearer <token>` → `jwt.verify` → `req.user = { userId }`.
- **Безопасность:** одинаковые сообщения об ошибках.
- **Защита от чужих данных:** `WHERE id = $1 AND user_id = $2`.
- **404 вместо 403:** не подсказывать, что чужая задача существует.

**Сделано:**
- `data/users.js`, `routes/auth.js`, `middlewares/auth.js`.
- `data/tasks.js` — все функции с `user_id`.
- `routes/tasks.js` — все роуты защищены `auth`.
- `JWT_SECRET` в `.env`.

### День 7 — Валидация через zod

**Изучено:**
- **`zod`** — декларативная валидация. Схемы описывают правила в одном месте.
- **`z.object({...})`** — объект-схема.
- **Цепочки:** `z.string().trim().min(1).max(255)`.
- **`.trim()` перед `.min()`** — иначе `'   '` пройдёт проверку.
- **`safeParse()`** — не бросает, возвращает `{ success, data | error }`.
- **`result.error.issues`** — в `zod` 4.x (было `errors` в 3.x).
- **Универсальный middleware** — фабрика `(schema) => (req, res, next)`.
- **`req.body = result.data`** — замена на очищенные данные.

**Сделано:**
- `src/schemas/auth.js` — `registerSchema`, `loginSchema`.
- `src/schemas/task.js` — `taskSchema`.
- `src/middlewares/validate.js` — универсальный middleware.
- `routes/auth.js` — `validate(registerSchema)` и `validate(loginSchema)`.
- `routes/tasks.js` — `validate(taskSchema)` вместо `validateTitle`.
- **Удалён** `middlewares/validateTitle.js`.

### День 8 — Кастомные ошибки

**Изучено:**
- **`class AppError extends Error`** — базовый класс. `super(message)`, `this.statusCode`, `this.isOperational`.
- **`Error.captureStackTrace(this, this.constructor)`** — чистый стек.
- **Наследники:** `NotFoundError` (404), `ValidationError` (400), `UnauthorizedError` (401), `ConflictError` (409).
- **`throw new NotFoundError(...)`** в async-роутах — Express 5 ловит.
- **`next(new UnauthorizedError(...))`** в middleware — работает во всех версиях.
- **`err.statusCode || err.status || 500`** — оба случая покрыты.
- **`isOperational`** — флаг «ожидаемая ошибка» vs «баг».

**Сделано:**
- `src/errors/AppError.js` — базовый класс.
- `src/errors/index.js` — `NotFoundError`, `ValidationError`, `UnauthorizedError`, `ConflictError`.
- `middlewares/errorHandler.js` — читает `statusCode`.
- `routes/tasks.js` — `throw new NotFoundError(...)`.
- `routes/auth.js` — `throw new ConflictError(...)`, `throw new UnauthorizedError(...)`.
- `middlewares/auth.js` — `next(new UnauthorizedError(...))`.

### День 9 — Тесты (Jest + Supertest)

**Изучено:**
- **Unit-тест** — одна функция, изолированно.
- **Integration-тест** — весь поток: HTTP → Express → middleware → data → база.
- **`Jest`** — тест-фреймворк. Находит `*.test.js`, запускает, отчитывается.
- **`Supertest`** — HTTP-клиент для тестов. `request(app)` — без `listen`.
- **`jest.config.js`** — `testEnvironment: 'node'`, `testMatch`, `setupFilesAfterEnv`.
- **`setupFilesAfterEnv`** (не `AfterEach`!) — подключение setup-файла.
- **`beforeEach`** — очистка перед каждым тестом.
- **`afterAll`** — закрытие пула после всех тестов.
- **`TRUNCATE users RESTART IDENTITY CASCADE`** — очистка + сброс id + каскад.
- **Тестовая база** — `task_manager_test`, отдельно от `task_manager`.
- **`NODE_ENV='test'`** — флаг тестового режима.
- **`--forceExit`** — если Jest не завершается (крайняя мера).
- **`--detectOpenHandles`** — найти открытые ресурсы.

**Сделано:**
- `jest.config.js` — конфиг.
- `tests/setup.js` — setup/teardown.
- `tests/task.test.js` — 8 unit-тестов для `data/tasks.js`.
- `tests/auth.test.js` — 7 integration-тестов для `/auth/*`.
- `tests/routes.test.js` — 3 integration-теста для `/tasks`.
- `package.json` — `scripts: test, test:watch`.
- `devDependencies`: `jest`, `supertest`.
- **Тестовая база** `task_manager_test` + миграции.
- **18 тестов** — все зелёные.

---

## Слабые места (что заметил за 9 дней)

Это **важнее** всего остального. На собесе спросят именно об этом.

1. **Опечатки в ключах.** `recived`, `tittle`, `createAt`, `d` вместо `id`, `task` вместо `tasks`, `passswor`. **Реальные баги.**

2. **Забываешь `return`.** После `res.end()` / `res.json()` — `return`.

3. **Порядок проверок.** Валидация — всегда **первой**.

4. **Middleware без `next`.** `(req, res)` вместо `(req, res, next)`.

5. **Порядок middleware в `app.js`.** `json` → `logger` → роуты → `notFound` → `errorHandler`.

6. **`app.use(logger())` вместо `app.use(logger)`.**

7. **JSON в curl (PowerShell/cmd).** Двойные кавычки снаружи → `\"` внутри.

8. **`errorHandler` не последним.** Express ищет **снизу вверх**.

9. **Хардкод статуса в errorHandler.** `const status = err.statusCode || err.status || 500`.

10. **Мёртвый `next()` после `return`.** В error-handler не нужен.

11. **Забываешь `async`/`await` в роутах.**

12. **Возвращаешь `result`, а не `result.rows`.**

13. **`pool.connect()` вместо `pool.query()`.**

14. **Не перезапускаешь сервер после правок.**

15. **PowerShell пишет в Windows-1251.** Редактируй в VS Code.

16. **Забываешь `;` в SQL.** `psql` переходит в режим `-#`.

17. **`UPDATE`/`DELETE` без проверки id.** `UPDATE 0` = ни одна строка.

18. **Путаешь `id` пользователей и задач.** Проверяй `SELECT` перед действием.

19. **Забываешь `module.exports` в новом модуле.**

20. **Путаешь `snake_case` и `camelCase`.** В SQL — `user_id`, в JS — `userId`.

21. **Переименование переменной — не везде.** **Правило:** `F2` в VS Code.

22. **Путаю версии библиотек.** `zod` 4 изменил API (`errors` → `issues`).

23. **`Object.keys()` не показывает геттеры.** Обращаться к свойству **напрямую**.

24. **Класс без `new`.** `throw NotFoundError(...)` → TypeError.

25. **Обращение к свойству до проверки на undefined.** `user.password_hash` до `if (!user)`.

26. **`throw` в `catch`.** Работает, но `next(err)` в middleware — читаемее.

27. **Дублирую импорты.** `require` дважды → SyntaxError. **Правило:** все импорты — в начале, один раз.

28. **Забываю импорты в новом файле.** `request is not defined`. **Правило:** сначала импорты, потом логика.

29. **Забываю `Ctrl+S`.** Jest/Node не видят изменений.

30. **`setupFilesAfterEach`** не существует. **Правильно:** `setupFilesAfterEnv`.

31. **Тестовая база не создана** → `database does not exist`. **Правило:** создать базу + прогнать миграции.

---

## Что дальше (порядок изучения)

- [x] ~~HTTP + Node.js~~ — сделано
- [x] ~~Express + структура~~ — сделано
- [x] ~~CRUD + middleware~~ — сделано
- [x] ~~PostgreSQL — замена массива~~ — сделано
- [x] ~~Миграции и связи~~ — сделано
- [x] ~~Аутентификация (JWT)~~ — сделано
- [x] ~~Валидация (zod)~~ — сделано
- [x] ~~Кастомные ошибки~~ — сделано
- [x] ~~Тесты (Jest + Supertest)~~ — сделано
- [ ] **Мониторинг и логирование (Winston/Pino)** — следующий шаг
- [ ] Sentry — отлов ошибок в проде
- [ ] gRPC
- [ ] GraphQL
- [ ] NoSQL (MongoDB) — обзорно
- [ ] WebSocket
- [ ] Redis (кэширование)
- [ ] Message Brokers (RabbitMQ, Kafka)
- [ ] Search Engines (Elasticsearch)
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
- zod: https://zod.dev
- Jest: https://jestjs.io
- Supertest: https://www.npmjs.com/package/supertest
- JWT decoder: https://jwt.io
- javascript.info: https://learn.javascript.ru
- Roadmap Backend: https://roadmap.sh/backend

---

## Как продолжить (для AI)

Если этот файл скидывают в новый чат — контекст такой:

- Пользователь учится на fullstack-разработчика, 9 дней опыта с Node.js/Express/PostgreSQL/JWT/zod/Jest.
- Стек: Node.js, Express, PostgreSQL, JWT, bcrypt, zod, Jest + Supertest. Миграции — ручные SQL-файлы. Кастомные ошибки. Тестовая база `task_manager_test`.
- Стиль обучения: **не писать код за него**. Говорить, что делать, давать подсказки, разбирать его код. Только направлять.
- Пользователь знает Python и JavaScript, имеет небольшой опыт работы (Node.js + React).
- Цель: найти работу как можно быстрее.
- Слабые места: **опечатки** (главная проблема), `return`, `async`/`await`, порядок middleware, `;` в SQL, `snake_case` vs `camelCase`, забывает `module.exports`, путает версии библиотек, забывает `new` перед классом, обращается к свойствам до проверки на `undefined`, забывает `Ctrl+S`, забывает импорты в новых файлах.

**Формат ответов:** структурированные, с разбором ошибок, без готового кода. Когда он ошибается — объяснять **почему**, а не просто «вот правильно».