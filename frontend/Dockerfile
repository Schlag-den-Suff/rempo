
# ---- Builder Stage ----
FROM node:18-alpine AS builder
WORKDIR /build

# Copy package files and tsconfig first for caching
COPY frontend/package*.json ./
COPY frontend/tsconfig.json ./

# Install all dependencies (including dev for TypeScript)
RUN npm ci

# Copy source code and build
COPY app/src ./src
RUN npm run build

# ---- Runtime Stage ----
FROM node:18-alpine AS runtime
WORKDIR /frontend

# Copy package files
COPY frontend/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled code and node_modules from builder
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY app/views ./views

# Add non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs
RUN chown -R nodejs:nodejs /app

USER nodejs

# OCI Labels
LABEL org.opencontainers.image.title="Knowker-Frontend" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.description="Angular Frontend of the Knowker Application" \
      org.opencontainers.image.authors="Florian Rittich"

# Environment variables
ENV PORT=3000 \
    PARTICIPANT_ID=002 \
    PARTICIPANT_NAME="Florian Rittich" \
    TEAM_COLOR=blue \
    APP_INSTANCE=frontend-b \
    REDIS_HOST=localhost \
    REDIS_PORT=6379

EXPOSE 3000
CMD ["node", "dist/server.js"]
