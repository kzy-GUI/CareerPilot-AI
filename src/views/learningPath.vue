<template>
  <div class="learning-container">
    <h1 class="page-title">学习路线生成器</h1>

    <!-- 输入区域 -->
    <div class="input-group">
      <input
        v-model="jobInput"
        type="text"
        placeholder="请输入目标岗位，如：Java后端、前端开发"
        class="job-input"
        @keyup.enter="generatePath"
      />
      <button class="generate-btn" @click="generatePath">生成学习路线</button>
    </div>

    <!-- 生成结果展示区 -->
    <div v-if="learningPath.length > 0" class="path-container">
      <div
        v-for="(stage, index) in learningPath"
        :key="index"
        class="stage-card"
      >
        <div class="stage-header">
          <span class="stage-number">阶段 {{ index + 1 }}</span>
          <h3 class="stage-title">{{ stage.title }}</h3>
        </div>
        <ul class="tips-list">
          <li v-for="(tip, tIndex) in stage.tips" :key="tIndex" class="tip-item">
            {{ tip }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 未找到路线时的提示 -->
    <div v-else-if="hasSearched" class="empty-tip">
      还没有该岗位的学习路线，试试“Java后端”或“前端开发”吧！
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 用户输入的岗位
const jobInput = ref('')

// 生成的路线数据（数组，每个元素是一个阶段对象）
const learningPath = ref([])

// 是否已经进行过搜索
const hasSearched = ref(false)

/**
 * 模拟路线库
 * 每个路线对象包含：
 * - keyword: 匹配关键词（岗位名称的一部分），用于筛选
 * - stages: 学习阶段数组
 *   每个阶段对象包含 title（阶段标题）和 tips（学习建议数组）
 */
const routeLibrary = [
  {
    keyword: 'Java后端',
    stages: [
      {
        title: '基础入门',
        tips: [
          '学习 Java 基础语法、面向对象编程思想',
          '掌握常用工具类库（集合、IO、多线程）',
          '了解 MySQL 基本操作与 SQL 语句'
        ]
      },
      {
        title: 'Web 开发基础',
        tips: [
          '学习 Servlet、JSP，理解 HTTP 协议',
          '掌握 Spring 框架核心（IoC、AOP）',
          '学习 Spring MVC 与 RESTful API 设计'
        ]
      },
      {
        title: '进阶实战',
        tips: [
          '搭建 Spring Boot 项目，整合 MyBatis/MyBatis-Plus',
          '学习 Redis 缓存、消息队列（RabbitMQ/Kafka）',
          '掌握微服务基础（Spring Cloud 或 Dubbo）'
        ]
      }
    ]
  },
  {
    keyword: '前端开发',
    stages: [
      {
        title: '基础三件套',
        tips: [
          '熟练掌握 HTML5、CSS3 页面布局与响应式设计',
          '深入学习 JavaScript ES6+ 语法，理解异步编程',
          '熟悉浏览器开发者工具的使用'
        ]
      },
      {
        title: '框架与工具',
        tips: [
          '学习 Vue 或 React 框架核心概念，完成一个单页应用',
          '掌握前端构建工具（Vite / Webpack）',
          '学习 npm/yarn 包管理，了解模块化开发'
        ]
      },
      {
        title: '工程化与进阶',
        tips: [
          '学习 TypeScript，为项目添加类型约束',
          '了解前端测试（Jest / Cypress）与 CI/CD 流程',
          '尝试 Next.js / Nuxt.js 等服务端渲染框架'
        ]
      }
    ]
  }
]

/**
 * 生成学习路线
 */
const generatePath = () => {
  const keyword = jobInput.value.trim()
  hasSearched.value = true

  if (!keyword) {
    learningPath.value = []
    return
  }

  // 在路线库中寻找匹配项（岗位关键词包含用户输入，或用户输入包含关键词）
  const matched = routeLibrary.find(item =>
    item.keyword.toLowerCase().includes(keyword.toLowerCase()) ||
    keyword.toLowerCase().includes(item.keyword.toLowerCase())
  )

  if (matched) {
    learningPath.value = matched.stages
  } else {
    learningPath.value = []
  }
}
</script>

<style scoped>
.learning-container {
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
  margin-bottom: 30px;
  text-align: center;
  letter-spacing: -0.5px;
}

.input-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
  align-items: center;
}

.job-input {
  flex: 1 1 300px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  color: #334155;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.job-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background: #ffffff;
}

.generate-btn {
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

.generate-btn:hover {
  background: #2563eb;
}

.generate-btn:active {
  transform: scale(0.97);
}

.path-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stage-card {
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
  border-radius: 12px;
  padding: 20px 24px;
  transition: box-shadow 0.2s;
}

.stage-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stage-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.stage-number {
  font-size: 13px;
  font-weight: 600;
  color: #3b82f6;
  background: #dbeafe;
  padding: 4px 10px;
  border-radius: 20px;
}

.stage-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-item {
  padding: 6px 0 6px 24px;
  position: relative;
  font-size: 15px;
  color: #475569;
  line-height: 1.5;
}

.tip-item::before {
  content: "•";
  position: absolute;
  left: 8px;
  color: #3b82f6;
  font-weight: bold;
}

.empty-tip {
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  padding: 40px 0;
}
</style>