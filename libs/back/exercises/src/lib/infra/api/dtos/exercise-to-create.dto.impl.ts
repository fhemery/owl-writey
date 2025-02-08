import { ExerciseToCreateDto, ExerciseType } from '@owl/shared/contracts';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class ExerciseToCreateDtoImpl implements ExerciseToCreateDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsEnum(ExerciseType)
  type!: ExerciseType;

  data!: unknown;
}
