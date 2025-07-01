#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting Frontend Build ---"
# Install Node.js dependencies (package.json is at root)
npm install

# Build the React frontend (output automatically goes to root public/)
npm run build
echo "--- Frontend Build Complete ---"

echo "--- Starting Backend Setup ---"
# Install Python dependencies using pipenv
# --deploy ensures Pipfile.lock is used
# --system installs into the system environment (common for CI/CD like Render)
pipenv install --deploy --system

# Run database migrations
pipenv run upgrade
echo "--- Backend Setup Complete ---"

echo "--- Build Process Finished Successfully ---"