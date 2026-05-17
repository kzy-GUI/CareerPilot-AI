// server/routes/learningPath.js
const fetch = require('node-fetch'); // 使用 node-fetch@2 (CommonJS)

const express = require('express');
const router = express.Router();

// DeepSeek API 基础配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

/**
 * 构建 Prompt（含角色定位、无效输入拒绝、人情味）
 */
function buildPrompt(targetJob) {
  const systemPrompt = `你是一位亲切、热心的职业规划导师，名叫"航导"。你的任务是：
1. 首先判断用户输入的"目标岗位"是否像是一个真实的职业方向（例如：Java后端、前端开发、UI设计师、产品经理、数据分析师、护士、机械工程师等）。
   - 如果不像，请用友好的语气告诉用户你暂时只能帮忙规划职业学习路线，并请他重新输入一个职业方向。
   - 回复格式必须是纯 JSON：{ "refused": true, "message": "你的友好提示" }
2. 如果像是真实的职业方向，则为其制定一个为期 4 周的学习计划。
   - 计划要具体、可执行，带有一点鼓励的语气，在每周标题或任务描述中体现出对学习者的关怀。
   - 回复格式必须是纯 JSON：{ "weeks": [ { "week": 1, "title": "...", "tasks": ["...", ...] }, ... ] }
   - 注意 tasks 是数组，每个元素是一条具体的学习任务（字符串）。

无论哪种情况，都只返回纯 JSON，不要包含任何 Markdown 标记或额外文字。`;

  const userMessage = `我想成为"${targetJob}"，请帮我规划一下学习路线。`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];
}

/**
 * 从 AI 返回的文本中提取并解析 JSON
 * 兼容 refused 结构和 weeks 结构
 */
function parseAIResponse(rawContent) {
  if (!rawContent) throw new Error('AI 返回内容为空');

  let jsonStr = rawContent.trim();

  // 处理可能包裹的 ```json ... ``` 或 ``` ... ```
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1];
  }

  const parsed = JSON.parse(jsonStr);

  // 如果包含 refused 字段，直接返回原对象（不作 weeks 校验）
  if (parsed.refused === true) return parsed;

  // 校验 weeks 结构
  if (!parsed.weeks || !Array.isArray(parsed.weeks) || parsed.weeks.length === 0) {
    throw new Error('返回的数据缺少 weeks 数组');
  }
  for (const w of parsed.weeks) {
    if (typeof w.week !== 'number' || !w.title || !Array.isArray(w.tasks)) {
      throw new Error('weeks 数组中某些元素格式不正确');
    }
  }

  return parsed;
}

// POST /api/learning-path
router.post('/learning-path', async (req, res) => {
  // 检查 API Key
  if (!process.env.DEEPSEEK_API_KEY) {
    return res.status(500).json({
      success: false,
      message: '服务器未配置 AI 服务，请联系管理员'
    });
  }

  const { targetJob } = req.body;
  if (!targetJob || typeof targetJob !== 'string' || targetJob.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: '请输入目标岗位'
    });
  }

  const job = targetJob.trim();

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: buildPrompt(job),
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`DeepSeek API 错误 (${response.status}):`, errorBody);
      return res.status(502).json({
        success: false,
        message: 'AI 服务暂时不可用，请稍后重试'
      });
    }

    const result = await response.json();
    const aiMessage = result.choices?.[0]?.message?.content;

    // 解析 AI 响应
    const parsedData = parseAIResponse(aiMessage);

    // 新增：判断是否为拒绝情况
    if (parsedData.refused) {
      return res.json({
        success: false,
        message: parsedData.message || '请输入有效的职业方向'
      });
    }

    // 正常返回学习计划
    res.json({
      success: true,
      data: parsedData
    });

  } catch (err) {
    console.error('学习路线生成失败:', err.message);

    if (err instanceof SyntaxError) {
      return res.status(500).json({
        success: false,
        message: 'AI 生成的数据格式异常，请重试'
      });
    }

    res.status(500).json({
      success: false,
      message: '生成学习路线失败，请检查网络连接或稍后重试'
    });
  }
});

module.exports = router;