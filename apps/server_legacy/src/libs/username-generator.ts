export class UsernameGenerator {
  /**
   * Génère un username unique à partir d'une email
   * @param email L'email de base
   * @returns Un username unique
   */
  static generateFromEmail(email: string): string {
    // Extraire la partie avant le @
    const localPart = email.split('@')[0];

    // Nettoyer le nom : supprimer caractères spéciaux, garder lettres/chiffres/tirets
    const cleanBase = localPart
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '')
      .replace(/^[._-]+|[._-]+$/g, '') // Supprimer les caractères spéciaux en début/fin
      .substring(0, 20); // Limiter à 20 caractères

    // Si le nom nettoyé est vide, utiliser un nom par défaut
    const baseUsername = cleanBase || 'user';

    // Ajouter un timestamp court pour l'unicité
    const timestamp = Date.now().toString(36).slice(-4);
    return `${baseUsername}_${timestamp}`;
  }

  /**
   * Génère plusieurs suggestions de usernames
   * @param email L'email de base
   * @param count Nombre de suggestions à générer
   * @returns Array de suggestions de usernames
   */
  static generateSuggestions(email: string, count: number = 5): string[] {
    const suggestions: string[] = [];
    const localPart = email.split('@')[0].toLowerCase();
    const domain = email.split('@')[1].split('.')[0];

    // Base nettoyée
    const cleanBase = localPart.replace(/[^a-z0-9._-]/g, '').substring(0, 15);

    // Différentes variantes
    const variants = [
      cleanBase,
      `${cleanBase}${domain}`,
      `${cleanBase}_${domain}`,
      `${cleanBase}${new Date().getFullYear()}`,
      `${cleanBase}_dev`,
      `${cleanBase}_user`,
      `${cleanBase}${Math.floor(Math.random() * 999)}`,
      `${cleanBase}_${Date.now().toString(36).slice(-4)}`,
    ];

    // Filtrer les variants valides
    variants.forEach((variant) => {
      if (
        variant &&
        variant.length >= 3 &&
        !suggestions.includes(variant) &&
        suggestions.length < count
      ) {
        suggestions.push(variant);
      }
    });

    return suggestions;
  }
}
