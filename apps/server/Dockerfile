FROM node:22-alpine AS base


FROM base AS deps

WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN corepack enable pnpm && pnpm i --frozen-lockfile


FROM base AS builder

WORKDIR /app
RUN corepack enable pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm prisma:generate:local
RUN pnpm run build


FROM base AS runner
LABEL org.opencontainers.image.source=https://github.com/opensource-together/opensource-together

RUN apk add --no-cache postgresql-client curl bash
RUN npm install -g prisma

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/src/persistence/orm/prisma ./schema
COPY --chown=nestjs:nodejs docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

USER nestjs

EXPOSE 3000

ENV PORT=3000

WORKDIR /app/dist
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "main"]
