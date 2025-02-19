# Development Stage
FROM node:20-alpine as development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "dev"]

# Production Stage
FROM node:20-alpine as production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=development /app/dist ./dist

CMD ["node", "dist/server.js"]