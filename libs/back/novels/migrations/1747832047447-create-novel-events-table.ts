import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNovelEventsTable1747832047447 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'novel_events',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'novelId',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'eventId',
            type: 'varchar',
            length: '36',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'eventName',
            type: 'varchar',
            length: '128',
            isNullable: false,
          },
          {
            name: 'eventVersion',
            type: 'varchar',
            length: '16',
            isNullable: false,
          },
          {
            name: 'data',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          {
            name: 'IDX_NOVEL_EVENTS_NOVEL_ID',
            columnNames: ['novelId']
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('novel_events');
  }
}
