# Development Stage
FROM node:20-alpine as development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL
RUN VITE_API_URL=${VITE_API_URL} npm run build

CMD ["npm", "run", "dev", "--", "--host"]

# Production Stage
FROM caddy:2-alpine as production
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=development /app/dist /srv
