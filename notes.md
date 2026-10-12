# Task Manager — Project Notes

> Контекст для продолжения работы. Стек: Node.js, Express, PostgreSQL, JWT, zod, Jest, pino, Docker, GitHub Actions.
> Цель: fullstack-разработчик, поиск работы.

---

## Что это за проект

`task-manager` — REST API для управления задачами. Учебный проект, который эволюционирует:
PostgreSQL → аутентификация → валидация → кастомные ошибки → тесты → логирование → Docker → CI/CD → фронтенд на Next.js.

**Текущий статус:** день 12 завершён (12.10.2026). CRUD работает на PostgreSQL,
аутентификация через JWT, роуты защищены, задачи привязаны к пользователям,
валидация через `zod`, кастомные ошибки, **18 тестов** (unit + integration),
структурное логирование через `pino`, **Docker + docker-compose**, **CI/CD через GitHub Actions**.
Проект — **на GitHub** с зелёным badge.
Следующий шаг — деплой на VPS.

---

## Структура проекта

```
JavaScript Intensive/
├── .github/
│   └── workflows/
│       └── test.yml            ← CI: тесты на каждый push
├── notes.md                    ← этот файл
├── README.md                   ← с badge CI
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
    │   ├── lib/
    │   │   └── logger.js       ← pino-логгер (dev/prod/test)
    │   ├── data/
    │   │   ├── db.js           ← пул соединений с PostgreSQL
    │   │   ├── users.js        ← работа с users
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
    │       ├── logger.js       ← logger.info для каждого запроса
    │       ├── notFound.js     ← 404 в конце
    │       ├── auth.js         ← проверка JWT → req.user
    │       ├── validate.js     ← универсальный validate(schema)
    │       └── errorHandler.js ← обработка ошибок через logger.error
    ├── tests/
    │   ├── env.js              ← NODE_ENV='test' (setupFiles)
    │   ├── setup.js            ← setup/teardown
    │   ├── task.test.js        ← 8 unit-тестов
    │   ├── auth.test.js        ← 7 integration-тестов
    │   └── routes.test.js      ← 3 integration-теста
    ├── Dockerfile              ← образ приложения
    ├── .dockerignore           ← что НЕ копировать
    ├── docker-compose.yml      ← app + postgres
    ├── jest.config.js
    ├── .env                    ← секреты (НЕ в Git)
    ├── package.json
    └── .gitignore
```

**Git:** репозиторий на GitHub — https://github.com/NumbWhileY/task-manager.
Двадцать шесть коммитов:
- `Day 12: add GitHub Actions CI workflow`
- `Day 12: fix workflows folder name`
- `Day 12: add README with CI badge`
- `Update notes after Day 12`
- `Day 11: Docker + docker-compose (app + postgres)`
- `Update notes after Day 11`
- `Day 10: structured logging with pino`
- ... (далее по дням)

**Email в Git — исправлен через `git filter-repo`:** `podzorovvvivan@gmail.com`.
Все 22 старых коммита переписаны — теперь связаны с GitHub-аккаунтом `NumbWhileY`.

---

## Окружение

- **PostgreSQL 15.19** установлен локально.
- Путь: `C:\Program Files\PostgreSQL\15\bin`
- Порт: `5432`.
- Пользователь: `postgres`.
- **Две базы:**
  - `task_manager` — разработка.
  - `task_manager_test` — тесты.

**Docker:**
- **Docker Desktop** (WSL 2).
- **WSL 3.0.1.0** + **Ubuntu**.
- **Docker version 29.8.2**.
- **Docker Compose v5.5.1**.

**GitHub:**
- **Аккаунт:** `NumbWhileY`.
- **Репозиторий:** https://github.com/NumbWhileY/task-manager.
- **CI:** `.github/workflows/test.yml` — запускается на push в `main`.
- **Status:** зелёный badge `Tests: passing`.

**Зависимости (prod):**
- `express`, `pg`, `dotenv`, `bcrypt`, `jsonwebtoken`, `zod`, `pino`, `pino-pretty`.

**Dev-зависимости:**
- `jest`, `supertest`.

**Скрипты:**
```bash
npm test           # jest --runInBand
npm run test:watch # jest --watch --runInBand
```

**Docker-команды:**
```bash
docker build -t task-manager .
docker compose up -d
docker compose ps
docker compose logs app
docker compose exec db psql -U postgres -d task_manager -c "SELECT * FROM users;"
docker compose down
```

**Git-команды:**
```bash
git pull                       # забрать изменения с GitHub
git push                       # запушить локальные изменения
git log --oneline              # история
git remote -v                  # remote
```

