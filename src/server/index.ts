import express from 'express';
import cors from 'cors';
import path from 'path';
import { initDatabase } from './db/database.js';
import chatRouter from './api/chat.js';
import reportRouter from './api/report.js';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库
initDatabase();

// API 路由
app.use('/api/chat', chatRouter);
app.use('/api/report', reportRouter);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 只在生产环境提供静态文件服务
if (process.env.NODE_ENV === 'production') {
  // 直接使用固定路径，因为在Dockerfile中明确指定了工作目录为/app
  const distPath = '/app/dist';
  
  // 检查dist目录是否存在
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // SPA 路由回退到 index.html
    app.get('*', (_req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ error: 'Index file not found' });
      }
    });
    console.log(`📁 静态文件服务已启用，dist目录: ${distPath}`);
  } else {
    console.log(`⚠️  警告: dist目录不存在于 ${distPath}`);
    // API仍然可用，只是静态文件服务不可用
  }
}

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

