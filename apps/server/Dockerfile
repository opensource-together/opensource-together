FROM node:22-alpine AS base


FROM base AS deps

WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN corepack enable pnpm && pnpm i --frozen-lockfile


FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && \
    pnpm prisma generate --schema=src/infrastructures/orm/prisma/schema.prisma && \
    pnpm run build


FROM base AS runner

WORKDIR /app

LABEL org.opencontainers.image.source=https://github.com/opensource-together/opensource-together

RUN apk add --no-cache postgresql-client curl

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/src/infrastructures/orm/prisma ./schema

USER nestjs

EXPOSE 3000

ENV PORT=3000

WORKDIR /app/dist
CMD ["node", "main"]
