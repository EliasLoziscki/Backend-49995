import express from "express";

import ProductManager from './ProductManager.js';

const PORT = 8080;

const app = express();

app.use(express.urlencoded({extended:true}))

const productManager = new ProductManager('./files/productos.json');


app.get('/products', async (req, res) => {
    try {
        let products = await productManager.getProducts();

        const limit = parseInt(req.query.limit, 10);

        if (!isNaN(limit) && limit > 0) {
            products = products.slice(0, limit);
        }

        res.send({ products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid, 10);

        if (isNaN(productId)) {
            console.error("El parámetro PID debe ser un número válido.");
        }

        const product = await productManager.getProductById(productId);

        if (!product || product === "Not Found") {
            console.error("Producto no encontrado.");
        }

        res.send({ product });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
    }
});

    app.listen(PORT, ()=>{
        console.log(`Servidor funcionando en el puerto: ${PORT}`);
    })