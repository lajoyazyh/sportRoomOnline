# 体育活动室在线管理系统 - 设计文档

## 📋 项目概述

**项目名称**: 体育活动室在线管理系统 (sportRoomOnline)  
**项目描述**: 一个集活动发布、报名管理、支付订单、社交互动于一体的体育活动管理平台  
**创建日期**: 2025年7月31日  
**当前版本**: v1.0.0-dev  

---

## 🎯 系统功能模块

### 核心功能清单
- ✅ **用户管理**: 注册、登录、个人信息管理、头像上传
- ✅ **活动管理**: 创建、编辑、发布、取消体育活动
- ✅ **活动报名**: 在线报名、审核、状态管理
- ✅ **订单支付**: 付费活动支付、订单管理、退款 (模拟支付)
- ✅ **活动展示**: 列表浏览、详情查看、搜索筛选
- ✅ **社交互动**: 评论评分、点赞系统、活动分享、权限控制
- ✅ **签到系统**: 随机码生成、现场签到、记录管理、持久化存储
- 🚧 **数据统计**: 活动数据分析、用户行为统计

### 功能状态说明
- ✅ 已完成 (功能完整，可正常使用)
- 🟡 基本完成 (核心功能实现，部分待优化)
- 🚧 开发中 (正在实现)
- ❌ 暂不考虑

---

## 🏗️ 系统架构设计

### 技术栈
**前端**:
- React 18 + Vite
- Tailwind CSS
- React Router
- Fetch API

**后端**:
- Node.js + TypeScript
- Midway.js 框架
- TypeORM + SQLite
- JWT 认证

**开发工具**:
- VS Code
- Git
- npm/yarn

---

## 📊 数据库设计

### 核心实体关系图
```
用户(User) ←→ 活动(Activity) ←→ 报名(Registration) ←→ 订单(Order)
     ↓              ↓                    ↓
  用户资料        活动详情            报名状态
     ↓              ↓                    ↓
   头像照片      活动图片            支付信息
                   ↓
               评论(Comment) ←→ 点赞(CommentLike)
                   ↓              ↓
               评分统计          用户点赞记录
```

### 主要实体设计

#### 1. User (用户实体) - ✅ 已完成
```typescript
interface User {
  userid: number;           // 用户ID
  username: string;         // 用户名
  password: string;         // 密码(加密)
  email?: string;           // 邮箱
  phone?: string;           // 手机号
  nickname?: string;        // 昵称
  name?: string;            // 真实姓名
  age?: number;             // 年龄
  gender?: string;          // 性别
  height?: number;          // 身高
  weight?: number;          // 体重
  bodyType?: string;        // 体型
  avatar?: string;          // 头像(base64)
  photos?: string;          // 照片集(JSON数组)
  sportsPreferences?: string; // 运动偏好
  createdAt: Date;          // 创建时间
  updatedAt: Date;          // 更新时间
}
```

#### 2. Activity (活动实体) - ✅ 已完成
```typescript
interface Activity {
  id: number;               // 活动ID
  title: string;            // 活动标题
  description: string;      // 活动描述
  type: ActivityType;       // 活动类型(枚举)
  status: ActivityStatus;   // 活动状态(枚举)
  location: string;         // 活动地点
  startTime: Date;          // 开始时间
  endTime: Date;            // 结束时间
  registrationDeadline: Date; // 报名截止时间
  minParticipants: number;  // 最少参与人数
  maxParticipants: number;  // 最多参与人数
  currentParticipants: number; // 当前报名人数
  fee: number;              // 活动费用
  requirements?: string;    // 参与要求
  equipment?: string;       // 所需设备
  images?: string;          // 活动图片(JSON)
  contactInfo?: string;     // 联系方式
  viewCount: number;        // 浏览次数
  likeCount: number;        // 点赞数
  checkInCode?: string;     // 签到码 (6位随机码)
  checkInEnabled: boolean;  // 签到功能启用状态
  creatorId: number;        // 创建者ID
  createdAt: Date;          // 创建时间
  updatedAt: Date;          // 更新时间
}

enum ActivityType {
  FITNESS = 'fitness',      // 健身
  BASKETBALL = 'basketball', // 篮球
  FOOTBALL = 'football',    // 足球
  BADMINTON = 'badminton',  // 羽毛球
  TENNIS = 'tennis',        // 网球
  YOGA = 'yoga',           // 瑜伽
  SWIMMING = 'swimming',    // 游泳
  RUNNING = 'running',      // 跑步
  OTHER = 'other'          // 其他
}

enum ActivityStatus {
  DRAFT = 'draft',         // 草稿
  PUBLISHED = 'published', // 已发布
  ONGOING = 'ongoing',     // 进行中
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled'  // 已取消
}
```

