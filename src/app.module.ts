import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BodyMetricsModule } from './modules/body-metrics/bodyMetrics.module';
import { DatabaseConfig } from 'config/database.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    AuthModule,
    BodyMetricsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
