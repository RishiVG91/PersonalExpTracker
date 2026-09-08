# Multi-stage Dockerfile for React + Vite frontend

# Stage 1: Build static distribution
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production Nginx web server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default html and copy build artifacts
RUN rm -rf ./*
COPY --from=build /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
