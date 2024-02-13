import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BodyMetricsModule } from './modules/body-metrics/bodyMetrics.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/gym-track'),
    AuthModule,
    BodyMetricsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
