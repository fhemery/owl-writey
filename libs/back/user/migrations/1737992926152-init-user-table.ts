import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitUserTable1737992926152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_profiles',
        columns: [
          {
            name: 'id',
            type: 'varchar(36)',
            isPrimary: true,
            isGenerated: false,
          },
          { name: 'email', type: 'varchar(255)', isUnique: true },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_profiles');
  }
}
