#!/usr/bin/env sh
set -e

# Run migrations
echo "Running alembic upgrade head..."
/app/.venv/bin/alembic upgrade head

# Now start the app
exec "$@"
