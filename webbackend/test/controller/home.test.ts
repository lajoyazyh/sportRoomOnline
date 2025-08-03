import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/controller/home.test.ts', () => {
  let app: any;

  beforeAll(async () => {
    // 创建应用实例，增加超时时间
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    // 确保应用正确关闭
    if (app) {
      await close(app);
    }
  });

  it('should GET /', async () => {
    // make request
    const result = await createHttpRequest(app).get('/');

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.text).toBe('Hello Midwayjs!');
  }, 10000); // 设置10秒超时时间
});
