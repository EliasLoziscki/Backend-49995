import { Router } from 'express';
import { ProductManagerFile } from '../managers/ProductManagerFile.js'; // Importar el manager de productos que vamos a usar en las rutas 

const path = 'products.json';
const router = Router();
const productManagerFile = new ProductManagerFile(path);

router.get('/', async (req, res) => {// Obtiene todos los productos
    try {
        let products = await productManagerFile.getProducts();
        res.render("home", { products });
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
        let products = await productManagerFile.getProducts();
        res.render('realtimeproducts', { products });
    } catch (error) {
        console.error("Error al obtener productos en tiempo real:", error);
        res.send({
            status: "error",
            msg: "Error al obtener productos en tiempo real"
        });
    }
});

export default router;