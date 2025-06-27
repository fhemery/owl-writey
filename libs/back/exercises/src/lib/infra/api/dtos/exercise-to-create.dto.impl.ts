import { ApiProperty } from '@nestjs/swagger';
import {
  ExerciseToCreateDto,
  ExerciseType,
} from '@owl/shared/exercises/contracts';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ExerciseToCreateDtoImpl implements ExerciseToCreateDto {
  @ApiProperty({
    description: 'The name of the exercise',
    example: 'My Writing Exercise',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'The type of the exercise',
    enum: ExerciseType,
    enumName: 'ExerciseType',
    example: ExerciseType.ExquisiteCorpse,
  })
  @IsEnum(ExerciseType)
  @IsNotEmpty()
  type!: ExerciseType;

  @ApiProperty({
    description: 'Configuration specific to the exercise type',
    example: {
      nbIterations: 5,
      initialContent: 'Once upon a time...',
      iterationDuration: 300,
      textSize: {
        minWords: 10,
        maxWords: 100,
      },
    },
    required: true,
  })
  @IsNotEmpty()
  config!: unknown;
}
