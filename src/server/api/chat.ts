import { Router } from 'express';
import { nlpService } from '../services/nlpService.js';
import type { ChatMessage } from '../../shared/types.js';

const router = Router();

// 聊天接口
router.post('/message', async (req, res) => {
  try {
    const { message, userId = 'user1' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '消息内容不能为空' });
    }

    // 解析意图
    const intent = nlpService.parseIntent(message);

    // 执行查询
    const result = await nlpService.executeQuery(intent, userId);

    // 构建回复消息
    const response: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: result.answer,
      timestamp: new Date().toISOString(),
      charts: result.charts,
    };

    res.json({
      message: response,
      data: result.data,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: '处理消息时发生错误' });
  }
});

// 获取对话历史（简化版，实际应该从数据库读取）
router.get('/history', (_req, res) => {
  res.json({ messages: [] });
});

export default router;

