#!/bin/sh

echo "⏳ Attente que la base soit prête..."
while ! pg_isready -h $BUSINESS_DB_HOST -p $BUSINESS_DB_PORT -U $BUSINESS_DB_USER; do
  sleep 2
done

echo "✅ Base de données disponible, lancement des migrations"
pnpm prisma generate --schema=src/infrastructures/orm/prisma/schema.prisma
pnpm prisma db push --schema=src/infrastructures/orm/prisma/schema.prisma

echo "🚀 Lancement de l'application"
pnpm run start:dev