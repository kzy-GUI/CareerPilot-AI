<!-- InternshipTracker.vue -->
<template>
  <div class="tracker-container">
    <h1 class="page-title">offer奔赴记录表</h1>

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
      <button class="add-btn" @click="addRecord">add record</button>
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
// ★ 引入状态映射（中文 → 数字）
import { STATUS_REVERSE_MAP } from '@/constants'

// ---------- 表单输入绑定 ----------
const companyInput = ref('')
const jobInput = ref('')
const statusInput = ref('')

// ---------- 数据存储 ----------
const records = ref([])

// ---------- 搜索/筛选/排序状态 ----------
const tempSearch = ref('')
const searchKeyword = ref('')
const selectedStatus = ref('全部')
const sortBy = ref('')

const API_BASE = 'http://localhost:3001/api'

// ---------- 获取全部记录 ----------
async function fetchRecords() {
  try {
    const response = await fetch(`${API_BASE}/records`)
    const result = await response.json()
    if (result.success) {
      records.value = result.data.map(item => ({
        id: item.id,
        company: item.company,
        job: item.position,         // 后端 position → 前端 job
        status: item.statusText,    // 后端已翻译的中文
        applyDate: item.apply_date,
        note: item.note
      }))
    } else {
      console.error('获取记录失败：', result.message)
    }
  } catch (err) {
    console.error('网络请求错误：', err.message)
    alert('无法连接到后端服务')
  }
}

onMounted(() => {
  fetchRecords()
})

// ---------- 搜索 ----------
const triggerSearch = () => {
  searchKeyword.value = tempSearch.value.trim()
}

// ---------- 新增记录（改为异步，对接 POST 接口）----------
const addRecord = async () => {
  const company = companyInput.value.trim()
  const job = jobInput.value.trim()
  const statusText = statusInput.value.trim()

  if (!company || !job || !statusText) {
    alert('请填写完整的公司名称、岗位名称和当前状态！')
    return
  }

  // 将中文状态转为数字，如果输入不合法则提示
  const statusNumber = STATUS_REVERSE_MAP[statusText]
  if (statusNumber === undefined) {
    alert('状态请输入：已投递 / 面试中 / 已录用 / 已拒绝')
    return
  }

  // 构造请求体（字段名需与后端保持一致）
  const payload = {
  company,
  position: job,
  applyDate: new Date().toISOString().slice(0, 10),  // ✅ 与后端一致
  status: statusNumber,
  note: null
}

  try {
    const response = await fetch(`${API_BASE}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const result = await response.json()

    if (result.success) {
      // 将后端返回的新记录映射为前端格式，追加到数组
      const newRecord = {
        id: result.data.id,
        company: result.data.company,
        job: result.data.position,
        status: result.data.statusText,
        applyDate: result.data.apply_date,
        note: result.data.note
      }
      records.value.push(newRecord)

      // 清空输入框
      companyInput.value = ''
      jobInput.value = ''
      statusInput.value = ''
    } else {
      alert('添加失败：' + result.message)
    }
  } catch (err) {
    console.error('添加请求出错：', err.message)
    alert('网络错误，添加失败')
  }
}

// ---------- 删除记录（移除临时 ID 判断）----------
const deleteRecord = async (record) => {
  try {
    const response = await fetch(`${API_BASE}/records/${record.id}`, {
      method: 'DELETE'
    })
    const result = await response.json()

    if (result.success) {
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

// ---------- 本地筛选 + 排序 ----------
const filteredSortedRecords = computed(() => {
  let result = records.value

  if (selectedStatus.value !== '全部') {
    result = result.filter(record => record.status.trim() === selectedStatus.value)
  }

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