---

## Что сделано по дням

### День 1 — HTTP + голый Node.js

**Изучено:**
- Структура HTTP-запроса: стартовая строка → заголовки → пустая строка → тело.
- Методы: GET, POST, PUT, PATCH, DELETE.
- Статусы: 2xx, 3xx, 4xx, 5xx.
- Заголовки: `Content-Type`, `Content-Length`, `Host`, `Authorization`, `Cookie`.
- HTTP без состояния.

**Сделано:**
- `Day 1/taskManager/server.js` — HTTP-сервер без фреймворков.
- Роутинг через `if (req.url === '/' && req.method === 'GET')`.
- Тело POST через `req.on('data')` / `req.on('end')`.
- `JSON.parse` в `try/catch` → 400.

### День 2 — Express + структура

**Изучено:**
- Middleware — `(req, res, next)`.
- Порядок middleware **критичен**.
- `express.json()`, `express.Router()`.
- Middleware передаётся **без скобок**.
- `app.disable('x-powered-by')`.

**Сделано:**
- Переписал сервер на Express.
- Разбил на модули: `app.js`, `server.js`, `routes/`, `middlewares/`.

### День 3 — CRUD + middleware валидации и ошибок

**Изучено:**
- CRUD — основа API.
- Статусы: 200, 201, 204, 400, 404.
- **Порядок проверок:** валидация **до** действия.
- `.json()` для тела, `.end()` для 204.
- **Error-handler** — 4 аргумента.
- **DRY**.

**Сделано:**
- `src/data/tasks.js`, 5 роутов, `validateTitle`, `errorHandler`.

### День 4 — PostgreSQL

**Изучено:**
- **Пул соединений** (`Pool`).
- **`pool.query()`**.
- **Плейсхолдеры** `$1`, `$2` — защита от SQL-инъекций.
- **`RETURNING *`**.
- **`async`/`await`** по цепочке.
- **`.env` + `dotenv`**.

**Сделано:**
- База `task_manager`, таблица `tasks`.
- `src/data/db.js`.
- `data/tasks.js` — SQL. **Массив удалён.**

### День 5 — Миграции и связи

**Изучено:**
- **Миграции** — SQL-файлы через `psql -f`.
- **`IF NOT EXISTS`** — идемпотентность.
- **`UNIQUE`** — дубликаты (email).
- **Foreign key** — `REFERENCES users(id)`.
- **`ON DELETE CASCADE`**.
- **`JOIN` vs `LEFT JOIN`**.

**Сделано:**
- `migrations/001-003`.
- `users`: `id`, `email UNIQUE`, `password_hash`, `created_at`.
- `tasks.user_id` — FK на `users(id)` с `CASCADE`.

### День 6 — Аутентификация (JWT)

**Изучено:**
- **`bcrypt`:** `hash(password, 10)`, `compare()`.
- **`jsonwebtoken`:** `sign()`, `verify()`.
- **JWT:** `header.payload.signature`.
- **Middleware `auth`:** `Bearer <token>` → `jwt.verify` → `req.user`.
- **Одинаковые сообщения** об ошибках.
- **Защита от чужих данных:** `WHERE id = $1 AND user_id = $2`.
- **404 вместо 403**.

**Сделано:**
- `data/users.js`, `routes/auth.js`, `middlewares/auth.js`.
- `data/tasks.js` — все функции с `user_id`.
- `routes/tasks.js` — все роуты защищены `auth`.

### День 7 — Валидация через zod

**Изучено:**
- **`zod`** — декларативная валидация.
- **`z.object({...})`**.
- **Цепочки:** `z.string().trim().min(1).max(255)`.
- **`.trim()` перед `.min()`**.
- **`safeParse()`**.
- **`result.error.issues`** — в `zod` 4.x.
- **Универсальный middleware** — `(schema) => (req, res, next)`.
- **`req.body = result.data`**.

**Сделано:**
- `src/schemas/auth.js`, `src/schemas/task.js`.
- `src/middlewares/validate.js`.
- Замена `validateTitle` на `validate(taskSchema)`.

### День 8 — Кастомные ошибки

**Изучено:**
- **`class AppError extends Error`**.
- **`statusCode`, `isOperational`**.
- **Наследники:** `NotFoundError` (404), `ValidationError` (400), `UnauthorizedError` (401), `ConflictError` (409).
- **`throw new NotFoundError(...)`** в async-роутах.
- **`next(new UnauthorizedError(...))`** в middleware.
- **`err.statusCode || err.status || 500`**.

