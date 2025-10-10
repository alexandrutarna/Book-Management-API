# Multi-stage build for optimized image size

# stage 1: Build stage
FROM node:22-alpine AS builder

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package.json package-lock.json ./

# install dependencies
RUN npm ci

# stage 2: Production stage
FROM node:22-alpine

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package.json package-lock.json ./

# copy only production files from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# copy the rest of the application code
COPY src ./src

# expose the application port
EXPOSE 3000

# optional: health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/books', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# start the application
CMD ["node", "src/server.js"]