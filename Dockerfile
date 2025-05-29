# Stage 1: Build the Angular application
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application in production mode
RUN npm run build

# Stage 2: Serve the application using nginx
FROM nginx:alpine

# Copy the built application from builder stage
COPY --from=builder /app/dist/hospital-app/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 