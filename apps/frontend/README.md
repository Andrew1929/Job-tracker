# Job Tracker — Frontend

Next.js client for the Job Tracker application.

[Back to main README](../../README.md)

## Stack

- Next.js 16 with App Router
- React 19 and TypeScript
- Tailwind CSS 4 and reusable UI components
- TanStack Query for remote server state
- React Hook Form and Zod for forms and validation
- Lucide icons

## Main screens

| Screen | Purpose |
|---|---|
| Dashboard | Job-search summary, charts and upcoming interviews |
| Jobs | Application listing, filters, and editing |
| Kanban | Status-based application board |
| Calendar | Upcoming job actions |
| Interviews | Interview management |
| Analytics | Application trends and funnel |
| Notifications | Reminders and unread state |
| Settings / Profile | User-level settings |
| Login / Register | Authentication |

## Structure

```text
src/
  app/           # App Router routes and layouts
  components/    # Reusable UI and feature components
  constants/     # Routes, names, and application constants
  contexts/      # React contexts
  hooks/         # UI and remote-data hooks
  lib/           # Shared helpers and API/auth infrastructure
  services/      # API-facing service functions
  types/         # Shared TypeScript types
```

## Development

Requires Node.js and npm, plus a running backend on port `3001`.

```bash
cd apps/frontend
npm ci
npm run dev
```

Open http://localhost:3000.

Create `apps/frontend/.env.local` when an explicit backend URL is required:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
```

If unset, the API client defaults to `http://localhost:3001`. On AWS, the frontend is built with an empty `NEXT_PUBLIC_API_URL`, so requests use the Caddy-served same-origin `/api` path.

## Authentication and API

The shared API client in `src/lib/api/api-client.ts`:

- sends bearer tokens when available
- handles API errors consistently
- attempts one session refresh after a non-auth API request returns `401`
- supports request cancellation via `AbortSignal`

Auth paths are defined in `src/constants/auth.constants.ts`.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Production Next.js build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Node test runner with alias hook |

## Deployment

The production Dockerfile is `infra/docker/frontend.Dockerfile`. CI publishes the frontend image to:

`ghcr.io/andrew1929/job-tracker-frontend:<git-sha>`

Caddy handles browser HTTPS traffic and proxies `/api/*` to the backend. For deployment details, consult the repository root README and `infra/docker/compose.deploy.yaml`.

