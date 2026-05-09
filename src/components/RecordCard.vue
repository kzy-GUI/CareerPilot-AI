<!-- RecordCard.vue -->
<template>
  <div :class="['record-card', statusClass]">
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
    <button class="delete-btn" @click="$emit('delete-record', record)">删除</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  record: {
    type: Object,
    required: true
  }
})

defineEmits(['delete-record'])

const statusClass = computed(() => {
  const s = props.record.status.trim()
  if (s === '已投递') return 'status-pending'
  if (s === '面试中') return 'status-interview'
  if (s === '已录用') return 'status-offer'
  return ''
})
</script>

<style scoped>
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

/* 状态背景色 */
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
</style>