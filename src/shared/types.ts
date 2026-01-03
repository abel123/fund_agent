// 基金持仓相关类型定义

export interface Fund {
  id: string;
  code: string; // 基金代码
  name: string; // 基金名称
  type: string; // 基金类型
  manager: string; // 基金经理
}

export interface Holding {
  id: string;
  fundId: string;
  userId: string;
  shares: number; // 持仓份额
  costPrice: number; // 成本价
  purchaseDate: string; // 购买日期
  fund?: Fund;
}

export interface FundPrice {
  fundId: string;
  date: string;
  nav: number; // 净值
  change: number; // 涨跌额
  changePercent: number; // 涨跌幅
}

export interface Profit {
  holdingId: string;
  date: string;
  floatingProfit: number; // 浮动盈亏
  floatingProfitPercent: number; // 浮动盈亏率
  realizedProfit: number; // 已实现收益
  totalProfit: number; // 总收益
}

export interface FundTopHolding {
  fundId: string;
  stockName: string;
  stockCode: string;
  weight: number; // 持仓权重
  industry: string; // 行业
}

export interface DailyReport {
  date: string;
  totalValue: number; // 总资产
  totalProfit: number; // 总收益
  totalProfitPercent: number; // 总收益率
  holdings: HoldingSummary[];
  topGainers: FundPerformance[];
  topLosers: FundPerformance[];
  alerts: Alert[];
  marketHighlights: string[];
}

export interface HoldingSummary {
  fundId: string;
  fundName: string;
  shares: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
}

export interface FundPerformance {
  fundId: string;
  fundName: string;
  profit: number;
  profitPercent: number;
  changeReason?: string; // 涨跌原因
}

export interface Alert {
  type: 'large_gain' | 'large_loss' | 'volatility';
  fundId: string;
  fundName: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  charts?: ChartData[];
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: any[];
}

export interface QueryIntent {
  type: 'query_holdings' | 'query_profit' | 'query_fund' | 'query_report' | 'qa';
  params: Record<string, any>;
}

