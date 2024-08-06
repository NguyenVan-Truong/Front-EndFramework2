import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    name:{
        type : String,
        default : "Chưa cập nhật"
    },
    address:{
        type : String,
        default : "Chưa cập nhật"
    },
    phone:{
        type : Number,
        default : null
    },
    avatar : {
        type : String,
        default : "https://i.pinimg.com/736x/07/66/d1/0766d183119ff92920403eb7ae566a85.jpg"
    },
    role:{
        type : String,
        default : "member",
        enum : ["member", "admin"]
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    lockedAt: { 
        type: Date,
        default: null
    },
}, {versionKey : false, timestamps : true});
export default mongoose.model("User", userSchema);