.PHONY: test
test:
	# Run tests in a one-off backend container
	docker compose run --rm backend uv run pytest .

.PHONY: test-watch
test-watch:
	# Run tests continuously with pytest-watch (ptw), requires pytest-watch in dev deps
	docker compose run --rm backend uv run ptw .

.PHONY: frontend-test-watch
frontend-test-watch:
	# Run tests continuously with vitest
	docker compose run --rm frontend-tester npm run test