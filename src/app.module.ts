import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './contexts/users/users.module';
import { MapModule } from './contexts/map/map.module';
import { PrismaModule } from './db/prisma/prisma.module';

@Module({
  imports: [UsersModule, MapModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
