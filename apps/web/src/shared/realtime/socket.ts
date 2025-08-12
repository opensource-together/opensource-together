import { Socket, io } from "socket.io-client";

/**
 * Socket service
 * @description Service responsible for managing WebSocket connections.
 * Allows you to connect, disconnect, emit and listen to events.
 */
export class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  /**
   * Connect to WebSocket server with auth token.
   * Avoids reconnecting if already connected with the same token.
   */
  connect(token: string) {
    if (this.socket?.connected && this.token === token) return;

    this.disconnect();
    this.token = token;

    this.socket = io(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
      query: { "x-ws-token": token },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => console.log("🔌 WebSocket connecté"));
    this.socket.on("disconnect", () => console.log("🔌 WebSocket déconnecté"));
    this.socket.on("connect_error", (error) =>
      console.error("🔌 Erreur de connexion:", error)
    );
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.token = null;
  }

  on<T = unknown>(event: string, callback: (data: T) => void) {
    this.socket?.on(event, callback);
  }

  off<T = unknown>(event: string, callback?: (data: T) => void) {
    this.socket?.off(event, callback);
  }

  emit<T = unknown>(event: string, data?: T) {
    this.socket?.emit(event, data);
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socket = new SocketService();