**Сделано:**
- `src/errors/AppError.js`, `src/errors/index.js`.
- `errorHandler.js` — читает `statusCode`.
- Роуты — `throw new ...`.

### День 9 — Тесты (Jest + Supertest)

**Изучено:**
- **Unit-тест** vs **Integration-тест**.
- **`Jest`** — фреймворк.
- **`Supertest`** — HTTP-клиент для тестов.
- **`setupFilesAfterEnv`**.
- **`beforeEach`**, **`afterAll`**.
- **`TRUNCATE users RESTART IDENTITY CASCADE`**.
- **`--runInBand`** — последовательно.
- **Параллельные тесты на общей БД** — конфликт.

**Сделано:**
- `jest.config.js`, `tests/setup.js`.
- 8 unit + 7 integration (auth) + 3 integration (routes) = **18 тестов**.

### День 10 — Логирование (pino)

**Изучено:**
- **`pino`** — структурное логирование.
- **`pino-pretty`** — красивый вывод для dev.
- **Уровни:** `debug`, `info`, `warn`, `error`, `silent`.
- **Транспорты:** pino-pretty в dev, JSON в prod, silent в test.
- **`NODE_ENV`** — переключение.
- **`setupFiles`** vs **`setupFilesAfterEnv`**.
- **`maxWorkers: 1`**.

**Сделано:**
- `src/lib/logger.js` — конфиг pino (3 режима).
- `middlewares/logger.js`, `errorHandler.js`, `server.js` — заменены.
- `tests/env.js` — `NODE_ENV='test'`.
- 18 тестов — чистый вывод.

### День 11 — Docker + docker-compose

**Изучено:**
- **Docker** — образ, контейнер.
- **`Dockerfile`** — `FROM`, `WORKDIR`, `COPY`, `RUN`, `EXPOSE`, `CMD`.
- **`.dockerignore`** — `node_modules`, `.env`, `tests`.
- **`docker-compose.yml`** — `services`, `build`, `image`, `environment`, `volumes`, `healthcheck`, `depends_on`, `ports`.
- **`DB_HOST: db`** — имя сервиса как хост.
- **`docker compose up -d`, `ps`, `logs`, `exec`, `down`**.
- **Volume** — данные сохраняются.

**Сделано:**
- `Dockerfile`, `.dockerignore`, `docker-compose.yml`.
- Миграции применены в Docker-БД.
- API проверен curl-ом.
- Volume — работает.

### День 12 — CI/CD (GitHub Actions)

**Изучено:**
- **GitHub Actions** — CI/CD прямо в GitHub.
- **`.github/workflows/*.yml`** — папка с workflows (с `s`!).
- **`on: push/pull_request`** — триггеры.
- **`jobs.<name>`** — задачи.
- **`runs-on: ubuntu-latest`** — среда.
- **`services.postgres`** — PostgreSQL как service container.
- **`working-directory`** — папка для команд.
- **`actions/checkout@v4`**, **`actions/setup-node@v4`** — готовые actions.
- **`cache: 'npm'`** — кэш зависимостей.
- **`env:`** — переменные окружения для шага.
- **Badge** в README — ссылка на статус workflow.
- **`git pull`** — синхронизация локального с удалённым.
- **`git filter-repo`** — перезапись email в истории.
- **`git remote add origin`** — связать локальный с GitHub.

**Сделано:**
- Репозиторий на GitHub — https://github.com/NumbWhileY/task-manager.
- **22** коммита **перезаписаны** через `git filter-repo` — email правильный.
- Первый push — 22 коммита на GitHub.
- `.github/workflows/test.yml` — CI workflow.
- Прогон тестов на каждый push в `main`.
- README с badge (создан через GitHub UI).
- Первый CI-прогон — **Success** за 41 секунду.

---

## Слабые места (что заметил за 12 дней)

Это **важнее** всего остального. На собесе спросят именно об этом.

1. **Опечатки в ключах.** `recived`, `tittle`, `createAt`, `d` вместо `id`, `task` вместо `tasks`, `passswor`.

2. **Забываешь `return`.** После `res.end()` / `res.json()`.

3. **Порядок проверок.** Валидация — всегда **первой**.

4. **Middleware без `next`.**

5. **Порядок middleware в `app.js`.**

6. **`app.use(logger())` вместо `app.use(logger)`.**

7. **JSON в curl.** Двойные кавычки снаружи → `\"` внутри.

8. **`errorHandler` не последним.**

9. **Хардкод статуса в errorHandler.**

10. **Мёртвый `next()` после `return`.**

11. **Забываешь `async`/`await` в роутах.**

12. **Возвращаешь `result`, а не `result.rows`.**

