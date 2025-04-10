import jwt from 'jsonwebtoken'

// next คือ function ที่ใช้ในการเรียก middleware ถัดไปใน stack ของ express
const userAuth = async (req,res,next) => {
    const {token} = req.cookies //รับ token จาก cookie ของ request
    if (!token){
        return res.json({success: false, message: "Not Authorized. Please login"}) //ถ้าไม่มี token ให้ return ออกไปเลย
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.user = { userId: tokenDecode.id } //ถ้า token ถูกต้องให้เก็บ userId ลงใน req.user เพื่อใช้ใน middleware ถัดไป
        }
        else{
            return res.json({success: false, message: "Not Authorized. Please login"}) //ถ้า token ไม่ถูกต้องให้ return ออกไปเลย
        }

        next() //เรียก middleware ถัดไปใน stack ของ express
        
    } catch (error) {
        res.json({success: false, message: error.message}) //ถ้าเกิด error ให้ return ออกไปเลย
    }
}

export default userAuth //export middleware นี้ไปใช้ในไฟล์อื่นๆ