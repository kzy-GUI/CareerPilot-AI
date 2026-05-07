<template>
  <div class="tracker-container">
    <h1 class="page-title">岗位投递追踪板</h1>

    <!-- 筛选与排序区域 -->
    <div class="toolbar">
      <div class="toolbar-item">
        <label class="toolbar-label">筛选状态：</label>
        <select v-model="selectedStatus" class="toolbar-select">
          <option value="全部">全部</option>
          <option value="已投递">已投递</option>
          <option value="面试中">面试中</option>
          <option value="已录用">已录用</option>
        </select>
      </div>
      <div class="toolbar-item">
        <label class="toolbar-label">排序方式：</label>
        <select v-model="sortBy" class="toolbar-select">
          <option value="">添加顺序（默认）</option>
          <option value="company">按公司名排序</option>
          <option value="job">按岗位名排序</option>
        </select>
      </div>
    </div>

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

    <!-- 记录卡片列表（渲染筛选排序后的结果） -->
    <div class="records-list">
      <div
        v-for="record in filteredSortedRecords"
        :key="record.id"
        :class="['record-card', getStatusClass(record.status)]"
      >
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
            <span class="card-status">{{ record.status }}</span>
          </div>
        </div>

        <!-- 删除按钮：传递整条记录对象，而不是索引，以兼容筛选排序场景 -->
        <button class="delete-btn" @click="deleteRecord(record)">删除</button>
      </div>

      <!-- 没有记录时的空状态提示 -->
      <div v-if="filteredSortedRecords.length === 0" class="empty-tip">
        还没有符合条件的投递记录
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ==================== 基础数据 ====================
const companyInput = ref('')
const jobInput = ref('')
const statusInput = ref('')

/**
 * records 为什么用数组？
 * 投递记录按添加时间顺序排列，数量会动态增长。
 * 数组能方便地：
 * 1. 按索引访问每一条；
 * 2. 用 push() 尾部追加，保持时间序；
 * 3. 配合 v-for 批量渲染。
 *
 * 本次新增：每条记录都带一个唯一 id，方便在筛选和排序后仍能准确定位原始数据。
 */
const records = ref([])

// ==================== 筛选与排序状态 ====================
const selectedStatus = ref('全部')        // 当前选中的筛选状态
const sortBy = ref('')                    // 当前选中的排序字段：'company' | 'job' | ''

// ==================== 添加记录（功能不变） ====================
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
   * 一条记录包含多个关联属性（公司、岗位、状态），
   * 用对象可以打包在一起，访问清晰，并方便携带唯一 id。
   */
  records.value.push({
    id: Date.now() + Math.random(),  // 简单唯一标识
    company,
    job,
    status
  })

  // 清空输入框
  companyInput.value = ''
  jobInput.value = ''
  statusInput.value = ''
}

// ==================== 删除记录 ====================
/**
 * 删除一条记录，接收记录对象而不是索引。
 * 这样即使当前渲染的列表经过了筛选和排序，仍能准确删除原始数组中的对应项。
 */
const deleteRecord = (record) => {
  // 在原始数组中查找当前记录对象的索引
  const index = records.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
    // splice(起始位置, 删除个数) 会从数组中移除该元素，并触发响应式更新
    records.value.splice(index, 1)
  }
}

// ==================== 状态背景色映射 ====================
const getStatusClass = (status) => {
  const s = status.trim()
  if (s === '已投递') return 'status-pending'
  if (s === '面试中') return 'status-interview'
  if (s === '已录用') return 'status-offer'
  return ''
}

// ==================== 计算属性：筛选 + 排序后的列表 ====================
/**
 * 先根据 selectedStatus 筛选，再根据 sortBy 排序。
 * 使用 computed 保证当 records、筛选条件或排序方式变化时，界面自动更新。
 */
const filteredSortedRecords = computed(() => {
  // 第一步：筛选
  let result = records.value.filter(record => {
    /**
     * filter() 方法会遍历数组中的每一个元素，并返回一个新数组，
     * 新数组中只包含那些让回调函数返回 true 的元素。
     * 这里如果 selectedStatus 是 '全部'，保留所有记录；
     * 否则只保留 status 完全匹配的那一部分。
     */
    if (selectedStatus.value === '全部') return true
    return record.status.trim() === selectedStatus.value
  })

  // 第二步：排序（只在 sortBy 不为空时进行）
  if (sortBy.value) {
    /**
     * sort() 方法会直接对原数组进行排序，并返回排序后的数组。
     * 为了保证不修改 computed 内部产生的临时数组（导致副作用），
     * 我们先 slice() 浅拷贝一份，再在拷贝上调用 sort。
     * 排序字段：'company' 按公司名升序，'job' 按岗位名升序。
     * localeCompare() 能正确处理中文字符串比较。
     */
    result = result.slice().sort((a, b) => {
      const fieldA = a[sortBy.value] || ''
      const fieldB = b[sortBy.value] || ''
      return fieldA.localeCompare(fieldB, 'zh')
    })
  }

  return result
})
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
  margin-bottom: 24px;
  text-align: center;
  letter-spacing: -0.5px;
}

/* 工具栏（筛选 & 排序） */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px 20px;
}

.toolbar-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.toolbar-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  background: white;
  cursor: pointer;
  outline: none;
}

.toolbar-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
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

.record-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 20px;
  border-left: 6px solid transparent;
  border-radius: 12px;
  background: #f8fafc;
  transition: box-shadow 0.2s, transform 0.1s, background 0.2s;
}

.record-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

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
  background: #e2e8f0;
  color: #334155;
  white-space: nowrap;
}

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

/* 状态背景色（保持不变） */
.record-card.status-pending {
  background: #eff6ff;
  border-left-color: #3b82f6;
}

.record-card.status-interview {
  background: #fff7ed;
  border-left-color: #f97316;
}

.record-card.status-offer {
  background: #f0fdf4;
  border-left-color: #22c55e;
}

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

/* 空状态 */
.empty-tip {
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  padding: 40px 0;
}
</style>