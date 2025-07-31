import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as swagger from '@midwayjs/swagger';
import * as orm from '@midwayjs/typeorm';
import * as jwt from '@midwayjs/jwt';
import * as upload from '@midwayjs/upload';
// import * as staticFile from '@midwayjs/static-file'; // 不需要静态文件服务
// import * as cors from '@koa/cors'; // 临时注释掉，使用手动CORS处理
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';

@Configuration({
  imports: [
    koa,
    orm,
    swagger,
    validate,
    jwt,
    upload, // 保留upload，用于处理临时文件
    // staticFile, // 移除静态文件服务，因为我们不需要提供文件访问
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // CORS配置 - 必须在其他中间件之前加载
    this.app.use(async (ctx, next) => {
      // 设置CORS头
      ctx.set('Access-Control-Allow-Origin', 'http://localhost:5173');
      ctx.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      ctx.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Accept, X-Requested-With'
      );
      ctx.set('Access-Control-Allow-Credentials', 'true');
      ctx.set('Access-Control-Max-Age', '86400');

      // 处理预检请求
      if (ctx.method === 'OPTIONS') {
        ctx.status = 200;
        return;
      }

      await next();
    });

    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
