.PHONYH: up down restart build logs ps migrate prisma update

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

update:
	docker compose -f docker-compose.prod.yml down
	docker compose -f docker-compose.prod.yml pull
	docker compose -f docker-compose.prod.yml up -d