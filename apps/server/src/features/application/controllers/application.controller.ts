import { Body, Controller, Post } from '@nestjs/common';
import { ApplicationService } from '../services/application.service';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  createApplication(@Body() body: any) {
    console.log(body);
    return [];
  }
}
