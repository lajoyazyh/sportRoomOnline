import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/controller/user.test.ts', () => {
  let app;

  beforeAll(async () => {
    // 创建应用实例
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    // 关闭应用
    await close(app);
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser_' + Date.now(), // 使用时间戳避免重复
        password: '123456',
        email: 'test@example.com',
        phone: '13800138000',
        nickname: '测试用户',
        name: '张三',
        age: 25,
        gender: '男'
      };

      const result = await createHttpRequest(app)
        .post('/api/user/register')
        .send(userData);

      expect(result.status).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.message).toBe('注册成功');
      expect(result.body.data).toBeDefined();
      expect(result.body.data.username).toBe(userData.username);
    });

    it('should fail when registering with existing username', async () => {
      const userData = {
        username: 'duplicate_user',
        password: '123456',
        email: 'test1@example.com',
        phone: '13800138001'
      };

      // 先注册一次
      await createHttpRequest(app)
        .post('/api/user/register')
        .send(userData);

      // 再次注册相同用户名
      const result = await createHttpRequest(app)
        .post('/api/user/register')
        .send(userData);

      expect(result.status).toBe(200);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toBe('用户名已存在');
    });
  });

  describe('User Login', () => {
    let testUser = {
      username: 'logintest_' + Date.now(),
      password: '123456',
      email: 'login@example.com',
      phone: '13900139000'
    };

    beforeAll(async () => {
      // 先创建一个测试用户
      await createHttpRequest(app)
        .post('/api/user/register')
        .send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        username: testUser.username,
        password: testUser.password
      };

      const result = await createHttpRequest(app)
        .post('/api/user/login')
        .send(loginData);

      expect(result.status).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.message).toBe('登录成功');
      expect(result.body.data).toBeDefined();
      expect(result.body.data.token).toBeDefined();
      expect(result.body.data.user).toBeDefined();
    });

    it('should fail login with incorrect password', async () => {
      const loginData = {
        username: testUser.username,
        password: 'wrongpassword'
      };

      const result = await createHttpRequest(app)
        .post('/api/user/login')
        .send(loginData);

      expect(result.status).toBe(200);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toBe('用户名或密码错误');
    });

    it('should fail login with non-existent user', async () => {
      const loginData = {
        username: 'nonexistentuser',
        password: '123456'
      };

      const result = await createHttpRequest(app)
        .post('/api/user/login')
        .send(loginData);

      expect(result.status).toBe(200);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toBe('用户名或密码错误');
    });
  });

  describe('User Profile', () => {
    let authToken = '';
    let testUser = {
      username: 'profiletest_' + Date.now(),
      password: '123456',
      email: 'profile@example.com',
      phone: '13700137000'
    };

    beforeAll(async () => {
      // 注册并登录获取token
      await createHttpRequest(app)
        .post('/api/user/register')
        .send(testUser);

      const loginResult = await createHttpRequest(app)
        .post('/api/user/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      authToken = loginResult.body.data.token;
    });

    it('should get user profile with valid token', async () => {
      const result = await createHttpRequest(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(result.status).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.message).toBe('获取用户信息成功');
      expect(result.body.data).toBeDefined();
      expect(result.body.data.username).toBe(testUser.username);
    });

    it('should fail to get profile without token', async () => {
      const result = await createHttpRequest(app)
        .get('/api/user/profile');

      expect(result.status).toBe(200);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toBe('缺少认证令牌');
    });

    it('should fail to get profile with invalid token', async () => {
      const result = await createHttpRequest(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(result.status).toBe(200);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toBe('无效的认证令牌');
    });
  });
});
