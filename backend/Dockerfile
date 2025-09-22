# Use official Node.js base image
FROM node:18-bullseye-slim

# Install system dependencies needed by Playwright (Chromium)
RUN apt-get update && apt-get install -y \
  ca-certificates wget gnupg fontconfig \
  libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 \
  libdbus-1-3 libdrm2 libgbm1 libgtk-3-0 libnspr4 libnss3 \
  libx11-xcb1 libxcomposite1 libxdamage1 libxfixes3 \
  libxrandr2 libxshmfence1 libxss1 libxtst6 xdg-utils \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and lock files first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers (Chromium only)
RUN npx playwright install --with-deps chromium

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "/app/dist/app.js"]
