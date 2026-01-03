import { profitService } from './profitService.js';
import { holdingService } from './holdingService.js';
import { attributionService } from './attributionService.js';
import type { DailyReport, HoldingSummary, FundPerformance, Alert } from '../../shared/types.js';
import { format } from 'date-fns';

export class ReportService {
  // 生成日报
  generateDailyReport(userId: string = 'user1'): DailyReport {
    const holdings = holdingService.getHoldings(userId);
    const dailyProfit = profitService.calculateDailyProfit(userId);

    // 持仓概览
    const holdingsSummary: HoldingSummary[] = holdings.map(holding => {
      const price = holdingService.getLatestPrice(holding.fundId);
      if (!price) {
        return {
          fundId: holding.fundId,
          fundName: holding.fund.name,
          shares: holding.shares,
          currentValue: 0,
          profit: 0,
          profitPercent: 0,
        };
      }

      const currentValue = holding.shares * price.nav;
      const costValue = holding.shares * holding.costPrice;
      const profit = currentValue - costValue;
      const profitPercent = (profit / costValue) * 100;

      return {
        fundId: holding.fundId,
        fundName: holding.fund.name,
        shares: holding.shares,
        currentValue,
        profit,
        profitPercent,
      };
    });

    // 收益排行
    const performances: FundPerformance[] = holdingsSummary
      .map(h => ({
        fundId: h.fundId,
        fundName: h.fundName,
        profit: h.profit,
        profitPercent: h.profitPercent,
        changeReason: attributionService.analyzeChangeReason(
          h.fundName,
          holdingService.getLatestPrice(h.fundId)?.changePercent || 0
        ),
      }))
      .sort((a, b) => b.profitPercent - a.profitPercent);

    const topGainers = performances.filter(p => p.profitPercent > 0).slice(0, 3);
    const topLosers = performances.filter(p => p.profitPercent < 0).slice(0, 3);

    // 异动提醒
    const alerts: Alert[] = [];
    performances.forEach(perf => {
      if (Math.abs(perf.profitPercent) > 3) {
        alerts.push({
          type: perf.profitPercent > 0 ? 'large_gain' : 'large_loss',
          fundId: perf.fundId,
          fundName: perf.fundName,
          message: `${perf.fundName}${perf.profitPercent > 0 ? '大幅上涨' : '大幅下跌'}${Math.abs(perf.profitPercent).toFixed(2)}%`,
        });
      }
    });

    // 市场要点（示例）
    const marketHighlights = [
      '白酒板块今日表现强势，多只重仓白酒的基金净值上涨',
      '金融板块震荡调整，相关基金净值小幅波动',
      '建议关注明日市场情绪变化，适时调整持仓结构',
    ];

    const totalValue = holdingsSummary.reduce((sum, h) => sum + h.currentValue, 0);

    return {
      date: format(new Date(), 'yyyy-MM-dd'),
      totalValue,
      totalProfit: dailyProfit.totalProfit,
      totalProfitPercent: dailyProfit.totalProfitPercent,
      holdings: holdingsSummary,
      topGainers,
      topLosers,
      alerts,
      marketHighlights,
    };
  }
}

export const reportService = new ReportService();

