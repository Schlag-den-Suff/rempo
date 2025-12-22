# ---- Builder Stage ----
FROM node:24-alpine AS builder
WORKDIR /build

# Copy Angular workspace files
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy full source tree
COPY src ./src

# Build Angular app
RUN npm run build

# ---- Runtime Stage ----
FROM node:24-alpine AS runtime
WORKDIR /frontend

# Copy build output only
COPY --from=builder /build/dist ./dist

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
