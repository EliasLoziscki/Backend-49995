import { Router } from 'express';
import { home, login, profile, realtimeproducts, register, cartsCid, products, chat, resetPassword } from '../controllers/views.controller.js';

const router = Router();

const publicAccess = (req, res, next)=>{
    if(req.session.user){
        return res.redirect("/profile");
    }
    next();
}

const privateAccess = (req, res, next)=>{
    if(!req.session.user){
        return res.redirect("/login"); 
    }
    next();
}

router.get('/', privateAccess, home);// Obtiene todos los productos

router.get('/realtimeproducts', realtimeproducts);//Obtiene todos los productos y los muestra en la vista realtimeproducts con websockets

router.get("/register", publicAccess, register);//Ruta para mostrar el formulario de registro

router.get("/login", publicAccess, login);//Ruta para mostrar el formulario de login

router.get("/profile", privateAccess, profile);//Ruta para mostrar el perfil del usuario

router.get('/carts/:cid', cartsCid);//Obtiene un carrito por ID y lo muestra en la vista cartId

router.get('/products', privateAccess, products);//Obtiene todos los productos y los muestra en la vista products con paginación

router.get('/chat', chat);//Obtiene todos los mensajes y los muestra en la vista chat

router.get("/resetPassword", resetPassword);//Ruta para mostrar el formulario de reseteo de contraseña


export default router;