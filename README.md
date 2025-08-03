# 体育活动室在线管理系统 (SportRoomOnline)

[![CI/CD Pipeline](https://github.com/lajoyazyh/sportRoomOnline/actions/workflows/ci.yml/badge.svg)](https://github.com/lajoyazyh/sportRoomOnline/actions/workflows/ci.yml)
[![Automated Testing](https://github.com/lajoyazyh/sportRoomOnline/actions/workflows/testing.yml/badge.svg)](https://github.com/lajoyazyh/sportRoomOnline/actions/workflows/testing.yml)
[![Code Quality](https://github.com/lajoyazyh/sportRoomOnline/actions/workflows/code-quality.yml/badge.svg)](https://github.com/lajoyazyh/sportRoomOnline/actions/workflows/code-quality.yml)

Web开发课程大作业 - 2025暑期

一个集活动发布、报名管理、支付订单、社交互动于一体的体育活动管理平台。

## 🚀 项目特性

- ✅ **用户管理**: 注册、登录、个人信息管理、头像上传
- ✅ **活动管理**: 创建、编辑、发布、取消体育活动
- ✅ **活动报名**: 在线报名、审核、状态管理
- ✅ **订单支付**: 付费活动支付、订单管理、退款（模拟支付）
- ✅ **活动展示**: 列表浏览、详情查看、搜索筛选
- 🚧 **社交互动**: 评论评分、活动分享（待开发）
- 🚧 **数据统计**: 活动数据分析、用户行为统计（待开发）

## 🏗️ 技术栈

**前端**:
- React 18 + Vite 
- Tailwind CSS
- React Router
- TypeScript

**后端**:
- Node.js + TypeScript
- Midway.js 框架
- TypeORM + SQLite
- JWT 认证

**DevOps**:
- GitHub Actions (CI/CD)
- 自动化测试
- 代码质量检查
- 安全扫描

## 📦 项目结构

```
├── webfrontend/          # React前端应用
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   ├── api/          # API接口
│   │   └── assets/       # 静态资源
│   └── package.json
│
├── webbackend/           # Node.js后端应用
│   ├── src/
│   │   ├── controller/   # 控制器层
│   │   ├── service/      # 服务层
│   │   ├── entity/       # 数据实体
│   │   └── dto/          # 数据传输对象
│   └── package.json
│
├── .github/
│   └── workflows/        # GitHub Actions工作流
│
└── DESIGN_DOCUMENT.md    # 详细设计文档
```

## 🚦 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
# 后端依赖
cd webbackend
npm install

# 前端依赖
cd webfrontend  
npm install
```

### 启动开发服务器
```bash
# 启动后端服务 (端口: 7001)
cd webbackend
npm run dev

# 启动前端服务 (端口: 5173)
cd webfrontend
npm run dev
```

### 运行测试
```bash
# 后端测试
cd webbackend
npm run test

# 前端测试
cd webfrontend
npm run test
```

## 🔧 开发指南

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- Git 提交遵循 Conventional Commits

### 测试策略
- 单元测试覆盖率 > 80%
- 集成测试覆盖关键流程
- E2E 测试主要用户路径

### CI/CD 流程
- 代码提交触发 GitHub Actions
- 自动运行测试和代码质量检查
- 自动构建和部署

## 📚 API 文档

API 文档可通过 Swagger 访问: http://localhost:7001/swagger-ui/index.html

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 📞 联系方式

项目维护者: lajoyazyh  
项目地址: https://github.com/lajoyazyh/sportRoomOnline
