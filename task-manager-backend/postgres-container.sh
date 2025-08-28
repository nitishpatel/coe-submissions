#!/usr/bin/env bash

# postgres-container.sh
# Manage a PostgreSQL Docker container with env config

set -a
if [ -f .env ]; then
  # Load .env variables into the environment
  source .env
else
  echo ".env file not found in current directory"
  exit 1
fi
set +a

CONTAINER_NAME=task_manager_backend_db
POSTGRES_IMAGE=postgres:15

function start() {
  echo "Starting PostgreSQL container: $CONTAINER_NAME"
  docker run -d \
    --name "$CONTAINER_NAME" \
    -e POSTGRES_USER="$POSTGRES_USER" \
    -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
    -e POSTGRES_DB="$POSTGRES_DB" \
    -p "$POSTGRES_PORT":5432 \
    "$POSTGRES_IMAGE"
}

function stop() {
  echo "Stopping container: $CONTAINER_NAME"
  docker stop "$CONTAINER_NAME"
}

function remove() {
  echo "Removing container: $CONTAINER_NAME"
  docker rm -f "$CONTAINER_NAME"
}

function restart() {
  echo "Restarting container: $CONTAINER_NAME"
  stop
  start
}

function logs() {
  docker logs -f "$CONTAINER_NAME"
}

function exec_psql() {
  docker exec -it "$CONTAINER_NAME" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
}

function status() {
  docker ps -a --filter "name=$CONTAINER_NAME"
}

function help() {
  echo "Usage: $0 {start|stop|remove|restart|logs|exec|status}"
}

case "$1" in
  start) start ;;
  stop) stop ;;
  remove) remove ;;
  restart) restart ;;
  logs) logs ;;
  exec) exec_psql ;;
  status) status ;;
  *) help ;;
esac
