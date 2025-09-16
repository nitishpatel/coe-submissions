#!/usr/bin/env bash
set -euo pipefail

echo "Entrypoint starting..."

# Run Alembic migrations only if POSTGRES_PORT is set
if [ -n "${POSTGRES_PORT:-}" ]; then
  echo "POSTGRES_PORT is set (${POSTGRES_PORT}), running alembic upgrade head..."
  /app/.venv/bin/alembic upgrade head
else
  echo "POSTGRES_PORT not set, skipping alembic migrations."
fi

exec "$@"
