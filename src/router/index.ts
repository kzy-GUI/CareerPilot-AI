import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/resume-optimizer',
    name: 'resume',
    component: () => import('@/views/ResumeOptimizer.vue')
  },
  {
    path: '/learning-path',
    name: 'learning',
    component: () => import('@/views/LearningPath.vue')
  },
  {
    path: '/internship-tracker',
    name: 'internship',
    component: () => import('@/views/InternshipTracker.vue')
  },
  {
    path: '/growth-board',
    name: 'growth',
    component: () => import('@/views/GrowthBoard.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router