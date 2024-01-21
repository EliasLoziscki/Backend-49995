import { Router } from 'express';
import userModel from '../dao/models/Users.models.js';
import { createHash, validatePassword } from '../utils.js';
import passport from 'passport';

const router = Router();

// router.post("/register", async (req, res)=>{
//     const { first_name, last_name, email, age, password } = req.body;
//     const exists = await userModel.findOne({email});

//     if(exists){
//         return res.status(400)
//         .send({
//             status: "error",
//             error: "El email ya existe"
//         })
//     }
//     const user = {
//         first_name,
//         last_name,
//         email,
//         age,
//         password: createHash(password),
//         rol: "usuario"
//     }

//     let result = await userModel.create(user);

//     res.send({
//         status: "success",
//         message: "Usuario creado con éxito"
//     })
// });

router.post("/register", passport.authenticate("register", {failureRedirect:"/api/sessions/failregister"}),
async (req, res)=>{
    return res.status(200)
    .send({
        status: "success",
        message: "Usuario creado con éxito"
    })
});

router.get("/failregister", async (req, res)=>{
    return res.status(400)
    .send({
        status: "error",
        error: "Falló el registro"
    })
});


router.post("/login", async (req, res)=>{
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if(!user){
        return res.status(400)
        .send({
            status: "error",
            error: "Datos incorrectos"
        })
    }

    const isValidPassword = validatePassword(password, user);
    if(!isValidPassword){
        return res.status(400)
        .send({
            status: "error",
            error: "Datos incorrectos"
        })
    }
    delete user.password; // Eliminamos la contraseña del objeto user para no enviarla en el payload de la sesión (cookie) ES UN DATO SENSIBLE

    req.session.user = {
        full_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        rol: user.rol
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
    res.redirect("/login");
});

export default router;