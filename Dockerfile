# ---------- 1️⃣ Base Builder Image ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install deps for all workspaces
RUN npm install --workspaces

# Copy full source
COPY . .

# Build all workspaces (shared → client → server)
RUN npm run build -w shared && npm run build -w client && npm run build -w server



# ---------- 2️⃣ Runtime Image ----------
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only the built code + production deps from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/client ./client
COPY --from=builder /app/node_modules ./node_modules

# Remove unnecessary files to shrink size
RUN npm prune --production

# Create a non-root user (for security)
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

# Expose your port
EXPOSE 8080

# Set env vars
ENV NODE_ENV=production
ENV PORT=8080

# Start server
CMD ["node", "server/dist/index.js"]
