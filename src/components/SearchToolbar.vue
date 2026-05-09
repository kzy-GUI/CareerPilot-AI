<!-- SearchToolbar.vue -->
<template>
  <div class="toolbar">
    <div class="toolbar-item">
      <label class="toolbar-label">搜索：</label>
      <input
        :value="tempSearch"
        type="text"
        placeholder="多关键词用空格分隔，按回车或点击搜索"
        class="toolbar-search"
        @input="$emit('update:tempSearch', $event.target.value)"
        @keyup.enter="$emit('trigger-search')"
      />
      <button class="search-btn" @click="$emit('trigger-search')">搜索</button>
    </div>
    <div class="toolbar-item">
      <label class="toolbar-label">筛选状态：</label>
      <select
        :value="selectedStatus"
        class="toolbar-select"
        @change="$emit('update:selectedStatus', $event.target.value)"
      >
        <option value="全部">全部</option>
        <option value="已投递">已投递</option>
        <option value="面试中">面试中</option>
        <option value="已录用">已录用</option>
      </select>
    </div>
    <div class="toolbar-item">
      <label class="toolbar-label">排序方式：</label>
      <select
        :value="sortBy"
        class="toolbar-select"
        @change="$emit('update:sortBy', $event.target.value)"
      >
        <option value="">默认（添加顺序）</option>
        <option value="company">按公司名排序</option>
        <option value="job">按岗位名排序</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tempSearch: String,
  selectedStatus: String,
  sortBy: String
})

defineEmits([
  'update:tempSearch',
  'update:selectedStatus',
  'update:sortBy',
  'trigger-search'
])
</script>

<style scoped>
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
</style>