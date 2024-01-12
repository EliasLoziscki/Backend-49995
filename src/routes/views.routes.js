import { Router } from 'express';
import { ProductManagerFile } from '../dao/managers/ProductManagerFile.js'; // Importar el manager de productos que vamos a usar en las rutas 
import MongoCartManager from '../dao/mongoManagers/MongoCartManager.js';
import productModel from '../dao/models/products.model.js';
import MongoMessageManager from '../dao/mongoManagers/MongoMessageManager.js';
import MongoProductManager from '../dao/mongoManagers/MongoProductManager.js';


const path = 'products.json';
const router = Router();
const productManagerFile = new ProductManagerFile(path);
const cartManager = new MongoCartManager();
const MessageManager = new MongoMessageManager();
const productManager = new MongoProductManager();

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
        console.log(products);
        res.render("home", { products, style:"index" });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.send({
            status: "error",
            msg: "Error al obtener productos"
        });
    }
});

router.get('/realtimeproducts', async (req, res) => {
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
        console.log(cart)
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
        console.log(products);
        res.render('products', {  products: products, limit: limit, category: category, sort: sort, user:req.session.user, style: 'index' });

    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.send({
            status: "error",
            msg: "Error al obtener los productos"
        });
    }
});

router.get('/chat', async (req, res) => {
    const message = await MessageManager.getMessages();
    console.log("message: ", message);
    res.render('chat', { message });
});


export default router;