import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1700000000001 implements MigrationInterface {
    name = 'CreateUserTable1700000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Vérifier si la table user existe déjà
        const tableExists = await queryRunner.hasTable('user');
        
        if (!tableExists) {
            // Créer la table User
            await queryRunner.query(`
                CREATE TABLE \`user\` (
                    \`id\` int NOT NULL AUTO_INCREMENT,
                    \`name\` varchar(255) NOT NULL,
                    \`email\` varchar(255) NOT NULL,
                    \`password\` varchar(255) NOT NULL,
                    PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB
            `);

            // Ajouter un index unique sur l'email
            await queryRunner.query(`
                ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_user_email\` (\`email\`)
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la table user
        await queryRunner.query(`DROP TABLE \`user\``);
    }
} 