import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { Role } from './role/role.entity';
import { Staff } from './staff/staff.entity';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      entities: [Role, Staff],
      host: process.env.DATABASE_HOST || '',
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      username: process.env.DATABASE_USERNAME || '',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || '',
      synchronize: true,
    }),
    HttpModule,
    TerminusModule,
    LoggerModule,
    AuthModule,
    RoleModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
