# SportRoomOnline 技术文档

## 📋 目录
- [项目概览](#项目概览)
- [技术架构](#技术架构)
- [开发环境配置](#开发环境配置)
- [API 接口文档](#api-接口文档)
- [数据库设计](#数据库设计)
- [CI/CD 流程](#cicd-流程)
- [测试策略](#测试策略)
- [部署指南](#部署指南)

## 🎯 项目概览

**SportRoomOnline** 是一个现代化的体育活动室在线管理系统，采用前后端分离的架构设计，为用户提供完整的体育活动管理解决方案。

### 核心功能
- 👤 **用户管理系统**：注册、登录、个人资料管理
- 📅 **活动发布管理**：创建、编辑、删除体育活动
- 📝 **报名订单系统**：在线报名、订单管理、支付集成
- 💬 **社交互动平台**：用户动态、活动评价、社交广场

### 项目特色
- ⚡ **高性能**：基于现代化技术栈，优化加载速度
- 📱 **响应式设计**：完美支持移动端和桌面端
- 🔒 **安全可靠**：JWT身份验证，数据加密传输
- 🛠️ **开发友好**：完整的CI/CD流程，自动化测试
- 📊 **监控完善**：代码质量监控，错误追踪

## 🏗️ 技术架构

### 整体架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 (React)   │    │  后端 (Node.js)  │    │   数据库 (SQLite) │
│                 │    │                 │    │                 │
│ • React 18      │◄──►│ • Midway.js     │◄──►│ • TypeORM       │
│ • React Router  │    │ • TypeScript    │    │ • 实体关系映射    │
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • 自动同步       │
│ • Vite          │    │ • RESTful API   │    │ • 测试隔离       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 前端架构
```typescript
// 技术栈
React 18.2.0          // UI 框架
React Router 7.x      // 路由管理
Tailwind CSS 3.x     // 样式框架
Vite 5.x             // 构建工具
Axios                // HTTP 客户端

// 项目结构
webfrontend/
├── src/
│   ├── api/              # API 接口封装
│   │   ├── auth.js       # 认证相关API
│   │   ├── activity.js   # 活动相关API
│   │   └── profile.js    # 用户相关API
│   ├── pages/            # 页面组件
│   │   ├── Home/         # 首页模块
│   │   ├── Login/        # 登录模块
│   │   ├── Activity/     # 活动管理模块
│   │   ├── Profile/      # 个人中心模块
│   │   └── Square/       # 社交广场模块
│   ├── assets/           # 静态资源
│   ├── App.jsx          # 主应用组件
│   └── main.jsx         # 应用入口
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
└── tailwind.config.js   # Tailwind 配置
```

### 后端架构
```typescript
// 技术栈
Node.js 18+          // 运行环境
TypeScript 5.x       // 编程语言
Midway.js 3.x       // Web 框架
TypeORM 0.3.x       # ORM 框架
SQLite 3.x          // 数据库
JWT                 // 身份验证
Multer              // 文件上传

// 分层架构
webbackend/
├── src/
│   ├── controller/       # 控制器层 - 处理HTTP请求
│   │   ├── user.controller.ts
│   │   ├── activity.controller.ts
│   │   └── registration.controller.ts
│   ├── service/          # 服务层 - 业务逻辑
│   │   ├── user.service.ts
│   │   ├── activity.service.ts
│   │   └── registration.service.ts
│   ├── entity/           # 实体层 - 数据模型
│   │   ├── user.entity.ts
│   │   ├── activity.entity.ts
│   │   └── registration.entity.ts
│   ├── dto/              # 数据传输对象
│   │   ├── user.dto.ts
│   │   ├── activity.dto.ts
│   │   └── registration.dto.ts
│   ├── config/           # 配置文件
│   │   ├── config.default.ts
│   │   └── config.unittest.ts
│   ├── middleware/       # 中间件
│   │   └── report.middleware.ts
│   └── filter/           # 异常过滤器
│       ├── default.filter.ts
│       └── notfound.filter.ts
├── test/                # 测试文件
│   └── controller/
├── uploads/             # 文件上传目录
└── logs/               # 日志目录
```

## ⚙️ 开发环境配置

### 环境要求
```bash
Node.js >= 18.0.0
npm >= 8.0.0
Git >= 2.0.0
```

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/lajoyazyh/sportRoomOnline.git
cd sportRoomOnline
```

2. **后端环境配置**
```bash
cd webbackend
npm install

# 开发模式启动
npm run dev

# 生产模式构建
npm run build
npm start
```

3. **前端环境配置**
```bash
cd webfrontend
npm install

# 开发服务器
npm run dev

# 生产构建
npm run build
```

### 环境变量配置
```bash
# webbackend/.env
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=./webbackend.db
UPLOAD_DIR=./uploads
LOG_LEVEL=info
```

## 📡 API 接口文档

### 认证相关 API

#### 用户注册
```http
POST /api/user/register
Content-Type: application/json

{
  "username": "string",
  "email": "string", 
  "password": "string",
  "phone": "string"
}

Response:
{
  "success": true,
  "data": {
    "id": "number",
    "username": "string",
    "email": "string"
  }
}
```

#### 用户登录
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response:
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "number",
      "username": "string",
      "email": "string"
    }
  }
}
```

#### 获取用户资料
```http
GET /api/user/profile
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "number",
    "username": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string",
    "createdAt": "string"
  }
}
```

### 活动管理 API

#### 创建活动
```http
POST /api/activity
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "startTime": "string",
  "endTime": "string",
  "location": "string",
  "maxParticipants": "number",
  "price": "number"
}

Response:
{
  "success": true,
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "startTime": "string",
    "endTime": "string"
  }
}
```

#### 获取活动列表
```http
GET /api/activities?page=1&limit=10&category=sports
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "activities": [],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### 获取活动详情
```http
GET /api/activity/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "startTime": "string",
    "endTime": "string",
    "location": "string",
    "maxParticipants": "number",
    "currentParticipants": "number",
    "price": "number",
    "creator": {
      "id": "number",
      "username": "string"
    }
  }
}
```

### 报名管理 API

#### 创建报名
```http
POST /api/registration
Authorization: Bearer {token}
Content-Type: application/json

{
  "activityId": "number",
  "notes": "string"
}

Response:
{
  "success": true,
  "data": {
    "id": "number",
    "activityId": "number",
    "userId": "number",
    "status": "pending",
    "registrationTime": "string"
  }
}
```

#### 获取报名列表
```http
GET /api/registrations?status=confirmed&page=1&limit=10
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "registrations": [],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### 通用 API

#### 文件上传
```http
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
file: File

Response:
{
  "success": true,
  "data": {
    "filename": "string",
    "url": "string",
    "size": "number"
  }
}
```

#### 健康检查
```http
GET /
Response:
{
  "message": "Hello SportRoomOnline!",
  "timestamp": "string",
  "version": "1.0.0"
}
```

## 🗄️ 数据库设计

### 实体关系图 (ERD)
```
┌─────────────┐       ┌──────────────┐       ┌─────────────────┐
│    User     │       │   Activity   │       │  Registration   │
├─────────────┤       ├──────────────┤       ├─────────────────┤
│ id (PK)     │   ┌──►│ id (PK)      │◄──┐   │ id (PK)         │
│ username    │   │   │ title        │   │   │ userId (FK)     │
│ email       │   │   │ description  │   │   │ activityId (FK) │
│ password    │   │   │ startTime    │   └───│ status          │
│ phone       │   │   │ endTime      │       │ registrationTime│
│ avatar      │   │   │ location     │       │ notes           │
│ createdAt   │   │   │ maxParticipants     │ createdAt       │
│ updatedAt   │   │   │ price        │       │ updatedAt       │
└─────────────┘   │   │ creatorId (FK)      └─────────────────┘
                  └───│ createdAt    │
                      │ updatedAt    │
                      └──────────────┘
```

### 数据表详细设计

#### 用户表 (User)
```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 活动表 (Activity)
```sql
CREATE TABLE activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(200),
    max_participants INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    creator_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES user(id)
);
```

#### 报名表 (Registration)
```sql
CREATE TABLE registration (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    registration_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (activity_id) REFERENCES activity(id),
    UNIQUE(user_id, activity_id)
);
```

### TypeORM 实体定义

#### User Entity
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Activity, activity => activity.creator)
  createdActivities: Activity[];

  @OneToMany(() => Registration, registration => registration.user)
  registrations: Registration[];
}
```

## 🔄 CI/CD 流程

### GitHub Actions 工作流

#### 1. Basic CI (.github/workflows/basic-ci.yml)
```yaml
name: Basic CI/CD Pipeline
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Backend CI
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Backend Dependencies
        run: |
          cd webbackend
          npm ci
          
      - name: Lint Backend
        run: |
          cd webbackend
          npm run lint
          
      - name: TypeScript Check
        run: |
          cd webbackend
          npm run build
          
      - name: Run Tests
        run: |
          cd webbackend
          npm run test:ci
          
      # Frontend CI
      - name: Frontend Dependencies
        run: |
          cd webfrontend
          npm ci
          
      - name: Lint Frontend
        run: |
          cd webfrontend
          npm run lint
          
      - name: Build Frontend
        run: |
          cd webfrontend
          npm run build
          
      # Security Audit
      - name: Security Audit
        run: |
          cd webbackend && npm audit --audit-level high
          cd webfrontend && npm audit --audit-level high
```

#### 2. Code Quality (.github/workflows/code-quality.yml)
```yaml
name: Code Quality Analysis
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: |
          cd webbackend && npm ci
          cd webfrontend && npm ci
          
      - name: Code Quality Analysis
        run: |
          cd webbackend
          npm run lint:report || true
          
      - name: Security Scan
        run: |
          npx audit-ci --config audit-ci.json
          
      - name: Project Statistics
        run: |
          echo "📊 Project Statistics"
          find . -name "*.ts" -o -name "*.js" -o -name "*.jsx" | wc -l
          find . -name "*.test.*" | wc -l
```

#### 3. Multi-Version Testing (.github/workflows/webpack.yml)
```yaml
name: Multi-Version Compatibility
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
        
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          
      - name: Install and Test
        run: |
          cd webbackend
          npm ci
          npm run build
          npm run test:ci
          
      - name: Webpack Build Test
        run: |
          cd webfrontend
          npm ci
          npm run build
```

### CI/CD 流程图
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Code Push  │───►│   Basic CI  │───►│  Deploy     │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ Code Quality│
                   └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │Multi-Version│
                   └─────────────┘
```

## 🧪 测试策略

### 测试层次结构
```
测试金字塔:
    ┌─────────────────┐
    │   E2E Tests     │  ← 端到端测试 (计划中)
    ├─────────────────┤
    │ Integration     │  ← 集成测试 (部分实现)
    │     Tests       │
    ├─────────────────┤
    │   Unit Tests    │  ← 单元测试 (已实现)
    └─────────────────┘
```

### 现有测试用例

#### 后端测试 (Jest)
```typescript
// test/controller/user.test.ts
describe('User Controller', () => {
  describe('POST /api/user/register', () => {
    test('should register new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        phone: '13800138000'
      };
      
      const result = await app
        .httpRequest()
        .post('/api/user/register')
        .send(userData)
        .expect(200);
        
      expect(result.body.success).toBe(true);
      expect(result.body.data.username).toBe('testuser');
    });
  });
  
  describe('POST /api/user/login', () => {
    test('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const result = await app
        .httpRequest()
        .post('/api/user/login')
        .send(loginData)
        .expect(200);
        
      expect(result.body.success).toBe(true);
      expect(result.body.data.token).toBeDefined();
    });
  });
});
```

### 测试配置

#### Jest 配置 (jest.config.js)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  testTimeout: 60000,
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true
};
```

### 测试运行命令
```bash
# 运行所有测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage

# CI 环境测试 (单线程, 超时控制)
npm run test:ci

# 监视模式测试
npm run test:watch
```

### 测试数据管理
```typescript
// test/setup.ts
import { DataSource } from 'typeorm';

let testDataSource: DataSource;

beforeAll(async () => {
  // 创建测试数据库连接
  testDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: [User, Activity, Registration],
    synchronize: true
  });
  
  await testDataSource.initialize();
});

afterAll(async () => {
  await testDataSource.destroy();
});

beforeEach(async () => {
  // 每个测试前清理数据
  await testDataSource.synchronize(true);
});
```

## 🚀 部署指南

### 本地开发环境
```bash
# 1. 启动后端服务
cd webbackend
npm run dev    # 开发模式，端口 7001

# 2. 启动前端服务
cd webfrontend
npm run dev    # 开发服务器，端口 5173
```

### 生产环境部署

#### 后端部署
```bash
# 1. 构建项目
cd webbackend
npm run build

# 2. 启动生产服务
npm start

# 3. 使用 PM2 (推荐)
npm install -g pm2
pm2 start ecosystem.config.js
```

#### 前端部署
```bash
# 1. 构建静态文件
cd webfrontend
npm run build

# 2. 部署到 Web 服务器 (Nginx)
cp -r dist/* /var/www/html/

# 3. Nginx 配置示例
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        try_files $uri $uri/ /index.html;
        root /var/www/html;
    }
    
    location /api {
        proxy_pass http://localhost:7001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker 部署 (推荐)
```dockerfile
# Dockerfile.backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 7001
CMD ["npm", "start"]

# Dockerfile.frontend
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build:
      context: ./webbackend
      dockerfile: Dockerfile
    ports:
      - "7001:7001"
    environment:
      - NODE_ENV=production
    volumes:
      - ./uploads:/app/uploads
      
  frontend:
    build:
      context: ./webfrontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
```

### 环境变量配置
```bash
# 生产环境变量
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key
DATABASE_URL=./production.db
UPLOAD_DIR=./uploads
LOG_LEVEL=warn
CORS_ORIGIN=https://your-domain.com
```

### 监控和日志
```javascript
// 使用 Winston 进行日志管理
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## 📈 性能优化

### 前端优化
- ⚡ **代码分割**：使用 React.lazy() 和 Suspense
- 🗜️ **资源压缩**：Vite 自动压缩 JS/CSS
- 🖼️ **图片优化**：WebP 格式，懒加载
- 📦 **缓存策略**：浏览器缓存，CDN 加速

### 后端优化
- 🔄 **数据库连接池**：SQLite 连接优化
- 📊 **查询优化**：索引优化，N+1 查询避免
- 🧾 **日志分级**：生产环境日志级别控制
- 🔒 **安全头**：CORS、CSRF 防护

## 🔧 故障排除

### 常见问题

1. **测试超时**
   ```bash
   # 解决方案：增加测试超时时间
   npm run test:ci  # 使用 60 秒超时配置
   ```

2. **数据库锁定**
   ```bash
   # 解决方案：使用单线程测试
   jest --maxWorkers=1 --forceExit
   ```

3. **端口冲突**
   ```bash
   # 检查端口占用
   netstat -tulpn | grep :7001
   netstat -tulpn | grep :5173
   ```

4. **依赖安装失败**
   ```bash
   # 清理缓存重新安装
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 📚 参考文档

- [Midway.js 官方文档](https://midwayjs.org/)
- [TypeORM 文档](https://typeorm.io/)
- [React 官方文档](https://react.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Jest 测试框架](https://jestjs.io/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

*文档最后更新时间：2025年1月 | 版本：v1.0.0*
