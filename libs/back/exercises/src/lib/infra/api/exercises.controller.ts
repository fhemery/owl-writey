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
import { ExerciseDto, GetAllExercisesResponseDto } from '@owl/shared/contracts';

import { ExerciseToCreate } from '../../domain/model';
import { ExerciseException } from '../../domain/model/exercise-exception';
import {
  ExerciseRepository,
  GetExerciseQuery,
  ListExercisesQuery,
} from '../../domain/ports';
import { CreateExerciseCommand } from '../../domain/ports/in/commands';
import { ExerciseToCreateDtoImpl } from './dtos/exercise-to-create.dto.impl';
import {
  toExerciseDto,
  toExerciseSummaryDto,
} from './mappers/exercise-dto.mappers';

@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly listExercisesQuery: ListExercisesQuery,
    private readonly createExerciseCommand: CreateExerciseCommand,
    private readonly getExerciseQuery: GetExerciseQuery,
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    private readonly usersService: UsersService
  ) {}

  @Get('')
  @Auth()
  async getAll(
    @Req() request: RequestWithUser
  ): Promise<GetAllExercisesResponseDto> {
    const exercises = await this.listExercisesQuery.execute(request.user.uid);
    return {
      exercises: exercises.map(toExerciseSummaryDto),
    };
  }

  @Post('')
  @Auth()
  async create(
    @Body() exerciseDto: ExerciseToCreateDtoImpl,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const id = await this.createExerciseCommand.execute(
      request.user.uid,
      new ExerciseToCreate(exerciseDto.name, exerciseDto.type, exerciseDto.data)
    );

    request.res?.location(`/api/exercises/${id}`);
  }

  @Get(':id')
  @Auth()
  async get(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<ExerciseDto> {
    const exercise = await this.getExerciseQuery.execute(request.user.uid, id);
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
