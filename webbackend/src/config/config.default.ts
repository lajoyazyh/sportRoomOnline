import { MidwayConfig } from '@midwayjs/core';
import * as entities from '../entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1752299389329_2928',
  koa: {
    port: 7001,
  },
  // CORS 配置
  cors: {
    origin: 'http://localhost:5173', // 允许前端域名
    credentials: true, // 允许携带cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
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
} as MidwayConfig;
