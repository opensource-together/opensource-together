import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ApplicationStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class AcceptOrRejectApplicationRequestDto {
  @IsNotEmpty()
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
