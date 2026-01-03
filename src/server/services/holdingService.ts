import db from '../db/database.js';
import type { Holding, Fund, FundPrice } from '../../shared/types.js';

export class HoldingService {
  // 获取用户所有持仓
  getHoldings(userId: string = 'user1'): (Holding & { fund: Fund })[] {
    const stmt = db.prepare(`
      SELECT 
        h.id, h.fund_id as fundId, h.user_id as userId,
        h.shares, h.cost_price as costPrice, h.purchase_date as purchaseDate,
        f.id as fund_id, f.code as fund_code, f.name as fund_name,
        f.type as fund_type, f.manager as fund_manager
      FROM holdings h
      JOIN funds f ON h.fund_id = f.id
      WHERE h.user_id = ?
    `);

    const rows = stmt.all(userId) as any[];
    return rows.map(row => ({
      id: row.id,
      fundId: row.fundId,
      userId: row.userId,
      shares: row.shares,
      costPrice: row.costPrice,
      purchaseDate: row.purchaseDate,
      fund: {
        id: row.fund_id,
        code: row.fund_code,
        name: row.fund_name,
        type: row.fund_type,
        manager: row.fund_manager,
      },
    }));
  }

  // 根据基金名称查找持仓
  findHoldingByFundName(userId: string, fundName: string): (Holding & { fund: Fund }) | null {
    const stmt = db.prepare(`
      SELECT 
        h.id, h.fund_id as fundId, h.user_id as userId,
        h.shares, h.cost_price as costPrice, h.purchase_date as purchaseDate,
        f.id as fund_id, f.code as fund_code, f.name as fund_name,
        f.type as fund_type, f.manager as fund_manager
      FROM holdings h
      JOIN funds f ON h.fund_id = f.id
      WHERE h.user_id = ? AND f.name LIKE ?
      LIMIT 1
    `);

    const row = stmt.get(userId, `%${fundName}%`) as any;
    if (!row) return null;

    return {
      id: row.id,
      fundId: row.fundId,
      userId: row.userId,
      shares: row.shares,
      costPrice: row.costPrice,
      purchaseDate: row.purchaseDate,
      fund: {
        id: row.fund_id,
        code: row.fund_code,
        name: row.fund_name,
        type: row.fund_type,
        manager: row.fund_manager,
      },
    };
  }

  // 获取基金最新价格
  getLatestPrice(fundId: string): FundPrice | null {
    const stmt = db.prepare(`
      SELECT fund_id as fundId, date, nav, change, change_percent as changePercent
      FROM fund_prices
      WHERE fund_id = ?
      ORDER BY date DESC
      LIMIT 1
    `);

    return stmt.get(fundId) as FundPrice | null;
  }

  // 获取基金历史价格
  getPriceHistory(fundId: string, days: number = 30): FundPrice[] {
    const stmt = db.prepare(`
      SELECT fund_id as fundId, date, nav, change, change_percent as changePercent
      FROM fund_prices
      WHERE fund_id = ?
      ORDER BY date DESC
      LIMIT ?
    `);

    return stmt.all(fundId, days) as FundPrice[];
  }
}

export const holdingService = new HoldingService();

