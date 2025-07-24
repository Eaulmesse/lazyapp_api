import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToAudit1700000000002 implements MigrationInterface {
    name = 'AddUserIdToAudit1700000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Vérifier si la colonne userId existe déjà
        const hasColumn = await queryRunner.hasColumn('Audit', 'userId');
        
        if (!hasColumn) {
            // Ajouter la colonne userId
            await queryRunner.query(`
                ALTER TABLE \`Audit\` ADD \`userId\` int NULL
            `);

            // Ajouter la clé étrangère
            await queryRunner.query(`
                ALTER TABLE \`Audit\` ADD CONSTRAINT \`FK_Audit_user\` 
                FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la clé étrangère
        await queryRunner.query(`ALTER TABLE \`Audit\` DROP FOREIGN KEY \`FK_Audit_user\``);
        
        // Supprimer la colonne userId
        await queryRunner.query(`ALTER TABLE \`Audit\` DROP COLUMN \`userId\``);
    }
} 