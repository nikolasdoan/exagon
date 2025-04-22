#!/bin/bash

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL first."
    echo "On Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "On macOS: brew install postgresql"
    exit 1
fi

# Create database and user
echo "Setting up local database..."
sudo -u postgres psql << EOF
CREATE DATABASE techvisualize3d;
CREATE USER techvisualize3d WITH ENCRYPTED PASSWORD 'techvisualize3d';
GRANT ALL PRIVILEGES ON DATABASE techvisualize3d TO techvisualize3d;
\c techvisualize3d
GRANT ALL ON SCHEMA public TO techvisualize3d;
EOF

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "LOCAL_DATABASE_URL=postgres://techvisualize3d:techvisualize3d@localhost:5432/techvisualize3d" > .env
    echo "SESSION_SECRET=your-secret-key-here" >> .env
fi

# Run database migrations
echo "Running database migrations..."
npm run db:push

echo "Local database setup complete!"
echo "You can now start the application with: npm run dev" 