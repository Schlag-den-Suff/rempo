# ---- Builder Stage ----
FROM node:18-alpine AS builder
WORKDIR /build

# Copy package files first for caching
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code and build
COPY src ./src
RUN npm run build

# ---- Runtime Stage ----
FROM node:18-alpine AS runtime
WORKDIR /frontend

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy compiled output from builder
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules

# Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs
RUN chown -R nodejs:nodejs /frontend

USER nodejs

# OCI labels
LABEL org.opencontainers.image.title="Knowker-Frontend" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.description="Frontend of the Knowker Application" \
      org.opencontainers.image.authors="Florian Rittich"

# Environment variables
ENV PORT=3000 \
    PARTICIPANT_ID=002 \
    PARTICIPANT_NAME="Florian Rittich" \
    TEAM_COLOR=blue \
    APP_INSTANCE=frontend-b \
    REDIS_HOST=redis-master \
    REDIS_PORT=6379

EXPOSE 3000
CMD ["node", "dist/server.js"]
