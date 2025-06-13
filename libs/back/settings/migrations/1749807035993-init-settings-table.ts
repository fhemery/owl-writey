import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class InitSettingsTable1749807035993 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'settings',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'key',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'scope',
                        type: 'varchar',
                        length: '20',
                        isNullable: false,
                    },
                    {
                        name: 'scopeId',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'value',
                        type: 'json',
                        isNullable: false,
                    },
                    {
                        name: 'updatedAt',
                        type: 'datetime',
                        isNullable: false,
                    },
                    {
                        name: 'updatedBy',
                        type: 'varchar',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        // Create unique index on (key, scope, scopeId)
        await queryRunner.createIndex(
            'settings',
            new TableIndex({
                name: 'IDX_SETTINGS_KEY_SCOPE',
                columnNames: ['key', 'scope', 'scopeId'],
                isUnique: true,
            }),
        );

        // Create index on (scope, scopeId) for faster lookups
        await queryRunner.createIndex(
            'settings',
            new TableIndex({
                name: 'IDX_SETTINGS_SCOPE',
                columnNames: ['scope', 'scopeId'],
            }),
        );
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('settings', 'IDX_SETTINGS_SCOPE');
        await queryRunner.dropIndex('settings', 'IDX_SETTINGS_KEY_SCOPE');
        await queryRunner.dropTable('settings');
    }
}