#### 3. Registration (报名实体) - ✅ 已完成
```typescript
interface Registration {
  id: number;               // 报名ID
  userId: number;           // 用户ID
  activityId: number;       // 活动ID
  status: RegistrationStatus; // 报名状态
  message?: string;         // 报名留言
  rejectReason?: string;    // 拒绝原因
  createdAt: Date;          // 报名时间
  updatedAt: Date;          // 更新时间
}

enum RegistrationStatus {
  PENDING = 'pending',     // 待审核
  APPROVED = 'approved',   // 已通过
  REJECTED = 'rejected',   // 已拒绝
  CANCELLED = 'cancelled', // 已取消
  COMPLETED = 'completed'  // 已完成
}
```

#### 4. Order (订单实体) - 🚧 待开发
```typescript
interface Order {
  id: number;               // 订单ID
  userId: number;           // 用户ID
  activityId: number;       // 活动ID
  registrationId: number;   // 报名ID
  amount: number;           // 订单金额
  status: OrderStatus;      // 订单状态
  paymentMethod?: string;   // 支付方式
  paymentTime?: Date;       // 支付时间
  refundTime?: Date;        // 退款时间
  createdAt: Date;          // 创建时间
  updatedAt: Date;          // 更新时间
}

enum OrderStatus {
  PENDING = 'pending',     // 待支付
  PAID = 'paid',          // 已支付
  REFUNDED = 'refunded',  // 已退款
  CANCELLED = 'cancelled' // 已取消
}
```

#### 5. CheckIn (签到实体) - ✅ 已完成
```typescript
interface CheckIn {
  id: number;               // 签到ID
  userId: number;           // 用户ID
  activityId: number;       // 活动ID
  checkInTime: Date;        // 签到时间
  checkInCode: string;      // 使用的签到码
  isValid: boolean;         // 签到是否有效
  createdAt: Date;          // 创建时间
  updatedAt: Date;          // 更新时间
}
```

#### 6. Comment (评论实体) - ✅ 已完成
```typescript
interface Comment {
  id: number;               // 评论ID
  userId: number;           // 用户ID
  activityId: number;       // 活动ID
  content: string;          // 评论内容
  rating: number;           // 评分(1-5星)
  images?: string;          // 评论图片
  likeCount: number;        // 点赞数
  createdAt: Date;          // 创建时间
  updatedAt: Date;          // 更新时间
}
```

#### 6. CommentLike (评论点赞实体) - ✅ 已完成
```typescript
interface CommentLike {
  id: number;               // 点赞记录ID
  userId: number;           // 点赞用户ID
  commentId: number;        // 被点赞评论ID
  createdAt: Date;          // 点赞时间
}

// 数据库约束
// UNIQUE INDEX (userId, commentId) - 确保每个用户对每条评论只能点一次赞
```

---

## 🚀 开发路线图

### 第一阶段: 基础活动管理  - ✅ 已完成
**目标**: 实现活动的基本CRUD操作和展示功能

**后端任务**:
- [x] 创建Activity实体和数据表
- [x] 实现ActivityService服务层
- [x] 实现ActivityController控制器
- [x] 添加活动图片上传功能
- [x] 实现活动搜索和筛选API

**前端任务**:
- [x] 设计活动列表页面 (SquarePage.jsx - 活动广场)
- [x] 设计活动详情页面 (ActivityDetailPage.jsx)
- [x] 实现活动创建表单 (CreateActivityPage.jsx)
- [x] 实现活动编辑功能 (复用创建表单逻辑)
- [x] 添加搜索和筛选组件 (集成在活动广场)
- [x] 创建活动相关API接口 (activity.js)
- [x] 完成路由配置和页面导航

**页面结构**:
- **Square (活动广场)**: 公共活动浏览、搜索、筛选 (/home/square)
- **Manage (活动管理)**: 个人活动管理中心 (/home/manage)
- **CreateActivity**: 创建活动页面 (/activity/create)
- **ActivityDetail**: 活动详情页面 (/activity/:id)

**API接口设计**:
```
GET    /api/activity/list      - 获取活动列表
GET    /api/activity/:id       - 获取活动详情
POST   /api/activity/create    - 创建活动
PUT    /api/activity/:id       - 更新活动
DELETE /api/activity/:id       - 删除活动
GET    /api/activity/search    - 搜索活动
```

