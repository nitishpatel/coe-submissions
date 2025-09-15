FROM python:3.12-slim-bookworm

COPY --from=ghcr.io/astral-sh/uv:0.8.17-python3.12-bookworm-slim /usr/local/bin/uv /bin/uv

WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN uv sync --locked --no-cache

COPY . /app

EXPOSE 80
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
