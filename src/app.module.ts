import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './modules/tasks/tasks.service';
import { LoginService } from './modules/login/login.service';
import { ProductService } from './modules/product/product.service';
import { ExportExcelService } from './modules/export/exportExcel.service';
import { MaotaiService } from './modules/maotai/maotai.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, TasksService, LoginService, ProductService, ExportExcelService, MaotaiService],
})
export class AppModule {
}
