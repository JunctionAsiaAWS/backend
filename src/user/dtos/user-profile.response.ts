import { User } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponse {
  @ApiProperty() id!: string;
  @ApiProperty() username!: string;
  @ApiProperty() email!: string;
  @ApiProperty() name!: string;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;

  constructor(data: User) {
    Object.assign(this, data);
  }
}
