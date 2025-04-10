# OpenSource Together - Development Environment Documentation

## Architecture Overview

The application consists of 5 main services:

1. **Business Database** (PostgreSQL)
   - Port: 5433
   - Purpose: Main application database
   - Container: apps-business_db-1

2. **SuperTokens Database** (PostgreSQL)
   - Port: 5432
   - Purpose: Authentication data storage
   - Container: apps-db-1

3. **SuperTokens Core**
   - Port: 3567
   - Purpose: Authentication service
   - Container: apps-supertokens-1

4. **Backend (NestJS)**
   - Port: 4000
   - Purpose: API server
   - Container: apps-backend-1

5. **Frontend (Next.js)**
   - Port: 3000
   - Purpose: Web application
   - Container: apps-frontend-1

## Service Dependencies

```mermaid
graph TD
    Frontend --> Backend
    Backend --> BusinessDB
    Backend --> SuperTokens
    SuperTokens --> SuperTokensDB
```

## Key Improvements Made

1. **Port Conflict Resolution**
   - Issue: Frontend was trying to use port 4000 which conflicted with the backend
   - Solution: Explicitly set Next.js port to 3000 in Dockerfile and command
   ```dockerfile
   ENV PORT=3000
   CMD ["pnpm", "dev", "--port", "3000"]
   ```

2. **Database Connections**
   - Proper separation of business and auth databases
   - Explicit port mappings to avoid conflicts
   - Health checks to ensure database availability

3. **Service Dependencies**
   - Added proper `depends_on` conditions with health checks
   - Ensures services start in the correct order

## Running the Application

1. **Initial Setup**
```bash
# Clone the repository
git clone <repository-url>
cd opensource-together/apps

# Ensure .env file exists with proper configuration
cp .env.example .env
```

2. **Starting the Application**
```bash
# Build and start all services
docker compose up --build

# Or start in detached mode
docker compose up -d --build
```

3. **Stopping the Application**
```bash
# Stop all services
docker compose down

# Stop and remove volumes (clean start)
docker compose down -v
```

## Database Access

### Business Database (Main Application)
```bash
# Using docker exec
docker exec -it apps-business_db-1 psql -U postgres -d app_database

# Using local psql client
psql -h localhost -p 5433 -U postgres -d app_database
```

### SuperTokens Database (Authentication)
```bash
# Using docker exec
docker exec -it apps-db-1 psql -U postgres -d opensource_together

# Using local psql client
psql -h localhost -p 5432 -U postgres -d opensource_together
```

## Service URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- SuperTokens Core: http://localhost:3567

## Environment Variables

Key environment variables in `.env`:

```env
# Business Database Configuration
BUSINESS_DB_HOST=business_db
BUSINESS_DB_PORT=5432
BUSINESS_DB_USER=postgres
BUSINESS_DB_PASSWORD=postgres
BUSINESS_DB_NAME=app_database

# Database URL for Prisma
DATABASE_URL=postgresql://${BUSINESS_DB_USER}:${BUSINESS_DB_PASSWORD}@${BUSINESS_DB_HOST}:${BUSINESS_DB_PORT}/${BUSINESS_DB_NAME}?schema=public

# API Configuration
PORT=4000
```

## Important Considerations

1. **Database Initialization**
   - Both databases are initialized on first startup
   - Prisma migrations run automatically via entrypoint script
   - Data persists in Docker volumes between restarts

2. **Development Mode**
   - Hot reload enabled for both frontend and backend
   - Source code mounted as volumes for live updates
   - Node modules isolated in separate volumes

3. **Network Configuration**
   - All services in same Docker network (app_network)
   - Inter-service communication uses container names as hostnames
   - External access through mapped ports

4. **Health Checks**
   - Database services have health checks
   - SuperTokens core has health check
   - Services wait for dependencies to be healthy

## Troubleshooting

1. **Port Conflicts**
   ```bash
   # Check if ports are already in use
   lsof -i :3000
   lsof -i :4000
   lsof -i :5432
   lsof -i :5433
   ```

2. **Container Logs**
   ```bash
   # View logs for specific service
   docker compose logs frontend
   docker compose logs backend
   docker compose logs business_db
   
   # Follow logs in real-time
   docker compose logs -f
   ```

3. **Database Connection Issues**
   ```bash
   # Check database status
   docker compose ps
   
   # Verify database is accepting connections
   docker exec apps-business_db-1 pg_isready
   docker exec apps-db-1 pg_isready
   ```

## Common Operations

1. **Rebuilding Single Service**
   ```bash
   docker compose up -d --build frontend
   docker compose up -d --build backend
   ```

2. **Restarting Services**
   ```bash
   docker compose restart frontend
   docker compose restart backend
   ```

3. **Viewing Logs**
   ```bash
   # All logs
   docker compose logs

   # Specific service logs
   docker compose logs frontend
   docker compose logs backend
   ```

## Remaining Considerations

1. **Production Setup**
   - Current setup is for development only
   - Production would need:
     - Proper SSL/TLS configuration
     - Environment-specific configurations
     - Production-ready Docker images

2. **Backup Strategy**
   - Currently no automated backup solution
   - Consider implementing backup strategy for databases

3. **Monitoring**
   - No monitoring solution in place
   - Consider adding health check endpoints
   - Consider adding logging aggregation

I'll add detailed explanations for each Dockerfile and the docker-compose.yml configuration.

# Docker Configuration Details

## Backend Dockerfile (apps/server/Dockerfile)

```dockerfile
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

# Make entrypoint script executable
RUN chmod +x ./entrypoint.sh

# Expose port
EXPOSE 4000

# Set environment to development
ENV NODE_ENV=development

# Command to run the app in development mode
CMD ["sh", "./entrypoint.sh"]
```

