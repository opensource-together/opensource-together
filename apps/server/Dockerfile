# Base image
FROM node:20-alpine
RUN apk add --no-cache postgresql-client

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy application source
COPY . .

# RUN pnpm prisma generate --schema=src/infrastructures/orm/prisma/schema.prisma
# RUN pnpm prisma db push --schema=src/infrastructures/orm/prisma/schema.prisma
# Expose port
EXPOSE 4000

# Set environment to development
ENV NODE_ENV=development

# Command to run the app in development mode
COPY entrypoint.sh .
CMD ["sh", "./entrypoint.sh"]
