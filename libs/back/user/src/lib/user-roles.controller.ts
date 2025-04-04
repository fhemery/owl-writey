import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth, AuthService } from '@owl/back/auth';
import { Role, UserRoleDto } from '@owl/shared/common/contracts';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { UsersService } from './users.service';

class UserRoleImpl implements UserRoleDto {
  @IsNotEmpty()
  @IsEnum(Role)
  role!: Role;
}

@Controller('users/:id/roles')
@ApiBearerAuth()
export class UserRolesController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  @Auth(Role.Admin)
  async setUserRoles(
    @Param('id') id: string,
    @Body() userRole: UserRoleImpl
  ): Promise<void> {
    const user = await this.usersService.get(id);
    if (!user) {
      throw new NotFoundException();
    }
    await this.authService.addRole(id, userRole.role);
  }
}
