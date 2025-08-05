# 🏃‍♂️ SportRoomOnline Backend

> 体育活动室在线管理系统 - 后端服务

基于 Midway.js 框架的 Node.js + TypeScript 后端服务，提供完整的 RESTful API 支持前端应用。

## 📋 项目概述

### 🎯 核心功能
- **用户管理**: 注册、登录、JWT认证、个人资料
- **活动管理**: 活动CRUD、搜索筛选、状态管理
- **报名系统**: 在线报名、审核流程、人数控制
- **订单支付**: 订单管理、模拟支付、退款处理
- **社交互动**: 评论评分、点赞系统、权限控制

### 🏗️ 技术架构
- **框架**: Midway.js 3.x (基于 Koa.js)
- **语言**: TypeScript 4.x
- **数据库**: TypeORM + SQLite (开发) / MySQL (生产)
- **认证**: JWT + bcrypt 密码加密
- **测试**: Jest 单元测试

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
# 服务将在 http://localhost:7001 启动
```

### 生产部署
```bash
npm run build
npm start
```

## 📚 API 文档

### 🔐 用户认证 API
```
POST   /api/user/register     - 用户注册
POST   /api/user/login        - 用户登录
GET    /api/user/profile      - 获取用户资料
PUT    /api/user/profile      - 更新用户资料
POST   /api/user/upload       - 上传头像
```

### 🏃‍♂️ 活动管理 API
```
GET    /api/activity/list     - 获取活动列表
GET    /api/activity/:id      - 获取活动详情
POST   /api/activity/create   - 创建活动
PUT    /api/activity/:id      - 更新活动
DELETE /api/activity/:id      - 删除活动
GET    /api/activity/search   - 搜索活动
```

### 📝 报名管理 API
```
POST   /api/registration/apply         - 申请报名
GET    /api/registration/my            - 我的报名
GET    /api/registration/activity/:id  - 活动报名列表
POST   /api/registration/review/:id    - 审核报名
DELETE /api/registration/cancel/:id    - 取消报名
```

### 💰 订单支付 API
```
POST   /api/order/create/:registrationId  - 创建订单
GET    /api/order/:id                     - 获取订单详情
GET    /api/order/my                      - 我的订单
POST   /api/order/pay/:id                 - 支付订单
PUT    /api/order/cancel/:id              - 取消订单
POST   /api/order/refund/:id              - 申请退款
```

### 💬 社交互动 API
```
POST   /api/comment/create            - 创建评论
GET    /api/comment/activity/:id      - 获取活动评论
GET    /api/comment/my               - 我的评论
PUT    /api/comment/:id              - 更新评论
DELETE /api/comment/:id              - 删除评论
GET    /api/comment/permission/:id   - 检查评论权限
POST   /api/comment/:id/like         - 切换点赞状态
GET    /api/comment/:id/like-status  - 检查点赞状态
GET    /api/comment/rating/:id       - 获取活动评分
```

## 🗄️ 数据库设计

### 核心实体
- **User**: 用户信息
- **Activity**: 活动信息
- **Registration**: 报名记录
- **Order**: 订单信息
- **Comment**: 评论内容
- **CommentLike**: 点赞记录

### 关键特性
- **唯一约束**: CommentLike 表的 (userId, commentId) 确保每用户每评论只能点赞一次
- **外键约束**: 完整的关联关系和级联删除
- **索引优化**: 查询性能优化的数据库索引

## 🧪 测试

### 运行测试
```bash
# 单元测试
npm test

# 测试覆盖率
npm run cov

# 代码检查
npm run lint
```

### 测试覆盖
- 控制器 API 测试
- 服务层业务逻辑测试
- 数据库操作测试
- 认证授权测试

## 🛠️ 开发脚本

```bash
npm run dev          # 开发模式 (热重载)
npm run build        # 构建生产版本
npm start            # 启动生产服务
npm run lint         # 代码风格检查
npm test             # 运行测试
npm run clean        # 清理构建文件
```

## 🔧 配置说明

### 环境配置
- `config.default.ts`: 默认配置
- `config.unittest.ts`: 测试环境配置
- `config.prod.ts`: 生产环境配置 (需创建)

### 关键配置项
- JWT密钥和过期时间
- 数据库连接信息
- 文件上传配置
- 跨域设置

## 📈 性能优化

- **数据库索引**: 为常用查询字段添加索引
- **分页查询**: 大列表数据分页加载
- **连接池**: 数据库连接池优化
- **缓存策略**: Redis 缓存热点数据 (待实现)

## 🐛 调试指南

### 开发工具
- **日志**: 详细的请求/响应日志
- **调试**: VS Code 调试配置
- **监控**: 中间件性能监控

### 常见问题
1. **数据库连接**: 检查 SQLite 文件权限
2. **端口占用**: 默认 7001 端口，可在配置中修改
3. **依赖安装**: 确保 Node.js 版本兼容

---

更多详细信息请参考 [Midway.js 官方文档](https://midwayjs.org)
