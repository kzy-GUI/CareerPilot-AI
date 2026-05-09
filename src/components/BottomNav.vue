<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" active-class="nav-item--active">
      <span class="nav-icon">🏠</span>
      <span class="nav-text">首页</span>
    </router-link>
    <router-link to="/internship" class="nav-item" active-class="nav-item--active">
      <span class="nav-icon">📋</span>
      <span class="nav-text">投递追踪</span>
    </router-link>
    <router-link to="/resume" class="nav-item" active-class="nav-item--active">
      <span class="nav-icon">📝</span>
      <span class="nav-text">简历优化</span>
    </router-link>
    <router-link to="/learning" class="nav-item" active-class="nav-item--active">
      <span class="nav-icon">📚</span>
      <span class="nav-text">学习路线</span>
    </router-link>
    <router-link to="/growth" class="nav-item" active-class="nav-item--active">
      <span class="nav-icon">📊</span>
      <span class="nav-text">成长看板</span>
    </router-link>
  </nav>
</template>

<script setup>
// 底部导航组件无需额外逻辑，路由高亮由 Vue Router 自动处理
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 8px 0 12px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.04);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: #94a3b8;
  font-size: 14px;
  transition: color 0.2s;
  padding: 4px 12px;
  border-radius: 8px;
}

.nav-icon {
  font-size: 20px;
}

.nav-text {
  font-size: 12px;
  font-weight: 500;
}

.nav-item--active {
  color: #3b82f6;
  background-color: #eff6ff;
}

.nav-item:hover {
  color: #3b82f6;
}
</style>