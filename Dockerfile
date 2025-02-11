# Client
FROM node:20-alpine AS client-builder

WORKDIR /app/client

COPY client/package*.json ./

RUN npm ci

COPY client/ .

RUN npm run build

# Server
FROM node:20-alpine AS server-builder

WORKDIR /app/server

COPY server/package*.json ./

RUN npm ci

COPY server/ .

RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=server-builder /app/server/package*.json ./server/
COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY --from=server-builder /app/server/dist ./server/dist

COPY --from=client-builder /app/client/dist ./client/dist

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server/dist/server.js"]

