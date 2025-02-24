import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddExerciseStatus1740404126361 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'exercises',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['Ongoing', 'Finished', 'Archived'],
        default: "'Ongoing'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('exercises', 'status');
  }
}
