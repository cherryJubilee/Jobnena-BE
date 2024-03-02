import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CrawlingService {
  async getJobDetail(jobLink: string) {
    const { data } = await axios.get(jobLink);
    const cheerio = require('cheerio');
    const $ = cheerio.load(data);
    const address = $('.address strong').text().trim();

    return address;
  }

  async getJobData(keyword: string) {
    const cheerio = require('cheerio');
    let jobsList = [];

    // 여러 페이지에 걸쳐 데이터를 수집합니다.
    for (let pageNo = 1; pageNo <= 5; pageNo++) {
      const pageUrl = `https://www.jobkorea.co.kr/Search/?stext=${keyword}&tabType=recruit&Page_No=${pageNo}`;
      const { data } = await axios.get(pageUrl);
      const $ = cheerio.load(data);

      const pageJobLinks = [];
      $('.post').each((_, node) => {
        const href = $(node).find('a.title').attr('href');
        if (href) {
          // href 값이 있는 경우에만 jobLink를 구성합니다.
          const jobLink = 'https://www.jobkorea.co.kr' + href;
          pageJobLinks.push(jobLink);
        }
      });

      const addressPromises = pageJobLinks.map((link) =>
        this.getJobDetail(link),
      );
      const addresses = await Promise.all(addressPromises);

      const pageJobsList = $('.post')
        .toArray()
        .map((node, index) => {
          const $node = $(node);
          return {
            jobTitle: $node.find('.title:eq(0)').text().trim(),
            company: $node.find('.name:eq(0)').text().trim(),
            jobLink: pageJobLinks[index],
            address: addresses[index],
            experience: $node.find('.exp:eq(0)').text().trim(),
            education: $node.find('.edu:eq(0)').text().trim(),
            regularYN: $node.find('.option>span:eq(2)').text().trim(),
            region: $node.find('.long:eq(0)').text().trim(),
            dueDate: $node.find('.date:eq(0)').text().trim(),
            etc: $node.find('.etc:eq(0)').text().trim(),
          };
        });

      jobsList = jobsList.concat(pageJobsList); // 현재 페이지의 결과를 총 결과에 추가합니다.
    }

    return jobsList;
  }
}
