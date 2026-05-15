// src/constants.ts
// 投递状态映射表：数字 <-> 中文

export const STATUS_MAP: Record<number, string> = {
  0: '已投递',
  1: '面试中',
  2: '已录用',
  3: '已拒绝'
}

export const STATUS_REVERSE_MAP: Record<string, number> = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([key, value]) => [value, Number(key)])
)