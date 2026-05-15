<!-- InternshipTracker.vue -->
<template>
  <div class="tracker-container">
    <h1 class="page-title">岗位投递追踪板</h1>

    <SearchToolbar
      v-model:temp-search="tempSearch"
      v-model:selected-status="selectedStatus"
      v-model:sort-by="sortBy"
      @trigger-search="triggerSearch"
    />

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

    <div class="records-list">
      <RecordCard
        v-for="record in filteredSortedRecords"
        :key="record.id"
        :record="record"
        @delete-record="deleteRecord"
      />
      <div v-if="filteredSortedRecords.length === 0" class="empty-tip">
        还没有符合条件的投递记录
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SearchToolbar from '@/components/SearchToolbar.vue'
import RecordCard from '@/components/RecordCard.vue'

// ---------- 表单输入绑定 ----------
const companyInput = ref('')
const jobInput = ref('')
const statusInput = ref('')

// ---------- 数据存储（改为从后端获取）----------
const records = ref([])

// ---------- 搜索/筛选/排序状态 ----------
const tempSearch = ref('')
const searchKeyword = ref('')
const selectedStatus = ref('全部')
const sortBy = ref('')

// ---------- 后端 API 基础地址 ----------
const API_BASE = 'http://localhost:3001/api'

/**
 * 从后端加载所有投递记录
 * 将后端字段映射为前端组件使用的字段：
 *   - id        → id
 *   - company   → company
 *   - position  → job       （前端原使用 job，后端使用 position）
 *   - statusText → status   （后端已翻译为中文）
 */
async function fetchRecords() {
  try {
    const response = await fetch(`${API_BASE}/records`)
    const result = await response.json()

    if (result.success) {
      // 映射后端字段到前端组件期望的结构
      records.value = result.data.map(item => ({
        id: item.id,
        company: item.company,
        job: item.position,           // 后端字段 position → 前端 job
        status: item.statusText,      // 后端翻译好的中文状态
        // 保留原始字段，方便后续扩展（如详情展示）
        applyDate: item.apply_date,
        note: item.note
      }))
    } else {
      console.error('获取记录失败：', result.message)
    }
  } catch (err) {
    console.error('网络请求错误：', err.message)
    alert('无法连接到后端服务，请检查服务是否已启动')
  }
}

// 组件挂载时自动加载数据
onMounted(() => {
  fetchRecords()
})

// ---------- 搜索触发 ----------
const triggerSearch = () => {
  searchKeyword.value = tempSearch.value.trim()
}

// ---------- 新增记录（当前仅本地操作，暂未连接后端）----------
const addRecord = () => {
  const company = companyInput.value.trim()
  const job = jobInput.value.trim()
  const status = statusInput.value.trim()

  if (!company || !job || !status) {
    alert('请填写完整的公司名称、岗位名称和当前状态！')
    return
  }

  // 注意：目前未对接后端创建接口，新增的记录只存在于本地，
  // 刷新页面后会丢失。后续需要增加 POST /api/records 接口。
  records.value.push({
    id: Date.now() + Math.random(), // 临时 ID
    company,
    job,
    status
  })

  companyInput.value = ''
  jobInput.value = ''
  statusInput.value = ''
}

// ---------- 删除记录（调用后端 DELETE 接口）----------
const deleteRecord = async (record) => {
  // 如果是本地临时添加的记录（id 为浮点数或很大），不发起后端请求，直接本地删除
  if (typeof record.id !== 'number' || record.id > 1e12) {
    // 临时记录：直接前端移除
    const index = records.value.findIndex(item => item.id === record.id)
    if (index !== -1) records.value.splice(index, 1)
    return
  }

  // 后端记录：调用删除接口
  try {
    const response = await fetch(`${API_BASE}/records/${record.id}`, {
      method: 'DELETE'
    })
    const result = await response.json()

    if (result.success) {
      // 从本地数组中移除
      const index = records.value.findIndex(item => item.id === record.id)
      if (index !== -1) records.value.splice(index, 1)
    } else {
      alert('删除失败：' + result.message)
    }
  } catch (err) {
    console.error('删除请求出错：', err.message)
    alert('网络错误，删除失败')
  }
}

// ---------- 本地筛选 + 排序（保持不变）----------
const filteredSortedRecords = computed(() => {
  let result = records.value

  // 状态筛选
  if (selectedStatus.value !== '全部') {
    result = result.filter(record => record.status.trim() === selectedStatus.value)
  }

  // 关键词搜索（公司或岗位）
  const rawKeyword = searchKeyword.value.trim()
  if (rawKeyword) {
    const keywords = rawKeyword.split(/\s+/).filter(k => k.length > 0)
    if (keywords.length > 0) {
      result = result.filter(record => {
        const company = record.company.toLowerCase()
        const job = record.job.toLowerCase()
        return keywords.some(kw => {
          const lowerKw = kw.toLowerCase()
          return company.includes(lowerKw) || job.includes(lowerKw)
        })
      })
    }
  }

  // 排序
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

.records-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.empty-tip {
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  padding: 40px 0;
}
</style>