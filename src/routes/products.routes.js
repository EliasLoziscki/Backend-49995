import { Router } from 'express';
import {ProductManagerFile} from '../managers/ProductManagerFile.js'; // Importar el manager de productos que vamos a usar en las rutas 

const path = 'products.json';
const router = Router();
const productManagerFile = new ProductManagerFile(path);

router.get('/', async (req, res) => {// Obtiene todos los productos
    try {
        let products = await productManagerFile.getProducts();

        const limit = parseInt(req.query.limit, 10);//limita la cantidad de productos a mostrar en la respuesta 

        if (!isNaN(limit) && limit > 0) {
            products = products.slice(0, limit);
        }

        res.send({ products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.send({
            status: "error",
            msg: "Error al obtener productos"
        });
    }
});

router.get('/:pid', async (req, res) => {// Obtiene un producto por id
    const pid = req.params.pid;
    try {
        const product = await productManagerFile.getProductById(pid);
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

    await productManagerFile.createProduct(product);

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
        await productManagerFile.updateProduct(pid, updatedProduct);
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
        const product = await productManagerFile.getProductById(pid);
        const productTitle = product.title;
        await productManagerFile.deleteProduct(pid);
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

export {router as productRouter}// Exportar el router para usarlo en app.js