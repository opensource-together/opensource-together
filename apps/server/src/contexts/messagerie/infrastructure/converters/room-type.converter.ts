import { RoomType as DomainRoomType } from '../../domain/room.entity';
import { RoomType as PrismaRoomType } from '@prisma/client';

export class RoomTypeConverter {
  /**
   * Convertit RoomType du domain vers Prisma
   */
  static toPrisma(domainType: DomainRoomType): PrismaRoomType {
    switch (domainType) {
      case DomainRoomType.DIRECT:
        return PrismaRoomType.DIRECT;
      case DomainRoomType.GROUP:
        return PrismaRoomType.GROUP;
      case DomainRoomType.SYSTEM:
        return PrismaRoomType.SYSTEM;
      default:
        throw new Error(`Unknown domain room type: ${domainType}`);
    }
  }

  /**
   * Convertit RoomType de Prisma vers le domain
   */
  static toDomain(prismaType: PrismaRoomType): DomainRoomType {
    switch (prismaType) {
      case PrismaRoomType.DIRECT:
        return DomainRoomType.DIRECT;
      case PrismaRoomType.GROUP:
        return DomainRoomType.GROUP;
      case PrismaRoomType.SYSTEM:
        return DomainRoomType.SYSTEM;
      default:
        throw new Error(`Unknown prisma room type: ${prismaType}`);
    }
  }
}
