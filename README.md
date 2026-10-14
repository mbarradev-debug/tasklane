# Tasklane

A small task manager built with a microservices architecture: a Next.js frontend, two NestJS services and one PostgreSQL database per service, all orchestrated with Docker Compose.

Tasklane is a learning project. It is being built in seven days to understand how microservices are designed, containerized, connected and debugged, keeping the scope small enough to understand every piece.

> **Status: work in progress (day 1 of 7).** Only `tasks-service` exists so far, running locally with in-memory storage. Docker, PostgreSQL, `auth-service` and the web app are added in the next days. See [Roadmap](#roadmap).

## Planned features

- Sign up and log in with email and password (JWT based).
- Create, edit, complete and delete your own tasks.
- Assign a task to another user by email.
- Every user sees the tasks they own and the tasks assigned to them.

## Architecture at a glance

| Component | Technology | Responsibility | Port | Status |
|---|---|---|---|---|
| `web` | Next.js | UI and backend-for-frontend (the only public entry point) | 3000 | Planned |
| `auth-service` | NestJS | Users, password hashing, JWT issuing, user lookup | 3001 | Planned |
| `tasks-service` | NestJS | Task CRUD, ownership and assignment | 3002 | In progress |
| `auth-db` | PostgreSQL | Data owned by `auth-service` only | 5432 (internal) | Planned |
| `tasks-db` | PostgreSQL | Data owned by `tasks-service` only | 5432 (internal) | Planned |

See [ARCHITECTURE.md](ARCHITECTURE.md) for the target design, the request flows and the reasoning behind each decision.

## Tech stack

Next.js, NestJS, TypeScript, TypeORM, PostgreSQL, Docker, Docker Compose, Jest and Supertest.

## Running it today

Requirements: Node.js 20 or later and Git.

```bash
git clone https://github.com/mbarradev-debug/tasklane.git
cd tasklane/services/tasks-service
npm install
npm run start:dev
```

The service listens on http://localhost:3002 (override it with the `PORT` environment variable). Data is kept in memory, so it is lost on every restart.

### Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/tasks` | List all tasks |
| GET | `/tasks/:id` | Get one task (400 if the id is not a UUID, 404 if it does not exist) |
| POST | `/tasks` | Create a task (`title` required, `description` optional) |
| PATCH | `/tasks/:id` | Edit the title and/or description |
| PATCH | `/tasks/:id/complete` | Mark a task as completed (idempotent) |
| DELETE | `/tasks/:id` | Delete a task (204) |

Request bodies are validated: unknown properties and an empty `title` return 400.

```bash
curl -X POST http://localhost:3002/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Write the Dockerfile","description":"Day 2"}'
```

## Project structure

```text
tasklane/
├── services/
│   └── tasks-service/       # NestJS tasks service
├── ARCHITECTURE.md
└── README.md
```

`apps/web` (Next.js) and `services/auth-service` will be added in later days.

## Roadmap

- [x] Day 1: `tasks-service` with NestJS, in-memory CRUD, validation and health check
- [ ] Day 2: Dockerfile for `tasks-service`
- [ ] Day 3: PostgreSQL with TypeORM and Docker Compose
- [ ] Day 4: `auth-service` with registration, login and JWT
- [ ] Day 5: Service-to-service communication, JWT guard, timeouts
- [ ] Day 6: Next.js frontend as a backend-for-frontend
- [ ] Day 7: Unit and e2e tests, debugging and a reproducible environment

## Out of scope (possible next steps)

API gateway, asynchronous messaging (RabbitMQ) and a notifications service, refresh tokens, CI/CD, cloud deployment and Kubernetes.
