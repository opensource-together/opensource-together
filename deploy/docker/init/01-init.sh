#!/bin/bash
set -e

echo "Initializing PostgreSQL users and databases..."

# Function to check if a user exists
user_exists() {
  psql -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_roles WHERE rolname='$1'" | grep -q 1
}

# Function to check if a database exists
db_exists() {
  psql -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='$1'" | grep -q 1
}

# Create users
if ! user_exists "$SUPERTOKENS_DB_USER"; then
  echo "🔧 Creating user: $SUPERTOKENS_DB_USER"
  psql -U "$POSTGRES_USER" -c "CREATE ROLE $SUPERTOKENS_DB_USER LOGIN PASSWORD '${SUPERTOKENS_DB_PASSWORD}';"
fi

if ! user_exists "$BUSINESS_DB_USER"; then
  echo "🔧 Creating user: $BUSINESS_DB_USER"
  psql -U "$POSTGRES_USER" -c "CREATE ROLE $BUSINESS_DB_USER LOGIN PASSWORD '${BUSINESS_DB_PASSWORD}';"
fi

# Create databases
if ! db_exists "$SUPERTOKENS_DB_NAME"; then
  echo "Creating database: $SUPERTOKENS_DB_NAME"
  psql -U "$POSTGRES_USER" -c "CREATE DATABASE $SUPERTOKENS_DB_NAME OWNER $SUPERTOKENS_DB_USER;"
fi

if ! db_exists "$BUSINESS_DB_NAME"; then
  echo "Creating database: $BUSINESS_DB_NAME"
  psql -U "$POSTGRES_USER" -c "CREATE DATABASE $BUSINESS_DB_NAME OWNER $BUSINESS_DB_USER;"
fi

echo "PostgreSQL initialization complete."
