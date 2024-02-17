import userModel from '../dao/models/Users.models.js';
import { createHash } from "../utils.js";

const register = async (req, res) => {
    return res.status(200)
    .send({
        status: "success",
        message: "Usuario creado con éxito"
    });
};

const failregister = async (req, res) => {
    return res.status(400)
    .send({
        status: "error",
        error: "Falló el registro"
    })
};

const login = async (req, res) => {
    if(!req.user){
        return res.status(400).send({status:error})
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        full_name: req.user.first_name + " " + req.user.last_name,
        age: req.user.age,
        cart: req.user.cart,
        email: req.user.email,
        rol: req.user.rol
    }
    res.send({status:"success", payload: req.user});
}

const current = async (req,res)=>{
    if(req.session.user){
        res.send({status:"success", payload: req.session.user});
    }else{
        res.status(401).send({status:"error", message:"No hay sesión iniciada"});
    }
}

const faillogin = async (req, res) => {
    return res.status(400)
    .send({
        status: "error",
        error: "Falló el login"
    });
};

const githubcallback = async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        full_name: req.user.first_name + " " + req.user.last_name,
        age: req.user.age,
        cart: req.user.cart,
        email: req.user.email,
        rol: req.user.rol
    }
    console.log(req.session.user)
    res.redirect("/products");
}

const logout = async (req, res) => {
    req.session.destroy(err=>{
        if(err)
            return res.status(500).send({
                status: "error",
                error: "No se pudo cerrar la sesión"
            });
        });
        res.redirect("/login");
}

const restartPassword = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).send(
        res.send({
            status:"error",
            message:"Datos incorrectos"
        })
    )
    const user = await userModel.findOne({email});
    if(!user) return res.status(400).send(
        res.send({
            status:"error",
            message:"No existe el usuario"
        })
    )
    const newHashPassword = createHash(password);

    await userModel.updateOne({_id:user._id},{$set:{password:newHashPassword}});
    res.send({
        status:"success",
        message:"contraseña restaurada"
    })
}

export {
    register,
    failregister,
    login,
    current,
    faillogin,
    githubcallback,
    logout,
    restartPassword
}