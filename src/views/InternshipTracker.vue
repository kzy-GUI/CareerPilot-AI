<template>
  <div class="tracker-container">
    <h1 class="page-title">岗位投递追踪板</h1>

    <!-- 工具栏：搜索（手动触发 + 多关键词）、筛选、排序 -->
    <div class="toolbar">
      <div class="toolbar-item">
        <label class="toolbar-label">搜索：</label>
        <input
          v-model="tempSearch"
          type="text"
          placeholder="多关键词用空格分隔，按回车或点击搜索"
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

    <!-- 新增记录区域 -->
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

// ---------- 基础数据 ----------
const companyInput = ref('')
const jobInput = ref('')
const statusInput = ref('')

const records = ref([])

// ---------- 搜索、筛选、排序状态 ----------
const tempSearch = ref('')           // 绑定输入框的临时搜索文本
const searchKeyword = ref('')        // 实际用于过滤的关键词字符串（可能包含多个空格分隔的词）
const selectedStatus = ref('全部')
const sortBy = ref('')

// ---------- 触发搜索 ----------
const triggerSearch = () => {
  searchKeyword.value = tempSearch.value.trim()
}

// ---------- 添加记录 ----------
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

// ---------- 删除记录（基于 id） ----------
const deleteRecord = (record) => {
  const index = records.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
    records.value.splice(index, 1)
  }
}

// ---------- 状态背景色映射 ----------
const getStatusClass = (status) => {
  const s = status.trim()
  if (s === '已投递') return 'status-pending'
  if (s === '面试中') return 'status-interview'
  if (s === '已录用') return 'status-offer'
  return ''
}

// ---------- 计算属性：筛选 + 多关键词搜索 + 排序 ----------
const filteredSortedRecords = computed(() => {
  let result = records.value

  // 1. 状态筛选
  if (selectedStatus.value !== '全部') {
    result = result.filter(record => record.status.trim() === selectedStatus.value)
  }

  // 2. 多关键词搜索（空格分隔，OR 逻辑，忽略大小写）
  const rawKeyword = searchKeyword.value.trim()
  if (rawKeyword) {
    // 将搜索字符串按空格分割成多个关键词，并过滤掉空字符串
    const keywords = rawKeyword.split(/\s+/).filter(k => k.length > 0)
    if (keywords.length > 0) {
      result = result.filter(record => {
        const company = record.company.toLowerCase()
        const job = record.job.toLowerCase()
        // 任意关键词匹配公司或岗位即保留记录
        return keywords.some(kw => {
          const lowerKw = kw.toLowerCase()
          return company.includes(lowerKw) || job.includes(lowerKw)
        })
      })
    }
  }

  // 3. 排序
  if (sortBy.value) {
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