import { Socket, io } from "socket.io-client";

export interface WebSocketMessage {
  id: string;
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
  readAt: string | null;
}

type NotificationCallback = (message: WebSocketMessage) => void;

class WebSocketManager {
  private socket: Socket | null = null;
  private token: string | null = null;
  private isConnecting = false;
  private connectionPromise: Promise<void> | null = null;
  private notificationCallbacks: Set<NotificationCallback> = new Set();

  // Méthode pour s'abonner aux notifications
  subscribe(callback: NotificationCallback): () => void {
    this.notificationCallbacks.add(callback);

    // Retourner une fonction pour se désabonner
    return () => {
      this.notificationCallbacks.delete(callback);
    };
  }

  // Méthode pour notifier tous les abonnés
  private notifySubscribers(message: WebSocketMessage): void {
    this.notificationCallbacks.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        console.error("Erreur dans le callback de notification:", error);
      }
    });
  }

  connect(token: string): Promise<void> {
    // Si déjà connecté avec le même token, retourner la promesse existante
    if (this.socket?.connected && this.token === token) {
      return Promise.resolve();
    }

    // Si une connexion est en cours, retourner la promesse existante
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Si déjà connecté mais token différent, déconnecter d'abord
    if (this.socket?.connected) {
      this.disconnect();
    }

    this.token = token;
    this.isConnecting = true;

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.socket = io(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
          query: { "x-ws-token": token },
          transports: ["websocket"],
        });

        this.socket.on("connect", () => {
          console.log("Socket.IO : WebSocket connecté avec succès");
          this.isConnecting = false;
          this.connectionPromise = null;
          resolve();
        });

        this.socket.on("disconnect", (reason) => {
          console.log("Socket.IO : WebSocket déconnecté:", reason);
          this.isConnecting = false;
          this.connectionPromise = null;

          // Seulement se reconnecter si ce n'est pas une déconnexion volontaire
          if (reason !== "io client disconnect" && this.token) {
            console.log("Socket.IO : Tentative de reconnexion automatique...");
            setTimeout(() => this.connect(this.token!), 2000);
          }
        });

        this.socket.on("connect_error", (error) => {
          console.error("Socket.IO : Erreur de connexion WebSocket:", error);
          this.isConnecting = false;
          this.connectionPromise = null;
          reject(error);
        });

        // Écouter les nouvelles notifications
        this.socket.on("new-notification", (data: WebSocketMessage) => {
          this.handleNewNotification(data);
        });

        // Timeout de sécurité
        setTimeout(() => {
          if (!this.socket?.connected) {
            this.isConnecting = false;
            this.connectionPromise = null;
            reject(new Error("Timeout de connexion"));
          }
        }, 5000);
      } catch (error) {
        this.isConnecting = false;
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
    this.connectionPromise = null;
    this.token = null;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  private handleNewNotification(message: WebSocketMessage): void {
    this.notifySubscribers(message);
  }
}

// Instance singleton globale
const webSocketManager = new WebSocketManager();

// Fonctions d'export simples
export const connectWebSocket = (token: string) =>
  webSocketManager.connect(token);
export const disconnectWebSocket = () => webSocketManager.disconnect();
export const isWebSocketConnected = () => webSocketManager.isConnected();
export const subscribeToNotifications = (callback: NotificationCallback) =>
  webSocketManager.subscribe(callback);
