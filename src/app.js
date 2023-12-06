import express from "express";
import {engine} from "express-handlebars";
import viewRouter from "./routes/views.routes.js";
import __dirname from "./utils.js"; 
import {Server} from "socket.io";
import { cartRouter } from './routes/carts.routes.js';
import { productRouter } from './routes/products.routes.js';
import { ProductManagerFile } from "./managers/ProductManagerFile.js";

const PORT = 8080;

const app = express();

app.use(express.json()) 
app.use(express.urlencoded({extended:true})) 

const httpServer = app.listen(PORT, ()=> console.log(`Servidor funcionando en el puerto: ${PORT}`)); //Se crea el servidor http con express y se lo asigna a una constante para poder usarlo en el socket server

const socketServer = new Server(httpServer);

app.engine("handlebars", engine());//handlebars como template engine para las vistas html
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));//Para poder usar los archivos estáticos de la carpeta public (css y js)

app.use("/", viewRouter)
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use("/realtimeproducts", viewRouter)

socketServer.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on('addProduct', async (productData) => {//Recibe los datos del producto desde el cliente y los agrega al archivo json
        try {
            console.log('Datos del producto recibidos en el servidor:', productData);
            
            const productManagerFile = new ProductManagerFile('products.json');
            await productManagerFile.initializeId();
            await productManagerFile.addProduct(productData.title, productData.description, productData.price, productData.thumbnail, productData.code, productData.stock, productData.status, productData.category);
    
            socketServer.emit('newProduct', productData);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });
});
