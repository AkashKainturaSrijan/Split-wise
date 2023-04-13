import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TripsController } from './app/trips/trips.controller';
import { UserController } from './app/user/user.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/splitwise', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  ],
  controllers: [AppController, TripsController, UserController],
  providers: [AppService],
})
export class AppModule {}
