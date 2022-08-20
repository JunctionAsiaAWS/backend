import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfileResponse } from './dtos/user-profile.response';
import { UserJoinRequest } from './dtos/user-join.request';
import { UserProfileUpdateRequest } from './dtos/user-profile-update.request';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('사용자')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: '사용자의 프로필을 조회합니다.' })
  async getUserProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserProfileResponse> {
    const user = await this.userService.findOneById(id);
    return new UserProfileResponse(user);
  }

  @Post()
  @ApiOperation({ summary: '회원 가입을 진행합니다.' })
  async joinUser(@Body() data: UserJoinRequest): Promise<UserProfileResponse> {
    const user = await this.userService.createUser(data);
    return new UserProfileResponse(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: '회원의 프로필 정보를 수정합니다.' })
  async updateUserProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UserProfileUpdateRequest,
  ): Promise<UserProfileResponse> {
    const user = await this.userService.updateUser(id, data);
    return new UserProfileResponse(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: '회원 탈퇴를 진행합니다.' })
  async withdrawUser(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
    return this.userService.deleteUser(id);
  }
}
