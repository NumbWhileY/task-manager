# Task Manager — Project Notes

> Контекст для продолжения работы. Стек: Node.js, Express, TypeScript, PostgreSQL, JWT, zod, Jest, pino, Docker, GitHub Actions, Next.js.
> Цель: fullstack-разработчик, поиск работы.

---

## Что это за проект

`task-manager` — Fullstack-приложение для управления задачами. Учебный проект, который эволюционирует:
PostgreSQL → аутентификация → валидация → кастомные ошибки → тесты → логирование → Docker → CI/CD → TypeScript → фронтенд на Next.js → WebSocket → Redis → деплой.

**Текущий статус:** день 14 завершён (19.10.2026). CRUD работает на PostgreSQL,
аутентификация через JWT, роуты защищены, задачи привязаны к пользователям,
валидация через `zod`, кастомные ошибки, **18 тестов** (unit + integration),
структурное логирование через `pino`, **Docker + docker-compose**, **CI/CD через GitHub Actions**,
**весь бэкенд на TypeScript**, **фронтенд на Next.js 16** (логин, регистрация, CRUD задач).
Проект — **на GitHub** с зелёным badge.
Следующий шаг — WebSocket (real-time).

---

## Структура проекта

```
JavaScript Intensive/
├── .github/
│   └── workflows/
│       └── test.yml            ← CI: typecheck + тесты
├── notes.md                    ← этот файл
├── README.md                   ← с badge CI
├── Day 1/
│   └── taskManager/
│       └── server.js           ← голый Node.js сервер (для сравнения)
└── Day 2/                      ← основной проект (бэкенд)
    ├── migrations/             ← SQL-миграции
    │   ├── 001_create_tasks.sql
    │   ├── 002_create_users.sql
    │   ├── 003_add_user_id_to_tasks.sql
    │   └── 004_add_description_to_tasks.sql
    ├── src/
    │   ├── app.ts              ← сборка Express
    │   ├── server.ts           ← запуск: app.listen(3001)
    │   ├── lib/
    │   │   └── logger.ts       ← pino-логгер
    │   ├── data/
    │   │   ├── db.ts           ← пул соединений
    │   │   ├── users.ts        ← работа с users
    │   │   └── tasks.ts        ← CRUD на SQL (с description)
    │   ├── errors/             ← AppError, NotFound, Validation, etc.
    │   ├── schemas/            ← zod-схемы (auth, task)
    │   ├── routes/             ← auth.ts, tasks.ts
    │   └── middlewares/        ← logger, notFound, auth, validate, errorHandler
    ├── tests/                  ← 18 тестов (Jest + Supertest)
    ├── frontend/               ← Next.js 16 (TypeScript, Tailwind 4)
    │   ├── src/
    │   │   ├── app/
    │   │   │   ├── login/page.tsx
    │   │   │   ├── register/page.tsx
    │   │   │   ├── page.tsx    ← список задач + форма создания + удаление
    │   │   │   ├── layout.tsx
    │   │   │   └── globals.css
    │   │   └── lib/
    │   │       └── api.ts      ← API-клиент (fetch)
    │   ├── next.config.ts      ← rewrites на localhost:3001
    │   ├── postcss.config.mjs  ← Tailwind 4
    │   └── package.json
    ├── tsconfig.json
    ├── .swcrc
    ├── jest.config.js
    ├── Dockerfile
    ├── docker-compose.yml
    └── .env
```

**Git:** репозиторий на GitHub — https://github.com/NumbWhileY/task-manager.
Тридцать коммитов (включая `Day 14`).
**Email в Git — исправлен через `git filter-repo`:** `podzorovvvivan@gmail.com`.

---

## Окружение

- **PostgreSQL 15.19** — `task_manager` (разработка), `task_manager_test` (тесты).
- **Docker Desktop** (WSL 2), Docker 29.8.2, Compose 5.5.1.
- **Node.js 20**, TypeScript 7.0.2, Next.js 16.4.2.
- **GitHub Actions** — CI зелёный.

