import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MapModule } from './contexts/map/map.module';
import { UsersModule } from './contexts/users/users.module';
import { CrawlingModule } from './crawling/crawling.module';
import { PrismaModule } from './db/prisma/prisma.module';

@Module({
  imports: [UsersModule, MapModule, PrismaModule, CrawlingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
