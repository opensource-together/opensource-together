import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import { notificationSocketService } from "../services/notification-socket.service";
import {
  getUnreadNotifications,
  markNotificationAsRead,
} from "../services/notification.service";
import { useNotificationStore } from "../stores/notification.store";

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
    updateNotification,
  } = useNotificationStore();

  // État de connexion WebSocket
  const [wsConnected, setWsConnected] = useState(false);

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

  // Effect pour gérer la connexion WebSocket et l'écoute des notifications
  useEffect(() => {
    if (!wsToken) {
      setWsConnected(false);
      return;
    }

    // Démarrer l'écoute des notifications via le service
    notificationSocketService.startListening(wsToken);
    setWsConnected(true);

    // S'abonner aux notifications du service
    const unsubscribe = notificationSocketService.subscribe((notification) => {
      const existingNotification = notifications.find(
        (n) => n.id === notification.id
      );
      if (existingNotification) {
        updateNotification(notification);
      } else {
        addNotification(notification);
      }
    });

    // Nettoyage
    return () => {
      unsubscribe();
      notificationSocketService.stopListening();
      setWsConnected(false);
    };
  }, [wsToken, addNotification, updateNotification, notifications]);

  const openNotifications = () => setIsOpen(true);
  const closeNotifications = () => setIsOpen(false);

  const useMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

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
    useMarkAsRead,
  };
};
