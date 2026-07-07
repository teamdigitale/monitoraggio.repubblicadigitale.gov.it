# Build (Node) - baseURL API iniettata a build time (default: /api via reverse-proxy)
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Runtime (nginx: serve la SPA e fa da reverse-proxy verso il backend)
FROM nginx:1.27-alpine
# Il template viene processato con envsubst all'avvio: ${BACKEND_URL} diventa
# l'URL del backend. Default valido per docker-compose (service DNS "backend").
COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
ENV BACKEND_URL=http://backend:8081
EXPOSE 80
