import type { Fund, Holding, FundPrice, FundTopHolding } from '../../shared/types.js';

// 内存数据库类
class MemoryDatabase {
  funds: Fund[] = [];
  holdings: Holding[] = [];
  fundPrices: FundPrice[] = [];
  fundTopHoldings: FundTopHolding[] = [];
  realizedProfits: Array<{ id: string; holdingId: string; date: string; profit: number }> = [];

  // 初始化数据库
  initDatabase() {
    this.funds = [];
    this.holdings = [];
    this.fundPrices = [];
    this.fundTopHoldings = [];
    this.realizedProfits = [];
    this.insertSampleData();
  }

  // 重置数据库
  resetDatabase() {
    this.initDatabase();
  }

  // 插入示例数据
  insertSampleData() {
    // 检查是否已有数据
    if (this.funds.length > 0) return;

    // 插入示例基金 - 增加到8个基金
    this.funds = [
      { id: 'f1', code: '110022', name: '易方达消费精选', type: '股票型', manager: '张坤' },
      { id: 'f2', code: '000001', name: '华夏成长', type: '混合型', manager: '王亚伟' },
      { id: 'f3', code: '001938', name: '中欧时代先锋', type: '股票型', manager: '周应波' },
      { id: 'f4', code: '161725', name: '招商中证白酒', type: '指数型', manager: '侯昊' },
      { id: 'f5', code: '005827', name: '易方达蓝筹精选', type: '混合型', manager: '张坤' },
      { id: 'f6', code: '110011', name: '易方达中小盘', type: '股票型', manager: '张坤' },
      { id: 'f7', code: '000002', name: '华夏回报', type: '混合型', manager: '蔡向阳' },
      { id: 'f8', code: '519674', name: '银河创新成长', type: '混合型', manager: '郑巍山' },
    ];

    // 插入示例持仓 - 增加到10个持仓
    this.holdings = [
      { id: 'h1', fundId: 'f1', userId: 'user1', shares: 1000, costPrice: 1.5, purchaseDate: '2024-01-01' },
      { id: 'h2', fundId: 'f2', userId: 'user1', shares: 2000, costPrice: 2.0, purchaseDate: '2024-01-15' },
      { id: 'h3', fundId: 'f3', userId: 'user1', shares: 1500, costPrice: 1.8, purchaseDate: '2024-02-01' },
      { id: 'h4', fundId: 'f4', userId: 'user1', shares: 3000, costPrice: 1.2, purchaseDate: '2023-12-10' },
      { id: 'h5', fundId: 'f5', userId: 'user1', shares: 800, costPrice: 2.5, purchaseDate: '2024-01-20' },
      { id: 'h6', fundId: 'f6', userId: 'user1', shares: 1200, costPrice: 1.6, purchaseDate: '2024-02-15' },
      { id: 'h7', fundId: 'f7', userId: 'user1', shares: 2500, costPrice: 1.8, purchaseDate: '2023-11-05' },
      { id: 'h8', fundId: 'f8', userId: 'user1', shares: 1800, costPrice: 1.4, purchaseDate: '2024-03-01' },
      { id: 'h9', fundId: 'f1', userId: 'user1', shares: 500, costPrice: 1.55, purchaseDate: '2024-03-10' },
      { id: 'h10', fundId: 'f2', userId: 'user1', shares: 1000, costPrice: 2.1, purchaseDate: '2024-03-20' },
    ];

    // 插入示例价格数据（包含历史数据）
    const today = new Date();
    const days = 90;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // 基金1: 易方达消费精选 - 上涨趋势
      const baseNav1 = 1.40 + (i * 0.003) + (Math.random() * 0.02 - 0.01);
      const prevNav1 = i === days - 1 ? baseNav1 : (1.40 + ((i + 1) * 0.003));
      const change1 = i === days - 1 ? 0 : baseNav1 - prevNav1;
      const changePercent1 = i === days - 1 ? 0 : (change1 / prevNav1) * 100;
      this.fundPrices.push({ 
        fundId: 'f1', 
        date: dateStr, 
        nav: Number(baseNav1.toFixed(2)), 
        change: Number(change1.toFixed(3)), 
        changePercent: Number(changePercent1.toFixed(2)) 
      });
      
      // 基金2: 华夏成长 - 波动上涨
      const baseNav2 = 1.90 + (i * 0.002) + (Math.random() * 0.03 - 0.015);
      const prevNav2 = i === days - 1 ? baseNav2 : (1.90 + ((i + 1) * 0.002));
      const change2 = i === days - 1 ? 0 : baseNav2 - prevNav2;
      const changePercent2 = i === days - 1 ? 0 : (change2 / prevNav2) * 100;
      this.fundPrices.push({ 
        fundId: 'f2', 
        date: dateStr, 
        nav: Number(baseNav2.toFixed(2)), 
        change: Number(change2.toFixed(3)), 
        changePercent: Number(changePercent2.toFixed(2)) 
      });
      
      // 基金3: 中欧时代先锋 - 小幅波动
      const baseNav3 = 1.65 + (i * 0.001) + (Math.random() * 0.025 - 0.0125);
      const prevNav3 = i === days - 1 ? baseNav3 : (1.65 + ((i + 1) * 0.001));
      const change3 = i === days - 1 ? 0 : baseNav3 - prevNav3;
      const changePercent3 = i === days - 1 ? 0 : (change3 / prevNav3) * 100;
      this.fundPrices.push({ 
        fundId: 'f3', 
        date: dateStr, 
        nav: Number(baseNav3.toFixed(2)), 
        change: Number(change3.toFixed(3)), 
        changePercent: Number(changePercent3.toFixed(2)) 
      });
      
      // 基金4: 招商中证白酒 - 波动较大
      const baseNav4 = 1.15 + (i * 0.002) + (Math.random() * 0.04 - 0.02);
      const prevNav4 = i === days - 1 ? baseNav4 : (1.15 + ((i + 1) * 0.002));
      const change4 = i === days - 1 ? 0 : baseNav4 - prevNav4;
      const changePercent4 = i === days - 1 ? 0 : (change4 / prevNav4) * 100;
      this.fundPrices.push({ 
        fundId: 'f4', 
        date: dateStr, 
        nav: Number(baseNav4.toFixed(2)), 
        change: Number(change4.toFixed(3)), 
        changePercent: Number(changePercent4.toFixed(2)) 
      });
      
      // 基金5: 易方达蓝筹精选 - 稳定上涨
      const baseNav5 = 2.40 + (i * 0.004) + (Math.random() * 0.015 - 0.0075);
      const prevNav5 = i === days - 1 ? baseNav5 : (2.40 + ((i + 1) * 0.004));
      const change5 = i === days - 1 ? 0 : baseNav5 - prevNav5;
      const changePercent5 = i === days - 1 ? 0 : (change5 / prevNav5) * 100;
      this.fundPrices.push({ 
        fundId: 'f5', 
        date: dateStr, 
        nav: Number(baseNav5.toFixed(2)), 
        change: Number(change5.toFixed(3)), 
        changePercent: Number(changePercent5.toFixed(2)) 
      });
      
      // 基金6: 易方达中小盘 - 中等波动
      const baseNav6 = 1.55 + (i * 0.0025) + (Math.random() * 0.02 - 0.01);
      const prevNav6 = i === days - 1 ? baseNav6 : (1.55 + ((i + 1) * 0.0025));
      const change6 = i === days - 1 ? 0 : baseNav6 - prevNav6;
      const changePercent6 = i === days - 1 ? 0 : (change6 / prevNav6) * 100;
      this.fundPrices.push({ 
        fundId: 'f6', 
        date: dateStr, 
        nav: Number(baseNav6.toFixed(2)), 
        change: Number(change6.toFixed(3)), 
        changePercent: Number(changePercent6.toFixed(2)) 
      });
      
      // 基金7: 华夏回报 - 稳定
      const baseNav7 = 1.75 + (i * 0.0015) + (Math.random() * 0.015 - 0.0075);
      const prevNav7 = i === days - 1 ? baseNav7 : (1.75 + ((i + 1) * 0.0015));
      const change7 = i === days - 1 ? 0 : baseNav7 - prevNav7;
      const changePercent7 = i === days - 1 ? 0 : (change7 / prevNav7) * 100;
      this.fundPrices.push({ 
        fundId: 'f7', 
        date: dateStr, 
        nav: Number(baseNav7.toFixed(2)), 
        change: Number(change7.toFixed(3)), 
        changePercent: Number(changePercent7.toFixed(2)) 
      });
      
      // 基金8: 银河创新成长 - 高波动
      const baseNav8 = 1.35 + (i * 0.003) + (Math.random() * 0.05 - 0.025);
      const prevNav8 = i === days - 1 ? baseNav8 : (1.35 + ((i + 1) * 0.003));
      const change8 = i === days - 1 ? 0 : baseNav8 - prevNav8;
      const changePercent8 = i === days - 1 ? 0 : (change8 / prevNav8) * 100;
      this.fundPrices.push({ 
        fundId: 'f8', 
        date: dateStr, 
        nav: Number(baseNav8.toFixed(2)), 
        change: Number(change8.toFixed(3)), 
        changePercent: Number(changePercent8.toFixed(2)) 
      });
    }

