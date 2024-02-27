import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";

export const dbConfigOptions: TypeOrmModuleAsyncOptions = 
{
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: ['src/../entities/*{.ts,.js}'],
        migrations: ['src/migrations/*{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: false,
    }),
    inject: [ConfigService],
};