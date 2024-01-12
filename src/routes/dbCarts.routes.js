import express from 'express';
import MongoCartManager from '../dao/mongoManagers/MongoCartManager.js';

const router = express.Router();
let cartManager = new MongoCartManager();


router.post('/', async (req, res) => {//Crea un carrito vacío y lo agrega al archivo carts.json
    try {
        const cart = await cartManager.createCart()
        res.send({
            status:"success",
            msg:"Cart creado",
            producto: cart
        })
    } catch (error) {
        console.error("Error al crear el cart:", error);
        res.send({
            status: "error",
            msg: "Error al crear el cart"
        });
    }
});

router.get('/', async (req, res) => {//Obtiene todos los productos del carrito
    try {
        const carts = await cartManager.getCarts();

        res.send({
            status:"success",
            msg:"Productos del carrito",
            carts: carts
        })
    } catch (error) {
        console.error("Error al obtener los carts:", error);
        res.send({
            status: "error",
            msg: "Error al obtener los carts"
        });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {//La ruta agrega un producto al carrito con el parámetro cid proporcionado
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

router.put('/:cid', async (req, res) => {//La ruta actualiza el carrito con el parámetro cid proporcionado
    try {
        const cid = req.params.cid;
        const updateData = req.body;
        const cart = await cartManager.updateCart(cid, updateData);
        res.send({
            status: "success",
            msg: `Ruta PUT ID CART con ID: ${cid}`,
            producto: cart
        });
    } catch (error) {
        console.error("Error al actualizar el cart:", error);
        res.send({
            status: "error",
            msg: `Error al actualizar el cart con ID: ${cid}`
        });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {//La ruta actualiza el carrito con el parámetro cid proporcionado y el producto con el parámetro pid proporcionado
    
    const cid = req.params.cid;
    const pid = req.params.pid;
    const updateData = req.body;
    try {
        const cart = await cartManager.updateProductInCart(cid, pid, updateData);
        res.send({
            status: "success",
            msg: `Ruta PUT ID CART con ID: ${cid} y ID PRODUCTO con ID: ${pid}`,
            producto: cart
        });
    } catch (error) {
        console.error("Error al actualizar el cart:", error);
        res.send({
            status: "error",
            msg: `Error al actualizar el cart con ID: ${cid} y el producto con ID: ${pid}`
        });
    }
});

router.delete('/:cid', async (req, res) => {//La ruta elimina el carrito con el parámetro cid proporcionado
    const cid = req.params.cid;
    try {
        const cart = await cartManager.deleteCart({ _id:cid });
        res.send({
            status: "success",
            msg: `Ruta DELETE ID CART con ID: ${cid}`,
            producto: cart
        });
    } catch (error) {
        console.error("Error al eliminar el cart:", error);
        res.send({
            status: "error",
            msg: `Error al eliminar el cart con ID: ${cid}`
        });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {//La ruta elimina el carrito con el parámetro cid proporcionado y el producto con el parámetro pid proporcionado
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const cart = await cartManager.deleteProductItCart(cid, pid);

        
        res.send({
            status: "success",
            msg: `Ruta DELETE ID CART con ID: ${cid}`,
            producto: cart
        });
    } catch (error) {
        console.error("Error al eliminar el cart:", error);
        res.send({
            status: "error",
            msg: `Error al eliminar el cart con ID: ${cid}`
        });
    }
});

export { router as MongoCartRouter}