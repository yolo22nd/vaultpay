#!/bin/sh
set -e

# --- CRITICAL FIX: Tell Python where settings are ---
export DJANGO_SETTINGS_MODULE=config.settings

if [ -z "$DATABASE_URL" ]; then
    echo "Running locally..."
    while ! nc -z db 5432; do sleep 0.1; done
else
    echo "Running on Cloud..."
fi

echo "Applying database migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check User Count with explicit settings export (Just to be safe)
echo "Checking database state..."
USER_COUNT=$(python -c "import os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings'); import django; django.setup(); from django.contrib.auth import get_user_model; print(get_user_model().objects.count())")

if [ "$USER_COUNT" -eq "0" ]; then
    echo "Database empty. Seeding data..."
    python manage.py seed_data
else
    echo "Database already has $USER_COUNT users. Skipping seed."
fi

echo "Starting Gunicorn..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000