# Use official Python runtime
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies via requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- THE BRUTE FORCE FIX ---
# Explicitly install the missing cloud packages to ensure they exist
RUN pip install dj-database-url whitenoise gunicorn
# ---------------------------

# Copy project
COPY . .

# Copy entrypoint script and make it executable
COPY entrypoint.sh .
RUN chmod +x /app/entrypoint.sh

# Run entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]