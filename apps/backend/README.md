# Job Tracker — Backend

NestJS REST API for application tracking, interviews, analytics, notifications, and user authentication.

[Back to main README](../../README.md)

## Stack

- NestJS 11, TypeScript
- Prisma 7 and PostgreSQL
- Redis / ioredis
- BullMQ for notification-related background jobs
- JWT, Passport, bcrypt
- class-validator and class-transformer
- Jest tests

## Modules

```text
src/
  config/               # Environment validation and application settings
  common/               # Guards/decorators/utilities/validation helpers
  modules/
    auth/               # Registration, login, refresh and logout
    users/              # User data
    jobs/               # Job applications and companies
    interviews/         # Interview records
    analytics/          # Dashboard and pipeline analytics
    notification/       # Notifications and preferences
    prisma/             # Database integration
    redis/              # Redis integration
prisma/
  schema.prisma         # Data model
  migrations/           # Versioned SQL migrations
```

## API

The API listens on port `3001` by default and uses `/api` as a global prefix.

Representative endpoints:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh tokens |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| GET, POST | `/api/jobs` | List/create applications |
| GET, PATCH, DELETE | `/api/jobs/:id` | Read/update/delete an application |
| GET, POST | `/api/interviews` | List/create interviews |
| GET, PATCH, DELETE | `/api/interviews/:id` | Read/update/delete an interview |

Analytics, notifications, and notification preferences have their own controllers under `src/modules/`.

Most application data endpoints require authentication. For example, an unauthenticated `GET /api/jobs` returns HTTP `401`.

## Local setup

Prerequisites: Node.js, pnpm, PostgreSQL and Redis.

```bash
cd apps/backend
pnpm install --frozen-lockfile
```

Create a local `.env` file under `apps/backend` with development values (do not commit it):

```dotenv
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/job_tracker?schema=public
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=REPLACE_WITH_LONG_RANDOM_SECRET
JWT_REFRESH_SECRET=REPLACE_WITH_ANOTHER_LONG_RANDOM_SECRET
CORS_ORIGIN=http://localhost:3000
NOTIFICATION_QUEUE_ENABLED=false
```

Adjust ports and credentials to match your local PostgreSQL/Redis setup.

```bash
pnpm run prisma:generate
pnpm run prisma:migrate
pnpm run start:dev
```

The Prisma migrate command above is for development. Production deployment uses `prisma migrate deploy`.

## Commands

| Command | Purpose |
|---|---|
| `pnpm run start:dev` | Watch-mode NestJS server |
| `pnpm run build` | Compile backend |
| `pnpm run start:prod` | Run compiled server |
| `pnpm run prisma:generate` | Generate Prisma client |
| `pnpm run prisma:migrate` | Apply development migrations |
| `pnpm test -- --runInBand` | Run Jest tests serially |
| `pnpm run test:cov` | Coverage |
| `pnpm run test:e2e` | E2E test command |

The backend's `lint` script includes `--fix`, so it can modify source files.

## Data and security

The Prisma schema models users, companies, job applications, interviews, notes, job activity, notifications, and notification preferences. Jobs and interviews are associated with users.

Access/refresh JWT flows are implemented in the auth module. CORS is configured through `CORS_ORIGIN`, and the global validation pipe rejects unexpected DTO properties.

The application can enable BullMQ notification processing with `NOTIFICATION_QUEUE_ENABLED=true`, using Redis.

## Deployment

The backend image is published as:

`ghcr.io/andrew1929/job-tracker-backend:<git-sha>`

Production Docker Compose supplies database/Redis URLs and secrets through environment variables. The `migrate` service applies production Prisma migrations before the backend starts. Persistent PostgreSQL and Redis data are managed through Docker volumes.

Never commit passwords, JWT secrets, `.env` files, database backups, or Terraform state.