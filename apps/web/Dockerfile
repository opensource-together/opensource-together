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
