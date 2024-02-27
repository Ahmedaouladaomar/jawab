import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Comments1708856360367 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "comments",
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
                        foreignKeyConstraintName: "fk_comments_user"
                    },
                    {
                        name: "threadId",
                        type: "bigint",
                        foreignKeyConstraintName: "fk_comments_thread"
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
                    },
                    {
                        name: "threadId",
                        columnNames: [ "threadId" ],
                        referencedTableName: "threads",
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
