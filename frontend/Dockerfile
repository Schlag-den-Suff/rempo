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

# Copy Angular build output to Nginx
COPY --from=builder /build/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Nginx runs as root by default in the container
CMD ["nginx", "-g", "daemon off;"]