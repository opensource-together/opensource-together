import { useQuery } from "@tanstack/react-query";

import { getMyProjects } from "../services/my-projects.service";

/**
 * Hook pour récupérer les projets de l'utilisateur courant
 *
 * @returns Un objet contenant les données des projets, l'état de chargement et les erreurs
 */
export function useMyProjects() {
  return useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjects,
  });
}
