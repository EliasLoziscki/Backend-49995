import { Router } from 'express';
import { current, faillogin, failregister, githubcallback, login, logout, register, restartPassword } from '../controllers/sessions.controller.js';
import passport from 'passport';

const router = Router();

//passport.authenticate es un método de passport que recibe como parámetro la estrategia que se va a utilizar, en este caso "register" y un objeto con las opciones de configuración, en este caso failureRedirect que redirige a la ruta /api/session/failregister si falla el registro y successRedirect que redirige a la ruta /api/session/successregister si el registro es exitoso 
router.post("/register", passport.authenticate("register", {failureRedirect:"/api/sessions/failregister"}), register);

//Si falla el registro, passport.authenticate redirige a esta ruta y envía un error 400
router.get("/failregister", failregister);

//passport.authenticate es un método de passport que recibe como parámetro la estrategia que se va a utilizar, en este caso "login" y un objeto con las opciones de configuración, en este caso failureRedirect que redirige a la ruta /api/session/faillogin si falla el login y successRedirect que redirige a la ruta /api/session/successlogin si el login es exitoso
router.post("/login", passport.authenticate("login", {failureRedirect:'/api/session/faillogin'}), login);

//Si el usuario está logueado, devuelve la información del usuario, si no, devuelve un error 401 (No autorizado) 
router.get("/current", current);

//Si falla el login, passport.authenticate redirige a esta ruta y envía un error 400
router.get("/faillogin", faillogin);

//passport.authenticate es un método de passport que recibe como parámetro la estrategia que se va a utilizar, en este caso "github" y un objeto con las opciones de configuración, en este caso scope que es un arreglo con los permisos que se le van a dar a la aplicación en github para acceder a la información del usuario que se está logueando en la aplicación
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res)=>{});

//passport.authenticate es un método de passport que recibe como parámetro la estrategia que se va a utilizar, en este caso "github" y un objeto con las opciones de configuración, en este caso failureRedirect que redirige a la ruta /login si falla el login y successRedirect que redirige a la ruta /products si el login es exitoso
router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}), githubcallback);

//req.session.destroy es un método de express-session que destruye la sesión del usuario y lo redirige al login
router.get("/logout", logout);

//Si el usuario olvidó su contraseña, puede reiniciarla con esta ruta
router.post("/restartPassword", restartPassword);

export default router;