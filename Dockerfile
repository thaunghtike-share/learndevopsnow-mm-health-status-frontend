# 1. Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install 

ENV DISABLE_ESLINT_PLUGIN=true

# Copy all files and build
COPY . .
RUN npm run build

# 2. Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files from build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port (default Next.js port)
EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "start"]
