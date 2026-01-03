import { Router } from 'express';
import { reportService } from '../services/reportService.js';

const router = Router();

// 获取日报
router.get('/daily', (req, res) => {
  try {
    const { userId = 'user1' } = req.query;
    const report = reportService.generateDailyReport(userId as string);
    res.json(report);
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ error: '生成日报时发生错误' });
  }
});

export default router;

