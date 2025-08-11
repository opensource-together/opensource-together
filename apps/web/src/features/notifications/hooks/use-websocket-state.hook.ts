import { useEffect, useState } from "react";

import { isWebSocketConnected } from "../services/websocket.service";

/**
 * Hook pour surveiller l'état de connexion WebSocket
 * Utilise un interval global pour éviter les montages/démontages multiples
 */
export const useWebSocketState = (token: string | null) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsConnected(false);
      return;
    }

    // Vérifier l'état de connexion immédiatement
    setIsConnected(isWebSocketConnected());

    // Vérifier périodiquement l'état de la connexion
    const interval = setInterval(() => {
      const connected = isWebSocketConnected();
      setIsConnected(connected);
    }, 3000);

    return () => {
      clearInterval(interval);
      // IMPORTANT: Ne jamais déconnecter ici !
    };
  }, [token]);

  return {
    isConnected,
  };
};
