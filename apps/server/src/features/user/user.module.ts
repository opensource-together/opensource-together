import { Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './services/user.service';
import { PrismaUserRepository } from './repositories/prisma.user.repository';
import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { PrismaModule } from 'prisma/prisma.module';
import { setUserService } from './services/user.holder';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  onModuleInit(): void {
    setUserService(this.userService);
  }
}
