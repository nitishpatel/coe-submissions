.PHONY: test
test:
	docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm --no-deps \
		-e JWT_SECRET="${JWT_SECRET:-dev-secret}" \
		backend-tester uv run pytest .

.PHONY: test-watch
test-watch:
	docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm backend-tester uv run ptw .

.PHONY: test-ci
test-ci:
	# CI-friendly: expects images named task-manager-backend:ci and task-manager-frontend:ci to exist (built & loaded)
	docker compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --no-deps \
		backend-tester uv run pytest .

.PHONY: frontend-test
frontend-test:
	# local dev watch
	docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm --no-deps \
		frontend-tester npm run test

.PHONY: frontend-test-ci
frontend-test-ci:
	# CI run (no reinstall; uses built image)
	docker compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --no-deps \
		frontend-tester npm run test:ci