### 第二阶段: 报名系统 - ✅ 已完成
**目标**: 实现用户报名和审核流程

**后端任务**:
- [x] 创建Registration实体和数据表
- [x] 实现RegistrationService服务层
- [x] 实现报名审核逻辑
- [x] 添加报名状态管理
- [x] 实现报名人数限制

**前端任务**:
- [x] 设计报名表单组件
- [x] 实现我的报名页面
- [x] 设计活动管理页面
- [x] 实现报名审核界面
- [x] 添加报名状态展示
- [x] 限制已发布活动关键字段编辑

**API接口设计**:
```
POST   /api/registration/apply         - 申请报名
GET    /api/registration/my            - 我的报名
GET    /api/registration/activity/:id  - 管理报名(活动创建者)
POST   /api/registration/review/:id    - 审核报名
DELETE /api/registration/cancel/:id    - 取消报名
```

### 第三阶段: 支付订单系统 - ✅ 已完成 (模拟支付)
**目标**: 集成支付功能和订单管理

**技术选型**:
- 支付接口: 微信支付 / 支付宝 (暂时使用模拟支付)
- 支付SDK: 官方Node.js SDK (待集成)

**后端任务**:
- [x] 创建Order实体和数据表
- [x] 实现OrderService服务层
- [x] 实现OrderController控制器
- [x] 实现订单生成逻辑 (报名审核通过自动创建)
- [x] 实现模拟支付功能
- [x] 添加订单状态管理和过期处理
- [x] 实现退款功能 (模拟)
- [x] 修复用户认证问题 (使用Headers认证)
- [x] 修复活动参与人数统计问题
- [ ] 集成微信支付API
- [ ] 实现支付回调处理

**前端任务**:
- [x] 创建订单相关API接口 (order.js)
- [x] 实现订单列表页面 (OrderListPage.jsx)
- [x] 设计支付页面 (PaymentPage.jsx)
- [x] 添加支付状态展示和操作
- [x] 实现模拟支付流程
- [x] 添加订单管理入口 (个人中心导航)
- [x] 修复路由跳转问题 (订单页面在/home路由下)
- [x] 修复活动详情页报名状态显示
- [ ] 集成真实支付界面
- [ ] 实现支付结果页面

**已修复的问题**:
1. ✅ 订单列表页面"请先登录"错误 - 修复OrderController认证方式
2. ✅ 路由跳转问题 - 将订单页面移到/home/orders
3. ✅ 活动详情页报名状态显示 - 区分pending/approved/rejected等状态
4. ✅ 活动管理页面参与人数显示 - 修复currentParticipants统计
5. ✅ 报名审核通过后订单创建 - 添加调试日志待测试

**API接口设计**:
```
POST   /api/order/create/:registrationId  - 创建订单
GET    /api/order/:id                     - 获取订单详情  
GET    /api/order/my                      - 我的订单列表
POST   /api/order/pay/:id                 - 支付订单 (模拟)
PUT    /api/order/cancel/:id              - 取消订单
POST   /api/order/refund/:id              - 申请退款 (模拟)
```

### 第四阶段: 社交功能 - ✅ 已完成
**目标**: 增加用户互动和评价功能

**后端任务**:
- [x] 创建Comment实体和数据表
- [x] 创建CommentLike实体和数据表 (点赞记录)
- [x] 实现评论系统API (CRUD操作)
- [x] 实现点赞系统API (切换点赞状态)
- [x] 实现评分统计逻辑
- [x] 添加评论权限验证 (只有参与过活动的用户可评论)
- [x] 添加用户点赞状态检查
- [x] 解决外键约束删除问题

**前端任务**:
- [x] 设计评论组件 (CommentList.jsx)
- [x] 实现评分展示 (星级评分系统)
- [x] 实现内联评论表单 (替换弹窗形式)
- [x] 实现点赞功能 (每用户每评论只能点赞一次)
- [x] 实现点赞状态视觉反馈
- [x] 添加评论权限控制 (预检查权限显示按钮状态)
- [x] 添加活动分享功能 (Web Share API)
- [x] 实现我的评价页面 (MyCommentsPage.jsx)
- [x] 优化用户体验和界面设计

