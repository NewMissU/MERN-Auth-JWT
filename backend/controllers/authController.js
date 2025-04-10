import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js'
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from '../config/emailTemplates.js'

// เก็บ function ที่เกี่ยวกับการ login, register, logout
export const register = async (req,res) => {
    //ต้องการรับ email, id , name, password จาก client (req.body)
    const {name, email, password} = req.body

    if(!name || !email || !password){ //เช็คว่ามีข้อมูลครบไหม
        return res.json({success: false, message: "Please fill all fields"})
        // return res.status(400).json({"message": "Please fill all fields"})
    }

    try {
        const existingUser = await userModel.findOne({email: email}) //เช็คว่า email นี้มีอยู่ในฐานข้อมูลหรือไม่ ซ้ำไหม
        if(existingUser){
            return res.json({success: false, message: "Email already exists"}) //ถ้ามี email นี้อยู่แล้วให้ return ออกไปเลย
        }
        const hashedPassword = await bcrypt.hash(password, 10) //เข้ารหัส password ด้วย bcrypt
        //create user
        const user = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword,
        })
        await user.save() //save user ลงในฐานข้อมูล

        // generate token jwt สร้าง token jwt โดยใช้ id ของ user ที่สร้างใหม่
        const jwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'}) 
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', //ใช้ secure cookie ถ้าอยู่ใน production\
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //ป้องกัน CSRF attacks 
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie หมดอายุใน 7 วัน หน่วยเป็น milliseconds
        })

        //send welcome email to new user account
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome to MyAuth.`,
            text: `Welcome to MyAuth website. Your account has been created successfully with email id: ${email}`,
        }

        await transporter.sendMail(mailOptions)

        return res.json({success: true}) //ส่งข้อมูล user กลับไปที่ client
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const login = async (req,res) => {
    const {email, password} = req.body //รับ email และ password จาก client (req.body)

    if(!email || !password){
        return res.json({success: false, message: "Please fill all fields"})
    }

    try {
        const user = await userModel.findOne({email: email})
        if(!user){
            return res.json({success: false, message: "Invalid email"}) //ถ้าไม่พบ user ให้ return ออกไปเลย
        }    

        const isPasswordValid = await bcrypt.compare(password, user.password) //เปรียบเทียบ password ที่กรอกกับ password ที่เก็บในฐานข้อมูล
        if(!isPasswordValid){
            return res.json({success: false, message: "Invalid password"}) //ถ้า password ไม่ถูกต้องให้ return ออกไปเลย
        }

        // generate token jwt สร้าง token jwt โดยใช้ id ของ user ที่ login เหมือนของ register
        const jwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'}) 
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', //ใช้ secure cookie ถ้าอยู่ใน production\
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //ป้องกัน CSRF attacks 
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie หมดอายุใน 7 วัน หน่วยเป็น milliseconds
        })

        return res.json({success: true}) //ส่งข้อมูล user กลับไปที่ client
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const logout = async (req,res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', //ใช้ secure cookie ถ้าอยู่ใน production\
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //ป้องกัน CSRF attacks 
        })
        return res.json({success: true, message:"Logged Out"}) //ส่งข้อมูล user กลับไปที่ client
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const sendVerifyOtp = async (req,res) => {
    try {
        const { userId } = req.user // รับ userId จาก req.user ที่ได้จาก middleware userAuth
        
        const user = await userModel.findById(userId) //ค้นหา user ในฐานข้อมูลด้วย userId
        if(user.isAccountVerified){
           //already verified
            return res.json({success: false, message: "Account already verified"}) 
        }

        //generate and send otp to user email
        const otp = String(Math.floor(100000 + Math.random() * 900000))  //สร้าง otp แบบสุ่ม 6 หลัก

        user.verifyOtp = otp //เก็บ otp ลงในฐานข้อมูล
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000 //กำหนดเวลา otp หมดอายุใน 24 ชั่วโมง

        await user.save() //save user ลงในฐานข้อมูล

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Verify your account OTP`,
            // text: `Your OTP for account verification is ${otp}. It is valid for 24 hours.`,
            html: EMAIL_VERIFY_TEMPLATE.replace('{{email}}', user.email).replace('{{otp}}', otp) //ใช้ template email ที่สร้างไว้ใน config/emailTemplates.js
        }
        
        await transporter.sendMail(mailOptions) //ส่ง email ไปยัง user

        return res.json({success: true, message: "Verification OTP sent to your email"}) //ส่งข้อมูล user กลับไปที่ client

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
} 