    // 插入示例重仓股
    this.fundTopHoldings = [
      // 基金1: 易方达消费精选 - 消费股
      { fundId: 'f1', stockName: '贵州茅台', stockCode: '600519', weight: 0.15, industry: '白酒' },
      { fundId: 'f1', stockName: '五粮液', stockCode: '000858', weight: 0.12, industry: '白酒' },
      { fundId: 'f1', stockName: '泸州老窖', stockCode: '000568', weight: 0.10, industry: '白酒' },
      { fundId: 'f1', stockName: '山西汾酒', stockCode: '600809', weight: 0.08, industry: '白酒' },
      { fundId: 'f1', stockName: '洋河股份', stockCode: '002304', weight: 0.07, industry: '白酒' },
      { fundId: 'f1', stockName: '海天味业', stockCode: '603288', weight: 0.06, industry: '食品' },
      // 基金2: 华夏成长 - 金融股
      { fundId: 'f2', stockName: '中国平安', stockCode: '601318', weight: 0.10, industry: '金融' },
      { fundId: 'f2', stockName: '招商银行', stockCode: '600036', weight: 0.08, industry: '金融' },
      { fundId: 'f2', stockName: '工商银行', stockCode: '601398', weight: 0.07, industry: '金融' },
      { fundId: 'f2', stockName: '建设银行', stockCode: '601939', weight: 0.06, industry: '金融' },
      { fundId: 'f2', stockName: '兴业银行', stockCode: '601166', weight: 0.05, industry: '金融' },
      { fundId: 'f2', stockName: '中国太保', stockCode: '601601', weight: 0.04, industry: '金融' },
      // 基金3: 中欧时代先锋 - 新能源
      { fundId: 'f3', stockName: '宁德时代', stockCode: '300750', weight: 0.12, industry: '新能源' },
      { fundId: 'f3', stockName: '比亚迪', stockCode: '002594', weight: 0.10, industry: '新能源' },
      { fundId: 'f3', stockName: '隆基绿能', stockCode: '601012', weight: 0.09, industry: '新能源' },
      { fundId: 'f3', stockName: '通威股份', stockCode: '600438', weight: 0.08, industry: '新能源' },
      { fundId: 'f3', stockName: '阳光电源', stockCode: '300274', weight: 0.07, industry: '新能源' },
      // 基金4: 招商中证白酒 - 白酒指数
      { fundId: 'f4', stockName: '贵州茅台', stockCode: '600519', weight: 0.18, industry: '白酒' },
      { fundId: 'f4', stockName: '五粮液', stockCode: '000858', weight: 0.15, industry: '白酒' },
      { fundId: 'f4', stockName: '泸州老窖', stockCode: '000568', weight: 0.12, industry: '白酒' },
      { fundId: 'f4', stockName: '山西汾酒', stockCode: '600809', weight: 0.10, industry: '白酒' },
      { fundId: 'f4', stockName: '洋河股份', stockCode: '002304', weight: 0.08, industry: '白酒' },
      // 基金5: 易方达蓝筹精选 - 蓝筹股
      { fundId: 'f5', stockName: '贵州茅台', stockCode: '600519', weight: 0.12, industry: '白酒' },
      { fundId: 'f5', stockName: '腾讯控股', stockCode: '00700', weight: 0.10, industry: '科技' },
      { fundId: 'f5', stockName: '美团', stockCode: '03690', weight: 0.09, industry: '科技' },
      { fundId: 'f5', stockName: '招商银行', stockCode: '600036', weight: 0.08, industry: '金融' },
      { fundId: 'f5', stockName: '中国平安', stockCode: '601318', weight: 0.07, industry: '金融' },
      // 基金6: 易方达中小盘 - 中小盘
      { fundId: 'f6', stockName: '海康威视', stockCode: '002415', weight: 0.10, industry: '科技' },
      { fundId: 'f6', stockName: '立讯精密', stockCode: '002475', weight: 0.09, industry: '科技' },
      { fundId: 'f6', stockName: '三一重工', stockCode: '600031', weight: 0.08, industry: '机械' },
      { fundId: 'f6', stockName: '恒瑞医药', stockCode: '600276', weight: 0.07, industry: '医药' },
      // 基金7: 华夏回报 - 稳健型
      { fundId: 'f7', stockName: '中国平安', stockCode: '601318', weight: 0.08, industry: '金融' },
      { fundId: 'f7', stockName: '招商银行', stockCode: '600036', weight: 0.07, industry: '金融' },
      { fundId: 'f7', stockName: '贵州茅台', stockCode: '600519', weight: 0.06, industry: '白酒' },
      { fundId: 'f7', stockName: '五粮液', stockCode: '000858', weight: 0.05, industry: '白酒' },
      // 基金8: 银河创新成长 - 科技成长
      { fundId: 'f8', stockName: '宁德时代', stockCode: '300750', weight: 0.11, industry: '新能源' },
      { fundId: 'f8', stockName: '比亚迪', stockCode: '002594', weight: 0.10, industry: '新能源' },
      { fundId: 'f8', stockName: '海康威视', stockCode: '002415', weight: 0.09, industry: '科技' },
      { fundId: 'f8', stockName: '立讯精密', stockCode: '002475', weight: 0.08, industry: '科技' },
      { fundId: 'f8', stockName: '韦尔股份', stockCode: '603501', weight: 0.07, industry: '科技' },
    ];

