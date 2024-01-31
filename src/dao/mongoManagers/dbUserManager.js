import userModel from "../models/Users.models.js";

export default class Users {
    constructor(){
        console.log("funciona el dbManager")
    }
    getAll = async ()=> {
        try{
            let users = await userModel.find().lean();
            return users;
        }catch(error){
            return {
                status: "error",
                msg: error.message
            }
        }
    }
    saveUser = async (user) => {
        try{
            let result = await userModel.find.create(user);
            return result;
        }catch(error){
            return {
                status: "error",
                msg: error.message
            }
        }
    }
    getBy = async (params) => {
        try{
            let result = await userModel.findOne(params).lean();
            return result;
        }catch(error){
            return {
                status: "error",
                msg: error.message
            }
        }
    }
    updateUser = async (id, user) => {
        try{
            delete user._id
            let result = await userModel.updateOne({_id:id},{$set:user});
            return result;
        }catch(error){
            return {
                status: "error",
                msg: error.message
            }
        }
    }
}
