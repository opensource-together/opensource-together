import { useEffect, useRef } from "react";

import {
  connectWebSocket,
  isWebSocketConnected,
} from "../services/websocket.service";

/**
 * Hook global pour gérer la connexion WebSocket une seule fois
 * Doit être utilisé au niveau racine de l'application (layout.tsx ou _app.tsx)
 */
export const useGlobalWebSocket = (token: string | null) => {
  const hasConnected = useRef(false);

  useEffect(() => {
    if (!token || hasConnected.current) {
      return;
    }

    // Se connecter automatiquement quand le token est disponible
    const connect = async () => {
      try {
        // Vérifier si déjà connecté
        if (isWebSocketConnected()) {
          hasConnected.current = true;
          return;
        }

        await connectWebSocket(token);
        hasConnected.current = true;
      } catch (error) {
        console.error("Erreur de connexion WebSocket globale:", error);
      }
    };

    connect();

    // Nettoyage seulement au démontage complet de l'application
    return () => {
      // Ne pas déconnecter ici, laisser la connexion active
      // La déconnexion se fera au logout ou à la fermeture de la session
    };
  }, [token]);

  // Ce hook ne retourne rien, il gère juste la connexion globale
};
