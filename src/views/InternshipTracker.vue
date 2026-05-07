<template>
  <div class="tracker-container">
    <h1 class="page-title">岗位投递追踪板</h1>

    <!-- 输入区域（原有功能不变） -->
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
        placeholder="当前状态（如：已投递/面试中/已录用）"
        class="tracker-input"
      />
      <button class="add-btn" @click="addRecord">添加投递记录</button>
    </div>

    <!-- 记录卡片列表 -->
    <div class="records-list">
      <div
        v-for="(record, index) in records"
        :key="index"
        :class="['record-card', getStatusClass(record.status)]"
      >
        <!-- 信息区域 -->
        <div class="card-info">
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
            <!-- 用动态样式突出状态，同时保留原有显示 -->
            <span class="card-status">{{ record.status }}</span>
          </div>
        </div>

        <!-- 删除按钮：点击时把当前记录的索引传给删除函数 -->
        <button class="delete-btn" @click="deleteRecord(index)">
          删除
        </button>
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

// --- 响应式数据（原有部分） ---
const companyInput = ref('')
const jobInput = ref('')
const statusInput = ref('')

/**
 * records 为什么用数组？
 * 投递记录按添加时间顺序排列，数量会动态增长。
 * 数组能方便地：
 * 1. 按索引访问每一条；
 * 2. 用 push() 尾部追加，保持时间序；
 * 3. 配合 v-for 批量渲染成卡片。
 */
const records = ref([])

// --- 添加记录（完全保留原有逻辑） ---
const addRecord = () => {
  const company = companyInput.value.trim()
  const job = jobInput.value.trim()
  const status = statusInput.value.trim()

  if (!company || !job || !status) {
    alert('请填写完整的公司名称、岗位名称和当前状态！')
    return
  }

  /**
   * 每条记录为什么用对象？
   * 一条记录包含公司、岗位、状态等多个关联属性，
   * 用对象可以清晰地打包在一起，访问时直接点属性名，远比维护多个分离数组方便。
   */
  records.value.push({
    company,
    job,
    status
  })

  // 清空输入框
  companyInput.value = ''
  jobInput.value = ''
  statusInput.value = ''
}

// --- 删除记录 ---
/**
 * @param {number} index - 要从数组中删除的元素的索引
 *
 * splice 的作用：
 * `records.value.splice(index, 1)` 会从 records 数组的第 index 位开始，
 * 删除 1 个元素，并自动触发 Vue 的响应式更新，从界面上移除对应的卡片。
 */
const deleteRecord = (index) => {
  records.value.splice(index, 1)
}

// --- 根据状态返回不同的 CSS 类名 ---
/**
 * 动态 class 绑定的原理：
 * 我们在模板里使用 `:class="['record-card', getStatusClass(record.status)]"`，
 * Vue 会实时调用 getStatusClass 函数，根据当前记录的状态字符串返回对应的类名。
 * 这样当每条记录的状态不同时，卡片就会自动应用不同的背景色和左边框色。
 */
const getStatusClass = (status) => {
  // 为了匹配更稳健，可以忽略前后空格
  const s = status.trim()
  if (s === '已投递') return 'status-pending'
  if (s === '面试中') return 'status-interview'
  if (s === '已录用') return 'status-offer'
  // 其他状态默认无特殊背景
  return ''
}
</script>

<style scoped>
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

/*
 * 基础卡片样式：去掉固定的左边框颜色，
 * 改用左侧边框宽度和圆角，颜色由状态类控制
 */
.record-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 20px;
  border-left: 6px solid transparent; /* 默认透明，具体颜色由状态类设置 */
  border-radius: 12px;
  background: #f8fafc; /* 无状态时的默认背景 */
  transition: box-shadow 0.2s, transform 0.1s, background 0.2s;
}

.record-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

/* 信息区域（公司/岗位/状态） */
.card-info {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  flex: 1;
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
}

.card-value {
  font-weight: 500;
  color: #1e293b;
  font-size: 15px;
}

.card-status {
  font-weight: 600;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 20px;
  background: #e2e8f0; /* 默认灰底 */
  color: #334155;
  white-space: nowrap;
}

/* 删除按钮 */
.delete-btn {
  background: none;
  border: 1px solid #e2e8f0;
  color: #94a3b8;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.delete-btn:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
}

/* ============================== */
/* 状态对应的背景色 + 左边框色 */
/* ============================== */
.record-card.status-pending {
  background: #eff6ff;      /* 淡蓝背景 */
  border-left-color: #3b82f6; /* 蓝色左边框 */
}

.record-card.status-interview {
  background: #fff7ed;      /* 淡橙背景 */
  border-left-color: #f97316; /* 橙色左边框 */
}

.record-card.status-offer {
  background: #f0fdf4;      /* 淡绿背景 */
  border-left-color: #22c55e; /* 绿色左边框 */
}

/* 如果需要，可以覆盖状态下状态标签的颜色（可选） */
.status-pending .card-status {
  background: #dbeafe;
  color: #1e40af;
}

.status-interview .card-status {
  background: #ffedd5;
  color: #c2410c;
}

.status-offer .card-status {
  background: #dcfce7;
  color: #15803d;
}

/* 空状态提示 */
.empty-tip {
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  padding: 40px 0;
}
</style>