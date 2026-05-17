<template>
  <div class="learning-container">
    <h1 class="page-title">学习路线生成器</h1>

    <!-- 输入区域 -->
    <div class="input-group">
      <input
        v-model="jobInput"
        type="text"
        placeholder="请输入目标岗位，如：Java后端、前端开发"
        class="job-input"
        @keyup.enter="generatePath"
        :disabled="isLoading"
      />
      <button
        class="generate-btn"
        @click="generatePath"
        :disabled="isLoading || !jobInput.trim()"
      >
        {{ isLoading ? '生成中...' : '生成学习路线' }}
      </button>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
      <button class="retry-btn" @click="errorMessage = ''">关闭</button>
    </div>

    <!-- 生成结果展示区 -->
    <div v-if="learningPath.length > 0" class="path-container">
      <div
        v-for="week in learningPath"
        :key="week.week"
        class="stage-card"
      >
        <div class="stage-header">
          <span class="stage-number">第 {{ week.week }} 周</span>
          <h3 class="stage-title">{{ week.title }}</h3>
        </div>
        <ul class="tips-list">
          <li v-for="(task, tIndex) in week.tasks" :key="tIndex" class="tip-item">
            {{ task }}
          </li>
        </ul>
      </div>
      <p class="ai-disclaimer">内容由 DeepSeek-v4-flash 生成，请仔细甄别</p>
    </div>

    <!-- 未找到路线时的提示 -->
    <div v-else-if="hasSearched && !isLoading" class="empty-tip">
      还没有该岗位的学习路线，试试“Java后端”或“前端开发”吧！
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 用户输入的岗位
const jobInput = ref('')

// 生成的路线数据（数组，每个元素是一个阶段对象）
const learningPath = ref([])

// 是否已经进行过搜索
const hasSearched = ref(false)

const isLoading = ref(false)
const errorMessage = ref('')
const generatePath = async () => {
  const keyword = jobInput.value.trim()
  if (!keyword) {
    errorMessage.value = '目标岗位这里填哦'
    return
  }

  // 重置状态
  errorMessage.value = ''
  hasSearched.value = true
  isLoading.value = true
  learningPath.value = []

  try {
    const response = await fetch('/api/learning-path', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ targetJob: keyword })
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || '请求失败')
    }

    // 接收 { weeks: [...] } 结构
    learningPath.value = result.data.weeks || []

  } catch (err) {
    console.error('学习路线生成失败:', err)
    errorMessage.value = err.message || '网络错误，请稍后重试'
    learningPath.value = []
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.error-message {
  background: #fef2f2;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.retry-btn {
  background: none;
  border: none;
  color: #b91c1c;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
}

.generate-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
}

.learning-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 30px;
  text-align: center;
  letter-spacing: -0.5px;
}

.input-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
  align-items: center;
}

.job-input {
  flex: 1 1 300px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  color: #334155;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.job-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background: #ffffff;
}

.generate-btn {
  flex: 0 0 auto;
  padding: 12px 28px;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  font-size: 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.generate-btn:hover {
  background: #2563eb;
}

.generate-btn:active {
  transform: scale(0.97);
}

.path-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stage-card {
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
  border-radius: 12px;
  padding: 20px 24px;
  transition: box-shadow 0.2s;
}

.stage-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stage-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.stage-number {
  font-size: 13px;
  font-weight: 600;
  color: #3b82f6;
  background: #dbeafe;
  padding: 4px 10px;
  border-radius: 20px;
}

.stage-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-item {
  padding: 6px 0 6px 24px;
  position: relative;
  font-size: 15px;
  color: #475569;
  line-height: 1.5;
}

.tip-item::before {
  content: "•";
  position: absolute;
  left: 8px;
  color: #3b82f6;
  font-weight: bold;
}

.empty-tip {
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  padding: 40px 0;
}

.ai-disclaimer {
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  margin-top: 16px;
}
</style>