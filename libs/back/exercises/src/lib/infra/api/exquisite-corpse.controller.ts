import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { SubmitTurnRequestDto } from '@owl/shared/contracts';
import { IsNotEmpty, IsString } from 'class-validator';

import { ExerciseException } from '../../domain/model';
import {
  CancelTurnCommand,
  SubmitTurnCommand,
  TakeTurnCommand,
} from '../../domain/ports';

class SubmitTurnRequestDtoImpl implements SubmitTurnRequestDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}

@Controller('exquisite-corpse')
@ApiBearerAuth()
export class ExquisiteCorpseController {
  constructor(
    private readonly takeTurnCommand: TakeTurnCommand,
    private readonly cancelTurnCommand: CancelTurnCommand,
    private readonly submitTurnCommand: SubmitTurnCommand
  ) {}

  @Post(':id/take-turn')
  @Auth()
  @HttpCode(204)
  async takeTurn(
    @Param('id') exerciseId: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    try {
      await this.takeTurnCommand.execute(request.user.uid, exerciseId);
    } catch (e) {
      if (e instanceof ExerciseException) {
        throw new BadRequestException(e.message);
      }
    }
  }

  @Post(':id/cancel-turn')
  @Auth()
  @HttpCode(204)
  async cancelTurn(
    @Param('id') exerciseId: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    try {
      await this.cancelTurnCommand.execute(request.user.uid, exerciseId);
    } catch (e) {
      if (e instanceof ExerciseException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  @Post(':id/submit-turn')
  @Auth()
  @HttpCode(204)
  async submitTurn(
    @Param('id') exerciseId: string,
    @Req() request: RequestWithUser,
    @Body() body: SubmitTurnRequestDtoImpl
  ): Promise<void> {
    try {
      await this.submitTurnCommand.execute(
        request.user.uid,
        exerciseId,
        body.content
      );
    } catch (e) {
      if (e instanceof ExerciseException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }
}
