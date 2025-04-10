import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'

import authRouter from './routes/authRoute.js'
import morgan from 'morgan'
import userRouter from './routes/userRoute.js'

const app = express()
const PORT = process.env.PORT || 4000
connectDB() // เชื่อมต่อ MongoDB

const allowedOrigins = ['http://localhost:5173'] // กำหนดโดเมนที่อนุญาตให้เข้าถึง API

//middlewares
app.use(morgan('dev')) // log request to console
app.use(express.json()) // แปลง JSON ที่ client ส่งมาใน request body ให้เป็น JavaScript object
app.use(cookieParser()) // แปลง cookie ที่ client ส่งมาใน request header ให้เป็น JavaScript object
app.use(cors({origin: allowedOrigins,credentials: true})) // เปิดใช้งาน CORS เพื่อให้ client สามารถเข้าถึง API ได้จากโดเมนอื่น , อนุญาตส่ง cookies, headers, และการรับค่า credentials (เช่น token, session) จากฝั่ง client

// API Endpoints
app.get('/', (req, res) => {
    res.send('API working')
})

app.use('/api/auth', authRouter) // ใช้ router สำหรับจัดการ authentication
app.use('/api/user', userRouter) // ใช้ router สำหรับจัดการ ข้อมูลผู้ใช้

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})




