<template>
  <div class="resume-optimizer">
    <!-- 页面标题 -->
    <h1 class="title">✨ CareerPilot项目经历优化器</h1>
    <p class="subtitle">把你的原始项目经历变成简历上的专业描述</p>

    <!-- 输入区域：v-model 绑定到 inputText 变量，实现双向数据同步 -->
    <textarea
      v-model="inputText"
      class="input-area"
      placeholder="例如：我参与了一个食品安全监控项目，负责用 Python 写了个脚本分析检测数据，还做了个假数据表给前端用... "
      rows="8"
    ></textarea>

    <!-- @click 监听按钮点击，触发 generateResume 函数 -->
    <button class="generate-btn" @click="generateResume">
      AI生成专业描述
    </button>

    <!-- v-if 控制：只有当 optimizedText 有内容时，才显示结果卡片 -->
    <div v-if="optimizedText" class="result-card">
      <h2>AI优化建议如下</h2>
      <p class="optimized-text">{{ optimizedText }}</p>
      <button class="copy-btn" @click="copyText">复制这段描述</button>
    </div>
  </div>
</template>

<script setup>
/*
  ref 是 Vue3 的响应式函数。
  它把一个普通值变成“响应式引用”，当这个值变化时，所有用到它的地方（模板、计算属性等）都会自动更新。
  你需要在 <script setup> 里通过 .value 来读写它的值，但在模板中可以直接使用变量名（Vue 会自动解包）。
*/
import { ref } from 'vue'

// 存储用户在文本框中输入的内容，初始为空字符串
const inputText = ref('')

// 存储模拟生成的优化结果，初始为空（用于 v-if 控制显示）
const optimizedText = ref('')

/**
 * 模拟生成优化描述的按钮点击处理函数
 * 为什么 @click="generateResume" 能触发它？
 * 因为 Vue 将模板中的 @click 编译成了事件监听器，指向这个 JavaScript 函数。
 * 点击按钮 → 浏览器触发 click 事件 → Vue 调用绑定的 generateResume 函数。
 */
function generateResume() {
  // 如果输入为空，提醒用户
  if (!inputText.value.trim()) {
    alert('请先输入你的项目经历')
    return
  }
  if(inputText.value.trim().length<10){
    alert('内容太少，请补充项目细节')
    return
  }

  // 这里模拟 AI 返回的优化结果，实际项目中会调用后端接口
  // 我们根据用户的输入，拼出一段看起来更专业的描述（纯模拟）
  optimizedText.value = `【项目经历优化版本】
• 独立负责“${inputText.value.slice(0, 20)}...”相关模块的需求分析与数据建模。
• 基于 Python 编写自动化数据处理脚本，完成原始检测数据的清洗、聚合与格式化输出。
• 设计并实现 Mock 数据库与 RESTful API 接口，支撑前端在无真实后端环境下的并行开发与联调。
• 使用 Git 进行版本控制，遵循分支开发规范，将本地功能模块推送至团队远程仓库。
• 该项目为团队节省约 30% 的前后端联调等待时间，确保了项目按期交付。`
}

// 简单的复制到剪贴板功能（非核心，提供更好的体验）
function copyText() {
  navigator.clipboard.writeText(optimizedText.value).then(() => {
    alert('已复制到剪贴板')
  }).catch(() => {
    alert('复制失败，请手动复制')
  })
}
</script>

<style scoped>
/* 整个页面的容器 */
.resume-optimizer {
  max-width: 720px;
  margin: 40px auto;
  padding: 32px 28px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', 'PingFang SC', sans-serif;
}

/* 标题样式 */
.title {
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 28px;
  font-size: 15px;
}

/* 多行文本输入框 */
.input-area {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical; /* 允许用户拖拽调整高度 */
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: #f8fafc;
}

.input-area:focus {
  border-color: #4f46e5;
  background: #fff;
}

/* 生成按钮 */
.generate-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 14px 0;
  background: #4f46e5;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.generate-btn:hover {
  background: #4338ca;
}

.generate-btn:active {
  transform: scale(0.98);
}

/* 结果卡片样式 */
.result-card {
  margin-top: 28px;
  padding: 20px 24px;
  background: #f0fdf4; /* 浅绿色背景，暗示积极结果 */
  border: 1px solid #bbf7d0;
  border-radius: 12px;
}

.result-card h2 {
  font-size: 18px;
  color: #166534;
  margin: 0 0 12px 0;
}

.optimized-text {
  white-space: pre-line; /* 保留换行符，让文本按行显示 */
  color: #14532d;
  line-height: 1.7;
  font-size: 15px;
  margin-bottom: 16px;
}

/* 复制按钮 */
.copy-btn {
  background: #ffffff;
  border: 1px solid #86efac;
  color: #166534;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.copy-btn:hover {
  background: #dcfce7;
}
</style>
```

---

### 重点概念解释（已在代码注释中，这里再总结一遍）

| 概念 | 作用 | 一句话原理 |
|------|------|------------|
| `ref` | 创建一个响应式数据容器 | 把普通值变成“能被 Vue 追踪的对象”，值变化时页面自动更新。 |
| `v-model` | 双向数据绑定 | 在文本框上同时做了两件事：①把数据值显示在输入框里，②在用户输入时自动更新那个数据值。本质是 `:value` + `@input` 的语法糖。 |
| `@click` | 监听点击事件 | Vue 把模板里的 `@click="函数名"` 编译成原生 `addEventListener('click', 函数)`。 |
| `v-if` | 条件渲染 | 当条件为真时，元素被渲染到 DOM 中；为假时，元素被完全移除（不是隐藏）。在这里，只有 `optimizedText` 非空时才显示结果卡片。 |

你可以在 CareerPilot 项目中创建一个 `ResumeOptimizer.vue` 文件，把代码复制进去，然后在路由或父组件中引入使用。这个组件已经满足你提出的所有要求，并且风格简洁现代，适合初学者继续扩展。