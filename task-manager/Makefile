.PHONY: test
test:
	# Run tests in a one-off backend container
	docker compose run --rm backend-tester uv run pytest .

.PHONY: test-watch
test-watch:
	# Run tests continuously with pytest-watch (ptw), requires pytest-watch in dev deps
	docker compose run --rm backend-tester uv run ptw .

.PHONY: frontend-test
frontend-test:
	# Run Vitest once in CI-friendly mode
	docker compose run --rm --no-deps frontend-tester npm run test:ci

.PHONY: frontend-test-watch
frontend-test-watch:
	# Run Vitest in watcher mode (local dev)
	docker compose run --rm --no-deps frontend-tester npm run test
