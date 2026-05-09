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
import { ref, computed } from 'vue'
import SearchToolbar from '@/components/SearchToolbar.vue'
import RecordCard from '@/components/RecordCard.vue'

const companyInput = ref('')
const jobInput = ref('')
const statusInput = ref('')

const records = ref([])

const tempSearch = ref('')
const searchKeyword = ref('')
const selectedStatus = ref('全部')
const sortBy = ref('')

const triggerSearch = () => {
  searchKeyword.value = tempSearch.value.trim()
}

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

const deleteRecord = (record) => {
  const index = records.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
    records.value.splice(index, 1)
  }
}

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