.PHONYH: up down restart logs ps migrate prisma

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down && docker compose up -d

logs:
	docker compose logs -f

ps:
	docker compose ps

migrate:
	docker compose exec backend npx prisma migrate dev

prisma:
	docker compose exec backend npx prisma studio