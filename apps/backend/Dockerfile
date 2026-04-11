FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .

RUN npm run build

RUN mkdir -p /tmp/avatars && chmod 700 /tmp/avatars

CMD ["node", "dist/server.js"]