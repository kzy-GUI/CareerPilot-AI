// server/app.js
// CareerPilot AI 后端服务入口

// 1. 加载环境变量（必须最先执行，确保后续代码能读取 .env 中的配置）
require('dotenv').config()

// 2. 引入 express 框架
const express = require('express')

// 3. 引入 cors 中间件，用于处理跨域请求
const cors = require('cors')

// 4. 引入 mysql2/promise，支持异步操作和连接池
const mysql = require('mysql2/promise')

// 创建 Express 应用实例
const app = express()

// 5. 配置 CORS 中间件
//    作用：允许来自前端开发服务器（localhost:5173）的请求访问后端接口，
//    解决前后端分离时的跨域问题。
app.use(cors())

// 6. 配置 JSON 解析中间件
//    作用：自动解析前端发来的 JSON 格式的请求体，解析后可通过 req.body 获取数据。
app.use(express.json())

// 7. 创建 MySQL 连接池（从环境变量读取配置）
const pool = mysql.createPool({
  host: process.env.DB_HOST,      // 数据库主机地址
  user: process.env.DB_USER,      // 数据库用户名
  password: process.env.DB_PASSWORD, // 数据库密码
  database: process.env.DB_NAME,  // 数据库名称
  port: process.env.DB_PORT || 3306, // 数据库端口，默认 3306
  waitForConnections: true,       // 当连接池无可用连接时，是否等待
  connectionLimit: 10,            // 连接池最大连接数
  queueLimit: 0                   // 等待队列最大长度（0 表示无限制）
})

// 8. 测试数据库连接（在启动时验证配置是否正确）
;(async function testDbConnection() {
  try {
    // 从连接池获取一个连接
    const connection = await pool.getConnection()
    // 执行简单查询验证连接有效性
    await connection.query('SELECT 1')
    // 释放连接回连接池
    connection.release()
    console.log('✅ MySQL 数据库连接成功')
  } catch (err) {
    console.error('❌ MySQL 数据库连接失败:', err.message)
    // 注意：这里不终止进程，允许服务继续启动（后续请求时会再次尝试连接）
  }
})()

// 9. 健康检查接口（保留原有功能）
//    当访问 GET /api/health 时，返回服务运行状态。
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CareerPilot API is running...'
  })
})

// 10. 数据库测试接口（新增）
//     当访问 GET /api/db-test 时，尝试执行 SELECT 1，返回数据库连接状态。
app.get('/api/db-test', async (req, res) => {
  try {
    // 从连接池获取连接
    const connection = await pool.getConnection()
    // 执行测试查询
    const [rows] = await connection.query('SELECT 1 AS result')
    // 释放连接
    connection.release()
    // 返回成功响应
    res.json({
      success: true,
      message: '数据库连接正常',
      data: rows[0] // 应返回 { result: 1 }
    })
  } catch (err) {
    console.error('数据库测试接口出错:', err.message)
    // 返回错误响应，状态码 500 表示服务器内部错误
    res.status(500).json({
      success: false,
      message: '数据库连接失败',
      error: err.message
    })
  }
})

// 11. 启动服务器，监听 3001 端口
app.listen(3001, () => {
  console.log('CareerPilot 后端服务已启动: http://localhost:3001')
})