export const verifyEmail = async (req,res) => {
    const { userId } = req.user // รับ userId จาก req.user ที่ได้จาก middleware userAuth
    const {otp} = req.body //รับ otp จาก client (req.body)

    if(!userId || !otp){
        return res.json({success: false, message: "Please fill all fields"})
    }

    try {
        const user = await userModel.findById(userId) //ค้นหา user ในฐานข้อมูลด้วย userId
        if(!user){
            return res.json({success: false, message: "User not found"}) //ถ้าไม่พบ user ให้ return ออกไปเลย
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"}) //ถ้า otp ไม่ถูกต้องให้ return ออกไปเลย
        }

        // หมดอายุ
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired"}) //ถ้า otp หมดอายุให้ return ออกไปเลย
        }

        user.isAccountVerified = true //ถ้า otp ถูกต้องให้เปลี่ยน isAccountVerified เป็น true
        //reset verifyOtp และ verifyOtpExpireAt
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0

        await user.save() //save user ลงในฐานข้อมูล

        return res.json({success: true, message: "Account verified successfully"}) //ส่งข้อมูล user กลับไปที่ client
 
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// check if user is authenticated or not
export const isAuthenticated = async (req,res) => { 
    try {
        return res.json({success: true}) //ส่งข้อมูล user กลับไปที่ client
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const sendPasswordResetOtp = async (req,res) => {
    const {email} = req.body //รับ email จาก client (req.body)

    if(!email){
        return res.json({success: false, message: "Email is required"})
    }

    try {
        const user = await userModel.findOne({email: email}) //ค้นหา user ในฐานข้อมูลด้วย email
        if (!user){
            return res.json({success: false, message: "User not found"}) //ถ้าไม่พบ user ให้ return ออกไปเลย
        }

        //generate and send otp to user email
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp //เก็บ otp ลงในฐานข้อมูล
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000 //กำหนดเวลา otp หมดอายุใน 15 mins

        await user.save() //save user ลงในฐานข้อมูล

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Reset your password OTP`,
            // text: `Your OTP for password reset is ${otp}. Use this OTP to proceed with resetting your password.`,
            html: PASSWORD_RESET_TEMPLATE.replace('{{email}}', email).replace('{{otp}}', otp) //ใช้ template email ที่สร้างไว้ใน config/emailTemplates.js
        }

        await transporter.sendMail(mailOption) //ส่ง email ไปยัง user
        return res.json({success: true, message: "Password reset OTP sent to your email"}) //ส่งข้อมูล user กลับไปที่ client

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Reset user password
export const resetPassword = async (req,res) => {
    const {email, otp, newPassword} = req.body //รับ email, otp และ password จาก client (req.body)

    if(!email || !otp || !newPassword){
        return res.status(400).json({success: false, message: "Please fill all fields"})
    }

    try {
        const user = await userModel.findOne({email: email})

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"}) //ถ้า otp ไม่ถูกต้องให้ return ออกไปเลย
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired"}) //ถ้า otp หมดอายุให้ return ออกไปเลย
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword //เปลี่ยน password ใหม่
        user.resetOtp = '' //reset otp
        user.resetOtpExpireAt = 0 //reset otp expire time

        user.save() //save user ลงในฐานข้อมูล
        return res.json({success: true, message: "Password reset successfully"}) //ส่งข้อมูล user กลับไปที่ client

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}