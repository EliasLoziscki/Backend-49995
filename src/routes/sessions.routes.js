import { Router } from 'express';
import passport from 'passport';
import userModel from '../dao/models/Users.models.js';
import { createHash } from "../utils.js";

const router = Router();

router.post("/register", passport.authenticate("register", {failureRedirect:"/api/sessions/failregister"}),//passport.authenticate es un método de passport que recibe como parámetro la estrategia que se va a utilizar, en este caso "register" y un objeto con las opciones de configuración, en este caso failureRedirect que redirige a la ruta /api/session/failregister si falla el registro y successRedirect que redirige a la ruta /api/session/successregister si el registro es exitoso 
async (req, res)=>{
    return res.status(200)
    .send({
        status: "success",
        message: "Usuario creado con éxito"
    })
});

router.get("/failregister", async (req, res)=>{//Si falla el registro, passport.authenticate redirige a esta ruta y envía un error 400
    return res.status(400)
    .send({
        status: "error",
        error: "Falló el registro"
    })
});

router.post("/login", passport.authenticate("login", {failureRedirect:'/api/session/faillogin'}),//passport.authenticate es un método de passport que recibe como parámetro la estrategia que se va a utilizar, en este caso "login" y un objeto con las opciones de configuración, en este caso failureRedirect que redirige a la ruta /api/session/faillogin si falla el login y successRedirect que redirige a la ruta /api/session/successlogin si el login es exitoso
    async (req, res)=>{
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
});

router.get("/current", async (req,res)=>{//Si el usuario está logueado, devuelve la información del usuario, si no, devuelve un error 401 (No autorizado) 
    if(req.session.user){
        res.send({status:"success", payload: req.session.user});
    }else{
        res.status(401).send({status:"error", message:"No hay sesión iniciada"});
    }
});

router.get("/faillogin", async (req, res)=>{//Si falla el login, passport.authenticate redirige a esta ruta y envía un error 400
    return res.status(400)
    .send({
        status: "error",
        error: "Falló el login"
    })
});

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res)=>{});//passport.authenticate es un método de passport que recibe como parámetro la estrategia que se va a utilizar, en este caso "github" y un objeto con las opciones de configuración, en este caso scope que es un arreglo con los permisos que se le van a dar a la aplicación en github para acceder a la información del usuario que se está logueando en la aplicación

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}), async (req, res)=>{//passport.authenticate es un método de passport que recibe como parámetro la estrategia que se va a utilizar, en este caso "github" y un objeto con las opciones de configuración, en este caso failureRedirect que redirige a la ruta /login si falla el login y successRedirect que redirige a la ruta /products si el login es exitoso
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
});

router.get("/logout", (req, res)=>{//req.session.destroy es un método de express-session que destruye la sesión del usuario y lo redirige al login
    req.session.destroy(err=>{
    if(err)
        return res.status(500).send({
            status: "error",
            error: "No se pudo cerrar la sesión"
        });
    });
    res.redirect("/login");
});

router.post("/restartPassword", async (req,res)=>{
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
})

export default router;