import db from '../db/database.js';
import { holdingService } from './holdingService.js';
import type { Holding } from '../../shared/types.js';
import { format, startOfWeek, startOfMonth, isAfter, parseISO } from 'date-fns';

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
    let totalCost = 0;
    let totalValue = 0;
    const holdingProfits: Array<{
      holdingId: string;
      fundName: string;
      profit: number;
      profitPercent: number;
    }> = [];

    holdings.forEach(holding => {
      const price = holdingService.getLatestPrice(holding.fundId);
      if (!price) return;

      const costValue = holding.shares * holding.costPrice;
      const currentValue = holding.shares * price.nav;
      const profit = currentValue - costValue;
      const profitPercent = (profit / costValue) * 100;

      totalCost += costValue;
      totalValue += currentValue;

      holdingProfits.push({
        holdingId: holding.id,
        fundName: holding.fund.name,
        profit,
        profitPercent,
      });
    });

    const totalProfit = totalValue - totalCost;
    const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

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
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const holdings = holdingService.getHoldings(userId);

    let totalCost = 0;
    let totalValue = 0;

    holdings.forEach(holding => {
      // 获取本周开始时的价格
      const priceHistory = holdingService.getPriceHistory(holding.fundId, 7);
      const weekStartPrice = priceHistory.find(p => 
        isAfter(parseISO(p.date), weekStart) || p.date === format(weekStart, 'yyyy-MM-dd')
      );

      const currentPrice = holdingService.getLatestPrice(holding.fundId);
      if (!currentPrice || !weekStartPrice) return;

      const currentValue = holding.shares * currentPrice.nav;
      const costValue = holding.shares * holding.costPrice;

      totalCost += costValue;
      totalValue += currentValue;
    });

    const totalProfit = totalValue - totalCost;
    const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    return { totalProfit, totalProfitPercent };
  }

  // 计算本月收益
  calculateMonthlyProfit(userId: string = 'user1'): {
    totalProfit: number;
    totalProfitPercent: number;
  } {
    const monthStart = startOfMonth(new Date());
    const holdings = holdingService.getHoldings(userId);

    let totalCost = 0;
    let totalValue = 0;

    holdings.forEach(holding => {
      const priceHistory = holdingService.getPriceHistory(holding.fundId, 31);
      const monthStartPrice = priceHistory.find(p => 
        isAfter(parseISO(p.date), monthStart) || p.date === format(monthStart, 'yyyy-MM-dd')
      );

      const currentPrice = holdingService.getLatestPrice(holding.fundId);
      if (!currentPrice || !monthStartPrice) return;

      const currentValue = holding.shares * currentPrice.nav;
      const costValue = holding.shares * holding.costPrice;

      totalCost += costValue;
      totalValue += currentValue;
    });

    const totalProfit = totalValue - totalCost;
    const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

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

    const currentPrice = holdingService.getLatestPrice(holding.fundId);
    if (!currentPrice) return null;

    let profit = 0;
    let profitPercent = 0;

    if (period === 'day') {
      const costValue = holding.shares * holding.costPrice;
      const currentValue = holding.shares * currentPrice.nav;
      profit = currentValue - costValue;
      profitPercent = (profit / costValue) * 100;
    } else if (period === 'week') {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const priceHistory = holdingService.getPriceHistory(holding.fundId, 7);
      const weekStartPrice = priceHistory.find(p => 
        isAfter(parseISO(p.date), weekStart) || p.date === format(weekStart, 'yyyy-MM-dd')
      );
      if (weekStartPrice) {
        const weekStartValue = holding.shares * weekStartPrice.nav;
        const currentValue = holding.shares * currentPrice.nav;
        profit = currentValue - weekStartValue;
        profitPercent = weekStartValue > 0 ? (profit / weekStartValue) * 100 : 0;
      }
    } else if (period === 'month') {
      const monthStart = startOfMonth(new Date());
      const priceHistory = holdingService.getPriceHistory(holding.fundId, 31);
      const monthStartPrice = priceHistory.find(p => 
        isAfter(parseISO(p.date), monthStart) || p.date === format(monthStart, 'yyyy-MM-dd')
      );
      if (monthStartPrice) {
        const monthStartValue = holding.shares * monthStartPrice.nav;
        const currentValue = holding.shares * currentPrice.nav;
        profit = currentValue - monthStartValue;
        profitPercent = monthStartValue > 0 ? (profit / monthStartValue) * 100 : 0;
      }
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

