import express from 'express'
import userAuth from '../middleware/userAuth.js'
import { getUserData } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data', userAuth, getUserData) // ใช้ middleware userAuth เพื่อให้แน่ใจว่าผู้ใช้ได้เข้าสู่ระบบแล้วก่อนที่จะเข้าถึงข้อมูลผู้ใช้

export default userRouter // ส่งออก userRouter เพื่อให้สามารถนำไปใช้งานในไฟล์อื่นได้