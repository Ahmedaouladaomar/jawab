import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Threads1708856338219 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "threads",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true
                    },
                    {
                        name: "content",
                        type: "text",
                    },
                    {
                        name: "userId",
                        type: "bigint",
                        foreignKeyConstraintName: "fk_threads_user"
                    },
                    {
                        name: "reactions",
                        type: "json",
                        isNullable: true
                    },
                    {
                        name: "date_created",
                        type: "timestamptz"
                    },
                    {
                        name: "deletedAt",
                        type: "timestamptz",
                        isNullable: true
                    }
                ],
                foreignKeys: [
                    {
                        name: "userId",
                        columnNames: [ "userId" ],
                        referencedTableName: "users",
                        referencedColumnNames: [ "id" ]
                    }
                ]
            }),
            true,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
