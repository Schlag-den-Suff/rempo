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
FROM nginx:alpine AS runtime

# Create non-root user
RUN addgroup -g 1001 -S appuser && adduser -S appuser -u 1001 -G appuser

# Give write permissions to Nginx directories
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx \
    && chown -R appuser:appuser /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

USER appuser

# Copy build
COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
