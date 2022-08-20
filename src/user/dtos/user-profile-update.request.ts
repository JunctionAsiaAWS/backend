import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileUpdateRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;
}
