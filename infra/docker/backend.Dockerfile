FROM node:22-bookworm-slim AS builder

WORKDIR /app

RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run prisma:generate

RUN pnpm run build


FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3001

CMD ["pnpm", "run", "start:prod"]