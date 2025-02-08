import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { UsersService } from '@owl/back/user';
import {
  ExerciseDto,
  ExerciseParticipantRole,
  GetAllExercisesResponseDto,
} from '@owl/shared/contracts';
import { v4 as uuidV4 } from 'uuid';

import { ExerciseRepository } from '../../domain/ports';
import { ExerciseParticipant } from '../../model/exercise';
import { ExerciseException } from '../../model/exercise-exception';
import { ExerciseFactory } from '../../model/exercise-factory';
import { ExerciseToCreateDtoImpl } from './dtos/exercise-to-create.dto.impl';
import { toExerciseDto } from './mappers/exercise-dto.mappers';

@Controller('exercises')
export class ExercisesController {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    private readonly usersService: UsersService
  ) {}

  @Get('')
  @Auth()
  async getAll(
    @Req() request: RequestWithUser
  ): Promise<GetAllExercisesResponseDto> {
    const exercises = await this.exerciseRepository.getAll(request.user.uid);
    return {
      exercises: exercises.map(toExerciseDto),
    };
  }

  @Post('')
  @Auth()
  async create(
    @Body() exerciseDto: ExerciseToCreateDtoImpl,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const id = uuidV4();
    const user = await this.usersService.get(request.user.uid);

    const exercise = ExerciseFactory.From(
      id,
      exerciseDto.name,
      exerciseDto.type,
      exerciseDto.data,
      [
        new ExerciseParticipant(
          request.user.uid,
          user?.name || 'Unknown',
          ExerciseParticipantRole.Admin
        ),
      ]
    );
    await this.exerciseRepository.save(exercise);

    request.res?.location(`/api/exercises/${id}`);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<ExerciseDto> {
    const exercise = await this.exerciseRepository.get(id);
    if (!exercise) {
      throw new NotFoundException();
    }
    return toExerciseDto(exercise);
  }

  @Delete(':id')
  @Auth()
  async delete(
    @Param('id') exerciseId: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const exercise = await this.exerciseRepository.get(exerciseId);
    if (!exercise) {
      throw new NotFoundException();
    }

    try {
      exercise.checkDelete(request.user.uid);

      await this.exerciseRepository.delete(exerciseId);
    } catch (err) {
      if (err instanceof ExerciseException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
    request.res?.status(204);
  }
}
