import 'dotenv/config';
import { Injectable, Logger } from '@nestjs/common';
import xlsx from 'node-xlsx';

@Injectable()
export class ExportExcelService {
  private readonly logger = new Logger(ExportExcelService.name);

  /**
   * 导出excel
   * @param titleList 标题
   * @param dataList 数据
   * @param xlsName sheet的名称
   */
  public exportExcel(
    titleList: Array<{ label: string; value: string }>,
    dataList: Record<string,any>[],
    xlsName = 'sheet1',
  ): ArrayBuffer {
    const data = []; // 其实最后就是把这个数组写入excel
    data.push(titleList.map(item => item.label)); // 添加完列名 下面就是添加真正的内容了
    // [{'2020': 1000, '2021': 1000}, '2021': 1000]
    dataList.forEach(element => {
      const arrInner = [];
      for (let i = 0; i < titleList.length; i++) {
        arrInner.push(element[titleList[i].value]);
      }
      data.push(arrInner); // data中添加的要是数组，可以将对象的值分解添加进数组，例如：['1','name','上海']
    });
    console.log('excel数据', data);
    const buffer = xlsx.build([
      {
        name: xlsName,
        data,
      },
    ]);
    return buffer;
  }
}
