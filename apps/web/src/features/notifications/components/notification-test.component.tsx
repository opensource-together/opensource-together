import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import { useNotifications } from "../hooks/use-notifications.hook";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../services/websocket.service";
import { useNotificationStore } from "../stores/notification.store";

export default function NotificationTest() {
  const { notifications, unreadCount, wsConnected, openNotifications } =
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

  // Log de debug simple (sans interception)
  console.log("🔔 NotificationTest - État actuel:", {
    notificationsCount: notifications.length,
    unreadCount,
    wsConnected,
    storeNotificationsCount: storeState.notifications.length,
    storeUnreadCount: storeState.unreadCount,
    isAuthenticated,
    wsTokenAvailable: !!wsToken,
    currentUser: currentUser?.username,
    notifications: notifications.slice(0, 3), // Afficher les 3 premières
  });

  // Fonction de test pour ajouter une notification manuellement
  const addTestNotification = () => {
    const testNotification = {
      id: `test-${Date.now()}`,
      object: "Test notification manuelle",
      receiverId: "test-user",
      senderId: "system",
      type: "test.notification" as any,
      payload: { message: "Ceci est un test manuel" },
      createdAt: new Date(),
      readAt: null,
    };

    console.log("🔔 Ajout de notification de test:", testNotification);
    storeState.addNotification(testNotification);

    // Ajouter au debug local
    setDebugLogs((prev) => [
      ...prev.slice(-9),
      `🧪 Test notification ajoutée: ${testNotification.id}`,
    ]);
  };

  // Fonction pour tester la connexion WebSocket
  const testWebSocketConnection = () => {
    const info = {
      tokenDisponible: !!wsToken,
      tokenLongueur: wsToken?.length || 0,
      wsConnecte: wsConnected,
      urlAPI: process.env.NEXT_PUBLIC_API_URL,
    };

    console.log("🔌 Test de connexion WebSocket:", info);

    // Ajouter au debug local
    setDebugLogs((prev) => [
      ...prev.slice(-9),
      `🔌 Test WebSocket: ${wsConnected ? "Connecté" : "Déconnecté"}`,
    ]);
  };

  // Fonction pour forcer la reconnexion WebSocket
  const forceWebSocketReconnection = async () => {
    if (!wsToken) {
      setDebugLogs((prev) => [
        ...prev.slice(-9),
        `❌ Pas de token WebSocket disponible`,
      ]);
      return;
    }

    try {
      setDebugLogs((prev) => [
        ...prev.slice(-9),
        `🔄 Tentative de reconnexion WebSocket...`,
      ]);

      // Déconnecter d'abord
      disconnectWebSocket();

      // Attendre un peu
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reconnecter
      connectWebSocket(wsToken);

      // Attendre un peu pour que la connexion s'établisse
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Vérifier l'état de la connexion
      if (wsConnected) {
        setDebugLogs((prev) => [
          ...prev.slice(-9),
          `✅ Reconnexion WebSocket réussie`,
        ]);
      } else {
        setDebugLogs((prev) => [
          ...prev.slice(-9),
          `❌ Échec de la reconnexion WebSocket`,
        ]);
      }
    } catch (error) {
      setDebugLogs((prev) => [
        ...prev.slice(-9),
        `❌ Erreur lors de la reconnexion: ${error}`,
      ]);
    }
  };

  // Fonction pour nettoyer les logs
  const clearLogs = () => {
    setDebugLogs([]);
    setStoreHistory([]);
  };

  // Fonction pour forcer la mise à jour du store
  const forceStoreUpdate = () => {
    const currentState = useNotificationStore.getState();
    console.log("🔧 État actuel du store:", currentState);

    setDebugLogs((prev) => [
      ...prev.slice(-9),
      `🔧 Store forcé: ${currentState.notifications.length} notifications`,
    ]);
  };

  // Fonction pour vérifier l'état complet du système
  const checkSystemStatus = () => {
    const status = {
      auth: isAuthenticated,
      wsToken: !!wsToken,
      wsConnected,
      storeNotifications: storeState.notifications.length,
      storeUnread: storeState.unreadCount,
      hookNotifications: notifications.length,
      hookUnread: unreadCount,
    };

    console.log("🔍 État complet du système:", status);

    setDebugLogs((prev) => [
      ...prev.slice(-9),
      `🔍 État système: Auth=${status.auth}, Token=${status.wsToken}, WS=${status.wsConnected}`,
      `🔍 Store: ${status.storeNotifications}/${status.storeUnread}, Hook: ${status.hookNotifications}/${status.hookUnread}`,
    ]);
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Test Notifications</h2>

      <div className="space-y-2">
        <p>
          <strong>Authentification:</strong>{" "}
          {isAuthenticated ? "🟢 Connecté" : "🔴 Déconnecté"}
        </p>
        {currentUser && (
          <p>
            <strong>Utilisateur:</strong> {currentUser.username}
          </p>
        )}
        <p>
          <strong>Token WebSocket:</strong>{" "}
          {wsToken ? "🟢 Disponible" : "🔴 Non disponible"}
        </p>
        <p>
          <strong>WebSocket:</strong>{" "}
          {wsConnected ? "🟢 Connecté" : "🔴 Déconnecté"}
        </p>
        <p>
          <strong>Total notifications (hook):</strong> {notifications.length}
        </p>
        <p>
          <strong>Total notifications (store):</strong>{" "}
          {storeState.notifications.length}
        </p>
        <p>
          <strong>Non lues (hook):</strong> {unreadCount}
        </p>
        <p>
          <strong>Non lues (store):</strong> {storeState.unreadCount}
        </p>
      </div>

      <div className="space-x-2">
        <Button onClick={openNotifications}>
          Ouvrir Modal ({unreadCount})
        </Button>
        <Button onClick={addTestNotification} variant="outline">
          Ajouter Test Notification
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
        <h3 className="font-semibold">📊 Historique du store Zustand:</h3>
        <div className="max-h-40 overflow-y-auto rounded border bg-blue-50 p-2 text-sm">
          {storeHistory.length === 0 ? (
            <p className="text-blue-500">Aucun historique pour le moment...</p>
          ) : (
            storeHistory.map((state, index) => (
              <div key={index} className="border-b pb-1 font-mono text-xs">
                <div>
                  <strong>{state.timestamp}</strong>
                </div>
                <div>
                  Notifications: {state.notificationsCount} | Non lues:{" "}
                  {state.unreadCount}
                </div>
                <div>
                  Types:{" "}
                  {state.notifications.map((n: any) => n.type).join(", ")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Notifications récentes:</h3>
        {storeState.notifications.slice(0, 5).map((notification, index) => (
          <div key={notification.id || index} className="rounded border p-2">
            <p>
              <strong>Type:</strong> {notification.type}
            </p>
            <p>
              <strong>Objet:</strong> {notification.object}
            </p>
            <p>
              <strong>Lu:</strong> {notification.readAt ? "Oui" : "Non"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded border border-yellow-200 bg-yellow-50 p-3">
        <h4 className="font-semibold text-yellow-800">
          Instructions de test :
        </h4>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-yellow-700">
          <li>
            Ouvrez cette page dans un autre navigateur (navigation privée)
          </li>
          <li>Connectez-vous avec le même compte</li>
          <li>Vérifiez que WebSocket est "🟢 Connecté"</li>
          <li>
            Revenez sur ce navigateur et cliquez "Ajouter Test Notification"
          </li>
          <li>La notification devrait apparaître sur l'autre navigateur</li>
        </ol>

        <div className="mt-3 rounded border border-blue-200 bg-blue-50 p-2">
          <h5 className="font-semibold text-blue-800">Test candidature:</h5>
          <p className="text-sm text-blue-700">
            Envoyez une candidature depuis l'autre navigateur et regardez les
            logs de debug ci-dessus pour voir si la notification arrive.
          </p>
        </div>

        <div className="mt-3 rounded border border-red-200 bg-red-50 p-2">
          <h5 className="font-semibold text-red-800">
            🚨 DIAGNOSTIC CRITIQUE:
          </h5>
          <p className="text-sm text-red-700">
            Si vous ne voyez AUCUN log dans "Debug en temps réel" quand vous
            envoyez une candidature, c'est que le WebSocket n'est PAS connecté
            ou que le message n'arrive PAS du tout.
          </p>
        </div>

        <div className="mt-3 rounded border border-green-200 bg-green-50 p-2">
          <h5 className="font-semibold text-green-800">
            🚀 ACTIONS IMMÉDIATES:
          </h5>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-green-700">
            <li>Cliquez sur "🔄 Force Reconnexion WS"</li>
            <li>Cliquez sur "🔍 État Système"</li>
            <li>Vérifiez que WebSocket devient "🟢 Connecté"</li>
            <li>Testez à nouveau avec une candidature</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
