# Job Tracker

A full-stack application for organizing job applications, interviews, follow-ups, and job-search progress.

Built as a portfolio project with a production-style monorepo, automated CI, container image publishing, and an AWS deployment workflow.

## Features

- **Dashboard:** application statistics, activity charts, recent applications, and upcoming interviews
- **Applications:** create, edit, search, filter, sort, and track jobs through their application lifecycle
- **Kanban board:** visualize applications by status
- **Interviews:** schedule and manage interviews, outcomes, and notes
- **Calendar:** review upcoming job-related actions
- **Analytics:** application trends, pipeline distribution, and funnel insights
- **Notifications:** reminders and notification preferences
- **Authentication:** registration, login, JWT-based authentication, and token refresh

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query, React Hook Form, Zod |
| Backend | NestJS 11, TypeScript, Prisma 7, BullMQ |
| Data | PostgreSQL 17 (Docker image), Redis 7 (Docker image) |
| Infrastructure | Docker Compose, Terraform, AWS EC2, AWS Systems Manager |
| Delivery | GitHub Actions, GitHub Container Registry (GHCR), Caddy with HTTPS |

## Architecture

```text
Browser
   |
   v
Caddy (HTTPS)
   |-- /api/* --> NestJS API --> PostgreSQL
   |                         \-> Redis / BullMQ
   +-- /* ------> Next.js
```

The application runs as separate frontend, backend, database, Redis, migration, and reverse-proxy services in Docker Compose. The PostgreSQL and Redis services use persistent volumes.

## Repository layout

```text
.github/workflows/ci.yml    # CI checks and GHCR publishing
apps/
  frontend/                 # Next.js web application
  backend/                  # NestJS API and Prisma schema
infra/
  docker/                   # Dockerfiles, Compose, Caddy, backup/deploy scripts
  terraform/                # AWS VPC, subnet, security groups, EC2 and IAM
  k8s/                      # Kubernetes manifests for learning/experimentation
```

## Quick start (Docker Compose)

Prerequisites: Docker with Compose support.

```bash
cd infra/docker
cp .env.example .env
```

Set secure, unique values for `POSTGRES_PASSWORD`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` in `.env` before starting services.

The base Compose configuration builds both applications from source. For local development on a fresh machine:

```bash
docker compose build backend frontend
docker compose up -d postgres redis
docker compose run --rm migrate
docker compose up -d backend frontend
```

Open `http://localhost:3000` for the frontend. The backend uses port `3001` and the API prefix `/api`.

For application-level development commands, see [Frontend README](apps/frontend/README.md) and [Backend README](apps/backend/README.md).

## CI and deployment

GitHub Actions runs frontend/backend checks and publishes versioned images to GHCR after successful checks on `main`.

The AWS deployment uses EC2 and AWS Systems Manager (SSM). Deployment is currently **manually triggered from an authorized machine**, not automatically triggered by every push.

The deployment Compose overlay, `infra/docker/compose.deploy.yaml`, uses published GHCR images tagged by the full Git commit SHA. `infra/docker/deploy.sh` validates Compose, checks persistent volumes, pulls images, backs up PostgreSQL, runs Prisma migrations, updates application containers, and performs basic HTTP checks.

Production-specific prerequisites include the server-side `.env`, the `DOMAIN` value, Caddy configuration, IAM/SSM access, and an existing EC2 instance. See [AWS infrastructure notes](infra/terraform/README.md).

**Important:** the deployment script does not implement automatic rollback. Backups should be tested and copied off the server. A `sslip.io` hostname based on the instance's public IP can change after the EC2 instance is stopped and restarted.

## Tests

```bash
cd apps/frontend
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

```bash
cd apps/backend
pnpm install --frozen-lockfile
pnpm run prisma:generate
pnpm test -- --runInBand
pnpm run build
```

## Security notes

- Do not commit `.env`, access keys, private SSH keys, database dumps, or Terraform state files.
- Treat the public demonstration as a project preview, not as a service with guaranteed uptime.
- PostgreSQL/Redis should remain internal to the Docker network; public traffic is routed through Caddy.
- Use `terraform plan` to review infrastructure changes before applying them.

## Documentation

- [Frontend](apps/frontend/README.md)
- [Backend](apps/backend/README.md)
- [Terraform / AWS infrastructure](infra/terraform/README.md)

## Project status

The application has been deployed to AWS EC2 using Docker Compose. CI, container publishing, and an SSM-initiated deployment script are implemented. Automated deployment authorization via GitHub OIDC and tested rollback remain future improvements.