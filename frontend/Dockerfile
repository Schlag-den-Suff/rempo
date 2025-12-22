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
WORKDIR /frontend

# Copy Angular build output
COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 80

# Nginx default command still works
CMD ["nginx", "-g", "daemon off;"]
