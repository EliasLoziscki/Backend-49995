import express from 'express';
import MongoCartManager from '../dao/mongoManagers/MongoCartManager.js';

const router = express.Router();
const cartManager = new MongoCartManager();


router.post('/', async (req, res) => {//Crea un carrito vacío y lo agrega al archivo carts.json

    const cart = req.body;

    const carts = await cartManager.createCart(cart);

    res.send({
        status:"success",
        msg:"Cart creado",
        producto: carts
    })
});


router.get('/', async (req, res) => {//Obtiene todos los productos del carrito
        let carts = await cartManager.getCart();

        res.send({
            status:"success",
            msg:"Productos del carrito",
            carts: carts
        })
});



router.get('/:cid', async (req, res) => {//La ruta lista los productos que pertenezcan al carrito con el parámetro cid proporcionado
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartProducts(cid);
        res.send({
            status: "success",
            msg: `Ruta GET ID CART con ID: ${cid}`,
            producto: cart
        });
    } catch (error) {
        console.error("Error al obtener el cart:", error);
        res.send({
            status: "error",
            msg: "Error al obtener el cart"
        });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {//esta ruta deberá agregar el producto al arreglo "products" del carrito seleccionado, agregándose como un objeto
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
        const cart = await cartManager.addProductToCart(cid, pid, quantity);
        res.send({
            status: "success",
            msg: `Ruta POST ID CART con ID: ${cid} y ID PRODUCTO con ID: ${pid}`,
            producto: cart
        });
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.send({
            status: "error",
            msg: "Error al agregar el producto al carrito"
        });
    }
}); 

export { router as MongoCartRouter}