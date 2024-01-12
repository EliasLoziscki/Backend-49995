import express from 'express';
import MongoProductManager from '../dao/mongoManagers/MongoProductManager.js';

const router = express.Router();
const productManager = new MongoProductManager();


router.get('/:pid', async (req, res) => {// Obtiene un producto por id
    const pid = req.params.pid;
    try {
        const product = await productManager.getProductById(pid);
        res.send({
            status: "success",
            msg: `Ruta GET ID PRODUCTS con ID: ${pid}`,
            producto: product
        });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.send({
            status: "error",
            msg: "Error al obtener el producto"
        });
    }
});

router.post('/', async (req, res) => {//Crea un producto

    const product = req.body;

    await productManager.createProduct(product);

    res.send({
        status:"success",
        msg:"Producto creado",
        producto: product
    })
});

router.put('/:pid', async (req, res) => {//Actualiza un producto por id
    try {
        const pid = req.params.pid;
        const updatedProduct = req.body;
        await productManager.updateProduct(pid, updatedProduct);
        res.send({
            status: "success",
            msg: `Ruta PUT de PRODUCTS con ID: ${pid}`,
        });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.send({
            status: "error",
            msg: "Error al actualizar el producto"
        });
    }
});

router.delete('/:pid', async (req, res) => { //Borra un producto por id 
    try {
        const pid = req.params.pid;
        const product = await productManager.getProductById(pid);
        const productTitle = product.title;
        await productManager.deleteProduct(pid);
        res.send({
            status: "success",
            msg: `Ruta DELETE de PRODUCTS con ID: ${pid}`,
            producto: productTitle
        });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.send({
            status: "error",
            msg: "Error al eliminar el producto"
        });
    }
});

export { router as MongoProductRouter}