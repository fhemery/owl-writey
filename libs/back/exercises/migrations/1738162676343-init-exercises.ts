import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitExercises1738162676343 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'exercises',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'data',
            type: 'json',
          },
        ],
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'exercise_participants',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'participantUid',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'role',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'exerciseId',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['exerciseId'],
            referencedTableName: 'exercises',
            referencedColumnNames: ['id'],
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exercise_participants');
    await queryRunner.dropTable('exercises');
  }
}
