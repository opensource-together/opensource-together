import { Socket, io } from "socket.io-client";

export class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

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
