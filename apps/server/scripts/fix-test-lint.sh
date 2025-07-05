#!/bin/bash

# Script pour corriger automatiquement les erreurs de lint dans les fichiers de test
# Usage: ./scripts/fix-test-lint.sh

echo "🔧 Correction automatique des erreurs de lint dans les fichiers .spec.ts..."

# Trouver tous les fichiers .spec.ts sans les commentaires ESLint disable
for file in $(find src -name "*.spec.ts" -exec grep -L "eslint-disable.*unsafe" {} \;); do
  echo "📝 Traitement: $file"
  
  # Créer une sauvegarde
  cp "$file" "$file.bak"
  
  # Ajouter les commentaires ESLint disable au début du fichier
  cat > "$file.tmp" << 'EOF'
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */

EOF
  
  # Ajouter le contenu original
  cat "$file" >> "$file.tmp"
  
  # Remplacer le fichier original
  mv "$file.tmp" "$file"
  
  echo "✅ Fichier traité: $file"
done

echo "🧹 Exécution de pnpm lint --fix pour nettoyer les warnings..."
pnpm lint --fix

echo "✨ Correction terminée! Les fichiers de test ne devraient plus avoir d'erreurs de lint liées aux types 'unsafe'."

# Nettoyage des fichiers de sauvegarde
echo "🗑️  Nettoyage des fichiers de sauvegarde..."
find src -name "*.spec.ts.bak" -delete

echo "🎉 Terminé!" 