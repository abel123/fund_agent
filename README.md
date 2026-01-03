# 银行基金持仓对话式日报智能体

一个智能的基金持仓管理和分析系统，支持自然语言查询、自动收益计算、涨跌归因分析和日报生成。

## 功能特性

- 🗣️ **自然语言查询**：支持多轮对话查询持仓信息
- 💰 **自动收益计算**：按持仓份额/成本价计算当日/本周/本月收益
- 📊 **涨跌归因分析**：关联基金重仓股/债、行业指数，解释涨跌原因
- 📈 **日报生成**：自动生成包含持仓概览、收益排行、异动提醒的日报
- ❓ **智能问答**：基于RAG的常见问题解答

## 技术栈

- **前端**：React + TypeScript + Vite
- **后端**：Node.js + Express + TypeScript
- **数据库**：SQLite
- **图表**：Recharts
- **AI**：OpenAI API (用于RAG和自然语言处理)

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件：

```
OPENAI_API_KEY=your_openai_api_key
PORT=3001
```

### 运行开发服务器

```bash
npm run dev
```

前端运行在 http://localhost:3000
后端运行在 http://localhost:3001

## 项目结构

```
fund_agent/
├── src/
│   ├── client/          # 前端代码
│   │   ├── components/  # React组件
│   │   ├── hooks/      # 自定义Hooks
│   │   └── App.tsx     # 主应用
│   ├── server/         # 后端代码
│   │   ├── api/        # API路由
│   │   ├── services/   # 业务逻辑
│   │   ├── db/         # 数据库
│   │   └── index.ts    # 服务器入口
│   └── shared/         # 共享类型定义
└── package.json
```

