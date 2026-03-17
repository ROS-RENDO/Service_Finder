# Multi-stage build for Service-Finder Backend
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Build stage
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Runtime stage
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=5000

# Copy Dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy Prisma client and schema
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy application code
COPY src ./src
COPY server.js .
COPY prisma ./prisma

# Create upload directories
RUN mkdir -p uploads logs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "server.js"]
