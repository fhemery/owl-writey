import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitUserProfilesTable1737992926152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_profiles',
        columns: [
          {
            name: 'uid',
            type: 'varchar(36)',
            isPrimary: true,
          },
          { name: 'email', type: 'varchar(255)', isUnique: true },
          { name: 'name', type: 'varchar(255)' },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_profiles');
  }
}
