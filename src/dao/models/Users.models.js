import mongoose from "mongoose";

const collection = "Users";

const UserSchema = new mongoose.Schema({
    first_name: {
        type:String,
        required: true
    },
    last_name: {
        type:String,
        required: true 
    },
    email: {
        type:String, 
        unique: true,
        required: true
    },
    age: {
        type:Number, 
        required: true
    },
    password: {
        type:String,
        required: true 
    },
    cart: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts",
    },
    rol: {
        type:String, 
        enum:["user","admin"],
        default: "user"}
});

const userModel = mongoose.model(collection, UserSchema);

export default userModel;