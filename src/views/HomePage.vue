<template>
  <div class="home-container">
    <h1 class="home-title">CareerPilot</h1>
    <p class="home-subtitle">你的 AI 求职成长助手</p>
    <div class="home-cards">
      <div class="home-card">
        <span class="home-card-icon">📋</span>
        <h3>投递追踪</h3>
        <p>记录并管理你的岗位投递进度</p>
      </div>
      <div class="home-card">
        <span class="home-card-icon">📝</span>
        <h3>简历优化</h3>
        <p>AI 帮你润色项目经历</p>
      </div>
      <div class="home-card">
        <span class="home-card-icon">📚</span>
        <h3>学习路线</h3>
        <p>获取个性化学习建议</p>
      </div>
      <div class="home-card">
        <span class="home-card-icon">📊</span>
        <h3>成长看板</h3>
        <p>追踪你的学习与求职数据</p>
      </div>
    </div>
    <p class="home-hint">👇 使用底部导航切换功能页面</p>
  </div>
</template>

<script setup>
// 首页只做展示，导航功能由底部 BottomNav 组件负责
</script>

<style scoped>
.home-container {
  text-align: center;
  padding: 60px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.home-title {
  font-size: 36px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: -1px;
}

.home-subtitle {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 40px;
}

.home-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.home-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px 16px;
  text-align: center;
  transition: box-shadow 0.2s;
}

.home-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.home-card-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.home-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.home-card p {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.home-hint {
  font-size: 14px;
  color: #94a3b8;
}
</style>