    // 插入一些已实现收益数据
    this.realizedProfits = [
      { id: 'rp1', holdingId: 'h1', date: '2024-02-15', profit: 120.5 }, // 部分赎回
      { id: 'rp2', holdingId: 'h2', date: '2024-03-01', profit: 200.0 }, // 部分赎回
    ];
  }

  // 数据库方法模拟
  prepare(sql: string) {
    return {
      all: (...params: any[]) => this.executeQuery(sql, params, 'all'),
      get: (...params: any[]) => this.executeQuery(sql, params, 'get'),
      run: (...params: any[]) => this.executeQuery(sql, params, 'run'),
    };
  }

  exec(_sql: string) {
    // 忽略 CREATE TABLE 等语句，因为我们使用内存数据结构
    return;
  }

  // 执行查询
  private executeQuery(sql: string, params: any[], mode: 'all' | 'get' | 'run') {
    // 解析SQL语句，模拟查询
    if (sql.includes('SELECT') && sql.includes('holdings')) {
      // 处理持仓查询
      const userId = params[0] || 'user1';
      const holdings = this.holdings.filter(h => h.userId === userId);
      
      return holdings.map(holding => {
        const fund = this.funds.find(f => f.id === holding.fundId);
        return {
          id: holding.id,
          fundId: holding.fundId, // 添加fundId属性，用于后续查询
          fund_id: holding.fundId,
          user_id: holding.userId,
          shares: holding.shares,
          cost_price: holding.costPrice,
          purchase_date: holding.purchaseDate,
          fund_code: fund?.code,
          fund_name: fund?.name,
          fund_type: fund?.type,
          fund_manager: fund?.manager,
        };
      });
    } 
    else if (sql.includes('SELECT') && sql.includes('fund_prices')) {
      // 处理价格查询
      const fundId = params[0];
      let days = params[1] || 30;
      
      const prices = this.fundPrices
        .filter(p => p.fundId === fundId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, days);
      
      return mode === 'get' ? prices[0] : prices;
    }
    else if (sql.includes('SELECT') && sql.includes('fund_top_holdings')) {
      // 处理重仓股查询
      const fundId = params[0];
      
      return this.fundTopHoldings
        .filter(h => h.fundId === fundId)
        .sort((a, b) => b.weight - a.weight);
    }
    else if (sql.includes('SELECT') && sql.includes('realized_profits')) {
      // 处理已实现收益查询
      const holdingId = params[0];
      const profits = this.realizedProfits.filter(p => p.holdingId === holdingId);
      const total = profits.reduce((sum, p) => sum + p.profit, 0);
      
      return { total };
    }
    else if (sql.includes('SELECT') && sql.includes('funds')) {
      // 处理基金查询
      return this.funds;
    }
    
    return mode === 'all' ? [] : mode === 'get' ? null : undefined;
  }
}

// 创建内存数据库实例
const db = new MemoryDatabase();
db.initDatabase();

// 导出函数
export function initDatabase() {
  db.initDatabase();
}

export function resetDatabase() {
  db.resetDatabase();
}

export default db;


