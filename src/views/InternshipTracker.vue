<template>
  <div class="tracker-container">
    <h1 class="page-title">岗位投递追踪板</h1>

    <!-- 工具栏：搜索（手动触发） + 筛选 + 排序 -->
    <div class="toolbar">
      <div class="toolbar-item">
        <label class="toolbar-label">搜索：</label>
        <input
          v-model="tempSearch"
          type="text"
          placeholder="输入公司或岗位关键词，按回车或点击搜索"
          class="toolbar-search"
          @keyup.enter="triggerSearch"
        />
        <button class="search-btn" @click="triggerSearch">搜索</button>
      </div>
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
          <option value="">默认（添加顺序）</option>
          <option value="company">按公司名排序</option>
          <option value="job">按岗位名排序</option>
        </select>
      </div>
    </div>

    <!-- 添加记录输入区 -->
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

    <!-- 记录卡片列表（渲染最终的筛选、搜索、排序结果） -->
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
        <button class="delete-btn" @click="deleteRecord(record)">删除</button>
      </div>
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
 * 3. 配合 v-for 批量渲染卡片。
 * 每条记录携带唯一 id，方便在筛选、搜索、排序后精准操作。
 */
const records = ref([])

// ==================== 搜索、筛选、排序状态 ====================
/*
 * 关键改动：搜索不再直接绑定到 searchKeyword，
 * 而是先用 tempSearch 临时存放用户输入，等用户主动触发搜索时才更新 searchKeyword。
 * 这样列表不会随输入实时刷新，而是用户决定何时执行搜索。
 */
const tempSearch = ref('')          // 输入框绑定的临时文本
const searchKeyword = ref('')       // 真正用于过滤的关键词（由 triggerSearch 更新）
const selectedStatus = ref('全部')
const sortBy = ref('')

// ==================== 触发搜索 ====================
/**
 * 搜索的触发原理：
 * - 用户点击“搜索”按钮或按 Enter 键时，调用 triggerSearch 函数。
 * - 该函数将 tempSearch 的当前值（去除首尾空格）赋给 searchKeyword。
 * - searchKeyword 是一个 ref，值一旦变化，依赖它的 computed（filteredSortedRecords）会自动重新计算。
 * - 于是卡片列表立即更新为最新的筛选 + 搜索 + 排序结果。
 */
const triggerSearch = () => {
  searchKeyword.value = tempSearch.value.trim()
}

// ==================== 添加记录（功能不变） ====================
const addRecord = () => {
  const company = companyInput.value.trim()
  const job = jobInput.value.trim()
  const status = statusInput.value.trim()

  if (!company || !job || !status) {
    alert('请填写完整的公司名称、岗位名称和当前状态！')
    return
  }

  records.value.push({
    id: Date.now() + Math.random(),
    company,
    job,
    status
  })

  companyInput.value = ''
  jobInput.value = ''
  statusInput.value = ''
}

// ==================== 删除记录（基于对象 + id） ====================
const deleteRecord = (record) => {
  const index = records.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
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

// ==================== 计算属性：筛选 + 搜索 + 排序（三合一） ====================
/**
 * 这个 computed 是 Vue 响应式的核心体现。
 * 当 records、selectedStatus、searchKeyword、sortBy 中任何一个 ref 发生变化时，
 * Vue 会自动重新运行这个函数，得到新列表并更新页面。
 */
const filteredSortedRecords = computed(() => {
  let result = records.value

  // 第一步：状态筛选
  if (selectedStatus.value !== '全部') {
    result = result.filter(record => record.status.trim() === selectedStatus.value)
  }

  // 第二步：关键词搜索（忽略大小写）
  const keyword = searchKeyword.value
  if (keyword) {
    /**
     * includes() 判断子字符串原理：
     * 字符串的 includes(sub) 方法会检查该字符串内是否包含子串 sub，
     * 包含则返回 true，否则返回 false。
     * includes 区分大小写，所以先用 toLowerCase() 将双方转为小写来达到忽略大小写的效果。
     */
    result = result.filter(record => {
      return record.company.toLowerCase().includes(keyword.toLowerCase()) ||
             record.job.toLowerCase().includes(keyword.toLowerCase())
    })
  }

  // 第三步：排序（需要时）
  if (sortBy.value) {
    /**
     * sort() 会直接修改调用它的数组，为避免副作用，先用 slice() 浅拷贝一份再排序。
     * localeCompare 能正确处理中文字符的排序（按拼音升序）。
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

/* 工具栏 */
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

.toolbar-search {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  background: white;
  outline: none;
  min-width: 180px;
}

.toolbar-search:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.search-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #2563eb;
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

/* 状态背景色与边框色 */
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

/* 空状态提示 */
.empty-tip {
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  padding: 40px 0;
}
</style>