import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendPasswordResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js'
import userAuth from '../middleware/userAuth.js'

const authRouter = express.Router()

//register, login, logout = handler function ที่ใช้ในการจัดการ
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp) // ใช้ middleware
authRouter.post('/verify-account', userAuth, verifyEmail) // ใช้ middleware
authRouter.get('/is-auth', userAuth, isAuthenticated) // ใช้ middleware
authRouter.post('/send-reset-otp', sendPasswordResetOtp)
authRouter.post('/reset-password', resetPassword)


export default authRouter
// ส่งออก authRouter เพื่อให้สามารถนำไปใช้งานในไฟล์อื่นได้