### Backend Dockerfile Explanation

1. **Base Image & Tools**
   - Uses `node:20-alpine` for a lightweight Node.js environment
   - Installs `postgresql-client` for database CLI tools and health checks
   - Alpine-based image reduces container size significantly

2. **Package Management**
   - Uses `pnpm` for faster, more efficient package management
   - `--no-frozen-lockfile` allows for dependency updates in development

3. **Working Directory**
   - Sets `/usr/src/app` as working directory
   - Standard practice for Node.js applications in containers

4. **File Copying Strategy**
   - Copies package files first to leverage Docker layer caching
   - Full source code copied after dependency installation
   - Optimizes rebuild times during development

5. **Entrypoint Configuration**
   - Makes `entrypoint.sh` executable
   - Script handles:
     - Database connection checks
     - Prisma migrations
     - Application startup

## Frontend Dockerfile (apps/web/Dockerfile)

```dockerfile
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy application source
COPY . .

# Set the port explicitly
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev", "--port", "3000"]
```

### Frontend Dockerfile Explanation

1. **Base Configuration**
   - Uses same `node:20-alpine` base for consistency
   - Sets up `pnpm` for package management

2. **Working Directory**
   - Uses `/app` as working directory
   - Simpler structure as no database tools needed

3. **Port Configuration**
   - Explicitly sets and exposes port 3000
   - Prevents port conflicts with backend
   - Uses Next.js port flag for guaranteed port binding

4. **Development Mode**
   - Runs Next.js in development mode with hot reloading
   - Direct command execution without intermediate script

## Docker Compose Configuration (apps/docker-compose.yml)

```yaml
services:
  business_db:
    image: postgres:16
    env_file:
      - .env
    environment:
      - POSTGRES_USER=${BUSINESS_DB_USER}
      - POSTGRES_PASSWORD=${BUSINESS_DB_PASSWORD}
      - POSTGRES_DB=${BUSINESS_DB_NAME}
    ports:
      - "5433:5432"
    volumes:
      - business_db_data:/var/lib/postgresql/data
      - ./server/init-scripts:/docker-entrypoint-initdb.d
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'pg_isready', '-U', '${BUSINESS_DB_USER}', '-d', '${BUSINESS_DB_NAME}']
      interval: 5s
      timeout: 5s
      retries: 5

  db:
    image: postgres:16
    env_file:
      - .env
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}

  supertokens:
    image: registry.supertokens.io/supertokens/supertokens-postgresql:10.1.0
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3567:3567"
    env_file:
      - .env
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: >
        bash -c 'exec 3<>/dev/tcp/127.0.0.1/3567 && echo -e "GET /hello HTTP/1.1\r\nhost: 127.0.0.1:3567\r\nConnection: close\r\n\r\n" >&3 && cat <&3 | grep "Hello"'
      interval: 10s
      timeout: 5s
      retries: 5
    environment:
      - POSTGRESQL_CONNECTION_URI=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    env_file:
      - .env
    ports:
      - "${PORT}:${PORT}"
    volumes:
      - ./server:/usr/src/app
      - /usr/src/app/node_modules
    environment:
      - DATABASE_URL=postgresql://${BUSINESS_DB_USER}:${BUSINESS_DB_PASSWORD}@business_db:5432/${BUSINESS_DB_NAME}?schema=public
      - SUPERTOKENS_HOST=supertokens
      - SUPERTOKENS_PORT=3567
    networks:
      - app_network
    depends_on:
      business_db:
        condition: service_healthy
      supertokens:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build:
      context: ./web
      dockerfile: Dockerfile
    env_file:
      - .env
    ports:
      - "3000:3000"
    volumes:
      - ./web:/app
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000
    networks:
      - app_network
    depends_on:
      - backend

volumes:
  business_db_data:
  db_data:

networks:
  app_network:
    driver: bridge
```

### Docker Compose Configuration Explanation

1. **Database Services**
   
   a. **Business Database (business_db)**
   - PostgreSQL 16 for application data
   - Custom port (5433) to avoid conflicts
   - Volume for data persistence
   - Init scripts support
   - Health check configuration
   - Environment variables from .env file

   b. **SuperTokens Database (db)**
   - PostgreSQL 16 for authentication data
   - Standard port (5432)
   - Separate volume for data isolation
   - Health check configuration
   - Direct environment variable injection

2. **Authentication Service (supertokens)**
   - Official SuperTokens image
   - Depends on its database being healthy
   - Custom health check using TCP connection
   - Environment configuration for database connection
   - Exposed on port 3567

3. **Backend Service**
   - Custom build using local Dockerfile
   - Volume mounts for hot reloading
   - Node modules in anonymous volume
   - Environment variables for both databases
   - Depends on both databases and SuperTokens
   - Health check dependencies

4. **Frontend Service**
   - Custom build using local Dockerfile
   - Volume mounts for hot reloading
   - Node modules in anonymous volume
   - API URL configuration
   - Depends on backend service

5. **Networking**
   - Custom bridge network (app_network)
   - Internal service discovery
   - Isolated network space

6. **Volumes**
   - Named volumes for databases
   - Anonymous volumes for node_modules
   - Source code mounting for development

7. **Health Checks**
   - Database health checks using pg_isready
   - SuperTokens health check using HTTP request
   - Ensures proper service startup order

8. **Environment Configuration**
   - Consistent use of .env file
   - Service-specific environment variables
   - Variable substitution in configuration

This configuration provides:
- Development-friendly environment
- Data persistence
- Service isolation
- Proper startup ordering
- Hot reloading
- Easy database access
- Secure authentication setup

The setup is optimized for development while maintaining proper separation of concerns and following Docker best practices.


Let me know if you need any clarification or have questions about specific aspects of the setup!