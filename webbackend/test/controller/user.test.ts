import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/controller/user.test.ts', () => {
  let app: any;

  beforeAll(async () => {
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    if (app) {
      await close(app);
    }
  });

  it('should POST /api/user/register - success', async () => {
    const userData = {
      username: 'testuser',
      password: '123456',
      email: 'test@example.com',
    };

    const result = await createHttpRequest(app)
      .post('/api/user/register')
      .send(userData);

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
  }, 15000);

  it('should POST /api/user/login - success', async () => {
    // 先注册用户
    await createHttpRequest(app)
      .post('/api/user/register')
      .send({
        username: 'loginuser',
        password: '123456',
        email: 'login@example.com',
      });

    // 然后登录
    const result = await createHttpRequest(app)
      .post('/api/user/login')
      .send({
        username: 'loginuser',
        password: '123456',
      });

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.data.token).toBeDefined();
  }, 15000);
});
