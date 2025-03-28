import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNovelContentsTable1743164505564
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'novel_contents',
        columns: [
          {
            name: 'novelId',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'content',
            type: 'json',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('novel_contents');
  }
}
