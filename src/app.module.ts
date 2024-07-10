import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Event } from './events/event.entity';
import { EventsModule } from './events/events.module';
import ormConfig from './config/orm.config';
import { SchoolModule } from './school/school.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig
    }),
    EventsModule,
    SchoolModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [{
    provide: AppService,
    useClass: AppService
  }]
})
export class AppModule { }