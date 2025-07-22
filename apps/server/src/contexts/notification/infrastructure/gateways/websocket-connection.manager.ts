import { Injectable, Logger } from '@nestjs/common';
import { AuthenticatedSocket } from '@/auth/web-socket/websocket-auth.service';

@Injectable()
export class WebSocketConnectionManager {
  private readonly logger = new Logger(WebSocketConnectionManager.name);
  private readonly userSockets = new Map<string, AuthenticatedSocket>();

  /**
   * Enregistre une connexion utilisateur
   */
  registerConnection(userId: string, socket: AuthenticatedSocket): void {
    // Fermer l'ancienne connexion si elle existe
    const existingSocket = this.userSockets.get(userId);
    // if (existingSocket) {
    //   this.logger.log(
    //     `Fermeture de l'ancienne connexion pour l'utilisateur ${userId}`,
    //   );
    //   existingSocket.disconnect();
    // }

    this.userSockets.set(userId, socket);
    this.logger.log(`Utilisateur ${userId} connecté (Socket: ${socket.id})`);
  }

  /**
   * Supprime une connexion utilisateur
   */
  unregisterConnection(userId: string): void {
    if (this.userSockets.delete(userId)) {
      this.logger.log(`Utilisateur ${userId} déconnecté`);
    }
  }

  /**
   * Récupère le socket d'un utilisateur
   */
  getUserSocket(userId: string): AuthenticatedSocket | undefined {
    return this.userSockets.get(userId);
  }

  /**
   * Vérifie si un utilisateur est connecté
   */
  isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  /**
   * Obtient le nombre d'utilisateurs connectés
   */
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  /**
   * Trouve l'userId associé à un socket par son ID
   */
  findUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, socket] of this.userSockets.entries()) {
      if (socket.id === socketId) {
        return userId;
      }
    }
    return undefined;
  }
}
