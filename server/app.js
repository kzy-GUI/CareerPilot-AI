// server/app.js
// CareerPilot AI 后端服务入口

// 1. 引入 express 框架
const express = require('express')

const cors = require('cors')

// 创建 Express 应用实例
const app = express()

// 3. 配置 CORS 中间件
//    作用：允许来自前端开发服务器（localhost:5173）的请求访问后端接口，
//    解决前后端分离时的跨域问题。
app.use(cors())

// 4. 配置 JSON 解析中间件
//    作用：自动解析前端发来的 JSON 格式的请求体，解析后可通过 req.body 获取数据。
app.use(express.json())

// 5. 创建健康检查接口（测试用）
//    当访问 GET /api/health 时，返回服务运行状态。
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CareerPilot API is running...'
  })
})

// 6. 启动服务器，监听 3001 端口
app.listen(3001, () => {
  console.log('CareerPilot 后端服务已启动: http://localhost:3001')
})