import 'dotenv/config';
import { Injectable, Logger } from '@nestjs/common';
import { LoginService } from '../login/login.service';
import { ExportExcelService } from '../export/exportExcel.service';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const excelPath = path.resolve(__dirname, '../', 'sheet.xls');

@Injectable()
export class MaotaiService {
  private readonly logger = new Logger(MaotaiService.name);
  constructor(
    private readonly loginService: LoginService,
    private readonly exportExcelService: ExportExcelService,
  ) {}

  async exportProfit() {
    const url = `http://quotes.money.163.com/f10/zycwzb_600519.html`;
    this.logger.log('获取内容: ', url);
    const res = await axios.get(url, {
      headers: {
        'User-Agent': this.loginService.ua,
        cookie: this.loginService.cookieToHeader(),
      },
    });

    this.loginService.cookieStore(res.headers);
    const $ = cheerio.load(res.data);
    const headers = $('.col_r tbody .dbrow')[0].childNodes;
    const years = headers
      .filter((v: any) => v && v.children && v.children[0])
      .map((node: any) => ({
        label: node.children[0].data,
        value: node.children[0].data,
      }));
    console.log('years', years);

    const data = $('.col_r tbody tr')[11]
      .childNodes.filter((v: any) => v && v.children && v.children[0])
      .reduce((obj: any, node: any, i: number) => {
        obj[years[i].value] = node.children[0].data;
        return obj;
      }, {});
    console.log('data', data);

    /**
     * exportExcel(
     titleList: Array<{ label: string; value: string }>,
     dataList: ObjectType[],
     xlsName = 'sheet1',
     )
     */
    const buffer = this.exportExcelService.exportExcel(years, [data], 'sheet1');
    if (buffer) {
      this.logger.log('获取流成功');
      fs.writeFile(excelPath, buffer, err => {
        if (err) throw err;
        this.logger.log('文件写入成功');
      });
    }
  }
}
