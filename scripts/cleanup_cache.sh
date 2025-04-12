#!/bin/bash

# This script removes Python cache files from git tracking.
# Optional flag --delete will also delete them from the local filesystem.

echo "🔍 Finding all Python cache files..."

# Remove from Git tracking (keep locally)
find . -type d -name "__pycache__" -exec git rm -r --cached {} + 2>/dev/null
find . -type f \( -name "*.pyc" -o -name "*.pyo" -o -name "*.pyd" \) -exec git rm --cached {} + 2>/dev/null

echo "✅ Removed __pycache__ and *.py[cod] files from Git tracking."

# Optionally delete from disk
if [ "$1" == "--delete" ]; then
    echo "🗑️  Deleting cache files from filesystem..."
    find . -type d -name "__pycache__" -exec rm -r {} +
    find . -type f \( -name "*.pyc" -o -name "*.pyo" -o -name "*.pyd" \) -delete
    echo "✅ Deleted cache files from filesystem."
fi

echo "🚀 Done. Now run:"
echo "   git add ."
echo "   git commit -m 'Cleaned up Python cache files from repo'"
