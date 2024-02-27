import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Users1703160182305 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true
                    },
                    {
                        name: "username",
                        type: "varchar",
                        isUnique: true
                    },
                    {
                        name: "firstName",
                        type: "varchar",
                    },
                    {
                        name: "lastName",
                        type: "varchar",
                    },
                    {
                        name: "password",
                        type: "varchar",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "date_created",
                        type: "timestamptz"
                    },
                    {
                        name: "verificationCode",
                        type: "bigint",
                        isNullable: true
                    },
                    {
                        name: "verificationCodeExpireDate",
                        type: "timestamptz",
                        isNullable: true
                    }
                ],
            }),
            true,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
