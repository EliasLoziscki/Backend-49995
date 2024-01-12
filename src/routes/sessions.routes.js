import { Router } from 'express';
import userModel from '../dao/models/Users.models.js';

const router = Router();

router.post("/register", async (req, res)=>{
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await userModel.findOne({email});

    if(exists){
        return res.status(400)
        .send({
            status: "error",
            error: "El email ya existe"
        })
    }
    const user = {
        first_name,
        last_name,
        email,
        age,
        password
    }

    let result = await userModel.create(user);

    res.send({
        status: "success",
        message: "Usuario creado con éxito"
    })
});

router.post("/login", async (req, res)=>{
    const { email, password } = req.body;
    const user = await userModel.findOne({email, password});
    if(!user){
        return res.status(400)
        .send({
            status: "error",
            error: "Usuario o contraseña incorrectos"
        })
    }
    req.session.user = {
        full_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }
    res.send({
        status: "success",
        payload: req.session.user,
        message: "Usuario logueado con éxito"
    })
});

router.get("/logout", (req, res)=>{
    req.session.destroy(err=>{
    if(err)
        return res.status(500).send({
            status: "error",
            error: "No se pudo cerrar la sesión"
        });
    });
    res.redirect("/perfil/login");
});

export default router;