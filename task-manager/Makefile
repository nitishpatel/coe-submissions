.PHONY: test
test:
	docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm --no-deps \
		-e JWT_SECRET="${JWT_SECRET:-dev-secret}" \
		backend-tester uv run pytest .

.PHONY: test-watch
test-watch:
	docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm backend-tester uv run ptw .

.PHONY: frontend-test
frontend-test:
	# local dev watch
	docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm --no-deps \
		frontend-tester npm run test

.PHONY: build
build:
	# local dev build
	docker compose -f docker-compose.yml build

.PHONY: up
up:
	# local dev build
	docker compose -f docker-compose.yml up

.PHONY: down
down:
	# local dev build
	docker compose -f docker-compose.yml down


