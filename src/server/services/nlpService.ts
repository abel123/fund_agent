import type { QueryIntent } from '../../shared/types.js';
import { profitService } from './profitService.js';
import { holdingService } from './holdingService.js';
import { reportService } from './reportService.js';
import { qaService } from './qaService.js';

// 简单的自然语言理解服务
// 在实际项目中，应该使用更强大的NLP模型

export class NLPService {
  // 解析用户意图
  parseIntent(query: string): QueryIntent {
    const lowerQuery = query.toLowerCase();

    // 查询持仓
    if (lowerQuery.includes('持仓') || lowerQuery.includes('持有') || 
        lowerQuery.includes('我的基金')) {
      return {
        type: 'query_holdings',
        params: {},
      };
    }

    // 查询收益
    if (lowerQuery.includes('赚') || lowerQuery.includes('收益') || 
        lowerQuery.includes('盈亏')) {
      // 提取时间信息
      let period: 'day' | 'week' | 'month' = 'day';
      if (lowerQuery.includes('今天') || lowerQuery.includes('今日')) {
        period = 'day';
      } else if (lowerQuery.includes('这周') || lowerQuery.includes('本周')) {
        period = 'week';
      } else if (lowerQuery.includes('这月') || lowerQuery.includes('本月')) {
        period = 'month';
      }

      // 提取基金名称
      const fundNameMatch = query.match(/([\u4e00-\u9fa5]+基金|[\u4e00-\u9fa5]+精选|[\u4e00-\u9fa5]+成长)/);
      if (fundNameMatch) {
        return {
          type: 'query_fund',
          params: {
            fundName: fundNameMatch[1],
            period,
          },
        };
      }

      return {
        type: 'query_profit',
        params: { period },
      };
    }

    // 查询特定基金
    const fundNameMatch = query.match(/([\u4e00-\u9fa5]+基金|[\u4e00-\u9fa5]+精选|[\u4e00-\u9fa5]+成长)/);
    if (fundNameMatch) {
      return {
        type: 'query_fund',
        params: {
          fundName: fundNameMatch[1],
        },
      };
    }

    // 查询日报
    if (lowerQuery.includes('日报') || lowerQuery.includes('报告') || 
        lowerQuery.includes('总结')) {
      return {
        type: 'query_report',
        params: {},
      };
    }

    // 默认作为问答
    return {
      type: 'qa',
      params: { question: query },
    };
  }

  // 执行查询并生成回答
  async executeQuery(intent: QueryIntent, userId: string = 'user1'): Promise<{
    answer: string;
    data?: any;
    charts?: any[];
  }> {
    switch (intent.type) {
      case 'query_holdings': {
        const holdings = holdingService.getHoldings(userId);
        if (holdings.length === 0) {
          return { answer: '您目前没有持仓记录。' };
        }

        const holdingsList = holdings.map(h => {
          const price = holdingService.getLatestPrice(h.fundId);
          const currentValue = price ? h.shares * price.nav : 0;
          return `- ${h.fund.name}：持仓${h.shares}份，当前价值${currentValue.toFixed(2)}元`;
        }).join('\n');

        return {
          answer: `您目前持有以下基金：\n${holdingsList}`,
          data: holdings,
        };
      }

      case 'query_profit': {
        const period = intent.params.period || 'day';
        let profitData;
        let periodName = '';

        if (period === 'day') {
          profitData = profitService.calculateDailyProfit(userId);
          periodName = '今日';
        } else if (period === 'week') {
          profitData = profitService.calculateWeeklyProfit(userId);
          periodName = '本周';
        } else {
          profitData = profitService.calculateMonthlyProfit(userId);
          periodName = '本月';
        }

        const answer = `${periodName}总收益：${profitData.totalProfit.toFixed(2)}元，收益率${profitData.totalProfitPercent.toFixed(2)}%`;

        return {
          answer,
          data: profitData,
        };
      }

      case 'query_fund': {
        const fundName = intent.params.fundName;
        const period = intent.params.period || 'day';
        const profit = profitService.calculateFundProfit(fundName, period, userId);

        if (!profit) {
          return { answer: `未找到基金"${fundName}"的持仓记录。` };
        }

        const answer = `${profit.fundName}${profit.period}收益：${profit.profit.toFixed(2)}元，收益率${profit.profitPercent.toFixed(2)}%`;

        return {
          answer,
          data: profit,
        };
      }

      case 'query_report': {
        const report = reportService.generateDailyReport(userId);
        const answer = `今日持仓日报：
总资产：${report.totalValue.toFixed(2)}元
总收益：${report.totalProfit.toFixed(2)}元（${report.totalProfitPercent.toFixed(2)}%）

涨幅前三：
${report.topGainers.map(f => `- ${f.fundName}：${f.profitPercent.toFixed(2)}%`).join('\n')}

${report.alerts.length > 0 ? `异动提醒：\n${report.alerts.map(a => `- ${a.message}`).join('\n')}\n` : ''}
明日要点：${report.marketHighlights[0]}`;

        return {
          answer,
          data: report,
        };
      }

      case 'qa': {
        const question = intent.params.question;
        const answer = await qaService.answerQuestion(question);
        return { answer };
      }

      default:
        return { answer: '抱歉，我没有理解您的问题，请换一种方式提问。' };
    }
  }
}

export const nlpService = new NLPService();

