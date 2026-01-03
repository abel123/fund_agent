import db from '../db/database.js';
import { holdingService } from './holdingService.js';
import type { FundTopHolding } from '../../shared/types.js';

export class AttributionService {
  // 获取基金重仓股
  getTopHoldings(fundId: string): FundTopHolding[] {
    const stmt = db.prepare(`
      SELECT 
        fund_id as fundId,
        stock_name as stockName,
        stock_code as stockCode,
        weight,
        industry
      FROM fund_top_holdings
      WHERE fund_id = ?
      ORDER BY weight DESC
    `);

    return stmt.all(fundId) as FundTopHolding[];
  }

  // 分析涨跌原因
  analyzeChangeReason(fundName: string, changePercent: number): string {
    const holding = holdingService.findHoldingByFundName('user1', fundName);
    if (!holding) return '未找到该基金';

    const topHoldings = this.getTopHoldings(holding.fundId);
    if (topHoldings.length === 0) {
      return `今日净值${changePercent > 0 ? '上涨' : '下跌'}${Math.abs(changePercent).toFixed(2)}%`;
    }

    // 根据重仓股行业分析
    const industries = topHoldings.reduce((acc, h) => {
      if (h.industry) {
        acc[h.industry] = (acc[h.industry] || 0) + h.weight;
      }
      return acc;
    }, {} as Record<string, number>);

    const topIndustry = Object.entries(industries)
      .sort(([, a], [, b]) => b - a)[0];

    let reason = `今日净值${changePercent > 0 ? '上涨' : '下跌'}${Math.abs(changePercent).toFixed(2)}%`;
    
    if (topIndustry) {
      reason += `，主要因重仓的${topIndustry[0]}行业${changePercent > 0 ? '上涨' : '下跌'}`;
      
      if (topHoldings.length > 0) {
        const topStock = topHoldings[0];
        reason += `，其中${topStock.stockName}（权重${(topStock.weight * 100).toFixed(1)}%）影响较大`;
      }
    }

    return reason;
  }

  // 获取行业分布
  getIndustryDistribution(fundId: string): Array<{ industry: string; weight: number }> {
    const stmt = db.prepare(`
      SELECT industry, SUM(weight) as total_weight
      FROM fund_top_holdings
      WHERE fund_id = ? AND industry IS NOT NULL
      GROUP BY industry
      ORDER BY total_weight DESC
    `);

    return stmt.all(fundId) as Array<{ industry: string; weight: number }>;
  }
}

export const attributionService = new AttributionService();

