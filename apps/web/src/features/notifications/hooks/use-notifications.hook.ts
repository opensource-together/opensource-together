import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import { getUnreadNotifications } from "../services/notification.service";
import { subscribeToNotifications } from "../services/websocket.service";
import { useNotificationStore } from "../stores/notification.store";
import { useWebSocketState } from "./use-websocket-state.hook";

export const useNotifications = () => {
  const { isAuthenticated, wsToken } = useAuth();
  const {
    notifications,
    isOpen,
    isLoading: storeLoading,
    error: storeError,
    setNotifications,
    setIsOpen,
    setError,
    addNotification,
  } = useNotificationStore();

  // Hook WebSocket - se connecte automatiquement quand le token est disponible
  const { isConnected: wsConnected } = useWebSocketState(wsToken);

  const {
    data: unreadNotificationsData,
    isLoading: isLoadingUnread,
    error: unreadError,
  } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: getUnreadNotifications,
    enabled: isAuthenticated,
  });

  // Effect pour traiter les données reçues de l'API
  useEffect(() => {
    if (unreadNotificationsData?.success) {
      // Fusionner avec les notifications existantes au lieu de les écraser
      const { notifications: existingNotifications } =
        useNotificationStore.getState();

      // Créer un Map des notifications existantes par ID pour éviter les doublons
      const existingNotificationsMap = new Map(
        existingNotifications.map((n) => [n.id, n])
      );

      // Ajouter les nouvelles notifications de l'API
      unreadNotificationsData.data.forEach((apiNotification) => {
        if (!existingNotificationsMap.has(apiNotification.id)) {
          existingNotificationsMap.set(apiNotification.id, apiNotification);
        }
      });

      // Convertir le Map en array et mettre à jour le store
      const mergedNotifications = Array.from(existingNotificationsMap.values());
      setNotifications(mergedNotifications);
    }
  }, [unreadNotificationsData, setNotifications]);

  // Effect pour traiter les erreurs
  useEffect(() => {
    if (unreadError) {
      setError(
        unreadError instanceof Error
          ? unreadError.message
          : "Erreur lors du chargement des notifications"
      );
    }
  }, [unreadError, setError]);

  // Effect pour s'abonner aux notifications WebSocket
  useEffect(() => {
    if (!wsConnected) {
      return;
    }

    console.log("🔔 S'abonnant aux notifications WebSocket...");

    // S'abonner aux nouvelles notifications
    const unsubscribe = subscribeToNotifications((message) => {
      console.log("🔔 Nouvelle notification reçue dans le hook:", message);

      // Le backend envoie directement la notification, pas dans payload
      const notificationData = message as any;

      // Vérifier que c'est bien une notification complète
      if (notificationData.id && notificationData.type) {
        console.log("🔔 Ajout de la notification au store:", notificationData);

        // Transformer createdAt en Date si c'est une string
        const notification = {
          ...notificationData,
          createdAt: notificationData.createdAt
            ? new Date(notificationData.createdAt)
            : new Date(),
          readAt: notificationData.readAt
            ? new Date(notificationData.readAt)
            : null,
        };

        addNotification(notification);

        // Vérifier que le store a été mis à jour
        const updatedState = useNotificationStore.getState();
        console.log("🔔 État du store après ajout:", {
          notificationsCount: updatedState.notifications.length,
          unreadCount: updatedState.unreadCount,
        });
      } else {
        console.warn(
          "🔔 Message reçu mais pas une notification valide:",
          message
        );
      }
    });

    // Nettoyage de l'abonnement
    return unsubscribe;
  }, [wsConnected, addNotification]);

  const openNotifications = () => setIsOpen(true);
  const closeNotifications = () => setIsOpen(false);

  // État combiné
  const isLoading = storeLoading || isLoadingUnread;
  const error = storeError || unreadError;

  return {
    // State
    notifications,
    unreadCount: useNotificationStore.getState().unreadCount,
    isOpen,
    isLoading,
    error,
    wsConnected,

    // Actions
    openNotifications,
    closeNotifications,
  };
};
