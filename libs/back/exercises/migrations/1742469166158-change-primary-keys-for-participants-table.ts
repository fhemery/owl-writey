import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePrimaryKeysForParticipantsTable1742469166158
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE exercise_participants MODIFY id INT NOT NULL DEFAULT 0`
    );
    await queryRunner.query(
      `ALTER TABLE exercise_participants DROP PRIMARY KEY`
    );
    await queryRunner.query(
      `ALTER TABLE exercise_participants ADD PRIMARY KEY (participantUid, exerciseId)`
    );
    await queryRunner.query(`ALTER TABLE exercise_participants DROP COLUMN id`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE exercise_participants DROP PRIMARY KEY`
    );
    await queryRunner.query(
      `ALTER TABLE exercise_participants ADD COLUMN id INT PRIMARY KEY AUTO_INCREMENT`
    );
  }
}
