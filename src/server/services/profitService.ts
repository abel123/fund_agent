import db from '../db/database.js';
import { holdingService } from './holdingService.js';
import type { Holding } from '../../shared/types.js';

export class ProfitService {
  // 计算持仓的浮动盈亏
  calculateFloatingProfit(holding: Holding, currentPrice: number): {
    floatingProfit: number;
    floatingProfitPercent: number;
  } {
    const currentValue = holding.shares * currentPrice;
    const costValue = holding.shares * holding.costPrice;
    const floatingProfit = currentValue - costValue;
    const floatingProfitPercent = (floatingProfit / costValue) * 100;

    return { floatingProfit, floatingProfitPercent };
  }

  // 计算已实现收益
  getRealizedProfit(holdingId: string): number {
    const stmt = db.prepare(`
      SELECT SUM(profit) as total
      FROM realized_profits
      WHERE holding_id = ?
    `);

    const result = stmt.get(holdingId) as { total: number | null };
    return result.total || 0;
  }

  // 计算当日收益
  calculateDailyProfit(userId: string = 'user1'): {
    totalProfit: number;
    totalProfitPercent: number;
    holdings: Array<{
      holdingId: string;
      fundName: string;
      profit: number;
      profitPercent: number;
    }>;
  } {
    const holdings = holdingService.getHoldings(userId);
    let totalYesterdayValue = 0;
    let totalCurrentValue = 0;
    const holdingProfits: Array<{
      holdingId: string;
      fundName: string;
      profit: number;
      profitPercent: number;
    }> = [];

    holdings.forEach(holding => {
      // 获取最新价格和昨天的价格
      const priceHistory = holdingService.getPriceHistory(holding.fundId, 2);
      if (priceHistory.length < 2) return;

      const currentPrice = priceHistory[0];
      const yesterdayPrice = priceHistory[1];

      const currentValue = holding.shares * currentPrice.nav;
      const yesterdayValue = holding.shares * yesterdayPrice.nav;
      const profit = currentValue - yesterdayValue;
      const profitPercent = yesterdayValue > 0 ? (profit / yesterdayValue) * 100 : 0;

      totalYesterdayValue += yesterdayValue;
      totalCurrentValue += currentValue;

      holdingProfits.push({
        holdingId: holding.id,
        fundName: holding.fund.name,
        profit,
        profitPercent,
      });
    });

    const totalProfit = totalCurrentValue - totalYesterdayValue;
    const totalProfitPercent = totalYesterdayValue > 0 ? (totalProfit / totalYesterdayValue) * 100 : 0;

    return {
      totalProfit,
      totalProfitPercent,
      holdings: holdingProfits,
    };
  }

  // 计算本周收益
  calculateWeeklyProfit(userId: string = 'user1'): {
    totalProfit: number;
    totalProfitPercent: number;
  } {
    const holdings = holdingService.getHoldings(userId);
    let totalWeekStartValue = 0;
    let totalCurrentValue = 0;

    holdings.forEach(holding => {
      // 获取价格历史
      const priceHistory = holdingService.getPriceHistory(holding.fundId, 7);
      if (priceHistory.length === 0) return;

      const currentPrice = priceHistory[0];
      // 使用历史数据中的最早价格作为本周开始价格（简化计算，避免日期匹配问题）
      const weekStartPrice = priceHistory[priceHistory.length - 1];

      const currentValue = holding.shares * currentPrice.nav;
      const weekStartValue = holding.shares * weekStartPrice.nav;

      totalWeekStartValue += weekStartValue;
      totalCurrentValue += currentValue;
    });

    const totalProfit = totalCurrentValue - totalWeekStartValue;
    const totalProfitPercent = totalWeekStartValue > 0 ? (totalProfit / totalWeekStartValue) * 100 : 0;

    return { totalProfit, totalProfitPercent };
  }

  // 计算本月收益
  calculateMonthlyProfit(userId: string = 'user1'): {
    totalProfit: number;
    totalProfitPercent: number;
  } {
    const holdings = holdingService.getHoldings(userId);
    let totalMonthStartValue = 0;
    let totalCurrentValue = 0;

    holdings.forEach(holding => {
      // 获取价格历史
      const priceHistory = holdingService.getPriceHistory(holding.fundId, 31);
      if (priceHistory.length === 0) return;

      const currentPrice = priceHistory[0];
      // 使用历史数据中的最早价格作为本月开始价格（简化计算，避免日期匹配问题）
      const monthStartPrice = priceHistory[priceHistory.length - 1];

      const currentValue = holding.shares * currentPrice.nav;
      const monthStartValue = holding.shares * monthStartPrice.nav;

      totalMonthStartValue += monthStartValue;
      totalCurrentValue += currentValue;
    });

    const totalProfit = totalCurrentValue - totalMonthStartValue;
    const totalProfitPercent = totalMonthStartValue > 0 ? (totalProfit / totalMonthStartValue) * 100 : 0;

    return { totalProfit, totalProfitPercent };
  }

  // 计算单个基金的收益
  calculateFundProfit(fundName: string, period: 'day' | 'week' | 'month' = 'day', userId: string = 'user1'): {
    fundName: string;
    profit: number;
    profitPercent: number;
    period: string;
  } | null {
    const holding = holdingService.findHoldingByFundName(userId, fundName);
    if (!holding) return null;

    // 获取价格历史
    const days = period === 'day' ? 2 : period === 'week' ? 7 : 31;
    const priceHistory = holdingService.getPriceHistory(holding.fundId, days);
    if (priceHistory.length < 2) return null;

    const currentPrice = priceHistory[0];
    let comparePrice;
    let profit = 0;
    let profitPercent = 0;

    if (period === 'day') {
      // 当日收益：使用昨天的价格
      comparePrice = priceHistory[1];
      const currentValue = holding.shares * currentPrice.nav;
      const compareValue = holding.shares * comparePrice.nav;
      profit = currentValue - compareValue;
      profitPercent = compareValue > 0 ? (profit / compareValue) * 100 : 0;
    } else if (period === 'week') {
      // 本周收益：使用本周第一天的价格（即历史数据中的最早价格）
      comparePrice = priceHistory[priceHistory.length - 1];
      const currentValue = holding.shares * currentPrice.nav;
      const compareValue = holding.shares * comparePrice.nav;
      profit = currentValue - compareValue;
      profitPercent = compareValue > 0 ? (profit / compareValue) * 100 : 0;
    } else if (period === 'month') {
      // 本月收益：使用本月第一天的价格（即历史数据中的最早价格）
      comparePrice = priceHistory[priceHistory.length - 1];
      const currentValue = holding.shares * currentPrice.nav;
      const compareValue = holding.shares * comparePrice.nav;
      profit = currentValue - compareValue;
      profitPercent = compareValue > 0 ? (profit / compareValue) * 100 : 0;
    }

    return {
      fundName: holding.fund.name,
      profit,
      profitPercent,
      period: period === 'day' ? '今日' : period === 'week' ? '本周' : '本月',
    };
  }
}

export const profitService = new ProfitService();

