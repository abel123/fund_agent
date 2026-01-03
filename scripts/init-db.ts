#!/usr/bin/env tsx
/**
 * 初始化数据库脚本
 * 用于强制重新生成测试数据（内存数据库）
 * 
 * 使用方法: npx tsx scripts/init-db.ts
 */

import { resetDatabase } from '../src/server/db/database.js';

console.log('🔄 开始重置数据库并生成测试数据...');

try {
  resetDatabase();
  
  console.log('✅ 内存数据库测试数据生成成功！');
  
  console.log('\n📊 生成的数据包括:');
  console.log('  - 8 只基金');
  console.log('  - 10 个持仓记录');
  console.log('  - 90 天历史价格数据（每只基金，共720条）');
  console.log('  - 40+ 个重仓股记录');
  console.log('  - 2 个已实现收益记录');
} catch (error) {
  console.error('❌ 生成测试数据失败:', error);
  process.exit(1);
}

