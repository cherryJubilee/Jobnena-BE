import { Controller, Get, Query } from '@nestjs/common';
import { CrawlingService } from './crawling.service';

@Controller('crawling')
export class CrawlingController {
  constructor(private readonly crawlingService: CrawlingService) {}

  @Get()
  getJobDate(@Query('keyword') keyword: string) {
    return this.crawlingService.getJobData(keyword);
  }
}