**Зависимости (prod):** express, pg, dotenv, bcrypt, jsonwebtoken, zod, pino, pino-pretty.
**Dev-зависимости:** jest, supertest, typescript, tsx, @types/*, @swc/jest, @swc/core.
**Frontend:** next, react, react-dom, tailwindcss, @tailwindcss/postcss.

**Скрипты (бэкенд):**
```bash
npm test           # jest --runInBand
npm run typecheck  # tsc --noEmit
npm run dev        # tsx watch src/server.ts
```

**Скрипты (фронтенд):**
```bash
npm run dev        # next dev (без Turbopack)
```

**Docker-команды:**
```bash
docker compose up -d
docker compose ps
docker compose down
```

---

## Что сделано по дням

### День 1 — HTTP + голый Node.js

**Изучено:**
- Структура HTTP-запроса и ответа.
- Методы, статусы, заголовки.
- HTTP без состояния.

**Сделано:**
- `Day 1/taskManager/server.js` — HTTP-сервер без фреймворков.
- Роутинг через `if (req.url === '/' && req.method === 'GET')`.
- Тело POST через `req.on('data')` / `req.on('end')`.

### День 2 — Express + структура

**Изучено:**
- Middleware — `(req, res, next)`.
- Порядок middleware **критичен**.
- `express.json()`, `express.Router()`.
- Middleware передаётся **без скобок**.

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

### День 13 — TypeScript

**Изучено:**
- **TypeScript** — JavaScript + типы.
- **`tsconfig.json`** — `target`, `module`, `strict`, `outDir`, `rootDir`.
- **TS 7**: `moduleResolution: "node"` → `"node16"`. `module` тоже `node16`.
- **`@types/*`** — типы для Express, pg, bcrypt, jsonwebtoken.
- **`tsx`** — запуск TS без компиляции.
- **`ts-jest`** — несовместим с TS 7. Заменили на **`@swc/jest`**.
- **`.swcrc`** — конфиг SWC.
- **`interface`**, **`Promise<T>`**, **`z.infer<typeof schema>`**.
- **`strict: true`** — ошибка при `any` без явного указания.
- **`req: any, res: any`** — временно, пока типы Express 5 сломаны.

**Сделано:**
- `tsconfig.json`, `@swc/jest`, `.swcrc`.
- Все файлы в `src/` — `.ts`.
- `interface Task`, `interface User`.
- `z.infer` — типы из схем.
- CI — `typecheck` добавлен в workflow.
- Dockerfile — двухэтапная сборка.
- 18 тестов — зелёные.
- CI — зелёный.

### День 14 — Frontend (Next.js)

**Изучено:**
- **Next.js 16** — App Router, TypeScript, Tailwind 4.
- **Turbopack** — баг с Tailwind 4 (классы `flex` игнорируются). **Решение:** отключить (`"dev": "next dev"`).
- **`postcss.config.mjs`** + `@tailwindcss/postcss` — обязательны для Tailwind 4.
- **`next.config.ts`** — `rewrites` для прокси на `localhost:3001` (обход CORS).
- **`'use client'`** — клиентские компоненты (хуки, события).
- **`useRouter`** — редиректы.
- **`localStorage`** — хранение JWT.
- **`type` import** — `import { type Task }` для типов.

**Сделано:**
- `frontend/` — Next.js проект.
- `lib/api.ts` — API-клиент.
- `app/login/page.tsx` — логин.
- `app/register/page.tsx` — регистрация.
- `app/page.tsx` — список задач (CRUD).
- Бэкенд: миграция `004`, `description` в схеме, `data/tasks.ts`, роуты.
- 18 тестов — зелёные.
- CI — зелёный.

---

## Слабые места (что заметил за 14 дней)

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
37. **`workflow` vs `workflows`.** Папка — `.github/workflows/` (с `s`).
38. **README можно создать прямо на GitHub** — не обязательно локально.
39. **TS 7 — breaking changes.** `moduleResolution: "node"` удалён.
40. **`ts-jest` + TS 7** — несовместимо. **Правило:** использовать `@swc/jest`.
41. **`export default` vs `module.exports`** — не смешивать в CommonJS-проекте.
42. **Типы Express 5 сломаны.** `res.status` — `number`. **Правило:** `any` временно.
43. **`import` без расширения.** **Правило:** без `.js` в импортах своих модулей.
44. **`git commit` без `-m`** — ошибка `pathspec`.
45. **TS `strict: true`** — ошибка при `any` без явного указания.
46. **Next.js 16 + Turbopack** — баг с Tailwind 4. **Правило:** отключить Turbopack.
47. **`@tailwindcss/postcss`** — не установился автоматом. **Правило:** проверить `postcss.config.mjs`.
48. **`type` import в Next.js** — `import { type Task }`. **Правило:** типы — с `type`.

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
- [x] ~~TypeScript~~
- [x] ~~Frontend (Next.js)~~
- [ ] **WebSocket** — real-time (следующий шаг)
- [ ] **Redis** — кэширование
- [ ] Message Brokers (RabbitMQ, Kafka)
- [ ] Search Engines (Elasticsearch)
- [ ] Sentry — отлов ошибок в проде
- [ ] gRPC
- [ ] GraphQL
- [ ] NoSQL (MongoDB)
- [ ] Архитектура: слои, паттерны, микросервисы
- [ ] Масштабирование (LB, репликация, шардинг)
- [ ] **Деплой на VPS + Nginx + HTTPS** — финал

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
- TypeScript: https://www.typescriptlang.org/docs
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- SWC: https://swc.rs
- JWT decoder: https://jwt.io
- javascript.info: https://learn.javascript.ru
- Roadmap Backend: https://roadmap.sh/backend

---

## Как продолжить (для AI)

Если этот файл скидывают в новый чат — контекст такой:

- Пользователь учится на fullstack-разработчика, 14 дней опыта с Node.js/Express/TypeScript/PostgreSQL/JWT/zod/Jest/pino/Docker/GitHub Actions/Next.js.
- Стек: Node.js, Express, TypeScript, PostgreSQL, JWT, bcrypt, zod, Jest + Supertest, pino, Docker + docker-compose, GitHub Actions, Next.js 16 (App Router, Tailwind 4).
- Репозиторий на GitHub — `NumbWhileY/task-manager`. CI зелёный.
- **Порядок изучения:** WebSocket → Redis → ... → деплой в самом конце.
- Стиль обучения: **не писать код за него**. Говорить, что делать, давать подсказки, разбирать его код. Только направлять.
- Пользователь знает Python и JavaScript, имеет небольшой опыт работы (Node.js + React).
- Цель: найти работу как можно быстрее.
- Слабые места: **опечатки**, `return`, `async`/`await`, порядок middleware, `;` в SQL, `snake_case` vs `camelCase`, забывает `module.exports`, путает версии библиотек, забывает `new` перед классом, обращается к свойствам до проверки на `undefined`, забывает `Ctrl+S`, забывает импорты, хардкодит значения, `.dockerfile` с точкой, путает `curl` в PowerShell, опечатка `workflow`/`workflows`, TS 7 breaking changes, `ts-jest` несовместим с TS 7, `export default` vs `module.exports`, типы Express 5 сломаны, Turbopack + Tailwind 4, `type` import.

**Формат ответов:** структурированные, с разбором ошибок, без готового кода. Когда он ошибается — объяснять **почему**, а не просто «вот правильно».