import mongoose from "mongoose";

const collection = "Users";

const UserSchema = new mongoose.Schema({
    first_name: {
        type:String,
        required: true
    },
    last_name: {
        type:String,
        //required: true no pudo ser requerido porque en el registro de github no se envía el apellido del usuario o por lo menos no encontré la forma de obtenerlo en el objeto que se recibe en el callback de github
    },
    email: {
        type:String, 
        unique: true
        //required: true no pudo ser requerido porque en el registro de github no se envía el email del usuario
    },
    age: {
        type:Number, 
        required: true
    },
    password: {
        type:String
        //required: true no pudo ser requerido porque en el registro de github no se envía la contraseña del usuario
    },
    cart: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"cart",
    },
    rol: {
        type:String, 
        enum:["user","admin"],
        default: "user"}
});

const userModel = mongoose.model(collection, UserSchema);

export default userModel;