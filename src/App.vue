<template>
  <!-- 页面主容器 -->
  <div class="app-container">
    <!--
      <router-view /> 是 Vue Router 的渲染出口。
      根据当前 URL，它会显示路由配置中匹配的组件。
      例如：
        / → 显示 HomePage.vue
        /internship → 显示 InternshipTracker.vue
        以此类推
    -->
    <router-view />

    <!--
      底部导航组件放置在 <router-view /> 下方，
      由于它是固定定位，会始终显示在屏幕底部，不受页面滚动影响。
    -->
    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from '@/components/BottomNav.vue'
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f1f5f9;
  min-height: 100vh;
  padding-bottom: 70px;  /* 为底部导航栏留出空间，避免内容被遮挡 */
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>