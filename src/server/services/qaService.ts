// 简单的RAG问答服务
// 在实际项目中，这里应该使用向量数据库和嵌入模型

const knowledgeBase: Record<string, string> = {
  '赎回费': `
基金赎回费的计算方式：
1. 持有期在7天以内：通常收取1.5%的赎回费
2. 持有期在7天-30天：通常收取0.75%的赎回费
3. 持有期在30天-1年：通常收取0.5%的赎回费
4. 持有期超过1年：通常免收赎回费

具体费率以基金合同为准，不同基金可能有所不同。
  `,
  '定投': `
基金定投设置方法：
1. 选择定投基金：根据风险承受能力选择合适的基金
2. 设置定投金额：建议每月定投金额不超过月收入的20%
3. 选择定投周期：可选择每周、每两周或每月定投
4. 设置定投日期：建议选择工资发放后几天
5. 长期坚持：定投需要长期坚持，建议至少1-2年

定投的优势：
- 分散投资风险
- 降低择时难度
- 利用复利效应
  `,
  '申购费': `
基金申购费的计算：
- 前端收费：在申购时收取，通常为1.5%
- 后端收费：在赎回时收取，持有时间越长费率越低
- 部分平台有折扣优惠，实际费率可能更低

建议在申购前查看基金合同中的具体费率说明。
  `,
  '分红': `
基金分红方式：
1. 现金分红：将收益以现金形式发放
2. 红利再投资：将收益自动转换为基金份额

选择建议：
- 需要现金流的投资者选择现金分红
- 长期投资者建议选择红利再投资，享受复利效应
  `,
  '风险': `
基金投资风险：
1. 市场风险：基金净值随市场波动
2. 流动性风险：部分基金可能限制赎回
3. 信用风险：债券基金可能面临违约风险
4. 管理风险：基金经理变动可能影响业绩

风险控制建议：
- 分散投资，不要把所有资金投入单一基金
- 根据风险承受能力选择合适的产品
- 定期审视和调整投资组合
  `,
};

export class QAService {
  // 简单的关键词匹配问答
  async answerQuestion(question: string): Promise<string> {
    const lowerQuestion = question.toLowerCase();

    // 关键词匹配
    for (const [keyword, answer] of Object.entries(knowledgeBase)) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        return answer.trim();
      }
    }

    // 如果没有匹配到，返回通用回答
    return `
抱歉，我暂时无法回答这个问题。我可以帮您解答以下问题：
- 赎回费如何计算
- 定投如何设置
- 申购费相关问题
- 基金分红方式
- 投资风险相关问题

请尝试用更具体的问题提问，我会尽力为您解答。
    `.trim();
  }

  // 扩展知识库（在实际项目中，这应该通过向量数据库实现）
  async searchKnowledgeBase(query: string): Promise<string[]> {
    const results: string[] = [];
    const lowerQuery = query.toLowerCase();

    for (const [keyword, content] of Object.entries(knowledgeBase)) {
      if (lowerQuery.includes(keyword.toLowerCase()) || 
          content.toLowerCase().includes(lowerQuery)) {
        results.push(content);
      }
    }

    return results;
  }
}

export const qaService = new QAService();

