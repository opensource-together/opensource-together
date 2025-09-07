import { Inject, Injectable } from '@nestjs/common';
import { APPLICATION_REPOSITORY } from '../repositories/application.repository.interface';
import { ApplicationRepository } from '../repositories/application.repository.interface';

@Injectable()
export class ApplicationService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
  ) {}
}
