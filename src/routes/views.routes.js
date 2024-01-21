import { Router } from 'express';
import MongoCartManager from '../dao/mongoManagers/MongoCartManager.js';
import productModel from '../dao/models/products.model.js';
import MongoMessageManager from '../dao/mongoManagers/MongoMessageManager.js';

const router = Router();
const cartManager = new MongoCartManager();
const MessageManager = new MongoMessageManager();

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

router.get('/', privateAccess, async (req, res) => {// Obtiene todos los productos
    try {
        const products = await productModel.find().lean();
        res.render("home", { products, style:"index" });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.send({
            status: "error",
            msg: "Error al obtener productos"
        });
    }
});

router.get('/realtimeproducts', async (req, res) => {//Obtiene todos los productos y los muestra en la vista realtimeproducts con websockets
    try {
        const products = await productModel.find().lean();
        res.render('realtimeproducts', { products, style:"index" });
    } catch (error) {
        console.error("Error al obtener productos en tiempo real:", error);
        res.send({
            status: "error",
            msg: "Error al obtener productos en tiempo real"
        });
    }
});

router.get("/register", publicAccess, (req, res)=>{//Ruta para mostrar el formulario de registro
    res.render('register', {style:"index"});
});

router.get("/login", publicAccess, (req, res)=>{//Ruta para mostrar el formulario de login
    res.render('login', {style:"index"});
});

router.get("/profile", privateAccess, (req, res)=>{//Ruta para mostrar el perfil del usuario
    res.render('profile', {user:req.session.user, style:"index"});
});

router.get('/carts/:cid', async (req, res) => {//Obtiene un carrito por ID y lo muestra en la vista cartId
    const cid = req.params.cid;
    try {
        const cart = await cartManager.getCartByID(cid).populate('products.product').lean();
        if (!cart) {
            throw new Error(`No se encontró el carrito con ID: ${cid}`);
        }

        res.render('cartId', {cart, style: 'index'})

    } catch (error) {
        console.error("Error al obtener el cart:", error);
        res.send({
            status: "error",
            msg: `Error al obtener el cart con ID: ${cid}`
        });
    }
});

router.get('/products', privateAccess, async (req, res) => {//Obtiene todos los productos y los muestra en la vista products con paginación
    try {
        const { page = 1, category, sort, limit = 10 } = req.query;

        const query = category ? { category } : {};

        const options = {
            page,
            limit: Number(limit),
            lean: true,
            leanWithId: false
        };
        if (sort) {
            options.sort = { price: sort === 'desc' ? -1 : 1 };
        }

        const products = await productModel.paginate(query, options);
        res.render('products', {  products: products, limit: limit, category: category, sort: sort, user:req.session.user, style: 'index' });

    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.send({
            status: "error",
            msg: "Error al obtener los productos"
        });
    }
});

router.get('/chat', async (req, res) => {//Obtiene todos los mensajes y los muestra en la vista chat
    const message = await MessageManager.getMessages();
    res.render('chat', { message });
});

router.get("/resetPassword", (req, res)=>{//Ruta para mostrar el formulario de reseteo de contraseña
    res.render('resetPassword', {style:"index"});
});

export default router;