13. **`pool.connect()` вместо `pool.query()`.**

14. **Не перезапускаешь сервер после правок.**

15. **PowerShell пишет в Windows-1251.**

16. **Забываешь `;` в SQL.**

17. **`UPDATE`/`DELETE` без проверки id.**

18. **Путаешь `id` пользователей и задач.**

19. **Забываешь `module.exports` в новом модуле.**

20. **Путаешь `snake_case` и `camelCase`.**

21. **Переименование переменной — не везде.**

22. **Путаю версии библиотек.** `zod` 4 — `errors` → `issues`.

23. **`Object.keys()` не показывает геттеры.**

24. **Класс без `new`.**

25. **Обращение к свойству до проверки на undefined.**

26. **`throw` в `catch`.**

27. **Дублирую импорты.**

28. **Забываю импорты в новом файле.**

29. **Забываю `Ctrl+S`.**

30. **`setupFilesAfterEach`** не существует. **Правильно:** `setupFilesAfterEnv`.

31. **Тестовая база не создана** → `database does not exist`.

32. **Хардкод уровня логгера.**

33. **Неиспользуемые переменные** (`const reg = ...`).

34. **`.dockerfile` с точкой.** Docker не видит. **Правило:** `Dockerfile` — без точки.

35. **PowerShell `curl` — алиас на `Invoke-WebRequest`.** **Правило:** `curl.exe` в PowerShell, `curl` в cmd.

36. **`docker compose` из корня не находит файл.**

37. **`workflow` vs `workflows`.** Папка — `.github/workflows/` (с `s`). Опечатка → Actions не видит файл.

38. **README можно создать прямо на GitHub** — не обязательно локально.

---

## Что дальше (порядок изучения)

- [x] ~~HTTP + Node.js~~
- [x] ~~Express + структура~~
- [x] ~~CRUD + middleware~~
- [x] ~~PostgreSQL~~
- [x] ~~Миграции и связи~~
- [x] ~~Аутентификация (JWT)~~
- [x] ~~Валидация (zod)~~
- [x] ~~Кастомные ошибки~~
- [x] ~~Тесты (Jest + Supertest)~~
- [x] ~~Логирование (pino)~~
- [x] ~~Docker + docker-compose~~
- [x] ~~CI/CD (GitHub Actions)~~
- [ ] **Деплой на VPS + Nginx + HTTPS** — следующий шаг
- [ ] Sentry — отлов ошибок в проде
- [ ] gRPC
- [ ] GraphQL
- [ ] NoSQL (MongoDB) — обзорно
- [ ] WebSocket
- [ ] Redis (кэширование)
- [ ] Message Brokers (RabbitMQ, Kafka)
- [ ] Search Engines (Elasticsearch)
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
- pino: https://getpino.io
- Docker Docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose/
- GitHub Actions: https://docs.github.com/en/actions
- git-filter-repo: https://github.com/newren/git-filter-repo
- JWT decoder: https://jwt.io
- javascript.info: https://learn.javascript.ru
- Roadmap Backend: https://roadmap.sh/backend

---

## Как продолжить (для AI)

Если этот файл скидывают в новый чат — контекст такой:

- Пользователь учится на fullstack-разработчика, 12 дней опыта с Node.js/Express/PostgreSQL/JWT/zod/Jest/pino/Docker/GitHub Actions.
- Стек: Node.js, Express, PostgreSQL, JWT, bcrypt, zod, Jest + Supertest, pino, Docker + docker-compose, GitHub Actions. Миграции — ручные SQL-файлы. Кастомные ошибки. Тестовая база `task_manager_test`.
- Репозиторий на GitHub — `NumbWhileY/task-manager`. CI зелёный.
- Стиль обучения: **не писать код за него**. Говорить, что делать, давать подсказки, разбирать его код. Только направлять.
- Пользователь знает Python и JavaScript, имеет небольшой опыт работы (Node.js + React).
- Цель: найти работу как можно быстрее.
- Слабые места: **опечатки** (главная проблема), `return`, `async`/`await`, порядок middleware, `;` в SQL, `snake_case` vs `camelCase`, забывает `module.exports`, путает версии библиотек, забывает `new` перед классом, обращается к свойствам до проверки на `undefined`, забывает `Ctrl+S`, забывает импорты в новых файлах, хардкодит значения, `.dockerfile` с точкой, путает `curl` в PowerShell, опечатка `workflow`/`workflows`.

**Формат ответов:** структурированные, с разбором ошибок, без готового кода. Когда он ошибается — объяснять **почему**, а не просто «вот правильно».