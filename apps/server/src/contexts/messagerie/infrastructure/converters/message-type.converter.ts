import { MessageType as DomainMessageType } from '../../domain/message.entity';
import { MessageType as PrismaMessageType } from '@prisma/client';

export class MessageTypeConverter {
  /**
   * Convertit MessageType du domain vers Prisma
   */
  static toPrisma(domainType: DomainMessageType): PrismaMessageType {
    switch (domainType) {
      case DomainMessageType.TEXT:
        return PrismaMessageType.TEXT;
      case DomainMessageType.IMAGE:
        return PrismaMessageType.IMAGE;
      case DomainMessageType.FILE:
        return PrismaMessageType.FILE;
      case DomainMessageType.SYSTEM:
        return PrismaMessageType.SYSTEM;
      default:
        throw new Error(`Unknown domain message type: ${String(domainType)}`);
    }
  }

  /**
   * Convertit MessageType de Prisma vers le domain
   */
  static toDomain(prismaType: PrismaMessageType): DomainMessageType {
    switch (prismaType) {
      case PrismaMessageType.TEXT:
        return DomainMessageType.TEXT;
      case PrismaMessageType.IMAGE:
        return DomainMessageType.IMAGE;
      case PrismaMessageType.FILE:
        return DomainMessageType.FILE;
      case PrismaMessageType.SYSTEM:
        return DomainMessageType.SYSTEM;
      default:
        throw new Error(`Unknown prisma message type: ${String(prismaType)}`);
    }
  }
}
