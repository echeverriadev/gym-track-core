import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/gym-track'),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
