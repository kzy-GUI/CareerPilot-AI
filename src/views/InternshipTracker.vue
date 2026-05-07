<template>
  <div class="tracker-container">
    <h1 class="page-title">岗位投递追踪板</h1>

    <!-- 输入区域 -->
    <div class="input-group">
      <input
        v-model="companyInput"
        type="text"
        placeholder="公司名称"
        class="tracker-input"
      />
      <input
        v-model="jobInput"
        type="text"
        placeholder="岗位名称"
        class="tracker-input"
      />
      <input
        v-model="statusInput"
        type="text"
        placeholder="当前状态"
        class="tracker-input"
      />
      <button class="add-btn" @click="addRecord">添加投递记录</button>
    </div>

    <!-- 记录卡片列表 -->
    <div class="records-list">
      <!--
        v-for 指令会遍历 records 数组中的每一项。
        每遍历到一个元素，Vue 会以当前元素为模板数据，在页面上渲染出一个卡片。
        :key 用来给每个渲染出来的节点一个唯一标识，帮助 Vue 高效地更新列表。
      -->
      <div
        v-for="(record, index) in records"
        :key="index"
        class="record-card"
      >
        <div class="card-field">
          <span class="card-label">公司：</span>
          <span class="card-value">{{ record.company }}</span>
        </div>
        <div class="card-field">
          <span class="card-label">岗位：</span>
          <span class="card-value">{{ record.job }}</span>
        </div>
        <div class="card-field">
          <span class="card-label">状态：</span>
          <span class="card-status">{{ record.status }}</span>
        </div>
      </div>

      <!-- 没有记录时的空状态提示 -->
      <div v-if="records.length === 0" class="empty-tip">
        还没有投递记录，快添加一条吧！
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// --- 定义响应式数据 ---

// 输入框绑定的值
const companyInput = ref('')
const jobInput = ref('')
const statusInput = ref('')

/*
 * records 为什么用数组？
 *
 * 投递记录是有顺序的（按照添加时间先后排列），且数量会动态增长。
 * 用数组可以方便地：
 * 1. 按索引访问每一条记录；
 * 2. 用 push() 从尾部添加新记录，保持时间顺序；
 * 3. 配合 v-for 指令，一次性把数组里的所有数据渲染成页面卡片。
 *
 * 如果只用单独的字符串或对象，无法存放多条记录，也就不方便展示列表。
 */
const records = ref([])

// --- 添加记录的方法 ---
const addRecord = () => {
  // 去空格后再判断，防止用户只输入空格
  const company = companyInput.value.trim()
  const job = jobInput.value.trim()
  const status = statusInput.value.trim()

  // 如果任意一项为空，弹窗提示并停止执行
  if (!company || !job || !status) {
    alert('请填写完整的公司名称、岗位名称和当前状态！')
    return
  }

  /*
   * 每条记录为什么用对象？
   *
   * 一条投递记录包含多个相关的信息：公司名、岗位名、状态。
   * 用对象可以把这些属性打包在一起，逻辑清晰，访问方便。
   * 比如 record.company、record.job、record.status 就能直接拿到对应字段。
   *
   * 如果把这些信息拆成三个独立的数组，维护起来会非常麻烦，而且难以一一对应。
   */
  records.value.push({
    company,
    job,
    status
  })

  // 添加成功后清空输入框，提升体验
  companyInput.value = ''
  jobInput.value = ''
  statusInput.value = ''
}
</script>

<style scoped>
/* 整体容器，与 ResumeOptimizer 风格统一：简洁、现代、居中 */
.tracker-container {
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

/* 输入区域 */
.input-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
}

.tracker-input {
  flex: 1 1 180px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  color: #334155;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.tracker-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background: #ffffff;
}

.add-btn {
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
  letter-spacing: 0.3px;
}

.add-btn:hover {
  background: #2563eb;
}

.add-btn:active {
  transform: scale(0.97);
}

/* 卡片列表 */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.record-card {
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  transition: box-shadow 0.2s, transform 0.1s;
}

.record-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.card-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-label {
  font-weight: 600;
  color: #64748b;
  font-size: 14px;
  white-space: nowrap;
}

.card-value {
  font-weight: 500;
  color: #1e293b;
  font-size: 15px;
}

.card-status {
  font-weight: 600;
  color: #0f172a;
  background: #dbeafe;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
}

/* 空状态提示 */
.empty-tip {
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  padding: 40px 0;
}
</style>