#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Waiting for PostgreSQL..."
# Simple wait loop (Postgres usually takes a few seconds to start in Docker)
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Seed data (Optional: Uncomment if you want fresh data every restart)
python manage.py seed_data

# Start server (Use Gunicorn for production performance)
echo "Starting Gunicorn Server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000