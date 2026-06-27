.PHONYH: up down restart build logs ps migrate prisma update

SERVICE ?= backend

# 開発用
up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down && docker compose up -d

build:
	docker compose up --build

logs:
	docker compose logs -f

ps:
	docker compose ps

migrate:
	docker compose exec backend npx prisma migrate dev

prisma:
	docker compose exec backend npx prisma studio

seed:
	docker compose exec backend npm run seed

seed-reset:
	docker compose exec backend npx prisma migrate reset --force
	docker compose exec backend npm run seed

pack:
	docker compose exec $(SERVICE) npm install $(PCK)

dev-pack:
	docker compose exec $(SERVICE) npm install -D $(PCK)

# 本番用
update:
	docker compose -f docker-compose.prod.yml down
	docker compose -f docker-compose.prod.yml pull
	docker compose -f docker-compose.prod.yml up -d