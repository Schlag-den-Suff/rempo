# ---- Builder Stage ----
FROM node:24-alpine AS builder
WORKDIR /build

# Copy Angular workspace files
COPY package*.json angular.json tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build Angular app
RUN npm run build

# ---- Runtime Stage ----
FROM node:24-alpine AS runtime
WORKDIR /frontend

# Copy Angular build output
COPY --from=builder /build/dist/frontend ./dist

RUN npm install -g serve

# Non-root user
RUN addgroup -g 1001 -S appuser && adduser -S appuser -u 1001 -G appuser
USER appuser

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
