import { createRouter, createWebHistory,type RouteRecordRaw } from 'vue-router'

// 页面组件导入
import HomePage from '@/views/HomePage.vue'
import InternshipTracker from '@/views/InternshipTracker.vue'
import ResumeOptimizer from '@/views/ResumeOptimizer.vue'
import LearningPath from '@/views/LearningPath.vue'
import GrowthBoard from '@/views/GrowthBoard.vue'

/**
 * 路由表配置
 * 每个路由对象包含：
 * - path: URL 路径
 * - name: 路由名称（可用于编程式导航）
 * - component: 对应的页面组件
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/internship',
    name: 'Internship',
    component: InternshipTracker
  },
  {
    path: '/resume',
    name: 'Resume',
    component: ResumeOptimizer
  },
  {
    path: '/learning',
    name: 'Learning',
    component: LearningPath
  },
  {
    path: '/growth',
    name: 'Growth',
    component: GrowthBoard
  }
]

/**
 * 创建路由实例
 * createWebHistory 使用 HTML5 History 模式（URL 不带 #）
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router