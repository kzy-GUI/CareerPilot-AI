<template>
  <div class="app">
    <h1>🚀 CareerPilot AI</h1>
    <p class="subtitle">懂你心事，陪你朝夕</p>

    <div class="cards">
      <CardItem
        v-for="card in cards"
        :key="card.id"
        :icon="card.icon"
        :title="card.title"
        :description="card.description"
        :buttonText="card.buttonText"
        :route="card.route"
        @navigate="goTo"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CardItem from '@/components/CardItem.vue'

const router = useRouter()

const cards = ref([
  {
    id: 1,
    icon: '📄',
    title: 'AI 简历优化',
    description: '智能分析岗位要求，一键优化简历关键词',
    buttonText: '立即体验',
    route: '/resume-optimizer'
  },
  {
    id: 2,
    icon: '📚',
    title: 'AI 学习路线',
    description: '根据目标岗位自动生成学习计划',
    buttonText: '立即体验',
    route: '/learning-path'
  },
  {
    id: 3,
    icon: '📮',
    title: '实习投递追踪',
    description: '记录投递进度，不再错过关键节点',
    buttonText: '立即体验',
    route: '/internship-tracker'
  },
  {
    id: 4,
    icon: '📋',
    title: '成长任务看板',
    description: '拆解大目标为每日小任务，步步为营',
    buttonText: '立即体验',
    route: '/growth-board'
  }
])

function goTo(path) {
  router.push(path)
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background: linear-gradient(to bottom, #e8f0fe, #ffffff);
  margin: 0;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 0;
}

.subtitle {
  color: #555;
  margin-bottom: 50px;
}

.cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}
</style>