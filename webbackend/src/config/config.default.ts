import { MidwayConfig } from '@midwayjs/core';
import * as entities from '../entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1752299389329_2928',
  koa: {
    port: 7001,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: 'webbackend.db',
        synchronize: true,
        logging: true,
        entities: [...Object.values(entities)],
      },
    },
  },
  // JWT 配置
  jwt: {
    secret: 'your-super-secret-jwt-key-2024', // JWT 密钥，生产环境请使用更复杂的密钥
    expiresIn: '7d', // token 过期时间，7天
  },
  // 文件上传配置 - 仅用于临时处理，最终存储为base64
  upload: {
    mode: 'file',
    fileSize: '10mb',
    whitelist: ['.jpg', '.jpeg', '.png', '.gif'],
    tmpdir: 'uploads', // 临时目录
    cleanTimeout: 5 * 60 * 1000, // 5分钟后自动清理临时文件
  },
} as MidwayConfig;
