# Stage 1: Reactアプリをビルド
FROM node:20 AS builder
WORKDIR /app
COPY apps/frontend/package*.json ./
RUN npm install
COPY apps/frontend ./
RUN npm run build

# Stage 2: ビルド結果をNginxで配信
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY infra/nginx/default.prod.conf /etc/nginx/conf.d/default.conf