**API接口设计**:
```
POST   /api/comment/create            - 创建评论
GET    /api/comment/activity/:id      - 获取活动评论
GET    /api/comment/my               - 我的评论
PUT    /api/comment/:id              - 更新评论  
DELETE /api/comment/:id              - 删除评论
GET    /api/comment/permission/:id   - 检查评论权限
POST   /api/comment/:id/like         - 切换点赞状态
DELETE /api/comment/:id/like         - 取消点赞 (合并到上述API)
GET    /api/comment/:id/like-status  - 检查用户点赞状态
GET    /api/comment/rating/:id       - 获取活动平均评分
```

**功能特色**:
- **智能权限控制**: 根据用户参与状态动态显示评论按钮
- **一键点赞**: 每用户每评论只能点赞一次，支持取消点赞
- **内联表单**: 评论表单直接在页面中展开，无需弹窗
- **视觉反馈**: 点赞状态用不同颜色和填充样式区分
- **外键安全**: 删除评论时自动清理相关点赞记录

### 第五阶段: 高级功能 - ✅ 已完成
**目标**: 完善系统功能和用户体验

**功能列表**:
- ✅ **活动签到系统** - 已完成
  - [x] 签到实体设计 (CheckIn实体)
  - [x] Activity实体扩展 (checkInCode, checkInEnabled字段)
  - [x] 签到API完整实现 (5个核心接口)
  - [x] 签到管理界面开发 (CheckInManagement组件)
  - [x] 用户签到界面开发 (CheckInComponent组件)
  - [x] 签到码持久化存储
  - [x] 权限验证和安全控制
  - [x] 实时状态同步

**后端任务**:
- [x] 创建CheckIn实体和数据表
- [x] 扩展Activity实体添加签到字段
- [x] 实现签到码生成算法 (6位随机码)
- [x] 实现签到API接口 (创建、验证、查询)
- [x] 添加签到权限验证 (报名状态、支付状态)
- [x] 实现防重复签到机制

**前端任务**:
- [x] 设计签到管理组件 (CheckInManagement.jsx)
- [x] 设计用户签到组件 (CheckInComponent.jsx)
- [x] 实现签到码生成和展示
- [x] 实现签到状态检查和验证
- [x] 集成到活动详情页面
- [x] 集成到活动管理页面
- [x] 实现持久化状态恢复

**API接口设计**:
```
POST   /api/checkin/:activityId/code    - 生成签到码 (创建者权限)
POST   /api/checkin/:activityId         - 用户签到
GET    /api/checkin/:activityId/status  - 获取签到状态
GET    /api/checkin/:activityId         - 获取签到记录 (创建者权限)
PUT    /api/checkin/:activityId/disable - 停止签到 (创建者权限)
```

**功能特色**:
- **随机码生成**: 6位大写字母数字组合，避免重复
- **持久化存储**: 签到码存储在数据库，支持长期保持
- **权限控制**: 严格的创建者权限验证和用户签到资格检查
- **防重复机制**: 数据库唯一约束防止重复签到
- **实时同步**: 前后端状态实时同步，支持多设备访问
- [ ] 积分奖励机制
- [ ] 数据统计dashboard
- [ ] 移动端响应式优化
- [ ] 消息推送系统

#### 活动签到系统设计
**功能描述**: 用户参与活动时通过签到码签到，记录实际参与情况

**签到流程**:
1. **活动发布者操作**: 
   - 在活动管理页面可以随时生成/更新签到码
   - 签到码只有活动发布者可见
   - 可以在活动现场口头告知参与者签到码
2. **参与者操作**:
   - 在活动详情页面输入签到码进行签到
   - 只有报名且支付成功的用户才能签到
   - 每个用户每个活动只能签到一次

**签到规则**:
- 活动发布者可以随时生成/更新签到码
- 只有报名且支付成功的用户才能签到
- 每个用户每个活动只能签到一次
- 签到码验证成功即完成签到

**奖励机制**:
- 首次签到获得经验值
- 签到记录影响用户信誉度
- 活动完成后获得参与证书
- 后续可扩展积分奖励机制

**数据结构**:
```typescript
// Activity实体增加字段
interface Activity {
  // ... 现有字段
  checkInCode?: string;     // 签到码(只有创建者可见)
  checkInEnabled: boolean;  // 是否开启签到
}

interface CheckIn {
  id: number;               // 签到ID
  userId: number;           // 用户ID
  activityId: number;       // 活动ID
  checkInTime: Date;        // 签到时间
  checkInCode: string;      // 使用的签到码
  isValid: boolean;         // 是否有效签到
  createdAt: Date;          // 创建时间
}
```

