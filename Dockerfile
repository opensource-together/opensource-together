FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN corepack enable pnpm
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN pnpm i --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
RUN corepack enable pnpm
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for Next.js environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_METADATA_ASSETS_S3_BUCKET

RUN pnpm run build;

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN apk add --no-cache curl

LABEL org.opencontainers.image.source=https://github.com/opensource-together/opensource-together

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
