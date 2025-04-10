import userModel from "../models/userModel.js";

export const getUserData = async (req,res) => {
    try {
        const {userId} = req.user //get userId from req.user ที่ได้จาก middleware userAuth
        //find user by id
        const user = await userModel.findById(userId)

        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }

        res.json({
            success: true,
            userData: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            }
        })

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}