**API接口设计**:
```
POST   /api/activity/:id/checkin-code    - 生成/更新签到码(创建者)
POST   /api/activity/:id/checkin         - 用户签到
GET    /api/activity/:id/checkin-status  - 获取签到状态
GET    /api/activity/:id/checkin-list    - 获取签到列表(创建者)
```

---

## 🎨 用户界面设计

### 页面结构设计
```
├── 首页 (HomePage)
│   ├── 轮播图展示
│   ├── 热门活动推荐
│   └── 活动分类导航
│
├── 活动相关页面
│   ├── 活动列表页 (ActivityList)
│   ├── 活动详情页 (ActivityDetail)
│   ├── 创建活动页 (CreateActivity)
│   └── 编辑活动页 (EditActivity)
│
├── 用户相关页面
│   ├── 个人中心 (Profile)
│   ├── 我的活动 (MyActivities)
│   ├── 我的报名 (MyRegistrations)
│   └── 我的订单 (MyOrders)
│
├── 管理相关页面
│   ├── 活动管理 (ActivityManage)
│   ├── 报名审核 (RegistrationReview)
│   └── 数据统计 (Analytics)
│
└── 通用页面
    ├── 登录页 (Login)
    ├── 注册页 (Register)
    └── 搜索页 (Search)
```

### 响应式设计
- **桌面端**: 1200px+ 三栏布局
- **平板端**: 768px-1199px 两栏布局
- **移动端**: <768px 单栏布局

---

## 🔧 技术实现细节

### 文件上传策略
**当前方案**: Base64存储到数据库
**优化方案**: 
1. 短期: 保持Base64存储，优化压缩算法
2. 长期: 迁移到云存储(OSS/COS)

### 状态管理
**前端状态管理**:
- 用户状态: localStorage + Context
- 活动数据: 组件级state
- 全局状态: 考虑引入Zustand

### 性能优化
**数据库优化**:
- 添加必要索引
- 实现分页查询
- 数据缓存策略

**前端优化**:
- 图片懒加载
- 路由懒加载
- 组件代码分割

### 安全考虑
- JWT token自动刷新
- API接口权限验证
- 文件上传安全检查
- XSS和CSRF防护

---

## 📈 运营策略

### 内容运营
- 定期举办热门体育活动
- 邀请专业教练入驻
- 建立活动质量评估体系
- 用户反馈收集和改进

### 用户增长
- 新用户注册奖励
- 邀请好友参与优惠
- 积分兑换体育用品
- 社交媒体推广

### 数据驱动
- 用户行为分析
- 活动参与度统计
- 收入和成本分析
- A/B测试优化



---

## 📝 开发注意事项

### 代码规范
- 使用TypeScript严格模式
- 统一的代码格式化(Prettier)
- Git提交规范(Conventional Commits)
- API文档维护(Swagger)

### 测试策略
- 单元测试覆盖率>80%
- 集成测试关键流程
- E2E测试主要用户路径
- 性能测试优化

### 部署策略
- 开发环境: 本地SQLite
- 测试环境: Docker容器
- 生产环境: 云服务器+数据库

---

## 📞 项目信息

**项目仓库**: sportRoomOnline  
**当前分支**: dev  
**维护者**: lajoyazyh  
**项目状态**: 核心功能已完成，社交功能全面上线
**完成度**: 约90% (包含完整的社交互动系统)
**最后更新**: 2025年8月6日

### 🎯 当前开发状态
- ✅ **用户认证**: 完整的注册登录体系
- ✅ **活动管理**: 从创建到发布的完整流程  
- ✅ **报名系统**: 完整的报名审核工作流
- ✅ **订单系统**: 模拟支付的订单管理
- ✅ **社交功能**: 评论评分、点赞系统、权限控制完整实现
- 🚧 **系统优化**: 性能优化和用户体验提升

### 🔄 下一步计划
1. **真实支付集成**: 集成微信支付/支付宝API
2. **数据统计**: 实现活动数据分析功能
3. **性能优化**: 前端打包优化，后端查询优化
4. **移动端适配**: 响应式设计优化

### 🆕 最新更新 (2025年8月6日)
- ✅ **点赞系统**: 实现每用户每评论只能点赞一次的约束
- ✅ **权限控制**: 评论权限预检查，智能显示按钮状态
- ✅ **界面优化**: 内联评论表单替换弹窗，提升用户体验
- ✅ **数据完整性**: 解决外键约束问题，确保数据删除安全
- ✅ **视觉反馈**: 点赞状态用颜色和填充样式区分

---

*本文档将随着项目开发进度持续更新*
