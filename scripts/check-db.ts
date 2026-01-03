#!/usr/bin/env tsx
/**
 * 检查数据库数据脚本
 */

import db from '../src/server/db/database.js';

console.log('📊 数据库统计信息:\n');

const fundCount = db.prepare('SELECT COUNT(*) as count FROM funds').get() as { count: number };
console.log(`✅ 基金数量: ${fundCount.count}`);

const holdingCount = db.prepare('SELECT COUNT(*) as count FROM holdings').get() as { count: number };
console.log(`✅ 持仓数量: ${holdingCount.count}`);

const priceCount = db.prepare('SELECT COUNT(*) as count FROM fund_prices').get() as { count: number };
console.log(`✅ 价格记录数: ${priceCount.count}`);

const stockCount = db.prepare('SELECT COUNT(*) as count FROM fund_top_holdings').get() as { count: number };
console.log(`✅ 重仓股数量: ${stockCount.count}`);

const profitCount = db.prepare('SELECT COUNT(*) as count FROM realized_profits').get() as { count: number };
console.log(`✅ 已实现收益记录: ${profitCount.count}`);

console.log('\n📋 基金列表:');
const funds = db.prepare('SELECT code, name, type, manager FROM funds').all() as Array<{
  code: string;
  name: string;
  type: string;
  manager: string;
}>;
funds.forEach((fund, index) => {
  console.log(`  ${index + 1}. ${fund.name} (${fund.code}) - ${fund.type} - 基金经理: ${fund.manager}`);
});

console.log('\n💼 持仓列表:');
const holdings = db.prepare(`
  SELECT h.id, f.name as fund_name, h.shares, h.cost_price, h.purchase_date
  FROM holdings h
  JOIN funds f ON h.fund_id = f.id
  WHERE h.user_id = 'user1'
`).all() as Array<{
  id: string;
  fund_name: string;
  shares: number;
  cost_price: number;
  purchase_date: string;
}>;
holdings.forEach((holding, index) => {
  console.log(`  ${index + 1}. ${holding.fund_name}: ${holding.shares} 份, 成本价 ${holding.cost_price}, 购买日期 ${holding.purchase_date}`);
});

console.log('\n📈 最新价格 (今日):');
const today = new Date().toISOString().split('T')[0];
const latestPrices = db.prepare(`
  SELECT f.name, fp.nav, fp.change, fp.change_percent
  FROM fund_prices fp
  JOIN funds f ON fp.fund_id = f.id
  WHERE fp.date = ?
  ORDER BY f.name
`).all(today) as Array<{
  name: string;
  nav: number;
  change: number;
  change_percent: number;
}>;
latestPrices.forEach((price) => {
  const changeSign = price.change >= 0 ? '+' : '';
  const color = price.change >= 0 ? '🟢' : '🔴';
  console.log(`  ${color} ${price.name}: ${price.nav} (${changeSign}${price.change}, ${changeSign}${price.change_percent}%)`);
});

db.close();

