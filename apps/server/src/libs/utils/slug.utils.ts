/**
 * Génère un slug à partir d'une chaîne de caractères
 * @param text - Le texte à transformer en slug
 * @returns Le slug généré
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Remplace les tirets multiples par un seul
    .replace(/^-+|-+$/g, ''); // Supprime les tirets au début et à la fin
}

/**
 * Génère un slug unique en ajoutant un suffixe aléatoire si nécessaire
 * @param text - Le texte à transformer en slug
 * @param existingSlugs - Liste des slugs existants pour vérifier l'unicité
 * @returns Le slug unique généré
 */
export function generateUniqueSlug(text: string, existingSlugs: string[] = []): string {
  let slug = generateSlug(text);
  
  if (existingSlugs.includes(slug)) {
    // Ajoute un suffixe aléatoire de 6 caractères
    const suffix = Math.random().toString(36).substring(2, 8);
    slug = `${slug}-${suffix}`;
  }
  
  return slug;
}