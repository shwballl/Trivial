#!/bin/sh

echo "Waiting for DB to be ready..."
while ! nc -z db 5432; do
  sleep 0.1
done

echo "Applying migrations..."
python manage.py migrate

echo "Starting server..."
python manage.py runserver 0.0.0.0:8000
