import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyOtp: {
        type: String,
        default: '',
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: '',
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0,
    },
},{timestamps: true}) // สร้าง field createdAt และ updatedAt อัตโนมัติ

const userModel = mongoose.models.user || mongoose.model('user', userSchema) //ตรวจสอบว่าโมเดลที่ชื่อว่า user มีอยู่แล้วใน mongoose.models หรือไม่ ไม่มีสร้างใหม่

export default userModel // ส่งออก model User เพื่อให้สามารถนำไปใช้งานในไฟล์อื่นได้c