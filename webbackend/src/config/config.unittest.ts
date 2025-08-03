import { MidwayConfig } from '@midwayjs/core';
import { join } from 'path';

export default {
  koa: {
    port: null,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: join(__dirname, '../../test.db'),
        synchronize: true,
        logging: false, // 关闭测试时的SQL日志
        entities: ['src/entity/*.entity{.ts,.js}'],
        // 测试环境特殊配置
        dropSchema: true, // 每次测试前清空数据库
        cache: false,
        extra: {
          // SQLite特殊配置，避免并发问题
          timeout: 20000,
          busyTimeout: 30000,
        },
      },
    },
  },
  jwt: {
    secret: 'test-secret-key',
    expiresIn: '1h',
  },
} as MidwayConfig;
