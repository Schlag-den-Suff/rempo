# ---- Builder Stage ----
FROM node:24-alpine AS builder
WORKDIR /build

COPY package*.json angular.json tsconfig*.json ./
RUN npm ci

COPY src ./src
RUN npm run build

# ---- Runtime Stage ----
FROM node:24-alpine AS runtime
WORKDIR /frontend

# Copy Angular build output
COPY --from=builder /build/dist/frontend/browser ./dist

RUN npm install -g serve

# Non-root user
RUN addgroup -g 1001 -S appuser && adduser -S appuser -u 1001 -G appuser
USER appuser

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
