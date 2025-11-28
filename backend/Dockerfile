FROM python:3.14-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

# Copy dependency definitions
COPY pyproject.toml .

# Install dependencies
# We use --system to install into the system python since we are in a container
RUN uv pip install --system .

# Copy application code
COPY app /app/app

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
