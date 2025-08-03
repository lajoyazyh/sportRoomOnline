import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/controller/api.test.ts', () => {
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

  it('should GET /api/get_user', async () => {
    // make request
    const result = await createHttpRequest(app).get('/api/get_user').query({ uid: 123 });

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('OK');
  }, 10000); // 设置10秒超时时间
});
