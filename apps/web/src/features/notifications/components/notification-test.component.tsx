import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { socket } from "@/shared/realtime/socket";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import { useNotifications } from "../hooks/use-notifications.hook";
import { useNotificationStore } from "../stores/notification.store";

export default function NotificationTest() {
  const { notifications, unreadCount, wsConnected, useMarkAsRead } =
    useNotifications();

  // Accès direct au store pour le débogage
  const storeState = useNotificationStore();

  // Informations d'authentification
  const { isAuthenticated, wsToken, currentUser } = useAuth();

  // Debug en temps réel
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [lastNotification, setLastNotification] = useState<any>(null);
  const [storeHistory, setStoreHistory] = useState<any[]>([]);

  // Surveiller les changements de notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      if (latest.id !== lastNotification?.id) {
        setLastNotification(latest);
        setDebugLogs((prev) => [
          ...prev.slice(-9),
          `🆕 Nouvelle notification détectée: ${latest.type}`,
        ]);
      }
    }
  }, [notifications, lastNotification]);

  // Surveiller les changements du store Zustand
  useEffect(() => {
    const currentStoreState = {
      timestamp: new Date().toISOString(),
      notificationsCount: storeState.notifications.length,
      unreadCount: storeState.unreadCount,
      notifications: storeState.notifications.slice(0, 3),
    };

    setStoreHistory((prev) => [...prev.slice(-4), currentStoreState]);
  }, [storeState.notifications, storeState.unreadCount]);

  // Test de marquage d'une notification comme lue
  const testMarkAsRead = async () => {
    if (notifications.length > 0) {
      const firstNotification = notifications[0];
      if (!firstNotification.readAt) {
        try {
          await useMarkAsRead(firstNotification.id);
          setDebugLogs((prev) => [
            ...prev.slice(-9),
            `✅ Notification marquée comme lue: ${firstNotification.id}`,
          ]);
        } catch (error) {
          setDebugLogs((prev) => [
            ...prev.slice(-9),
            `❌ Erreur lors du marquage: ${error}`,
          ]);
        }
      } else {
        setDebugLogs((prev) => [
          ...prev.slice(-9),
          `ℹ️ Notification déjà lue: ${firstNotification.id}`,
        ]);
      }
    } else {
      setDebugLogs((prev) => [
        ...prev.slice(-9),
        `⚠️ Aucune notification disponible pour le test`,
      ]);
    }
  };

  // Test de connexion WebSocket
  const testWebSocketConnection = () => {
    const isConnected = socket.isConnected();
    setDebugLogs((prev) => [
      ...prev.slice(-9),
      `🔌 WebSocket connecté: ${isConnected}`,
    ]);
  };

  // Force la reconnexion WebSocket
  const forceWebSocketReconnection = () => {
    socket.disconnect();
    setTimeout(() => {
      if (wsToken) {
        socket.connect(wsToken);
        setDebugLogs((prev) => [
          ...prev.slice(-9),
          `🔄 Reconnexion WebSocket forcée`,
        ]);
      }
    }, 1000);
  };

  // Vérifier l'état du système
  const checkSystemStatus = () => {
    const status = {
      isAuthenticated,
      wsToken: !!wsToken,
      wsConnected,
      notificationsCount: notifications.length,
      unreadCount,
      storeNotificationsCount: storeState.notifications.length,
      storeUnreadCount: storeState.unreadCount,
    };

    setDebugLogs((prev) => [
      ...prev.slice(-9),
      `🔍 État système: ${JSON.stringify(status, null, 2)}`,
    ]);
  };

  // Force la mise à jour du store
  const forceStoreUpdate = () => {
    const currentState = useNotificationStore.getState();
    setDebugLogs((prev) => [
      ...prev.slice(-9),
      `🔄 Store forcé: ${currentState.notifications.length} notifications, ${currentState.unreadCount} non lues`,
    ]);
  };

  // Nettoyer les logs
  const clearLogs = () => {
    setDebugLogs([]);
    setStoreHistory([]);
  };

  // Ajouter une notification de test
  const addTestNotification = () => {
    const testNotification = {
      id: `test-${Date.now()}`,
      object: "Test Notification",
      receiverId: currentUser?.id || "test-user",
      senderId: "system",
      type: "test.created" as any,
      payload: {
        message: "Ceci est une notification de test",
        timestamp: new Date().toISOString(),
      },
      createdAt: new Date(),
      readAt: null,
    };

    useNotificationStore.getState().addNotification(testNotification);
    setDebugLogs((prev) => [
      ...prev.slice(-9),
      `🧪 Notification de test ajoutée: ${testNotification.id}`,
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
        <h2 className="text-2xl font-bold">🧪 Test des Notifications</h2>
        <p className="text-muted-foreground">
          Composant de test pour vérifier le bon fonctionnement du système de
          notifications
        </p>
      </div>

      {/* Informations d'état */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm">
          <h3 className="font-semibold">🔐 Authentification</h3>
          <p className="text-2xl font-bold">
            {isAuthenticated ? "✅ Connecté" : "❌ Déconnecté"}
          </p>
          {currentUser && (
            <p className="text-muted-foreground text-sm">
              {currentUser.username}
            </p>
          )}
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm">
          <h3 className="font-semibold">🔌 WebSocket</h3>
          <p className="text-2xl font-bold">
            {wsConnected ? "✅ Connecté" : "❌ Déconnecté"}
          </p>
          <p className="text-muted-foreground text-sm">
            Token: {wsToken ? "✅ Présent" : "❌ Absent"}
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm">
          <h3 className="font-semibold">📬 Notifications</h3>
          <p className="text-2xl font-bold">{notifications.length}</p>
          <p className="text-muted-foreground text-sm">
            {unreadCount} non lues
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm">
          <h3 className="font-semibold">💾 Store Zustand</h3>
          <p className="text-2xl font-bold">
            {storeState.notifications.length}
          </p>
          <p className="text-muted-foreground text-sm">
            {storeState.unreadCount} non lues
          </p>
        </div>
      </div>

      {/* Actions de test */}
      <div className="space-y-2">
        <h3 className="font-semibold">🎮 Actions de Test:</h3>

        <div className="space-x-2">
          <Button onClick={addTestNotification} variant="outline">
            Ajouter Test Notification
          </Button>
          <Button onClick={testMarkAsRead} variant="outline">
            🧪 Tester Mark As Read
          </Button>
          <Button onClick={testWebSocketConnection} variant="outline">
            Test WebSocket
          </Button>
          <Button onClick={forceWebSocketReconnection} variant="outline">
            🔄 Force Reconnexion WS
          </Button>
          <Button onClick={checkSystemStatus} variant="outline">
            🔍 État Système
          </Button>
          <Button onClick={forceStoreUpdate} variant="outline">
            Force Store Update
          </Button>
          <Button onClick={clearLogs} variant="outline">
            Nettoyer Logs
          </Button>
        </div>
      </div>

      {/* Debug en temps réel */}
      <div className="space-y-2">
        <h3 className="font-semibold">🔍 Debug en temps réel:</h3>
        <div className="max-h-40 overflow-y-auto rounded border bg-gray-50 p-2 text-sm">
          {debugLogs.length === 0 ? (
            <p className="text-gray-500">
              Aucun log de debug pour le moment...
            </p>
          ) : (
            debugLogs.map((log, index) => (
              <div key={index} className="font-mono text-xs">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Historique du store */}
      <div className="space-y-2">
        <h3 className="font-semibold">📊 Historique du Store:</h3>
        <div className="max-h-40 overflow-y-auto rounded border bg-gray-50 p-2 text-sm">
          {storeHistory.length === 0 ? (
            <p className="text-gray-500">Aucun historique pour le moment...</p>
          ) : (
            storeHistory.map((state, index) => (
              <div key={index} className="font-mono text-xs">
                <div className="font-semibold">
                  {new Date(state.timestamp).toLocaleTimeString()}
                </div>
                <div>Notifications: {state.notificationsCount}</div>
                <div>Non lues: {state.unreadCount}</div>
                <div className="text-gray-500">
                  {state.notifications
                    .map((n: any) => `${n.id.slice(0, 8)}...`)
                    .join(", ")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dernière notification reçue */}
      {lastNotification && (
        <div className="space-y-2">
          <h3 className="font-semibold">📨 Dernière Notification:</h3>
          <div className="rounded border bg-gray-50 p-3 text-sm">
            <div className="font-mono">
              <div>ID: {lastNotification.id}</div>
              <div>Type: {lastNotification.type}</div>
              <div>Object: {lastNotification.object}</div>
              <div>Créée: {lastNotification.createdAt.toLocaleString()}</div>
              <div>
                Lue: {lastNotification.readAt ? "✅" : "❌"}
                {lastNotification.readAt &&
                  ` (${lastNotification.readAt.toLocaleString()})`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
