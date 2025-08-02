import { OstContributor } from "../types/project.type";

/**
 * Exemple de contributeurs OST (Open Source Together)
 * Ces contributeurs proviennent des candidatures approuvées par les owners de projets
 * au lieu des contributeurs GitHub classiques
 */
export const ostContributorsExample: OstContributor[] = [
  {
    login: "Byron M",
    avatar_url: "/icons/exemplebyronIcon.svg",
    html_url: "http://localhost:4000/v1/user/user-123", // Lien vers la page profil OST
    user_id: "user-123", // ID interne OST
    contributions: 3, // Nombre de rôles approuvés dans ce projet
  },
  {
    login: "Killian C",
    avatar_url: "/icons/killiancodes-icon.jpg",
    html_url: "http://localhost:4000/v1/user/user-456",
    user_id: "user-456",
    contributions: 2,
  },
  {
    login: "P2aco Dev",
    avatar_url: "/icons/p2aco-icon.png",
    html_url: "http://localhost:4000/v1/user/user-789",
    user_id: "user-789",
    contributions: 1,
  },
];

/**
 * Comparaison : Anciens contributeurs GitHub vs Nouveaux contributeurs OST
 *
 * AVANT (GitHub contributors):
 * - Proviennent de l'API GitHub
 * - Incluent github-actions[bot], lowlighter, etc.
 * - Lien vers profiles GitHub
 * - contributions = commits GitHub
 *
 * APRÈS (OST contributors):
 * - Proviennent des candidatures approuvées dans la base OST
 * - Uniquement les vrais contributeurs OST (utilisateurs acceptés)
 * - Lien vers profiles OST internes
 * - contributions = nombre de rôles approuvés
 * - Champ user_id pour navigation interne
 */

export const comparisonExample = {
  before: {
    // Ce qu'on avait avant avec l'API GitHub
    contributors: [
      {
        login: "github-actions[bot]",
        avatar_url: "https://avatars.githubusercontent.com/u/41898282?v=4",
        html_url: "https://github.com/apps/github-actions",
        contributions: 25,
      },
      {
        login: "lowlighter",
        avatar_url: "https://avatars.githubusercontent.com/u/22963968?v=4",
        html_url: "https://github.com/lowlighter",
        contributions: 15,
      },
    ],
  },
  after: {
    // Ce qu'on a maintenant avec les contributeurs OST
    contributors: ostContributorsExample,
  },
};
